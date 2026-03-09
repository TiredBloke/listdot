import Head from 'next/head'
import Link from 'next/link'
import { Logo } from '../components/Logo'

export default function Landing() {
  return (
    <>
      <Head>
        <title>List. — Decide tonight. Do tomorrow. Done.</title>
        <meta name="description" content="The productivity method used by the world's most effective people, built into a simple app. Pick your 5 priorities tonight. Get to the dot tomorrow." />
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
            textDecoration: 'none',
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
        <div style={{
          position: 'absolute', top: '-120px', right: '-120px',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(15,102,68,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-80px', left: '-80px',
          width: '400px', height: '400px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(224,78,10,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ animation: 'fadeUp 0.7s ease forwards', opacity: 0 }}>
          {/* Eyebrow */}
          <div style={{
            display: 'inline-block',
            fontSize: '0.7rem', fontWeight: 700, color: '#0f6644',
            letterSpacing: '0.16em', textTransform: 'uppercase',
            fontFamily: 'Inter, sans-serif',
            background: '#eaf5f0', border: '1px solid rgba(15,102,68,0.15)',
            borderRadius: '20px', padding: '5px 14px', marginBottom: '28px',
          }}>
            The dot means done.
          </div>

          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
            fontSize: 'clamp(2.8rem, 7vw, 5rem)',
            color: '#0f1a14', letterSpacing: '-2px', lineHeight: 1.05,
            marginBottom: '12px', maxWidth: '760px',
          }}>
            Decide tonight.
          </h1>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
            fontSize: 'clamp(2.8rem, 7vw, 5rem)',
            color: '#0f6644', letterSpacing: '-2px', lineHeight: 1.05,
            marginBottom: '12px', maxWidth: '760px',
          }}>
            Do tomorrow.
          </h1>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
            fontSize: 'clamp(2.8rem, 7vw, 5rem)',
            color: '#0f1a14', letterSpacing: '-2px', lineHeight: 1.05,
            marginBottom: '32px', maxWidth: '760px',
          }}>
            Done<span style={{ color: '#0f6644' }}>.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.15rem)', color: '#4a4235',
            maxWidth: '480px', lineHeight: 1.75, marginBottom: '40px',
            fontWeight: 400, margin: '0 auto 40px',
          }}>
            Your notebook, finally digital. Pick your five most important tasks tonight. Wake up knowing exactly what to do.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" style={{
              fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 600,
              color: '#fff', background: '#0f6644',
              padding: '14px 32px', borderRadius: '10px', textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(15,102,68,0.3)',
              display: 'inline-block',
            }}>
              Start for free →
            </Link>
            <Link href="#pricing" style={{
              fontFamily: 'Inter, sans-serif', fontSize: '1rem', fontWeight: 500,
              color: '#4a4235', background: '#fff',
              padding: '14px 32px', borderRadius: '10px', textDecoration: 'none',
              border: '1.5px solid #ede8df',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              display: 'inline-block',
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

      {/* IVY LEE STORY */}
      <section style={{
        padding: '100px 24px',
        background: '#0f1a14',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '680px', margin: '0 auto' }}>
          <div style={{
            fontSize: '0.7rem', fontWeight: 700, color: '#3d7a5a',
            letterSpacing: '0.16em', textTransform: 'uppercase',
            fontFamily: 'Inter, sans-serif', marginBottom: '32px',
          }}>
            1918 · The method that changed everything
          </div>

          <p style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700,
            fontSize: 'clamp(1.4rem, 3vw, 2rem)',
            color: '#fff', lineHeight: 1.5, marginBottom: '32px',
            letterSpacing: '-0.5px',
          }}>
            "Write down your five most important tasks for tomorrow. Work through them in order. Do not move on until the first is finished."
          </p>

          <p style={{
            fontSize: '0.9rem', color: '#5a8a70',
            lineHeight: 1.8, marginBottom: '40px',
            fontFamily: 'Inter, sans-serif',
          }}>
            In 1918, consultant Ivy Lee shared this method with Charles Schwab, president of Bethlehem Steel. Three months later, Schwab sent him a cheque for <strong style={{ color: '#2db87a' }}>$25,000</strong> — around $400,000 in today's money — calling it the most profitable advice he'd ever received.
          </p>

          <p style={{
            fontSize: '0.9rem', color: '#3d7a5a',
            lineHeight: 1.8, fontFamily: 'Inter, sans-serif',
            fontStyle: 'italic',
          }}>
            The key insight: decide the night before, when you're calm and honest with yourself. Not the morning, when you're already reactive.
          </p>

          <div className="three-col-grid" style={{
            marginTop: '48px', display: 'grid', gap: '16px',
          }}>
            {philosophyCards.map((card, i) => (
              <div key={i} style={{
                background: '#1a2e20', borderRadius: '14px', padding: '24px',
                border: '1px solid #2a4030', textAlign: 'left',
              }}>
                <div style={{ fontSize: '0.65rem', fontWeight: 700, color: '#3d7a5a', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px', fontFamily: 'Inter, sans-serif' }}>{card.era}</div>
                <p style={{ fontSize: '0.85rem', color: '#7ab898', lineHeight: 1.65, marginBottom: '16px', fontFamily: 'Inter, sans-serif', fontStyle: 'italic' }}>
                  "{card.insight}"
                </p>
                <div style={{ borderTop: '1px solid #2a4030', paddingTop: '12px' }}>
                  <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>{card.name}</div>
                  <div style={{ fontSize: '0.72rem', color: '#3d7a5a', fontFamily: 'Inter, sans-serif' }}>{card.title}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: '100px 24px', maxWidth: '860px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
            fontSize: 'clamp(2rem, 4vw, 2.8rem)',
            color: '#0f1a14', letterSpacing: '-1px', marginBottom: '16px',
          }}>
            A rhythm, not just an app.
          </h2>
          <p style={{ fontSize: '1rem', color: '#4a4235', maxWidth: '440px', margin: '0 auto', lineHeight: 1.7 }}>
            List. is built around a daily rhythm that the most effective people in the world have used for over a century.
          </p>
        </div>

        <div className="three-col-grid" style={{ display: 'grid', gap: '20px' }}>
          {rhythm.map((step, i) => (
            <div key={i} style={{
              background: '#fff',
              borderRadius: '16px', padding: '32px',
              border: '1.5px solid #ede8df',
              borderLeft: '4px solid #0f6644',
              boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            }}>
              <div style={{
                fontSize: '0.65rem', fontWeight: 700,
                color: '#9a8f7a',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                fontFamily: 'Inter, sans-serif', marginBottom: '16px',
              }}>{step.time}</div>
              <div style={{ fontSize: '1.8rem', marginBottom: '12px' }}>{step.icon}</div>
              <h3 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
                fontSize: '1.2rem', color: '#0f1a14',
                marginBottom: '10px', letterSpacing: '-0.3px',
              }}>{step.title}</h3>
              <p style={{ fontSize: '0.85rem', color: '#4a4235', lineHeight: 1.65 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOCUS TEASER */}
      <section style={{
        padding: '100px 24px',
        background: 'linear-gradient(160deg, #0a0f0d 0%, #0d1f16 100%)',
        textAlign: 'center',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(74,222,128,0.06) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: '560px', margin: '0 auto', position: 'relative' }}>
          {/* Breathing dot */}
          <div style={{
            width: '72px', height: '72px', borderRadius: '50%',
            background: 'radial-gradient(circle at 35% 35%, #6ee7a0, #0f6644)',
            margin: '0 auto 40px',
            boxShadow: '0 0 60px rgba(74,222,128,0.3), 0 0 120px rgba(74,222,128,0.1)',
            animation: 'breathe 4s ease-in-out infinite',
          }} />

          <div style={{
            fontSize: '0.7rem', fontWeight: 700, color: '#3d7a5a',
            letterSpacing: '0.16em', textTransform: 'uppercase',
            fontFamily: 'Inter, sans-serif', marginBottom: '20px',
          }}>
            Introducing Focus.
          </div>

          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
            fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
            color: '#fff', letterSpacing: '-1px', lineHeight: 1.2, marginBottom: '20px',
          }}>
            When you're ready to work,<br />
            <span style={{ color: '#4ade80' }}>really work.</span>
          </h2>

          <p style={{
            fontSize: '1rem', color: '#5a8a70', lineHeight: 1.8,
            fontFamily: 'Inter, sans-serif', marginBottom: '16px',
          }}>
            Hover over any priority task and hit Focus. The world disappears. A breathing dot. Your task. An honest timer counting up — not down.
          </p>

          <p style={{
            fontSize: '0.85rem', color: '#3d7a5a', lineHeight: 1.7,
            fontFamily: 'Inter, sans-serif',
            fontStyle: 'italic',
          }}>
            No Pomodoro timers. No pressure. No gamification. Just you and the work.
          </p>
        </div>

        <style>{`
          @keyframes breathe {
            0%, 100% { transform: scale(1); box-shadow: 0 0 40px rgba(74,222,128,0.3), 0 0 80px rgba(74,222,128,0.08); }
            50% { transform: scale(1.2); box-shadow: 0 0 80px rgba(74,222,128,0.5), 0 0 160px rgba(74,222,128,0.15); }
          }
        `}</style>
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
              <div style={{ fontSize: '0.82rem', color: '#a8e8c8', marginBottom: '32px' }}>per month · 7-day free trial</div>
              {proTier.map((f, i) => <PricingRow key={i} text={f} bright />)}
              <Link href="/signup?plan=pro" style={{
                display: 'block', textAlign: 'center', marginTop: '28px',
                fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.9rem',
                color: '#0f6644', background: '#fff',
                padding: '12px', borderRadius: '10px', textDecoration: 'none',
                boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
              }}>Start 7-day free trial</Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <section style={{
        padding: '100px 24px', textAlign: 'center',
        background: 'linear-gradient(160deg, #f7f4ef 0%, #eaf5f0 100%)',
      }}>
        <div style={{
          fontSize: '0.7rem', fontWeight: 700, color: '#0f6644',
          letterSpacing: '0.16em', textTransform: 'uppercase',
          fontFamily: 'Inter, sans-serif', marginBottom: '20px',
        }}>Get to the dot.</div>
        <h2 style={{
          fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 800,
          fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
          color: '#0f1a14', letterSpacing: '-1px', marginBottom: '16px',
        }}>
          Start tonight.
        </h2>
        <p style={{ fontSize: '1rem', color: '#4a4235', marginBottom: '36px', lineHeight: 1.7, maxWidth: '400px', margin: '0 auto 36px' }}>
          Pick your five. Wake up ready. Free to start, takes 30 seconds.
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
        <p style={{ fontSize: '0.75rem', color: '#9a8f7a', textAlign: 'center' }}>
          List. is the first in a family of focused tools.<br />
          <span style={{ color: '#0f6644', fontWeight: 600 }}>More dots coming.</span>
        </p>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Link href="/privacy" style={{ fontSize: '0.75rem', color: '#9a8f7a', textDecoration: 'none' }}>Privacy</Link>
          <Link href="/terms" style={{ fontSize: '0.75rem', color: '#9a8f7a', textDecoration: 'none' }}>Terms</Link>
          <a href="mailto:hello@listdot.app" style={{ fontSize: '0.75rem', color: '#9a8f7a', textDecoration: 'none' }}>Contact</a>
        </div>
      </footer>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .three-col-grid {
          grid-template-columns: repeat(3, 1fr);
        }
        @media (max-width: 768px) {
          .three-col-grid {
            grid-template-columns: 1fr;
          }
        }
        html, body {
          overflow-x: hidden;
          max-width: 100%;
        }
      `}</style>
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
      <div style={{ background: '#0f1a14', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#e04e0a', opacity: 0.8 }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#d4920a', opacity: 0.8 }} />
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#2db87a', opacity: 0.8 }} />
        <div style={{ flex: 1, textAlign: 'center', fontSize: '0.7rem', color: '#3d7a5a', fontWeight: 500, letterSpacing: '0.05em' }}>list.app</div>
      </div>
      <div style={{ background: '#eaf5f0', padding: '16px 20px', borderBottom: '1.5px solid #d4ebe0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '1rem' }}>🎯</span>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#0f6644' }}>Today's Focus</span>
          <span style={{ fontSize: '0.65rem', background: '#0f6644', color: '#fff', borderRadius: '10px', padding: '2px 8px', fontWeight: 600 }}>2 / 5</span>
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

const rhythm = [
  {
    time: 'Evening',
    icon: '🌙',
    title: 'Decide.',
    desc: 'At the end of your day, pick your five most important tasks for tomorrow. Not ten. Not twenty. Five. Do it while you\'re calm and honest with yourself.',
    dark: false,
  },
  {
    time: 'Morning',
    icon: '☀️',
    title: 'Do.',
    desc: 'Wake up already knowing what matters. Start with task one. Don\'t move on until it\'s done. No decision fatigue. No wasted time.',
    dark: true,
  },
  {
    time: 'Completion',
    icon: '·',
    title: 'Done.',
    desc: 'Each task you finish earns its dot. At the end of the day, reflect on what you achieved — and choose tomorrow\'s five.',
    dark: false,
  },
]

const philosophyCards = [
  {
    era: 'The Ivy Lee Method · 1918',
    insight: 'Write down your most important tasks. Work through them in order. Do not move on until the first is finished.',
    name: 'Ivy Lee',
    title: 'Productivity consultant — $25,000 idea',
  },
  {
    era: 'Warren Buffett',
    insight: 'The difference between successful people and very successful people is that very successful people say no to almost everything.',
    name: 'Warren Buffett',
    title: 'CEO · Berkshire Hathaway',
  },
  {
    era: 'Steve Jobs',
    insight: 'Deciding what not to do is as important as deciding what to do.',
    name: 'Steve Jobs',
    title: 'Co-founder · Apple',
  },
]

const features = [
  { icon: '📋', bg: '#eaf5f0', title: 'Multiple Lists', desc: 'Work, Personal, Shopping — keep everything separate and switch between them instantly.' },
  { icon: '🎯', bg: '#eaf5f0', title: "Today's Focus", desc: 'Star up to 5 tasks as your daily priorities. They collect at the top so you always know what matters most.' },
  { icon: '🔍', bg: '#f0f4ff', title: 'Search', desc: 'Instantly search across all your lists. Find any task in seconds no matter how many you have.' },
  { icon: '🔄', bg: '#eaf5f0', title: 'Sync Everywhere', desc: 'Your lists follow you across phone, tablet, and desktop. Always up to date.' },
  { icon: '↕️', bg: '#fdf0ea', title: 'Drag to Reorder', desc: 'Grab any task and drag it into the exact order you want. No fussing around.' },
  { icon: '⚡', bg: '#fdf8ec', title: 'Focus Mode', desc: 'One task. Full screen. A breathing dot and an honest timer. No distractions, no pressure.' },
]

const freeTier = [
  '1 list',
  'Up to 20 tasks',
  "Today's Focus (5 priorities)",
  'Focus mode',
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
