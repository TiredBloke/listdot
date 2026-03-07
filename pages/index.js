import Head from 'next/head'
import Link from 'next/link'
import { Logo } from '../components/Logo'

export default function Landing() {
  return (
    <>
      <Head>
        <title>List. — Focus. Done.</title>
        <meta name="description" content="The notebook you always meant to digitise. Manage tasks, set daily priorities, and get things done." />
        <link rel="icon" href="/favicon.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
      </Head>

      {/* NAV */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        background: 'rgba(247,244,239,0.92)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        zIndex: 100, padding: '0 40px', height: '60px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Logo size="sm" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Link href="/login" style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', fontWeight: 500,
            color: '#4a4235', padding: '8px 16px', borderRadius: '8px', textDecoration: 'none',
          }}>Log in</Link>
          <Link href="/signup" style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', fontWeight: 600,
            color: '#fff', background: '#0f6644', padding: '8px 20px',
            borderRadius: '8px', textDecoration: 'none',
            boxShadow: '0 1px 4px rgba(15,102,68,0.3)',
          }}>Get started free</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '100px 24px 60px',
        background: '#f7f4ef', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '10%', right: '5%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(15,102,68,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '5%', left: '0%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(224,78,10,0.04) 0%, transparent 65%)', pointerEvents: 'none' }} />

        <div style={{ animation: 'fadeUp 0.6s ease forwards', opacity: 0, maxWidth: '720px' }}>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
            fontSize: 'clamp(2.8rem, 6vw, 4.8rem)',
            color: '#0f1a14', letterSpacing: '-2px', lineHeight: 1.08, marginBottom: '24px',
          }}>
            Your notebook,{' '}
            <span style={{ color: '#0f6644' }}>finally digital.</span>
          </h1>

          <p style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(1rem, 2vw, 1.15rem)', color: '#5a5248',
            maxWidth: '480px', lineHeight: 1.75, fontWeight: 400, margin: '0 auto 40px',
          }}>
            Stop juggling sticky notes and scraps of paper. Keep your tasks organised, flag today's priorities, and sync across every device.
          </p>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{
              fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 600,
              color: '#fff', background: '#0f6644', padding: '13px 28px',
              borderRadius: '10px', textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(15,102,68,0.28)',
              display: 'inline-flex', alignItems: 'center', gap: '6px',
            }}>Start for free →</Link>
            <Link href="#pricing" style={{
              fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 500,
              color: '#4a4235', background: '#fff', padding: '13px 28px',
              borderRadius: '10px', textDecoration: 'none', border: '1px solid #e0d8cc',
            }}>See pricing</Link>
          </div>

          <p style={{ marginTop: '18px', fontSize: '0.75rem', color: '#9a8f7a', fontFamily: 'Inter, sans-serif' }}>
            Free forever · No credit card · Upgrade anytime
          </p>
        </div>

        <div style={{ marginTop: '64px', width: '100%', maxWidth: '640px', animation: 'fadeUp 0.7s ease 0.15s forwards', opacity: 0 }}>
          <AppMockup />
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '100px 24px', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
            fontSize: 'clamp(1.9rem, 4vw, 2.6rem)',
            color: '#0f1a14', letterSpacing: '-1px', marginBottom: '14px', lineHeight: 1.15,
          }}>
            Everything your notebook had.{' '}
            <span style={{ color: '#0f6644' }}>Plus what it was missing.</span>
          </h2>
          <p style={{ fontSize: '1rem', color: '#5a5248', maxWidth: '420px', margin: '0 auto', lineHeight: 1.7, fontFamily: 'Inter, sans-serif' }}>
            Built for people who actually write lists, not for productivity influencers.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
          {features.map((f, i) => (
            <div key={i} style={{ background: '#fff', borderRadius: '14px', padding: '26px', border: '1px solid #ede8df', boxShadow: '0 1px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginBottom: '14px' }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.95rem', color: '#0f1a14', marginBottom: '6px' }}>{f.title}</h3>
              <p style={{ fontSize: '0.83rem', color: '#5a5248', lineHeight: 1.6, fontFamily: 'Inter, sans-serif' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ padding: '100px 24px', background: '#0f1a14' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(1.9rem, 4vw, 2.6rem)', color: '#fff', letterSpacing: '-1px', marginBottom: '12px', lineHeight: 1.15 }}>
            Simple pricing.{' '}<span style={{ color: '#2db87a' }}>No surprises.</span>
          </h2>
          <p style={{ fontSize: '1rem', color: '#5a8a70', maxWidth: '380px', margin: '0 auto 52px', lineHeight: 1.7, fontFamily: 'Inter, sans-serif' }}>
            Start free, upgrade when you need more.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', maxWidth: '640px', margin: '0 auto' }}>
            <div style={{ background: '#1a2e20', borderRadius: '18px', padding: '32px', border: '1px solid #2a4030', textAlign: 'left' }}>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#3d7a5a', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'Inter, sans-serif' }}>Free</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '2.6rem', color: '#fff', letterSpacing: '-1px', marginBottom: '2px' }}>$0</div>
              <div style={{ fontSize: '0.8rem', color: '#5a8a70', marginBottom: '28px', fontFamily: 'Inter, sans-serif' }}>forever, no card needed</div>
              {freeTier.map((f, i) => <PricingRow key={i} text={f} />)}
              <Link href="/signup" style={{ display: 'block', textAlign: 'center', marginTop: '24px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.88rem', color: '#fff', border: '1px solid #3d7a5a', padding: '11px', borderRadius: '9px', textDecoration: 'none' }}>Get started free</Link>
            </div>
            <div style={{ background: '#0f6644', borderRadius: '18px', padding: '32px', border: '1px solid #2db87a', textAlign: 'left', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 32px rgba(15,102,68,0.35)' }}>
              <div style={{ position: 'absolute', top: '14px', right: '14px', background: '#2db87a', color: '#fff', fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', padding: '3px 9px', borderRadius: '8px', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>Most popular</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#a8e8c8', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'Inter, sans-serif' }}>Pro</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '2.6rem', color: '#fff', letterSpacing: '-1px', marginBottom: '2px' }}>$2.99</div>
              <div style={{ fontSize: '0.8rem', color: '#a8e8c8', marginBottom: '28px', fontFamily: 'Inter, sans-serif' }}>per month · cancel anytime</div>
              {proTier.map((f, i) => <PricingRow key={i} text={f} bright />)}
              <Link href="/signup?plan=pro" style={{ display: 'block', textAlign: 'center', marginTop: '24px', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.88rem', color: '#0f6644', background: '#fff', padding: '11px', borderRadius: '9px', textDecoration: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }}>Start 7-day free trial</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 24px', textAlign: 'center', background: '#f7f4ef' }}>
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', color: '#0f1a14', letterSpacing: '-1px', marginBottom: '14px', lineHeight: 1.15 }}>
          Ready to ditch the notebook?
        </h2>
        <p style={{ fontSize: '1rem', color: '#5a5248', marginBottom: '32px', lineHeight: 1.7, fontFamily: 'Inter, sans-serif' }}>
          Free to start. Takes 30 seconds. Your lists, everywhere.
        </p>
        <Link href="/signup" style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.95rem', fontWeight: 600, color: '#fff', background: '#0f6644', padding: '13px 36px', borderRadius: '10px', textDecoration: 'none', boxShadow: '0 4px 16px rgba(15,102,68,0.28)', display: 'inline-block' }}>
          Start for free →
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{ padding: '28px 40px', borderTop: '1px solid #ede8df', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', maxWidth: '960px', margin: '0 auto' }}>
        <Logo size="sm" />
        <p style={{ fontSize: '0.73rem', color: '#9a8f7a', fontFamily: 'Inter, sans-serif' }}>© {new Date().getFullYear()} List. · Focus. Done.</p>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#" style={{ fontSize: '0.73rem', color: '#9a8f7a', textDecoration: 'none', fontFamily: 'Inter, sans-serif' }}>{l}</a>
          ))}
        </div>
      </footer>
    </>
  )
}

function PricingRow({ text, bright }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '9px', marginBottom: '10px' }}>
      <div style={{ width: '17px', height: '17px', borderRadius: '50%', flexShrink: 0, background: bright ? 'rgba(255,255,255,0.18)' : 'rgba(45,184,122,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', color: bright ? '#fff' : '#2db87a' }}>✓</div>
      <span style={{ fontSize: '0.83rem', color: bright ? '#d4f0e4' : '#7ab898', fontFamily: 'Inter, sans-serif' }}>{text}</span>
    </div>
  )
}

