import type { CSSProperties } from 'react';
import './motion.css';

/*
 * The space party's own illustrations, drawn flat in the theme's colors: a rocket, a ringed planet, the moon, a
 * four-point sparkle and an astronaut. Their parts move on their own (motion.css): the rocket's flame flickers and
 * puffs smoke, a moonlet orbits the planet and the astronaut drifts and waves.
 */

export function Rocket({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 250" className={className} aria-hidden="true">
      {[
        [52, 0],
        [66, -0.5],
        [58, -1],
      ].map(([cx, delay]) => (
        <circle key={cx} className="espacial-puff" cx={cx} cy="206" r="9" fill="#dfe4fb" style={{ animationDelay: `${delay}s` }} />
      ))}
      <path className="espacial-flame" d="M44 170 Q60 236 76 170 Z" fill="#ffa45c" />
      <path className="espacial-flame espacial-flame-core" d="M51 170 Q60 214 69 170 Z" fill="#fff1c1" />
      <path d="M32 116 L8 168 L38 158 Z" fill="#ec6a2c" />
      <path d="M88 116 L112 168 L82 158 Z" fill="#ec6a2c" />
      <path d="M60 8 C90 36 94 98 87 162 L33 162 C26 98 30 36 60 8 Z" fill="#f4f6ff" />
      <path d="M60 8 C73 19 80 32 83 46 L37 46 C40 32 47 19 60 8 Z" fill="#ec6a2c" />
      <path d="M33 162 C31 140 30 118 31 96 L42 96 C41 120 42 142 44 162 Z" fill="#dfe4fb" />
      <circle cx="60" cy="88" r="18" fill="#2c2f91" stroke="#c9d1ff" strokeWidth="6" />
      <circle className="espacial-glint" cx="54" cy="82" r="5" fill="#ffffff" opacity="0.6" />
      <rect x="55" y="128" width="10" height="42" rx="5" fill="#ec6a2c" />
      <rect x="36" y="158" width="48" height="13" rx="5" fill="#c9d1ff" />
    </svg>
  );
}

export function RingedPlanet({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 170 120" className={className} aria-hidden="true">
      <g transform="rotate(-14 85 60)">
        <g className="espacial-tilt">
        <ellipse cx="85" cy="60" rx="78" ry="17" fill="none" stroke="#ffc36b" strokeWidth="7" opacity="0.55" />
        <circle cx="85" cy="60" r="42" fill="#8b7cf6" />
        <path d="M46 46 Q85 36 124 46" fill="none" stroke="#a99cff" strokeWidth="7" strokeLinecap="round" />
        <path d="M44 66 Q85 58 126 66" fill="none" stroke="#6f5fe0" strokeWidth="6" strokeLinecap="round" />
        <circle cx="70" cy="44" r="6" fill="#ffffff" opacity="0.35" />
        <path d="M7 60 A78 17 0 0 0 163 60" fill="none" stroke="#ffc36b" strokeWidth="7" strokeLinecap="round" />
        <circle className="espacial-orbit" cx="85" cy="60" r="5.5" fill="#fff1c1" />
        </g>
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

/** A little astronaut floating in space and waving with its right hand. */
export function Astronaut({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 110 120" className={className} aria-hidden="true">
      <g stroke="#2c2f91" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round">
        <rect x="32" y="50" width="46" height="40" rx="10" fill="#c9d1ff" />
        <path d="M38 92 L36 112 L50 112 L52 92 Z" fill="#f4f6ff" />
        <path d="M58 92 L60 112 L74 112 L72 92 Z" fill="#f4f6ff" />
        <path d="M38 60 C24 62 16 72 14 84" fill="none" strokeWidth="16" />
        <path d="M38 60 C24 62 16 72 14 84" fill="none" stroke="#f4f6ff" strokeWidth="9" />
        <rect x="36" y="56" width="38" height="38" rx="12" fill="#f4f6ff" />
        <rect x="46" y="70" width="18" height="12" rx="3" fill="#ec6a2c" />
        <g className="espacial-wave">
          <path d="M72 62 C84 58 90 48 92 36" fill="none" strokeWidth="16" />
          <path d="M72 62 C84 58 90 48 92 36" fill="none" stroke="#f4f6ff" strokeWidth="9" />
          <circle cx="92" cy="32" r="6.5" fill="#f4f6ff" />
        </g>
        <circle cx="55" cy="34" r="26" fill="#f4f6ff" />
        <rect x="36" y="22" width="38" height="26" rx="13" fill="#2c2f91" />
      </g>
      <path d="M44 30 C46 26 50 25 54 25" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7" />
      <circle cx="66" cy="40" r="2.5" fill="#ffffff" opacity="0.5" />
    </svg>
  );
}
