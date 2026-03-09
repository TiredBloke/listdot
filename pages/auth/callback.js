import { useEffect } from 'react'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'

export default function AuthCallback() {
  const supabase = useSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    const handleCallback = async () => {
      const { data, error } = await supabase.auth.exchangeCodeForSession(
        window.location.href
      )
      if (error) {
        console.error('Auth callback error:', error)
        router.push('/login')
        return
      }
      // Redirect to wherever they were going, or /app by default
      const next = router.query.next || '/app'
      router.push(next)
    }

    handleCallback()
  }, [])

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#f7f4ef',
      fontFamily: 'Inter, sans-serif', color: '#9a8f7a', fontSize: '0.85rem'
    }}>
      Signing you in…
    </div>
  )
}
