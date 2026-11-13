import type { CSSProperties } from 'react';

/*
 * The space party's own illustrations, drawn flat in the theme's colors: a rocket, a ringed planet, the moon and
 * a four-point sparkle.
 */

export function Rocket({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 230" className={className} aria-hidden="true">
      <path d="M44 170 Q60 236 76 170 Z" fill="#ffa45c" />
      <path d="M51 170 Q60 214 69 170 Z" fill="#fff1c1" />
      <path d="M32 116 L8 168 L38 158 Z" fill="#ec6a2c" />
      <path d="M88 116 L112 168 L82 158 Z" fill="#ec6a2c" />
      <path d="M60 8 C90 36 94 98 87 162 L33 162 C26 98 30 36 60 8 Z" fill="#f4f6ff" />
      <path d="M60 8 C73 19 80 32 83 46 L37 46 C40 32 47 19 60 8 Z" fill="#ec6a2c" />
      <path d="M33 162 C31 140 30 118 31 96 L42 96 C41 120 42 142 44 162 Z" fill="#dfe4fb" />
      <circle cx="60" cy="88" r="18" fill="#2c2f91" stroke="#c9d1ff" strokeWidth="6" />
      <circle cx="54" cy="82" r="5" fill="#ffffff" opacity="0.6" />
      <rect x="55" y="128" width="10" height="42" rx="5" fill="#ec6a2c" />
      <rect x="36" y="158" width="48" height="13" rx="5" fill="#c9d1ff" />
    </svg>
  );
}

export function RingedPlanet({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 170 120" className={className} aria-hidden="true">
      <g transform="rotate(-14 85 60)">
        <ellipse cx="85" cy="60" rx="78" ry="17" fill="none" stroke="#ffc36b" strokeWidth="7" opacity="0.55" />
        <circle cx="85" cy="60" r="42" fill="#8b7cf6" />
        <path d="M46 46 Q85 36 124 46" fill="none" stroke="#a99cff" strokeWidth="7" strokeLinecap="round" />
        <path d="M44 66 Q85 58 126 66" fill="none" stroke="#6f5fe0" strokeWidth="6" strokeLinecap="round" />
        <circle cx="70" cy="44" r="6" fill="#ffffff" opacity="0.35" />
        <path d="M7 60 A78 17 0 0 0 163 60" fill="none" stroke="#ffc36b" strokeWidth="7" strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function Moon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="44" fill="#eef1ff" />
      <circle cx="50" cy="50" r="44" fill="#c9d1ff" opacity="0.35" />
      <circle cx="34" cy="38" r="9" fill="#d5dbf7" />
      <circle cx="62" cy="62" r="12" fill="#d5dbf7" />
      <circle cx="66" cy="30" r="5" fill="#d5dbf7" />
      <circle cx="36" cy="68" r="4" fill="#d5dbf7" />
    </svg>
  );
}

export function Sparkle({ className, style }: { className?: string; style?: CSSProperties }) {
  return (
    <svg viewBox="-12 -12 24 24" className={className} style={style} aria-hidden="true">
      <path d="M0 -11 C1.2 -1.2 1.2 -1.2 11 0 C1.2 1.2 1.2 1.2 0 11 C-1.2 1.2 -1.2 1.2 -11 0 C-1.2 -1.2 -1.2 -1.2 0 -11 Z" fill="currentColor" />
    </svg>
  );
}
