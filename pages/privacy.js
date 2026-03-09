import Head from 'next/head'
import Link from 'next/link'
import { Logo } from '../components/Logo'

export default function Privacy() {
  return (
    <>
      <Head>
        <title>Privacy Policy — List.</title>
        <meta name="description" content="Privacy policy for List." />
        <link rel="icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        background: 'rgba(247,244,239,0.88)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1.5px solid #ede8df',
        zIndex: 100, padding: '0 24px', height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ textDecoration: 'none' }}><Logo size="sm" /></Link>
        <Link href="/signup" style={{
          fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 600,
          color: '#fff', background: '#0f6644', padding: '8px 18px',
          borderRadius: '8px', textDecoration: 'none',
        }}>Get started free</Link>
      </nav>

      <div style={{
        maxWidth: '680px', margin: '0 auto', padding: '120px 24px 80px',
        fontFamily: 'Inter, sans-serif',
      }}>
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
          fontSize: '2.4rem', color: '#0f1a14', letterSpacing: '-1px', marginBottom: '8px',
        }}>Privacy Policy</h1>
        <p style={{ fontSize: '0.85rem', color: '#9a8f7a', marginBottom: '48px' }}>Last updated: March 2026</p>

        {sections.map((s, i) => (
          <div key={i} style={{ marginBottom: '40px' }}>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
              fontSize: '1.1rem', color: '#0f1a14', marginBottom: '12px',
            }}>{s.title}</h2>
            <p style={{ fontSize: '0.9rem', color: '#4a4235', lineHeight: 1.8 }}>{s.body}</p>
          </div>
        ))}

        <div style={{ borderTop: '1.5px solid #ede8df', paddingTop: '32px', marginTop: '48px' }}>
          <p style={{ fontSize: '0.85rem', color: '#9a8f7a' }}>
            Questions? Contact us at{' '}
            <a href="mailto:hello@listdot.app" style={{ color: '#0f6644', textDecoration: 'none', fontWeight: 500 }}>
              hello@listdot.app
            </a>
          </p>
        </div>
      </div>

      <footer style={{
        padding: '32px 24px', borderTop: '1.5px solid #ede8df',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '16px', maxWidth: '960px', margin: '0 auto',
      }}>
        <Logo size="sm" />
        <p style={{ fontSize: '0.75rem', color: '#9a8f7a' }}>© {new Date().getFullYear()} List.</p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/privacy" style={{ fontSize: '0.75rem', color: '#0f6644', textDecoration: 'none', fontWeight: 500 }}>Privacy</Link>
          <Link href="/terms" style={{ fontSize: '0.75rem', color: '#9a8f7a', textDecoration: 'none' }}>Terms</Link>
        </div>
      </footer>
    </>
  )
}

const sections = [
  {
    title: '1. What we collect',
    body: 'We collect the information you provide when you create an account — your name and email address. If you sign in with Google, we receive your name and email from Google. We also collect the tasks and lists you create within the app, which are stored securely in our database.',
  },
  {
    title: '2. How we use your information',
    body: 'We use your information solely to provide and improve the List. service. Your email is used for account authentication and occasional product updates. We do not sell, rent, or share your personal information with third parties for marketing purposes.',
  },
  {
    title: '3. Data storage',
    body: 'Your data is stored securely using Supabase, a managed database platform. All data is encrypted in transit and at rest. We retain your data for as long as your account is active. You can request deletion of your account and all associated data at any time by contacting us.',
  },
  {
    title: '4. Payments',
    body: 'Payment processing is handled by Stripe. We do not store your payment card details — these are handled entirely by Stripe and subject to their privacy policy. We receive only a confirmation of payment status.',
  },
  {
    title: '5. Cookies',
    body: 'We use cookies solely for authentication purposes — to keep you logged in across sessions. We do not use cookies for tracking or advertising.',
  },
  {
    title: '6. Third-party services',
    body: 'List. uses the following third-party services: Supabase (database and authentication), Stripe (payments), Google OAuth (optional sign-in), and Vercel (hosting). Each of these services has their own privacy policy governing their use of data.',
  },
  {
    title: '7. Your rights',
    body: 'You have the right to access, correct, or delete your personal data at any time. To request a copy of your data or to delete your account, please contact us at hello@listdot.app and we will respond within 7 days.',
  },
  {
    title: '8. Changes to this policy',
    body: 'We may update this privacy policy from time to time. We will notify you of significant changes by email. Continued use of the service after changes constitutes acceptance of the updated policy.',
  },
]
