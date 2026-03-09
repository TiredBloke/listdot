import Head from 'next/head'
import Link from 'next/link'
import { Logo } from '../components/Logo'

export default function Terms() {
  return (
    <>
      <Head>
        <title>Terms of Service — List.</title>
        <meta name="description" content="Terms of service for List." />
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
        }}>Terms of Service</h1>
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
          <Link href="/privacy" style={{ fontSize: '0.75rem', color: '#9a8f7a', textDecoration: 'none' }}>Privacy</Link>
          <Link href="/terms" style={{ fontSize: '0.75rem', color: '#0f6644', textDecoration: 'none', fontWeight: 500 }}>Terms</Link>
        </div>
      </footer>
    </>
  )
}

const sections = [
  {
    title: '1. Acceptance of terms',
    body: 'By creating an account or using List. ("the Service"), you agree to these Terms of Service. If you do not agree, please do not use the Service. These terms apply to all users, including free and paid subscribers.',
  },
  {
    title: '2. Use of the service',
    body: 'List. is a personal productivity tool. You may use it to manage your own tasks and lists. You agree not to use the Service for any unlawful purpose, to attempt to gain unauthorised access to any part of the Service, or to interfere with the Service in any way.',
  },
  {
    title: '3. Your account',
    body: 'You are responsible for maintaining the security of your account and password. You must notify us immediately at hello@listdot.app if you suspect any unauthorised use of your account. We are not liable for any loss resulting from unauthorised use of your account.',
  },
  {
    title: '4. Free and paid plans',
    body: 'List. offers a free plan with limited features and a paid Pro plan billed monthly. By subscribing to the Pro plan, you authorise us to charge your payment method on a recurring monthly basis. You may cancel at any time and will retain access until the end of your billing period.',
  },
  {
    title: '5. Refunds',
    body: 'We offer a 7-day free trial on the Pro plan. If you are unsatisfied after your first paid month, contact us at hello@listdot.app and we will consider refund requests on a case-by-case basis.',
  },
  {
    title: '6. Your data',
    body: 'You own the data you create in List. We do not claim ownership over your tasks or lists. You can export or delete your data at any time by contacting us. If you delete your account, your data will be permanently removed within 30 days.',
  },
  {
    title: '7. Service availability',
    body: 'We aim to keep List. available at all times but cannot guarantee uninterrupted access. We may perform maintenance, updates, or experience outages. We are not liable for any loss caused by downtime or service interruptions.',
  },
  {
    title: '8. Termination',
    body: 'We reserve the right to suspend or terminate accounts that violate these terms, engage in abusive behaviour, or attempt to compromise the security of the Service. You may delete your account at any time.',
  },
  {
    title: '9. Limitation of liability',
    body: 'List. is provided "as is" without warranties of any kind. To the fullest extent permitted by law, we are not liable for any indirect, incidental, or consequential damages arising from your use of the Service.',
  },
  {
    title: '10. Changes to these terms',
    body: 'We may update these terms from time to time. We will notify you of significant changes by email. Continued use of the Service after changes constitutes acceptance of the updated terms.',
  },
]
