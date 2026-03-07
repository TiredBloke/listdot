export function Logo({ dark = false, size = 'md' }) {
  const sizes = { sm: 28, md: 36, lg: 48 }
  const s = sizes[size] || 36

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: s * 0.28 + 'px' }}>
      {/* Icon tile */}
      <svg width={s} height={s} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id={`tg-${size}-${dark}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#1a7a52"/>
            <stop offset="100%" stopColor="#0d5438"/>
          </linearGradient>
          <linearGradient id={`dg-${size}-${dark}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3dd68c"/>
            <stop offset="100%" stopColor="#2db87a"/>
          </linearGradient>
        </defs>
        <rect x="4" y="4" width="112" height="112" rx="26" fill={`url(#tg-${size}-${dark})`}/>
        <rect x="4" y="4" width="112" height="56" rx="26" fill="white" opacity="0.06"/>
        <rect x="28" y="24" width="18" height="58" rx="5" fill="white"/>
        <rect x="28" y="64" width="50" height="18" rx="5" fill="white"/>
        <circle cx="92" cy="28" r="13" fill={`url(#dg-${size}-${dark})`}/>
        <circle cx="88" cy="24" r="4" fill="white" opacity="0.3"/>
      </svg>
      {/* Wordmark */}
      <span style={{
        fontFamily: 'Syne, sans-serif',
        fontWeight: 800,
        fontSize: s * 0.72 + 'px',
        letterSpacing: '-0.04em',
        color: dark ? '#ffffff' : '#0f1a14',
        lineHeight: 1,
      }}>
        List<span style={{ color: dark ? '#2db87a' : '#0f6644' }}>.</span>
      </span>
    </div>
  )
}

export function LogoIcon({ size = 36 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="lg-icon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1a7a52"/>
          <stop offset="100%" stopColor="#0d5438"/>
        </linearGradient>
        <linearGradient id="dg-icon" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3dd68c"/>
          <stop offset="100%" stopColor="#2db87a"/>
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="112" height="112" rx="26" fill="url(#lg-icon)"/>
      <rect x="4" y="4" width="112" height="56" rx="26" fill="white" opacity="0.06"/>
      <rect x="28" y="24" width="18" height="58" rx="5" fill="white"/>
      <rect x="28" y="64" width="50" height="18" rx="5" fill="white"/>
      <circle cx="92" cy="28" r="13" fill="url(#dg-icon)"/>
      <circle cx="88" cy="24" r="4" fill="white" opacity="0.3"/>
    </svg>
  )
}
