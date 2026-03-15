import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useUser, useSessionContext } from '@supabase/auth-helpers-react'
import { Logo } from '../components/Logo'
import Link from 'next/link'

export default function InvitePage() {
  const router = useRouter()
  const user = useUser()
  const { isLoading: sessionLoading } = useSessionContext()
  const { token } = router.query

  const [status, setStatus] = useState('loading') // loading | accepting | success | error | wrong-email
  const [message, setMessage] = useState('')
  const [listName, setListName] = useState('')

  useEffect(() => {
    if (sessionLoading || !token) return

    // Not logged in — redirect to login, come back after
    if (!user) {
      router.push(`/login?redirect=${encodeURIComponent(`/invite?token=${token}`)}`)
      return
    }

    acceptInvite()
  }, [user, sessionLoading, token])

  const acceptInvite = async () => {
    setStatus('accepting')
    try {
      const res = await fetch('/api/accept-invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          userId: user.id,
          userEmail: user.email,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 403) {
          setStatus('wrong-email')
          setMessage(data.error)
        } else {
          setStatus('error')
          setMessage(data.error || 'Something went wrong.')
        }
        return
      }

      setListName(data.listName)
      setStatus('success')

      // Redirect to the app after a short delay
      setTimeout(() => {
        router.push('/app')
      }, 2500)

    } catch (err) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <>
      <Head><title>Accept Invite — List.</title></Head>
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg, #f0ece2 0%, #f7f4ef 50%, #eaf5f0 100%)',
        padding: '24px',
      }}>
        <Link href="/" style={{ marginBottom: '40px', textDecoration: 'none' }}>
          <Logo size="md" />
        </Link>

        <div style={{
          background: '#fff', borderRadius: '20px', padding: '40px',
          width: '100%', maxWidth: '420px', textAlign: 'center',
          boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
          border: '1.5px solid #ede8df',
        }}>

          {/* Loading / Accepting */}
          {(status === 'loading' || status === 'accepting') && (
            <>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>⏳</div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: '#0f1a14', letterSpacing: '-0.5px', marginBottom: '8px' }}>
                Accepting invite…
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#9a8f7a' }}>Just a moment</p>
            </>
          )}

          {/* Success */}
          {status === 'success' && (
            <>
              <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'radial-gradient(circle at 35% 35%, #6ee7a0, #0f6644)', margin: '0 auto 20px', boxShadow: '0 0 40px rgba(74,222,128,0.3)' }} />
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1.6rem', color: '#0f6644', letterSpacing: '-0.5px', marginBottom: '8px' }}>
                You're in!
              </h2>
              <p style={{ fontSize: '0.9rem', color: '#4a4235', lineHeight: 1.6, marginBottom: '8px' }}>
                <strong>"{listName}"</strong> has been added to your lists.
              </p>
              <p style={{ fontSize: '0.8rem', color: '#9a8f7a' }}>Redirecting you to the app…</p>
            </>
          )}

          {/* Wrong email */}
          {status === 'wrong-email' && (
            <>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>🔒</div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: '#0f1a14', letterSpacing: '-0.5px', marginBottom: '12px' }}>
                Wrong account
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#4a4235', lineHeight: 1.6, marginBottom: '24px' }}>
                {message}
              </p>
              <button onClick={async () => {
                // Sign out and redirect back to login with the invite token
                router.push(`/login?redirect=${encodeURIComponent(`/invite?token=${token}`)}`)
              }} style={{
                width: '100%', padding: '12px', borderRadius: '10px',
                background: '#0f6644', border: 'none', color: '#fff',
                fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9rem',
                cursor: 'pointer',
              }}>
                Log in with the right account
              </button>
            </>
          )}

          {/* Error */}
          {status === 'error' && (
            <>
              <div style={{ fontSize: '2.5rem', marginBottom: '16px' }}>😕</div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '1.4rem', color: '#0f1a14', letterSpacing: '-0.5px', marginBottom: '12px' }}>
                Something went wrong
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#4a4235', lineHeight: 1.6, marginBottom: '24px' }}>
                {message}
              </p>
              <Link href="/app" style={{
                display: 'block', padding: '12px', borderRadius: '10px',
                background: '#0f6644', color: '#fff', textDecoration: 'none',
                fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9rem',
                textAlign: 'center',
              }}>
                Go to app
              </Link>
            </>
          )}

        </div>
      </div>
    </>
  )
}
