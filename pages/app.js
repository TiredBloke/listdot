import Head from 'next/head'
import { useState, useEffect, useCallback } from 'react'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { Logo } from '../components/Logo'

const LIST_COLORS = ['#0f6644','#e04e0a','#1a56c4','#9333ea','#d4920a','#0891b2','#e11d48','#65a30d']
const FREE_MAX_LISTS = 1
const FREE_MAX_TASKS = 20

export default function App() {
  const supabase = useSupabaseClient()
  const user = useUser()
  const router = useRouter()

  const [profile, setProfile] = useState(null)
  const [lists, setLists] = useState([])
  const [activeList, setActiveList] = useState(null)
  const [items, setItems] = useState([])
  const [top3, setTop3] = useState([])
  const [filter, setFilter] = useState('all')
  const [newItemText, setNewItemText] = useState('')
  const [loading, setLoading] = useState(true)
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [showNewList, setShowNewList] = useState(false)
  const [newListName, setNewListName] = useState('')
  const [newListColor, setNewListColor] = useState(LIST_COLORS[0])
  const [dragSrcId, setDragSrcId] = useState(null)
  const [top3Open, setTop3Open] = useState(true)
  const [upgradingLoading, setUpgradingLoading] = useState(false)
  const [successBanner, setSuccessBanner] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (user === null) router.push('/login')
  }, [user, router])

  // Show success banner if redirected from Stripe
  useEffect(() => {
    if (router.query.upgraded === 'true') {
      setSuccessBanner(true)
      setTimeout(() => setSuccessBanner(false), 5000)
    }
  }, [router.query])

  // Load profile + lists
  useEffect(() => {
    if (!user) return
    loadData()
  }, [user])

  const loadData = async () => {
    setLoading(true)
    const [{ data: prof }, { data: listsData }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('lists').select('*').eq('user_id', user.id).order('created_at'),
    ])
    setProfile(prof)
    if (listsData && listsData.length > 0) {
      setLists(listsData)
      setActiveList(listsData[0])
    } else {
      // Create default list
      const { data: newList } = await supabase.from('lists').insert({
        user_id: user.id, name: 'My List', color: LIST_COLORS[0]
      }).select().single()
      if (newList) { setLists([newList]); setActiveList(newList) }
    }
    setLoading(false)
  }

  // Load items when active list changes
  useEffect(() => {
    if (!activeList) return
    loadItems()
  }, [activeList])

  const loadItems = async () => {
    const { data } = await supabase
      .from('items')
      .select('*')
      .eq('list_id', activeList.id)
      .order('position')
    setItems(data || [])
  }

  // Load top3 from user profile
  useEffect(() => {
    if (!profile) return
    setTop3(profile.top3 || [])
    setTop3Open(profile.top3_open !== false)
  }, [profile])

  const saveTop3 = async (newTop3, newOpen) => {
    setTop3(newTop3)
    await supabase.from('profiles').update({ top3: newTop3, top3_open: newOpen ?? top3Open }).eq('id', user.id)
  }

  const isPro = profile?.is_pro

  // Limits check
  const canAddList = isPro || lists.length < FREE_MAX_LISTS
  const canAddItem = isPro || items.filter(i => !i.done).length < FREE_MAX_TASKS

  const addItem = async () => {
    if (!newItemText.trim()) return
    if (!canAddItem) { setShowUpgrade(true); return }
    const pos = items.length
    const { data } = await supabase.from('items').insert({
      list_id: activeList.id, user_id: user.id,
      text: newItemText.trim(), done: false, starred: false, position: pos
    }).select().single()
    if (data) setItems(prev => [...prev, data])
    setNewItemText('')
  }

  const toggleDone = async (id) => {
    const item = items.find(i => i.id === id)
    if (!item) return
    const updated = { ...item, done: !item.done }
    setItems(prev => prev.map(i => i.id === id ? updated : i))
    await supabase.from('items').update({ done: updated.done }).eq('id', id)
  }

  const toggleStar = async (id) => {
    const item = items.find(i => i.id === id)
    if (!item) return
    const updated = { ...item, starred: !item.starred }
    setItems(prev => prev.map(i => i.id === id ? updated : i))
    await supabase.from('items').update({ starred: updated.starred }).eq('id', id)
    // Update top3
    let newTop3 = [...top3]
    if (updated.starred) {
      if (!newTop3.find(r => r.itemId === id)) {
        if (newTop3.length >= 3) newTop3.shift()
        newTop3.push({ itemId: id, listId: activeList.id, listName: activeList.name })
      }
    } else {
      newTop3 = newTop3.filter(r => r.itemId !== id)
    }
    await saveTop3(newTop3)
  }

  const deleteItem = async (id) => {
    setItems(prev => prev.filter(i => i.id !== id))
    const newTop3 = top3.filter(r => r.itemId !== id)
    if (newTop3.length !== top3.length) await saveTop3(newTop3)
    await supabase.from('items').delete().eq('id', id)
  }

  const updateItemText = async (id, text) => {
    await supabase.from('items').update({ text }).eq('id', id)
  }

  const clearDone = async () => {
    const doneIds = items.filter(i => i.done).map(i => i.id)
    setItems(prev => prev.filter(i => !i.done))
    const newTop3 = top3.filter(r => !doneIds.includes(r.itemId))
    if (newTop3.length !== top3.length) await saveTop3(newTop3)
    await supabase.from('items').delete().in('id', doneIds)
  }

  const createList = async () => {
    if (!newListName.trim()) return
    if (!canAddList) { setShowUpgrade(true); setShowNewList(false); return }
    const { data } = await supabase.from('lists').insert({
      user_id: user.id, name: newListName.trim(), color: newListColor
    }).select().single()
    if (data) {
      setLists(prev => [...prev, data])
      setActiveList(data)
    }
    setShowNewList(false)
    setNewListName('')
    setNewListColor(LIST_COLORS[0])
  }

  const deleteList = async (listId) => {
    if (lists.length <= 1) { alert('You need at least one list!'); return }
    if (!confirm('Delete this list and all its tasks?')) return
    setLists(prev => prev.filter(l => l.id !== listId))
    const newTop3 = top3.filter(r => r.listId !== listId)
    if (newTop3.length !== top3.length) await saveTop3(newTop3)
    if (activeList.id === listId) setActiveList(lists.find(l => l.id !== listId))
    await supabase.from('lists').delete().eq('id', listId)
  }

  const handleUpgrade = async () => {
    setUpgradingLoading(true)
    const res = await fetch('/api/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: user.id, email: user.email }),
    })
    const { url } = await res.json()
    if (url) window.location.href = url
    setUpgradingLoading(false)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  // Top3 items resolved
  const top3Items = top3.map(ref => {
    // Could be from any list — for simplicity track from items in current list or ref
    return { ...ref, text: ref.text || '—', done: ref.done || false }
  })

  const filteredItems = (() => {
    let f = items.filter(i => {
      if (filter === 'starred') return i.starred && !i.done
      if (filter === 'active') return !i.done
      if (filter === 'done') return i.done
      return true
    })
    if (filter === 'all') {
      f = [...f.filter(i => i.starred && !i.done), ...f.filter(i => !i.starred || i.done)]
    }
    return f
  })()

  const total = items.length
  const done = items.filter(i => i.done).length
  const starredCount = items.filter(i => i.starred && !i.done).length

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f7f4ef' }}>
        <div style={{ textAlign: 'center' }}>
          <Logo size="md" />
          <p style={{ marginTop: '16px', fontSize: '0.85rem', color: '#9a8f7a' }}>Loading your lists…</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head><title>List. — Your notebook</title></Head>

      {/* Success banner */}
      {successBanner && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
          background: '#0f6644', color: '#fff', textAlign: 'center',
          padding: '12px', fontSize: '0.88rem', fontWeight: 500,
        }}>
          🎉 Welcome to Pro! All limits removed. Enjoy.
        </div>
      )}

      <div style={{
        minHeight: '100vh', background: '#f7f4ef',
        backgroundImage: 'radial-gradient(ellipse at 10% 10%, #e8dfc8 0%, transparent 60%), radial-gradient(ellipse at 90% 80%, #ddd5c0 0%, transparent 50%)',
      }}>

        {/* TOP BAR */}
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: 'rgba(247,244,239,0.9)', backdropFilter: 'blur(10px)',
          borderBottom: '1.5px solid #ede8df',
          padding: '0 24px', height: '56px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Logo size="sm" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!isPro && (
              <button onClick={() => setShowUpgrade(true)} style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600,
                color: '#0f6644', background: '#eaf5f0', border: '1.5px solid rgba(15,102,68,0.2)',
                borderRadius: '20px', padding: '5px 14px', cursor: 'pointer',
              }}>⭐ Upgrade to Pro</button>
            )}
            {isPro && <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#0f6644', background: '#eaf5f0', padding: '4px 10px', borderRadius: '10px' }}>✓ Pro</span>}
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0f6644', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
              title={user.email} onClick={logout}>
              {user.email?.[0]?.toUpperCase()}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ maxWidth: '600px', margin: '0 auto', padding: '80px 16px 100px' }}>

          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '2.4rem', color: '#0f1a14', letterSpacing: '-1.5px', lineHeight: 1 }}>Lists</h1>
            <p style={{ fontSize: '0.72rem', color: '#9a8f7a', marginTop: '6px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Your digital notebook</p>
            <div style={{ display: 'flex', gap: '6px', marginTop: '14px', flexWrap: 'wrap' }}>
              <StatPill label={`${total} total`} />
              <StatPill label={`${done} done`} color="green" />
              <StatPill label={`${total - done} remaining`} color="orange" />
              <StatPill label={`${starredCount} priority`} color="star" />
            </div>
          </div>

          {/* Today's Focus */}
          <FocusPanel
            top3={top3} items={items} lists={lists}
            top3Open={top3Open}
            onToggleOpen={async () => {
              const next = !top3Open; setTop3Open(next)
              await supabase.from('profiles').update({ top3_open: next }).eq('id', user.id)
            }}
            onToggleDone={toggleDone}
            onRemove={async (itemId) => {
              const newTop3 = top3.filter(r => r.itemId !== itemId)
              await saveTop3(newTop3)
              const item = items.find(i => i.id === itemId)
              if (item) await supabase.from('items').update({ starred: false }).eq('id', itemId)
              setItems(prev => prev.map(i => i.id === itemId ? { ...i, starred: false } : i))
            }}
          />

          {/* List tabs */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            {lists.map(list => (
              <button key={list.id}
                onClick={() => setActiveList(list)}
                onContextMenu={e => { e.preventDefault(); deleteList(list.id) }}
                title="Right-click to delete"
                style={{
                  fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 500,
                  padding: '7px 16px', borderRadius: '20px',
                  border: `1.5px solid ${activeList?.id === list.id ? list.color : '#ede8df'}`,
                  background: activeList?.id === list.id ? list.color : '#fff',
                  color: activeList?.id === list.id ? '#fff' : '#4a4235',
                  cursor: 'pointer',
                  display: 'flex', alignItems: 'center', gap: '6px',
                  boxShadow: activeList?.id === list.id ? `0 2px 12px ${list.color}44` : '0 1px 4px rgba(0,0,0,0.06)',
                }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: activeList?.id === list.id ? 'rgba(255,255,255,0.7)' : list.color, flexShrink: 0 }} />
                {list.name}
              </button>
            ))}
            <button onClick={() => canAddList ? setShowNewList(true) : setShowUpgrade(true)}
              style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.78rem', fontWeight: 500,
                padding: '7px 16px', borderRadius: '20px',
                border: '1.5px dashed #ede8df', background: 'transparent',
                color: '#9a8f7a', cursor: 'pointer',
              }}>
              + New List
            </button>
          </div>

          {/* Card */}
          <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', border: '1.5px solid #ede8df', overflow: 'hidden' }}>

            {/* Input */}
            <div style={{ display: 'flex', gap: '10px', padding: '14px 16px', borderBottom: '1.5px solid #ede8df', background: '#f7f4ef' }}>
              <input
                value={newItemText}
                onChange={e => setNewItemText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addItem()}
                placeholder="Add a task… press ↵ to save"
                style={{
                  flex: 1, fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
                  padding: '9px 14px', borderRadius: '8px',
                  border: '1.5px solid #ede8df', background: '#fff',
                  color: '#0f1a14', outline: 'none',
                }}
                onFocus={e => e.target.style.borderColor = activeList?.color || '#0f6644'}
                onBlur={e => e.target.style.borderColor = '#ede8df'}
              />
              <button onClick={addItem} style={{
                fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.78rem',
                padding: '9px 18px', borderRadius: '8px', border: 'none',
                background: activeList?.color || '#0f6644', color: '#fff', cursor: 'pointer',
                letterSpacing: '0.04em', textTransform: 'uppercase',
              }}>Add</button>
            </div>

            {/* Filter bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', borderBottom: '1.5px solid #ede8df' }}>
              <div style={{ display: 'flex' }}>
                {['all','starred','active','done'].map(f => (
                  <button key={f} onClick={() => setFilter(f)} style={{
                    fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.72rem',
                    padding: '10px 12px', border: 'none', background: 'transparent',
                    color: filter === f ? '#e04e0a' : '#9a8f7a', cursor: 'pointer',
                    borderBottom: `2px solid ${filter === f ? '#e04e0a' : 'transparent'}`,
                    marginBottom: '-1.5px', letterSpacing: '0.05em',
                    textTransform: 'capitalize',
                  }}>{f === 'starred' ? '⭐ Priority' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
                ))}
              </div>
              {starredCount > 0 && <span style={{ fontSize: '0.68rem', color: '#d4920a', fontWeight: 600 }}>⭐ {starredCount} priority</span>}
            </div>

            {/* Items */}
            <div style={{ minHeight: '80px', maxHeight: '52vh', overflowY: 'auto' }}>
              {filteredItems.length === 0 ? (
                <EmptyState filter={filter} />
              ) : filteredItems.map(item => (
                <ItemRow
                  key={item.id} item={item}
                  listColor={activeList?.color || '#0f6644'}
                  onToggleDone={() => toggleDone(item.id)}
                  onToggleStar={() => toggleStar(item.id)}
                  onDelete={() => deleteItem(item.id)}
                  onTextChange={(t) => updateItemText(item.id, t)}
                  dragSrcId={dragSrcId}
                  onDragStart={() => setDragSrcId(item.id)}
                  onDragEnd={() => setDragSrcId(null)}
                  onDrop={async () => {
                    if (!dragSrcId || dragSrcId === item.id) return
                    const allItems = [...items]
                    const si = allItems.findIndex(i => i.id === dragSrcId)
                    const ti = allItems.findIndex(i => i.id === item.id)
                    if (si === -1 || ti === -1) return
                    const [moved] = allItems.splice(si, 1)
                    allItems.splice(ti, 0, moved)
                    setItems(allItems)
                    // Update positions
                    await Promise.all(allItems.map((it, idx) =>
                      supabase.from('items').update({ position: idx }).eq('id', it.id)
                    ))
                  }}
                />
              ))}
            </div>

            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderTop: '1.5px solid #ede8df', background: '#f7f4ef' }}>
              <span style={{ fontSize: '0.72rem', color: '#9a8f7a', fontWeight: 500 }}>
                {total - done === 0 && total > 0 ? '🎉 All done!' : `${total - done} remaining`}
                {!isPro && <span style={{ color: '#e04e0a', marginLeft: '8px' }}> · {FREE_MAX_TASKS - items.filter(i=>!i.done).length} free slots left</span>}
              </span>
              <button onClick={clearDone} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.72rem', fontWeight: 500, background: 'none', border: 'none', color: '#9a8f7a', cursor: 'pointer', padding: '4px 8px', borderRadius: '6px' }}>Clear done</button>
            </div>
          </div>
        </div>
      </div>

      {/* UPGRADE MODAL */}
      {showUpgrade && (
        <Modal onClose={() => setShowUpgrade(false)}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '12px' }}>⭐</div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1.5rem', color: '#0f1a14', letterSpacing: '-0.5px', marginBottom: '8px' }}>Upgrade to Pro</h2>
            <p style={{ fontSize: '0.85rem', color: '#4a4235', lineHeight: 1.6, marginBottom: '24px' }}>
              You've hit the free plan limit. Upgrade to Pro for unlimited lists, unlimited tasks, and sync across all your devices.
            </p>
            <div style={{ background: '#f7f4ef', borderRadius: '12px', padding: '20px', marginBottom: '24px', textAlign: 'left' }}>
              {['Unlimited lists','Unlimited tasks','Sync across all devices','7-day free trial'].map((f,i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: i < 3 ? '10px' : 0 }}>
                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#eaf5f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#0f6644', flexShrink: 0 }}>✓</div>
                  <span style={{ fontSize: '0.85rem', color: '#4a4235' }}>{f}</span>
                </div>
              ))}
            </div>
            <button onClick={handleUpgrade} disabled={upgradingLoading} style={{
              width: '100%', padding: '14px', borderRadius: '10px', border: 'none',
              background: '#0f6644', color: '#fff', fontFamily: 'Inter, sans-serif',
              fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(15,102,68,0.3)',
            }}>{upgradingLoading ? 'Redirecting to checkout…' : 'Start 7-day free trial — $7/mo'}</button>
            <p style={{ marginTop: '12px', fontSize: '0.75rem', color: '#9a8f7a' }}>Cancel anytime. No charge during trial.</p>
          </div>
        </Modal>
      )}

      {/* NEW LIST MODAL */}
      {showNewList && (
        <Modal onClose={() => setShowNewList(false)}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: '#0f1a14', letterSpacing: '-0.5px', marginBottom: '6px' }}>New List</h2>
          <p style={{ fontSize: '0.8rem', color: '#9a8f7a', marginBottom: '20px' }}>Give it a name and pick a colour.</p>
          <input
            value={newListName} onChange={e => setNewListName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && createList()}
            placeholder="e.g. Work, Personal, Shopping…"
            style={{ width: '100%', padding: '11px 14px', borderRadius: '8px', border: '1.5px solid #ede8df', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', color: '#0f1a14', outline: 'none', marginBottom: '16px', background: '#fafaf8' }}
            onFocus={e => e.target.style.borderColor = '#0f6644'}
            onBlur={e => e.target.style.borderColor = '#ede8df'}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#4a4235' }}>Colour</span>
            {LIST_COLORS.map(c => (
              <div key={c} onClick={() => setNewListColor(c)} style={{
                width: '22px', height: '22px', borderRadius: '50%', background: c,
                cursor: 'pointer', border: `2px solid ${newListColor === c ? '#0f1a14' : 'transparent'}`,
                transform: newListColor === c ? 'scale(1.1)' : 'scale(1)',
                transition: 'transform 0.15s',
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
            <button onClick={() => setShowNewList(false)} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.85rem', padding: '10px 18px', borderRadius: '8px', border: '1.5px solid #ede8df', background: 'transparent', color: '#4a4235', cursor: 'pointer' }}>Cancel</button>
            <button onClick={createList} style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.85rem', padding: '10px 18px', borderRadius: '8px', border: 'none', background: '#0f6644', color: '#fff', cursor: 'pointer' }}>Create List</button>
          </div>
        </Modal>
      )}
    </>
  )
}

function ItemRow({ item, listColor, onToggleDone, onToggleStar, onDelete, onTextChange, onDragStart, onDragEnd, onDrop, dragSrcId }) {
  const [dragOver, setDragOver] = useState(false)
  return (
    <div
      draggable
      onDragStart={onDragStart} onDragEnd={onDragEnd}
      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={() => { setDragOver(false); onDrop() }}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '11px 16px', borderBottom: '1px solid #f0ece4',
        background: item.starred ? '#fdf8ec' : dragOver ? '#f0ece4' : 'transparent',
        borderLeft: item.starred ? `3px solid ${listColor}` : '3px solid transparent',
        transition: 'background 0.15s',
        cursor: 'default',
        opacity: dragSrcId === item.id ? 0.35 : 1,
        borderTop: dragOver ? `2px solid ${listColor}` : undefined,
      }}
    >
      <span style={{ color: '#e0d8cc', fontSize: '1rem', cursor: 'grab', userSelect: 'none', lineHeight: 1.4, padding: '0 2px' }}>⠿</span>
      <div onClick={onToggleDone} style={{
        width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, cursor: 'pointer',
        border: `2px solid ${item.done ? listColor : listColor + '55'}`,
        background: item.done ? listColor : 'transparent',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.2s',
      }}>
        {item.done && <span style={{ fontSize: '0.55rem', color: '#fff', fontWeight: 700 }}>✓</span>}
      </div>
      <div
        contentEditable suppressContentEditableWarning
        onBlur={e => { const t = e.target.textContent.trim(); if (t) onTextChange(t) }}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); e.target.blur() } }}
        style={{
          flex: 1, fontSize: '0.9rem', color: item.done ? '#b0a898' : '#0f1a14',
          textDecoration: item.done ? 'line-through' : 'none',
          fontWeight: item.starred ? 500 : 400, outline: 'none', cursor: 'text',
          lineHeight: 1.5,
        }}
      >{item.text}</div>
      <button onClick={onToggleStar} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', color: item.starred ? '#d4920a' : '#e0d8cc', padding: '4px', transition: 'color 0.2s, transform 0.2s' }}
        onMouseOver={e => e.target.style.transform = 'scale(1.2)'}
        onMouseOut={e => e.target.style.transform = 'scale(1)'}
      >{item.starred ? '⭐' : '☆'}</button>
      <span style={{ fontSize: '0.62rem', color: '#c0b8a8', whiteSpace: 'nowrap' }}>{formatDate(item.created_at)}</span>
      <button onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#e0d8cc', padding: '4px', opacity: 0, transition: 'opacity 0.15s, color 0.15s' }}
        onMouseOver={e => { e.target.style.opacity = 1; e.target.style.color = '#e04e0a' }}
        onMouseOut={e => { e.target.style.opacity = 0; e.target.style.color = '#e0d8cc' }}
      >×</button>
    </div>
  )
}

