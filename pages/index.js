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
        background: 'rgba(247,244,239,0.88)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1.5px solid #ede8df',
        zIndex: 100,
        padding: '0 24px',
        height: '64px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Logo size="sm" />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link href="/login" style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 500,
            color: '#4a4235', padding: '8px 16px', borderRadius: '8px',
            textDecoration: 'none', transition: 'background 0.2s',
          }}>Log in</Link>
          <Link href="/signup" style={{
            fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 600,
            color: '#fff', background: '#0f6644', padding: '8px 18px',
            borderRadius: '8px', textDecoration: 'none',
            boxShadow: '0 2px 8px rgba(15,102,68,0.25)',
          }}>Get started free</Link>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: '120px 24px 80px',
        background: 'linear-gradient(160deg, #f0ece2 0%, #f7f4ef 40%, #eaf5f0 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute', top: '-120px', right: '-120px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(15,102,68,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-80px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(224,78,10,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ animation: 'fadeUp 0.7s ease forwards', opacity: 0 }}>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
            fontSize: 'clamp(2.8rem, 7vw, 5rem)',
            color: '#0f1a14', letterSpacing: '-2px', lineHeight: 1.05,
            marginBottom: '24px', maxWidth: '700px',
          }}>
            Your notebook,<br />
            <span style={{ color: '#0f6644' }}>finally digital.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', color: '#4a4235',
            maxWidth: '520px', lineHeight: 1.7, marginBottom: '40px',
            fontWeight: 400,
          }}>
            Stop juggling sticky notes and scraps of paper. Keep your tasks organised, flag today's priorities, and sync across every device.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{
              fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 600,
              color: '#fff', background: '#0f6644',
              padding: '14px 32px', borderRadius: '10px', textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(15,102,68,0.3)',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              Start for free →
            </Link>
            <Link href="#pricing" style={{
              fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 500,
              color: '#4a4235', background: '#fff',
              padding: '14px 32px', borderRadius: '10px', textDecoration: 'none',
              border: '1.5px solid #ede8df',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}>
              See pricing
            </Link>
          </div>

          <p style={{ marginTop: '20px', fontSize: '0.78rem', color: '#9a8f7a' }}>
            Free forever · No credit card · Upgrade anytime
          </p>
        </div>

        {/* App preview mockup */}
        <div style={{
          marginTop: '72px', width: '100%', maxWidth: '680px',
          animation: 'fadeUp 0.8s ease 0.2s forwards', opacity: 0,
        }}>
          <AppMockup />
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '100px 24px', maxWidth: '960px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            color: '#0f1a14', letterSpacing: '-1px', marginBottom: '16px',
          }}>
            Everything your notebook had.<br />
            <span style={{ color: '#0f6644' }}>Plus what it was missing.</span>
          </h2>
          <p style={{ fontSize: '1rem', color: '#4a4235', maxWidth: '440px', margin: '0 auto', lineHeight: 1.7 }}>
            Built for people who actually write lists, not for productivity influencers.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '20px',
        }}>
          {features.map((f, i) => (
            <div key={i} style={{
              background: '#fff', borderRadius: '16px', padding: '28px',
              border: '1.5px solid #ede8df',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
              animation: `fadeUp 0.5s ease ${0.1 * i}s forwards`,
              opacity: 0,
            }}>
              <div style={{
                width: '44px', height: '44px', borderRadius: '12px',
                background: f.bg, display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '1.3rem', marginBottom: '16px',
              }}>{f.icon}</div>
              <h3 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
                fontSize: '1rem', color: '#0f1a14', marginBottom: '8px',
                letterSpacing: '-0.3px',
              }}>{f.title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#4a4235', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{
        padding: '100px 24px',
        background: '#0f1a14',
      }}>
        <div style={{ maxWidth: '860px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            color: '#fff', letterSpacing: '-1px', marginBottom: '16px',
          }}>
            Simple pricing.<br />
            <span style={{ color: '#2db87a' }}>No surprises.</span>
          </h2>
          <p style={{ fontSize: '1rem', color: '#5a8a70', maxWidth: '400px', margin: '0 auto 56px', lineHeight: 1.7 }}>
            Start free, upgrade when you need more.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px', maxWidth: '680px', margin: '0 auto',
          }}>
            {/* Free */}
            <div style={{
              background: '#1a2e20', borderRadius: '20px', padding: '36px',
              border: '1.5px solid #2a4030', textAlign: 'left',
            }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#3d7a5a', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>Free</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '2.8rem', color: '#fff', letterSpacing: '-1px', marginBottom: '4px' }}>$0</div>
              <div style={{ fontSize: '0.82rem', color: '#5a8a70', marginBottom: '32px' }}>forever, no card needed</div>
              {freeTier.map((f, i) => <PricingRow key={i} text={f} />)}
              <Link href="/signup" style={{
                display: 'block', textAlign: 'center', marginTop: '28px',
                fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9rem',
                color: '#fff', border: '1.5px solid #3d7a5a',
                padding: '12px', borderRadius: '10px', textDecoration: 'none',
                transition: 'background 0.2s',
              }}>Get started free</Link>
            </div>

            {/* Pro */}
            <div style={{
              background: '#0f6644', borderRadius: '20px', padding: '36px',
              border: '1.5px solid #2db87a', textAlign: 'left',
              position: 'relative', overflow: 'hidden',
              boxShadow: '0 8px 40px rgba(15,102,68,0.4)',
            }}>
              <div style={{
                position: 'absolute', top: '16px', right: '16px',
                background: '#2db87a', color: '#fff',
                fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.1em',
                padding: '4px 10px', borderRadius: '10px', textTransform: 'uppercase',
              }}>Most popular</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#a8e8c8', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '12px' }}>Pro</div>
              <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800, fontSize: '2.8rem', color: '#fff', letterSpacing: '-1px', marginBottom: '4px' }}>$2.99</div>
              <div style={{ fontSize: '0.82rem', color: '#a8e8c8', marginBottom: '32px' }}>per month, cancel anytime</div>
              {proTier.map((f, i) => <PricingRow key={i} text={f} bright />)}
              <Link href="/signup?plan=pro" style={{
                display: 'block', textAlign: 'center', marginTop: '28px',
                fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9rem',
                color: '#0f6644', background: '#fff',
                padding: '12px', borderRadius: '10px', textDecoration: 'none',
                boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
              }}>Upgrade to Pro</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section style={{
        padding: '100px 24px', textAlign: 'center',
        background: 'linear-gradient(160deg, #f7f4ef 0%, #eaf5f0 100%)',
      }}>
        <h2 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          color: '#0f1a14', letterSpacing: '-1px', marginBottom: '16px',
        }}>
          Ready to ditch the notebook?
        </h2>
        <p style={{ fontSize: '1rem', color: '#4a4235', marginBottom: '36px', lineHeight: 1.7 }}>
          Free to start. Takes 30 seconds. Your lists, everywhere.
        </p>
        <Link href="/signup" style={{
          fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 600,
          color: '#fff', background: '#0f6644',
          padding: '14px 40px', borderRadius: '10px', textDecoration: 'none',
          boxShadow: '0 4px 20px rgba(15,102,68,0.3)',
          display: 'inline-block',
        }}>
          Start for free →
        </Link>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '32px 24px',
        borderTop: '1.5px solid #ede8df',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '16px', maxWidth: '960px', margin: '0 auto',
      }}>
        <Logo size="sm" />
        <p style={{ fontSize: '0.75rem', color: '#9a8f7a' }}>
          © {new Date().getFullYear()} List. · Focus. Done.
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <a key={l} href="#" style={{ fontSize: '0.75rem', color: '#9a8f7a', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </>
  )
}

