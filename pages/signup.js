import Head from 'next/head'
import Link from 'next/link'
import { useState } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { Logo } from '../components/Logo'

export default function Signup() {
  const supabase = useSupabaseClient()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/app` }
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/app` }
    })
  }

  return (
    <>
      <Head><title>Sign up — List.</title></Head>
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(160deg, #f0ece2 0%, #f7f4ef 50%, #eaf5f0 100%)',
        padding: '24px',
      }}>
        <Link href="/" style={{ marginBottom: '32px', textDecoration: 'none' }}>
          <Logo size="md" />
        </Link>

        <div style={{
          background: '#fff', borderRadius: '20px', padding: '40px',
          width: '100%', maxWidth: '420px',
          boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
          border: '1.5px solid #ede8df',
        }}>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
            fontSize: '1.8rem', color: '#0f1a14', letterSpacing: '-0.5px',
            marginBottom: '6px',
          }}>Create your account</h1>
          <p style={{ fontSize: '0.85rem', color: '#9a8f7a', marginBottom: '28px' }}>
            Free forever. No credit card needed.
          </p>

          {success ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📬</div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '1.1rem', color: '#0f1a14', marginBottom: '8px' }}>Check your email</h3>
              <p style={{ fontSize: '0.85rem', color: '#4a4235', lineHeight: 1.6 }}>
                We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account.
              </p>
            </div>
          ) : (
            <>
              <button onClick={handleGoogle} style={{
                width: '100%', padding: '12px', borderRadius: '10px',
                border: '1.5px solid #ede8df', background: '#fff',
                fontFamily: 'Inter, sans-serif', fontWeight: 500, fontSize: '0.9rem',
                color: '#0f1a14', cursor: 'pointer', marginBottom: '20px',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              }}>
                <svg width="18" height="18" viewBox="0 0 18 18"><path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/><path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/><path d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/><path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/></svg>
                Continue with Google
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ flex: 1, height: '1px', background: '#ede8df' }} />
                <span style={{ fontSize: '0.75rem', color: '#9a8f7a', fontWeight: 500 }}>or</span>
                <div style={{ flex: 1, height: '1px', background: '#ede8df' }} />
              </div>

              <form onSubmit={handleSignup}>
                <AuthInput label="Email address" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
                <AuthInput label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters" />
                {error && <div style={{ fontSize: '0.82rem', color: '#e04e0a', marginBottom: '16px', padding: '10px 14px', background: '#fdf0ea', borderRadius: '8px' }}>{error}</div>}
                <button type="submit" disabled={loading} style={{
                  width: '100%', padding: '13px', borderRadius: '10px',
                  border: 'none', background: loading ? '#7ab898' : '#0f6644',
                  fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.95rem',
                  color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
                  boxShadow: '0 2px 12px rgba(15,102,68,0.25)',
                  transition: 'background 0.2s',
                }}>{loading ? 'Creating account…' : 'Create free account'}</button>
              </form>
            </>
          )}

          <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.82rem', color: '#9a8f7a' }}>
            Already have an account?{' '}
            <Link href="/login" style={{ color: '#0f6644', fontWeight: 600, textDecoration: 'none' }}>Log in</Link>
          </p>
        </div>
      </div>
    </>
  )
}

function AuthInput({ label, type, value, onChange, placeholder }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#4a4235', marginBottom: '6px', letterSpacing: '0.02em' }}>{label}</label>
      <input type={type} value={value} onChange={onChange} placeholder={placeholder} required
        style={{
          width: '100%', padding: '11px 14px', borderRadius: '8px',
          border: '1.5px solid #ede8df', fontFamily: 'Inter, sans-serif',
          fontSize: '0.9rem', color: '#0f1a14', outline: 'none',
          background: '#fafaf8', transition: 'border-color 0.2s',
        }}
        onFocus={e => e.target.style.borderColor = '#0f6644'}
        onBlur={e => e.target.style.borderColor = '#ede8df'}
      />
    </div>
  )
}