function FocusPanel({ top3, items, lists, top3Open, onToggleOpen, onToggleDone, onRemove }) {
  const resolvedTop3 = top3.map(ref => {
    const item = items.find(i => i.id === ref.itemId)
    return item ? { ...item, listName: ref.listName } : null
  }).filter(Boolean)

  const doneCount = resolvedTop3.filter(i => i.done).length
  const pct = resolvedTop3.length === 0 ? 0 : Math.round((doneCount / 3) * 100)

  return (
    <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.07)', border: '1.5px solid rgba(15,102,68,0.12)', overflow: 'hidden', marginBottom: '20px', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(15,102,68,0.03) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div onClick={onToggleOpen} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', cursor: 'pointer', borderBottom: top3Open ? '1.5px solid #eaf5f0' : 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #1a7a52, #0d5438)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', boxShadow: '0 2px 8px rgba(15,102,68,0.25)' }}>🎯</div>
          <div>
            <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#0f6644' }}>Today's Focus</div>
            <div style={{ fontSize: '0.65rem', color: '#9a8f7a', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              {new Date().toLocaleDateString('en-AU', { weekday: 'long', month: 'short', day: 'numeric' }).toUpperCase()}
            </div>
          </div>
        </div>
        <span style={{ fontSize: '0.65rem', color: '#9a8f7a', transition: 'transform 0.2s', display: 'inline-block', transform: top3Open ? 'rotate(0)' : 'rotate(-90deg)' }}>▼</span>
      </div>
      {top3Open && (
        <div>
          <div style={{ padding: '10px 20px 0' }}>
            <div style={{ height: '4px', background: '#eaf5f0', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ height: '100%', background: 'linear-gradient(90deg, #0f6644, #2db87a)', borderRadius: '4px', width: pct + '%', transition: 'width 0.5s cubic-bezier(0.4,0,0.2,1)' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', paddingBottom: '10px', borderBottom: '1.5px solid #eaf5f0' }}>
              <span style={{ fontSize: '0.68rem', color: '#0f6644', fontWeight: 600 }}>{doneCount} of {resolvedTop3.length} complete{resolvedTop3.length < 3 ? ` · ${3 - resolvedTop3.length} slots free` : ''}</span>
              <span style={{ fontSize: '0.65rem', color: '#9a8f7a' }}>Star tasks to add them here</span>
            </div>
          </div>
          {[0, 1, 2].map(i => {
            const item = resolvedTop3[i]
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 20px', borderBottom: i < 2 ? '1px solid #f0f8f4' : 'none', minHeight: '48px' }}>
                <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.65rem', color: '#0f6644', opacity: 0.7, width: '18px', flexShrink: 0 }}>{String(i + 1).padStart(2, '0')}</span>
                {item ? (
                  <>
                    <div onClick={() => onToggleDone(item.id)} style={{ width: '18px', height: '18px', borderRadius: '50%', border: `2px solid ${item.done ? '#0f6644' : 'rgba(15,102,68,0.3)'}`, background: item.done ? '#0f6644' : 'transparent', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
                      {item.done && <span style={{ fontSize: '0.5rem', color: '#fff', fontWeight: 700 }}>✓</span>}
                    </div>
                    <span style={{ flex: 1, fontSize: '0.87rem', color: item.done ? '#9a8f7a' : '#0f1a14', textDecoration: item.done ? 'line-through' : 'none' }}>{item.text}</span>
                    <span style={{ fontSize: '0.62rem', padding: '2px 8px', borderRadius: '10px', background: '#eaf5f0', color: '#0f6644', fontWeight: 600, flexShrink: 0 }}>{item.listName}</span>
                    <button onClick={() => onRemove(item.id)} style={{ background: 'none', border: 'none', color: '#c0b8a8', fontSize: '1rem', cursor: 'pointer', padding: '0 2px', opacity: 0 }}
                      onMouseOver={e => e.target.style.opacity = 1} onMouseOut={e => e.target.style.opacity = 0}
                    >×</button>
                  </>
                ) : (
                  <span style={{ fontSize: '0.78rem', color: '#c0b8a8', fontStyle: 'italic' }}>⭐ star a task to pin it here</span>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Modal({ children, onClose }) {
  return (
    <div onClick={e => e.target === e.currentTarget && onClose()} style={{ position: 'fixed', inset: 0, background: 'rgba(17,16,8,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '24px' }}>
      <div style={{ background: '#fff', borderRadius: '20px', padding: '32px', width: '100%', maxWidth: '400px', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', border: '1.5px solid #ede8df', position: 'relative' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', fontSize: '1.2rem', color: '#9a8f7a', cursor: 'pointer' }}>×</button>
        {children}
      </div>
    </div>
  )
}

function StatPill({ label, color }) {
  const colors = {
    green: { bg: '#eaf5f0', border: 'rgba(15,102,68,0.2)', text: '#0f6644' },
    orange: { bg: '#fdf0ea', border: 'rgba(224,78,10,0.2)', text: '#e04e0a' },
    star: { bg: '#fdf8ec', border: 'rgba(212,146,10,0.2)', text: '#d4920a' },
  }
  const c = colors[color] || { bg: '#fff', border: '#ede8df', text: '#4a4235' }
  return (
    <span style={{ fontSize: '0.72rem', fontWeight: 500, padding: '5px 12px', borderRadius: '20px', background: c.bg, border: `1.5px solid ${c.border}`, color: c.text, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
      {label}
    </span>
  )
}

function EmptyState({ filter }) {
  const states = {
    starred: { icon: '⭐', title: 'No priority tasks', sub: 'Star a task to mark it as important' },
    done: { icon: '✅', title: 'Nothing done yet', sub: 'Complete some tasks to see them here' },
    active: { icon: '🎉', title: 'All done!', sub: 'Everything is checked off — great work!' },
    all: { icon: '✏️', title: 'Empty list', sub: 'Add your first task above' },
  }
  const s = states[filter] || states.all
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 20px', gap: '10px' }}>
      <div style={{ fontSize: '2rem', opacity: 0.5 }}>{s.icon}</div>
      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#4a4235' }}>{s.title}</div>
      <div style={{ fontSize: '0.78rem', color: '#9a8f7a', textAlign: 'center', maxWidth: '200px', lineHeight: 1.5 }}>{s.sub}</div>
    </div>
  )
}

function formatDate(ts) {
  if (!ts) return ''
  const d = new Date(ts)
  const now = new Date()
  if (d.toDateString() === now.toDateString()) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}