function PricingRow({ text, bright }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
      <div style={{
        width: '18px', height: '18px', borderRadius: '50%', flexShrink: 0,
        background: bright ? 'rgba(255,255,255,0.2)' : 'rgba(45,184,122,0.15)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.65rem', color: bright ? '#fff' : '#2db87a',
      }}>✓</div>
      <span style={{ fontSize: '0.85rem', color: bright ? '#d4f0e4' : '#7ab898' }}>{text}</span>
    </div>
  )
}

function AppMockup() {
  return (
    <div style={{
      background: '#fff', borderRadius: '20px', overflow: 'hidden',
      boxShadow: '0 24px 80px rgba(15,26,20,0.18), 0 4px 20px rgba(0,0,0,0.08)',
      border: '1.5px solid #ede8df',
    }}>
      {/* Mock title bar */}
      <div style={{ background: '#0f1a14', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e04e0a', opacity: 0.8 }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#d4920a', opacity: 0.8 }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2db87a', opacity: 0.8 }} />
        <div style={{ flex: 1, textAlign: 'center', fontSize: '0.7rem', color: '#3d7a5a', fontWeight: 500, letterSpacing: '0.05em' }}>list.app</div>
      </div>
      {/* Mock today's focus */}
      <div style={{ background: '#eaf5f0', padding: '16px 20px', borderBottom: '1.5px solid #d4ebe0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '1rem' }}>🎯</span>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#0f6644' }}>Today's Focus</span>
          <span style={{ fontSize: '0.65rem', background: '#0f6644', color: '#fff', borderRadius: '10px', padding: '2px 8px', fontWeight: 600 }}>2 / 3</span>
        </div>
        {mockFocus.map((f, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0' }}>
            <div style={{
              width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
              background: f.done ? '#0f6644' : 'transparent',
              border: `2px solid ${f.done ? '#0f6644' : 'rgba(15,102,68,0.3)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {f.done && <span style={{ fontSize: '0.5rem', color: '#fff' }}>✓</span>}
            </div>
            <span style={{ fontSize: '0.82rem', color: f.done ? '#9a8f7a' : '#0f1a14', textDecoration: f.done ? 'line-through' : 'none', flex: 1 }}>{f.text}</span>
            <span style={{ fontSize: '0.62rem', background: 'rgba(15,102,68,0.1)', color: '#0f6644', borderRadius: '8px', padding: '2px 6px', fontWeight: 600 }}>{f.list}</span>
          </div>
        ))}
      </div>
      {/* Mock list items */}
      <div style={{ padding: '8px 0' }}>
        {mockItems.map((item, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '9px 20px',
            borderBottom: i < mockItems.length - 1 ? '1px solid #f0ece4' : 'none',
            background: item.starred ? '#fdf8ec' : 'transparent',
          }}>
            <div style={{
              width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
              background: item.done ? '#e04e0a' : 'transparent',
              border: `2px solid ${item.done ? '#e04e0a' : '#e0d8cc'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {item.done && <span style={{ fontSize: '0.5rem', color: '#fff' }}>✓</span>}
            </div>
            <span style={{ flex: 1, fontSize: '0.82rem', color: item.done ? '#b0a898' : '#0f1a14', textDecoration: item.done ? 'line-through' : 'none', fontWeight: item.starred ? 500 : 400 }}>{item.text}</span>
            {item.starred && <span style={{ fontSize: '0.85rem' }}>⭐</span>}
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

const freeTier = [
  '1 list',
  'Up to 20 tasks',
  "Today's Focus",
  'Priority starring',
  'Works on any device',
]

const proTier = [
  'Unlimited lists',
  'Unlimited tasks',
  'Sync across all devices',
  'Everything in Free',
  'Priority support',
  
]

const mockFocus = [
  { text: 'Review pitch deck slides', list: 'Work', done: true },
  { text: 'Final concept designs for Project X', list: 'Work', done: false },
  { text: 'Anniversary dinner reservation', list: 'Personal', done: false },
]

const mockItems = [
  { text: 'Review pitch deck slides', done: true, starred: false },
  { text: 'Sign off on Q2 budget', done: false, starred: false },
  { text: 'Update project timeline', done: false, starred: false },
  { text: 'Send invoice to client', done: false, starred: false },
]
