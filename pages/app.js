import Head from 'next/head'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useSupabaseClient, useUser, useSessionContext } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { Logo } from '../components/Logo'

const LIST_COLORS = ['#0f6644','#e04e0a','#1a56c4','#9333ea','#d4920a','#0891b2','#e11d48','#65a30d']
const FREE_MAX_LISTS = 1
const FREE_MAX_TASKS = 20

export default function App() {
  const supabase = useSupabaseClient()
  const user = useUser()
  const { isLoading: sessionLoading } = useSessionContext()
  const router = useRouter()

  const [profile, setProfile] = useState(null)
  const [lists, setLists] = useState([])
  const [activeList, setActiveList] = useState(null)
  const [items, setItems] = useState([])
  const [allItems, setAllItems] = useState([])
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
  const [focusItem, setFocusItem] = useState(null)
  const [showSearch, setShowSearch] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [focusTimers, setFocusTimers] = useState({})
  const [toast, setToast] = useState(null)
  const toastTimerRef = React.useRef(null)

  // Redirect if not logged in
  // Only redirect if still no user after a grace period — prevents spurious
  // logouts from token refresh events briefly setting user to null
  useEffect(() => {
    if (sessionLoading) return
    if (user !== null) return
    const timer = setTimeout(() => {
      if (!user) router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`)
    }, 2000)
    return () => clearTimeout(timer)
  }, [user, sessionLoading])

  // Show success banner if redirected from Stripe
  useEffect(() => {
    if (router.query.upgraded === 'true') {
      setSuccessBanner(true)
      setTimeout(() => setSuccessBanner(false), 5000)
    }
  }, [router.query])

  // Cmd/Ctrl+K to open search
  useEffect(() => {
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setShowSearch(s => !s)
      }
      if (e.key === 'Escape') { setShowSearch(false); setShowUserMenu(false) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Load profile + lists
  const hasLoadedRef = React.useRef(false)
  useEffect(() => {
    if (!user) return
    if (hasLoadedRef.current) return  // prevent re-load on auth token refresh
    hasLoadedRef.current = true
    loadData()
  }, [user])

  const loadData = async () => {
    setLoading(true)
    const [{ data: prof }, { data: listsData }, { data: allItemsData }] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('lists').select('*').eq('user_id', user.id).order('created_at'),
      supabase.from('items').select('*').eq('user_id', user.id).order('position'),
    ])
    setProfile(prof)
    setAllItems(allItemsData || [])
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

  // Load top3 from user profile + auto-clear done focus items on first load of day
  useEffect(() => {
    if (!profile) return
    const loadedTop3 = profile.top3 || []
    setTop3(loadedTop3)
    setTop3Open(profile.top3_open !== false)
    // Auto-clear: run against freshly loaded top3 and allItems directly
    if (!user || loadedTop3.length === 0) return
    const today = new Date().toDateString()
    const lastClear = localStorage.getItem(`focus_clear_${user.id}`)
    if (lastClear !== today) {
      localStorage.setItem(`focus_clear_${user.id}`, today)
      // We have fresh allItems in closure from loadData — use functional update
      setAllItems(currentAllItems => {
        const doneIds = loadedTop3
          .map(ref => currentAllItems.find(i => i.id === ref.itemId))
          .filter(item => item && item.done)
          .map(item => item.id)
        if (doneIds.length === 0) return currentAllItems
        const newTop3 = loadedTop3.filter(ref => !doneIds.includes(ref.itemId))
        // Fire-and-forget async updates
        supabase.from('profiles').update({ top3: newTop3, top3_open: profile.top3_open !== false }).eq('id', user.id)
        doneIds.forEach(id => supabase.from('items').update({ starred: false }).eq('id', id))
        // setTop3 called outside functional update to avoid React anti-pattern
        setTimeout(() => setTop3(newTop3), 0)
        return currentAllItems.map(i => doneIds.includes(i.id) ? { ...i, starred: false } : i)
      })
    }
  }, [profile])

  const saveTop3 = async (newTop3, newOpen) => {
    setTop3(newTop3)
    await supabase.from('profiles').update({ top3: newTop3, top3_open: newOpen ?? top3Open }).eq('id', user.id)
  }

  // Clear completed tasks from Today's Focus — uses functional updates to avoid stale closure
  const clearDoneFocus = async () => {
    let doneIds = []
    let newTop3 = []
    setTop3(currentTop3 => {
      setAllItems(currentAllItems => {
        doneIds = currentTop3
          .map(ref => currentAllItems.find(i => i.id === ref.itemId))
          .filter(item => item && item.done)
          .map(item => item.id)
        return currentAllItems
      })
      if (doneIds.length === 0) return currentTop3
      newTop3 = currentTop3.filter(ref => !doneIds.includes(ref.itemId))
      return newTop3
    })
    if (doneIds.length === 0) return
    setAllItems(prev => prev.map(i => doneIds.includes(i.id) ? { ...i, starred: false } : i))
    await supabase.from('profiles').update({ top3: newTop3 }).eq('id', user.id)
    await Promise.all(doneIds.map(id => supabase.from('items').update({ starred: false }).eq('id', id)))
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
    if (data) { setItems(prev => [...prev, data]); setAllItems(prev => [...prev, data]) }
    setNewItemText('')
  }

  const toggleDone = async (id) => {
    const item = allItems.find(i => i.id === id) || items.find(i => i.id === id)
    if (!item) return
    const updated = { ...item, done: !item.done }
    // Optimistic update
    setItems(prev => prev.map(i => i.id === id ? updated : i))
    setAllItems(prev => prev.map(i => i.id === id ? updated : i))
    // If marking done, remove from focus panel immediately (consistent with focus timer behaviour)
    let removedFromTop3 = false
    if (updated.done) {
      setTop3(prev => {
        const next = prev.filter(r => r.itemId !== id)
        removedFromTop3 = next.length !== prev.length
        return next
      })
    }
    // DB write — rollback on failure
    const { error } = await supabase.from('items').update({ done: updated.done }).eq('id', id)
    if (error) {
      setItems(prev => prev.map(i => i.id === id ? item : i))
      setAllItems(prev => prev.map(i => i.id === id ? item : i))
      if (removedFromTop3) setTop3(prev => [...prev, { itemId: id, listId: item.list_id, listName: item.listName || '' }])
    } else if (removedFromTop3) {
      // Persist top3 update to DB
      setTop3(currentTop3 => {
        supabase.from('profiles').update({ top3: currentTop3 }).eq('id', user.id)
        return currentTop3
      })
    }
  }

  const toggleStar = async (id) => {
    const item = items.find(i => i.id === id)
    if (!item) return
    const updated = { ...item, starred: !item.starred }
    setItems(prev => prev.map(i => i.id === id ? updated : i))
    setAllItems(prev => prev.map(i => i.id === id ? updated : i))
    await supabase.from('items').update({ starred: updated.starred }).eq('id', id)
    // Update top3
    let newTop3 = [...top3]
    if (updated.starred) {
      if (!newTop3.find(r => r.itemId === id)) {
        if (newTop3.length >= 5) {
          // Block — focus panel full, revert optimistic star and notify
          showToast('Focus panel full — complete or remove a task first', 'warn')
          setItems(prev => prev.map(i => i.id === id ? item : i))
          setAllItems(prev => prev.map(i => i.id === id ? item : i))
          await supabase.from('items').update({ starred: false }).eq('id', id)
          return
        }
        newTop3.push({ itemId: id, listId: activeList.id, listName: activeList.name })
      }
    } else {
      newTop3 = newTop3.filter(r => r.itemId !== id)
    }
    await saveTop3(newTop3)
  }

  const deleteItem = async (id) => {
    setItems(prev => prev.filter(i => i.id !== id))
    setAllItems(prev => prev.filter(i => i.id !== id))
    const newTop3 = top3.filter(r => r.itemId !== id)
    if (newTop3.length !== top3.length) await saveTop3(newTop3)
    await supabase.from('items').delete().eq('id', id)
  }

  const updateItemText = async (id, text) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, text } : i))
    setAllItems(prev => prev.map(i => i.id === id ? { ...i, text } : i))
    await supabase.from('items').update({ text }).eq('id', id)
  }

  const clearDone = async () => {
    const doneIds = items.filter(i => i.done).map(i => i.id)
    setItems(prev => prev.filter(i => !i.done))
    setAllItems(prev => prev.filter(i => !doneIds.includes(i.id)))
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

  const showToast = (message, type = 'info') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast({ message, type })
    toastTimerRef.current = setTimeout(() => setToast(null), 3000)
  }

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
          position: 'fixed', top: successBanner ? '44px' : 0, left: 0, right: 0, zIndex: 100,
          background: 'rgba(247,244,239,0.9)', backdropFilter: 'blur(10px)',
          borderBottom: '1.5px solid #ede8df',
          padding: '0 24px', height: '56px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Logo size="sm" />
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button onClick={() => setShowSearch(s => !s)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#9a8f7a', fontSize: '1.1rem', padding: '4px 8px',
              borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px',
              transition: 'color 0.2s',
            }}
              onMouseOver={e => e.currentTarget.style.color = '#0f6644'}
              onMouseOut={e => e.currentTarget.style.color = '#9a8f7a'}
              title="Search (Ctrl+K)"
            >🔍</button>
            {!isPro && (
              <button onClick={() => setShowUpgrade(true)} style={{
                fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', fontWeight: 600,
                color: '#0f6644', background: '#eaf5f0', border: '1.5px solid rgba(15,102,68,0.2)',
                borderRadius: '20px', padding: '5px 14px', cursor: 'pointer',
              }}>⭐ Upgrade to Pro</button>
            )}
            {isPro && <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#0f6644', background: '#eaf5f0', padding: '4px 10px', borderRadius: '10px' }}>✓ Pro</span>}
            {/* Avatar + dropdown */}
            <div style={{ position: 'relative' }}>
              <div onClick={() => setShowUserMenu(v => !v)}
                style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0f6644', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer', userSelect: 'none' }}>
                {user.email?.[0]?.toUpperCase()}
              </div>
              {showUserMenu && (
                <>
                  <div onClick={() => setShowUserMenu(false)} style={{ position: 'fixed', inset: 0, zIndex: 150 }} />
                  <div style={{ position: 'absolute', top: '40px', right: 0, background: '#fff', borderRadius: '14px', border: '1.5px solid #ede8df', boxShadow: '0 8px 32px rgba(0,0,0,0.12)', zIndex: 200, minWidth: '220px', overflow: 'hidden' }}>
                    <div style={{ padding: '16px', borderBottom: '1.5px solid #f0ece4' }}>
                      <div style={{ fontSize: '0.68rem', color: '#9a8f7a', fontFamily: 'Inter, sans-serif', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Signed in as</div>
                      <div style={{ fontSize: '0.82rem', color: '#0f1a14', fontFamily: 'Inter, sans-serif', fontWeight: 600, wordBreak: 'break-all' }}>{user.email}</div>
                    </div>
                    <div style={{ padding: '12px 16px', borderBottom: '1.5px solid #f0ece4', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.82rem', color: '#4a4235', fontFamily: 'Inter, sans-serif' }}>Plan</span>
                      {isPro
                        ? <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0f6644', background: '#eaf5f0', border: '1px solid rgba(15,102,68,0.2)', padding: '3px 10px', borderRadius: '10px' }}>✓ Pro</span>
                        : <span style={{ fontSize: '0.72rem', fontWeight: 600, color: '#9a8f7a', background: '#f7f4ef', border: '1px solid #ede8df', padding: '3px 10px', borderRadius: '10px' }}>Free</span>
                      }
                    </div>
                    {!isPro && (
                      <div style={{ padding: '8px' }}>
                        <button onClick={() => { setShowUserMenu(false); setShowUpgrade(true) }} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#0f6644', border: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 600, color: '#fff', cursor: 'pointer' }}>⭐ Upgrade to Pro</button>
                      </div>
                    )}
                    <div style={{ padding: isPro ? '8px' : '0 8px 8px' }}>
                      <button onClick={() => { setShowUserMenu(false); logout() }} style={{ width: '100%', padding: '10px', borderRadius: '8px', background: 'none', border: '1px solid #ede8df', fontFamily: 'Inter, sans-serif', fontSize: '0.82rem', fontWeight: 500, color: '#9a8f7a', cursor: 'pointer', textAlign: 'left' }}>Log out</button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '80px 24px 100px' }}>

          {/* Header */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '2.4rem', color: '#0f1a14', letterSpacing: '-1.5px', lineHeight: 1 }}>List<span style={{ color: '#0f6644' }}>.</span></h1>
            <p style={{ fontSize: '0.72rem', color: '#9a8f7a', marginTop: '6px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Less list. More done.</p>
            <div style={{ display: 'flex', gap: '6px', marginTop: '14px', flexWrap: 'wrap' }}>
              <StatPill label={`${total} total`} />
              <StatPill label={`${done} done`} color="green" />
              <StatPill label={`${total - done} remaining`} color="orange" />
              <StatPill label={`${starredCount} priority`} color="star" />
            </div>
          </div>

          {/* Today's Focus */}
          <FocusPanel
            top3={top3} items={allItems} lists={lists}
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
              setAllItems(prev => prev.map(i => i.id === itemId ? { ...i, starred: false } : i))
            }}
            onFocus={(item) => setFocusItem(item)}
            onClearDone={clearDoneFocus}
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
                    const reordered = [...items]
                    const si = reordered.findIndex(i => i.id === dragSrcId)
                    const ti = reordered.findIndex(i => i.id === item.id)
                    if (si === -1 || ti === -1) return
                    const [moved] = reordered.splice(si, 1)
                    reordered.splice(ti, 0, moved)
                    setItems(reordered)
                    // Update positions
                    await Promise.all(reordered.map((it, idx) =>
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
            }}>{upgradingLoading ? 'Redirecting to checkout…' : 'Start 7-day free trial — $2.99/mo'}</button>
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
      {showSearch && (
        <SearchModal
          allItems={allItems}
          lists={lists}
          onClose={() => { setShowSearch(false); setSearchQuery('') }}
          onSelectItem={(item) => {
            const list = lists.find(l => l.id === item.list_id)
            if (list) setActiveList(list)
            setShowSearch(false)
            setSearchQuery('')
          }}
        />
      )}

      <Toast toast={toast} />

      {focusItem && (
        <FocusScreen
          item={focusItem}
          initialSeconds={focusTimers[focusItem.id] || 0}
          onDone={async (elapsed) => {
            const id = focusItem.id
            // 1. Clean up timer state
            setFocusTimers(t => { const n = {...t}; delete n[id]; return n })
            // 2. Optimistic UI — mark done, clear starred, update focus duration
            setItems(prev => prev.map(i => i.id === id ? { ...i, done: true, starred: false, focus_duration: elapsed } : i))
            setAllItems(prev => prev.map(i => i.id === id ? { ...i, done: true, starred: false, focus_duration: elapsed } : i))
            // 3. Remove from Focus panel immediately — use functional update to avoid stale closure
            let savedTop3Before = null
            let newTop3 = null
            setTop3(prev => {
              savedTop3Before = prev
              newTop3 = prev.filter(r => r.itemId !== id)
              return newTop3
            })
            // 4. Write done + starred to DB (critical)
            const { error: doneError } = await supabase.from('items').update({ done: true, starred: false }).eq('id', id)
            if (doneError) {
              // Rollback everything on failure using saved pre-change value
              setItems(prev => prev.map(i => i.id === id ? { ...i, done: false, starred: true } : i))
              setAllItems(prev => prev.map(i => i.id === id ? { ...i, done: false, starred: true } : i))
              if (savedTop3Before) setTop3(savedTop3Before)
            } else {
              // 5. Save top3 and focus_duration (non-critical, don't rollback)
              if (newTop3) await supabase.from('profiles').update({ top3: newTop3 }).eq('id', user.id)
              await supabase.from('items').update({ focus_duration: elapsed }).eq('id', id)
            }
            // NOTE: setFocusItem(null) is called from the "Back to List." button
            // so the completion screen stays visible while DB writes happen
          }}
          onExit={(elapsed) => {
            setFocusTimers(t => ({ ...t, [focusItem.id]: elapsed }))
            setFocusItem(null)
          }}
          onClose={() => setFocusItem(null)}
        />
      )}
    </>
  )
}

function ItemRow({ item, listColor, onToggleDone, onToggleStar, onDelete, onTextChange, onDragStart, onDragEnd, onDrop, dragSrcId }) {
  const [dragOver, setDragOver] = useState(false)
  const [hovered, setHovered] = useState(false)
  return (
    <div
      draggable
      onDragStart={onDragStart} onDragEnd={onDragEnd}
      onDragOver={e => { e.preventDefault(); setDragOver(true) }}
      onDragLeave={() => setDragOver(false)}
      onDrop={() => { setDragOver(false); onDrop() }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
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
      {item.done && item.focus_duration > 0 && (
        <span style={{ fontSize: '0.6rem', color: '#0f6644', background: '#eaf5f0', border: '1px solid rgba(15,102,68,0.2)', borderRadius: '8px', padding: '2px 7px', whiteSpace: 'nowrap', fontWeight: 600 }}>
          ⏱ {item.focus_duration < 60 ? `${item.focus_duration}s` : `${Math.floor(item.focus_duration / 60)}m`}
        </span>
      )}
      <span style={{ fontSize: '0.62rem', color: '#c0b8a8', whiteSpace: 'nowrap' }}>{formatDate(item.created_at)}</span>

      <button onClick={onDelete} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#e0d8cc', padding: '4px', opacity: 0, transition: 'opacity 0.15s, color 0.15s' }}
        onMouseOver={e => { e.target.style.opacity = 1; e.target.style.color = '#e04e0a' }}
        onMouseOut={e => { e.target.style.opacity = 0; e.target.style.color = '#e0d8cc' }}
      >×</button>
    </div>
  )
}

function FocusPanel({ top3, items, lists, top3Open, onToggleOpen, onToggleDone, onRemove, onFocus, onClearDone }) {
  const resolvedTop3 = top3.map(ref => {
    const item = items.find(i => i.id === ref.itemId)
    return item ? { ...item, listName: ref.listName } : null
  }).filter(Boolean)

  const doneCount = resolvedTop3.filter(i => i.done).length
  const pct = resolvedTop3.length === 0 ? 0 : Math.round((doneCount / resolvedTop3.length) * 100)

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
              <span style={{ fontSize: '0.68rem', color: '#0f6644', fontWeight: 600 }}>{doneCount} of {resolvedTop3.length} complete{resolvedTop3.length < 5 ? ` · ${5 - resolvedTop3.length} slots free` : ''}</span>
              {doneCount > 0 && (
                <button onClick={onClearDone} style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.68rem', fontWeight: 600, background: 'none', border: '1px solid rgba(15,102,68,0.25)', color: '#0f6644', cursor: 'pointer', padding: '3px 10px', borderRadius: '8px', marginLeft: '8px' }}>Clear done ✓</button>
              )}
              <span style={{ fontSize: '0.65rem', color: '#9a8f7a' }}>Star tasks to add them here</span>
            </div>
          </div>
          {[0, 1, 2, 3, 4].map(i => {
            const item = resolvedTop3[i]
            return (
              <FocusPanelRow
                key={i}
                index={i}
                item={item}
                onToggleDone={onToggleDone}
                onRemove={onRemove}
                onFocus={onFocus}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}


function FocusPanelRow({ index, item, onToggleDone, onRemove, onFocus }) {
  const [hovered, setHovered] = React.useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px 20px", borderBottom: index < 4 ? "1px solid #f0f8f4" : "none", minHeight: "48px" }}
    >
      <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: "0.65rem", color: "#0f6644", opacity: 0.7, width: "18px", flexShrink: 0 }}>{String(index + 1).padStart(2, "0")}</span>
      {item ? (
        <>
          <div onClick={() => onToggleDone(item.id)} style={{ width: "18px", height: "18px", borderRadius: "50%", border: `2px solid ${item.done ? "#0f6644" : "rgba(15,102,68,0.3)"}`, background: item.done ? "#0f6644" : "transparent", cursor: "pointer", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
            {item.done && <span style={{ fontSize: "0.5rem", color: "#fff", fontWeight: 700 }}>✓</span>}
          </div>
          <span style={{ flex: 1, fontSize: "0.87rem", color: item.done ? "#9a8f7a" : "#0f1a14", textDecoration: item.done ? "line-through" : "none", minWidth: 0 }}>{item.text}</span>
          {/* Right side: fixed layout — list badge always visible, Focus → only on hover/desktop */}
          <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
            {!item.done && onFocus && hovered && (
              <button onClick={() => onFocus(item)} style={{ background: "none", border: "1px solid rgba(74,222,128,0.5)", borderRadius: "6px", cursor: "pointer", fontSize: "0.65rem", color: "#4ade80", padding: "3px 8px", fontFamily: "Inter, sans-serif", fontWeight: 600, whiteSpace: "nowrap" }}
                onMouseOver={e => e.currentTarget.style.background = "rgba(74,222,128,0.1)"}
                onMouseOut={e => e.currentTarget.style.background = "none"}
              >Focus →</button>
            )}
            <span style={{ fontSize: "0.62rem", padding: "2px 8px", borderRadius: "10px", background: "#eaf5f0", color: "#0f6644", fontWeight: 600, whiteSpace: "nowrap" }}>{item.listName}</span>
            {hovered && <button onClick={() => onRemove(item.id)} style={{ background: "none", border: "none", color: "#c0b8a8", fontSize: "1rem", cursor: "pointer", padding: "0 2px" }}>×</button>}
          </div>
        </>
      ) : (
        <span style={{ fontSize: "0.78rem", color: "#c0b8a8", fontStyle: "italic" }}>⭐ star a task to pin it here</span>
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

// ─── FOCUS SCREEN ────────────────────────────────────────────────────────────
function FocusScreen({ item, onDone, onExit, onClose, initialSeconds = 0 }) {
  const STORAGE_KEY = `focus_timer_${item.id}`
  const isDoneRef = React.useRef(false)

  // On mount: restore from localStorage if available, else use initialSeconds
  const getInitialState = () => {
    const now = Date.now()
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
      if (saved && !saved.paused) {
        const elapsed = Math.floor((now - saved.startTime) / 1000)
        return { seconds: elapsed, paused: false, startTime: saved.startTime, baseSeconds: elapsed }
      } else if (saved && saved.paused) {
        return { seconds: saved.baseSeconds, paused: true, startTime: null, baseSeconds: saved.baseSeconds }
      }
    } catch {}
    return { seconds: initialSeconds, paused: false, startTime: now - initialSeconds * 1000, baseSeconds: initialSeconds }
  }

  const init = getInitialState()
  const [paused, setPaused] = useState(init.paused)
  const [seconds, setSeconds] = useState(init.seconds)
  const [complete, setComplete] = useState(false)
  const [flash, setFlash] = useState(false)
  const startTimeRef = React.useRef(init.startTime)
  const pausedSecondsRef = React.useRef(init.seconds)

  // Persist timer state to localStorage on every tick and pause/resume
  const persist = (secs, isPaused) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        startTime: isPaused ? null : (Date.now() - secs * 1000),
        baseSeconds: secs,
        paused: isPaused,
      }))
    } catch {}
  }

  useEffect(() => {
    if (paused || complete) return

    if (!startTimeRef.current) {
      startTimeRef.current = Date.now() - pausedSecondsRef.current * 1000
    }

    const tick = () => {
      if (!startTimeRef.current) return
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      setSeconds(elapsed)
      persist(elapsed, false)
    }

    const onVisibility = () => {
      if (document.visibilityState === 'visible') tick()
    }
    document.addEventListener('visibilitychange', onVisibility)

    tick()
    const id = setInterval(tick, 1000)

    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [paused, complete])

  const handlePause = () => {
    // Read elapsed directly from startTimeRef — avoids React state async lag
    const elapsed = startTimeRef.current
      ? Math.floor((Date.now() - startTimeRef.current) / 1000)
      : seconds
    pausedSecondsRef.current = elapsed
    startTimeRef.current = null
    setPaused(true)
    persist(elapsed, true)
  }

  const handleResume = () => {
    startTimeRef.current = Date.now() - pausedSecondsRef.current * 1000
    setPaused(false)
    persist(pausedSecondsRef.current, false)
  }

  const formatTime = (s) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const handleDone = () => {
    if (isDoneRef.current) return  // prevent double-fire
    isDoneRef.current = true
    try { localStorage.removeItem(STORAGE_KEY) } catch {}
    onDone(seconds)  // Save to DB immediately — don't wait for animation
    setFlash(true)
    setTimeout(() => {
      setComplete(true)  // set complete first so background transitions to dark, not gradient
      setFlash(false)
    }, 1200)
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: flash ? '#4ade80' : complete ? '#0a0f0d' : 'linear-gradient(160deg, #0a0f0d 0%, #0d1f16 100%)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      transition: 'background 0.4s',
      fontFamily: 'Inter, sans-serif',
    }}>
      {/* Exit button */}
      {!complete && (
        <button onClick={() => { try { localStorage.removeItem(STORAGE_KEY) } catch {} onExit(seconds) }} style={{
          position: 'absolute', top: '24px', right: '24px',
          background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)',
          fontSize: '0.75rem', cursor: 'pointer', transition: 'color 0.2s',
          fontFamily: 'Inter, sans-serif', letterSpacing: '0.08em',
          display: 'flex', alignItems: 'center', gap: '6px',
        }}
          onMouseOver={e => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
          onMouseOut={e => e.currentTarget.style.color = 'rgba(255,255,255,0.2)'}
        >exit ×</button>
      )}

      {!complete ? (
        <>
          {/* Label */}
          <p style={{
            fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase',
            color: paused ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.4)',
            marginBottom: '20px', transition: 'color 0.4s',
          }}>{paused ? 'paused' : 'focusing on'}</p>

          {/* Task name */}
          <p style={{
            fontSize: '1.3rem', fontWeight: 600, color: paused ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.9)',
            marginBottom: '52px', maxWidth: '480px', textAlign: 'center',
            lineHeight: 1.4, padding: '0 32px',
            transition: 'color 0.4s',
          }}>{item.text}</p>

          {/* Breathing dot */}
          <div style={{
            width: '90px', height: '90px', borderRadius: '50%',
            background: paused
              ? 'radial-gradient(circle at 35% 35%, rgba(74,222,128,0.15), rgba(15,102,68,0.08))'
              : 'radial-gradient(circle at 35% 35%, #6ee7a0, #0f6644)',
            marginBottom: '48px',
            animation: paused ? 'none' : 'breathe 4s ease-in-out infinite',
            opacity: paused ? 0.35 : 1,
            transition: 'opacity 0.6s, background 0.6s',
            boxShadow: paused ? 'none' : '0 0 60px rgba(74,222,128,0.35), 0 0 120px rgba(74,222,128,0.1)',
          }} />

          {/* Timer */}
          <p style={{
            fontSize: '2.2rem', fontWeight: 200, color: paused ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
            letterSpacing: '0.08em', marginBottom: '48px', fontVariantNumeric: 'tabular-nums',
            transition: 'color 0.4s',
          }}>{formatTime(seconds)}</p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button onClick={paused ? handleResume : handlePause} style={{
              padding: '12px 28px', borderRadius: '10px',
              border: '1.5px solid rgba(255,255,255,0.15)', background: 'transparent',
              color: 'rgba(255,255,255,0.6)', fontFamily: 'Inter, sans-serif',
              fontWeight: 500, fontSize: '0.88rem', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'; e.currentTarget.style.color = 'rgba(255,255,255,0.9)' }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = 'rgba(255,255,255,0.6)' }}
            >{paused ? 'Resume' : 'Pause'}</button>

            <button onClick={handleDone} style={{
              padding: '12px 28px', borderRadius: '10px',
              border: 'none', background: '#4ade80',
              color: '#0a0f0d', fontFamily: 'Inter, sans-serif',
              fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
              transition: 'all 0.2s',
            }}
              onMouseOver={e => e.currentTarget.style.background = '#6ee7a0'}
              onMouseOut={e => e.currentTarget.style.background = '#4ade80'}
            >Done ✓</button>
          </div>

          <style>{`
            @keyframes breathe {
              0%, 100% { transform: scale(1); box-shadow: 0 0 40px rgba(74,222,128,0.3), 0 0 80px rgba(74,222,128,0.08); }
              50% { transform: scale(1.2); box-shadow: 0 0 80px rgba(74,222,128,0.5), 0 0 160px rgba(74,222,128,0.15); }
            }
          `}</style>
        </>
      ) : (
        /* Completion screen */
        <div style={{ textAlign: 'center', padding: '0 32px' }}>
          <div style={{
            width: '64px', height: '64px', borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #6ee7a0, #0f6644)',
            margin: '0 auto 32px',
            boxShadow: '0 0 60px rgba(74,222,128,0.4), 0 0 120px rgba(74,222,128,0.15)',
          }} />
          <p style={{ fontSize: '3rem', fontWeight: 800, color: '#4ade80', letterSpacing: '-1px', marginBottom: '12px', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Done.</p>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.5)', marginBottom: '8px', maxWidth: '360px', lineHeight: 1.5 }}>{item.text}</p>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', marginBottom: '48px' }}>
            {Math.floor(seconds / 60) > 0 ? `${Math.floor(seconds / 60)} min` : `${seconds} sec`} of focused work
          </p>
          <button onClick={onClose} style={{
            padding: '14px 32px', borderRadius: '10px',
            border: 'none', background: '#0f6644',
            color: '#fff', fontFamily: 'Inter, sans-serif',
            fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(15,102,68,0.4)',
          }}>Back to List.</button>
        </div>
      )}
    </div>
  )
}

// ─── TOAST ───────────────────────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast) return null
  const isWarn = toast.type === 'warn'
  return (
    <>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 600px) {
          .toast-container {
            left: 12px !important;
            right: 12px !important;
            bottom: 80px !important;
            max-width: none !important;
            width: auto !important;
          }
        }
      `}</style>
      <div className="toast-container" style={{
        position: 'fixed',
        bottom: '32px',
        right: '24px',
        maxWidth: '320px',
        zIndex: 500,
        animation: 'toastIn 0.25s ease-out',
        background: isWarn ? '#fff8ec' : '#f0faf5',
        border: `1.5px solid ${isWarn ? 'rgba(212,146,10,0.3)' : 'rgba(15,102,68,0.2)'}`,
        borderRadius: '12px',
        padding: '12px 16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        fontFamily: 'Inter, sans-serif',
      }}>
        <span style={{ fontSize: '1rem', flexShrink: 0 }}>{isWarn ? '⚠️' : 'ℹ️'}</span>
        <span style={{ fontSize: '0.82rem', color: '#0f1a14', fontWeight: 500, lineHeight: 1.4 }}>{toast.message}</span>
      </div>
    </>
  )
}

// ─── SEARCH MODAL ─────────────────────────────────────────────────────────────
function SearchModal({ allItems, lists, onClose, onSelectItem }) {
  const [query, setQuery] = useState('')
  const inputRef = React.useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const results = query.trim().length < 1 ? [] : allItems.filter(item =>
    item.text.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8)

  const getListName = (listId) => lists.find(l => l.id === listId)?.name || ''
  const getListColor = (listId) => lists.find(l => l.id === listId)?.color || '#0f6644'

  return (
    <div
      onClick={e => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(17,16,8,0.5)', backdropFilter: 'blur(4px)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '80px 24px 24px',
      }}
    >
      <div style={{
        background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '520px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.2)', border: '1.5px solid #ede8df',
        overflow: 'hidden',
      }}>
        {/* Search input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderBottom: results.length > 0 ? '1.5px solid #ede8df' : 'none' }}>
          <span style={{ fontSize: '1rem', color: '#9a8f7a', flexShrink: 0 }}>🔍</span>
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search tasks…"
            style={{
              flex: 1, border: 'none', outline: 'none',
              fontFamily: 'Inter, sans-serif', fontSize: '1rem',
              color: '#0f1a14', background: 'transparent',
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9a8f7a', fontSize: '1rem', padding: '0' }}>×</button>
          )}
          <button onClick={onClose} style={{
            background: '#f7f4ef', border: '1px solid #ede8df', borderRadius: '8px',
            cursor: 'pointer', color: '#9a8f7a', fontSize: '0.75rem', padding: '4px 10px',
            fontFamily: 'Inter, sans-serif', flexShrink: 0,
          }}>Close</button>
        </div>

        {/* Results */}
        {results.length > 0 && (
          <div>
            {results.map(item => (
              <div
                key={item.id}
                onClick={() => onSelectItem(item)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '12px 20px', cursor: 'pointer',
                  borderBottom: '1px solid #f7f4ef',
                  transition: 'background 0.1s',
                }}
                onMouseOver={e => e.currentTarget.style.background = '#f7f4ef'}
                onMouseOut={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{
                  width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${item.done ? getListColor(item.list_id) : getListColor(item.list_id) + '55'}`,
                  background: item.done ? getListColor(item.list_id) : 'transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {item.done && <span style={{ fontSize: '0.45rem', color: '#fff', fontWeight: 700 }}>✓</span>}
                </div>
                <span style={{
                  flex: 1, fontSize: '0.9rem',
                  color: item.done ? '#9a8f7a' : '#0f1a14',
                  textDecoration: item.done ? 'line-through' : 'none',
                }}>{item.text}</span>
                <span style={{
                  fontSize: '0.62rem', padding: '2px 8px', borderRadius: '10px',
                  background: '#eaf5f0', color: getListColor(item.list_id),
                  fontWeight: 600, flexShrink: 0,
                }}>{getListName(item.list_id)}</span>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {query.trim().length > 0 && results.length === 0 && (
          <div style={{ padding: '32px 20px', textAlign: 'center', color: '#9a8f7a', fontSize: '0.85rem' }}>
            No tasks found for "<strong>{query}</strong>"
          </div>
        )}

        {/* Hint when empty */}
        {query.trim().length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center', color: '#c0b8a8', fontSize: '0.78rem' }}>
            Search across all your lists
          </div>
        )}
      </div>
    </div>
  )
}