function AppMockup() {
  return (
    <div style={{ background: '#fff', borderRadius: '18px', overflow: 'hidden', boxShadow: '0 20px 60px rgba(15,26,20,0.14), 0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #e8e2d8' }}>
      <div style={{ background: '#0f1a14', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '7px' }}>
        <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#e04e0a', opacity: 0.8 }} />
        <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#d4920a', opacity: 0.8 }} />
        <div style={{ width: '9px', height: '9px', borderRadius: '50%', background: '#2db87a', opacity: 0.8 }} />
        <div style={{ flex: 1, textAlign: 'center', fontSize: '0.68rem', color: '#3d7a5a', fontWeight: 500, letterSpacing: '0.05em', fontFamily: 'Inter, sans-serif' }}>listdot.vercel.app</div>
      </div>
      <div style={{ background: '#eaf5f0', padding: '14px 18px', borderBottom: '1px solid #d4ebe0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '0.9rem' }}>🎯</span>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.82rem', color: '#0f6644' }}>Today's Focus</span>
          <span style={{ fontSize: '0.62rem', background: '#0f6644', color: '#fff', borderRadius: '8px', padding: '2px 7px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>2 / 3</span>
        </div>
        {mockFocus.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '5px 0' }}>
            <div style={{ width: '15px', height: '15px', borderRadius: '50%', flexShrink: 0, background: f.done ? '#0f6644' : 'transparent', border: `2px solid ${f.done ? '#0f6644' : 'rgba(15,102,68,0.3)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {f.done && <span style={{ fontSize: '0.45rem', color: '#fff' }}>✓</span>}
            </div>
            <span style={{ fontSize: '0.8rem', color: f.done ? '#9a8f7a' : '#0f1a14', textDecoration: f.done ? 'line-through' : 'none', flex: 1, fontFamily: 'Inter, sans-serif' }}>{f.text}</span>
            <span style={{ fontSize: '0.6rem', background: 'rgba(15,102,68,0.1)', color: '#0f6644', borderRadius: '6px', padding: '2px 6px', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>{f.list}</span>
          </div>
        ))}
      </div>
      <div style={{ padding: '6px 0' }}>
        {mockItems.map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 18px', borderBottom: i < mockItems.length - 1 ? '1px solid #f0ece4' : 'none', background: item.starred ? '#fdf8ec' : 'transparent' }}>
            <div style={{ width: '15px', height: '15px', borderRadius: '50%', flexShrink: 0, background: item.done ? '#e04e0a' : 'transparent', border: `2px solid ${item.done ? '#e04e0a' : '#e0d8cc'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {item.done && <span style={{ fontSize: '0.45rem', color: '#fff' }}>✓</span>}
            </div>
            <span style={{ flex: 1, fontSize: '0.8rem', color: item.done ? '#b0a898' : '#0f1a14', textDecoration: item.done ? 'line-through' : 'none', fontWeight: item.starred ? 500 : 400, fontFamily: 'Inter, sans-serif' }}>{item.text}</span>
            {item.starred && <span style={{ fontSize: '0.8rem' }}>⭐</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

const features = [
  { icon: '📋', bg: '#eaf5f0', title: 'Multiple Lists', desc: 'Work, Personal, Shopping — keep everything separate and switch between them instantly.' },
  { icon: '🎯', bg: '#eaf5f0', title: "Today's Focus", desc: 'Star up to 3 tasks as your daily priorities. They collect at the top so you always know what matters most.' },
  { icon: '⭐', bg: '#fdf8ec', title: 'Priority Flagging', desc: 'Star any task to mark it as important. Priority tasks float to the top and glow gold.' },
  { icon: '🔄', bg: '#eaf5f0', title: 'Sync Everywhere', desc: 'Your lists follow you across phone, tablet, and desktop. Always up to date.' },
  { icon: '↕️', bg: '#fdf0ea', title: 'Drag to Reorder', desc: 'Grab any task and drag it into the exact order you want. No fussing around.' },
  { icon: '📊', bg: '#fdf0ea', title: 'Progress Tracking', desc: 'Watch the progress bar fill up as you check things off. Genuinely satisfying.' },
]

const freeTier = ['1 list', 'Up to 20 tasks', "Today's Focus", 'Priority starring', 'Works on any device']
const proTier = ['Unlimited lists', 'Unlimited tasks', 'Sync across all devices', 'Everything in Free', 'Priority support']

const mockFocus = [
  { text: 'Send project proposal', list: 'Work', done: true },
  { text: 'Pick up kids from school', list: 'Personal', done: false },
  { text: 'Review quarterly budget', list: 'Work', done: false },
]

const mockItems = [
  { text: 'Send project proposal', done: true, starred: false },
  { text: 'Review quarterly budget', done: false, starred: true },
  { text: 'Book dentist appointment', done: false, starred: false },
  { text: 'Respond to client email', done: false, starred: false },
]
