/*
 * The jurassic party's own illustrations, drawn flat with ink outlines: a friendly long-necked dinosaur, an egg
 * (whole or hatched), a volcano, a fern and a three-toed footprint.
 */

const INK = 'var(--foreground)';

export function Dino({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 230 190" className={className} aria-hidden="true">
      <g stroke={INK} strokeWidth="4" strokeLinejoin="round" strokeLinecap="round">
        {[
          [40, 122], [62, 110], [84, 100], [106, 94], [128, 94], [148, 86],
        ].map(([x, y], index) => (
          <path key={index} d={`M${x - 11} ${y + 6} L${x} ${y - 14} L${x + 11} ${y + 6} Z`} fill="#f6a23c" />
        ))}
        <path d="M10 146 C30 126 62 118 92 118 L100 150 C70 156 38 156 10 146 Z" fill="#5cb85c" />
        <rect x="76" y="140" width="22" height="36" rx="10" fill="#4aa64e" />
        <rect x="132" y="140" width="22" height="36" rx="10" fill="#4aa64e" />
        <ellipse cx="118" cy="126" rx="56" ry="38" fill="#5cb85c" />
        <path d="M146 110 C152 80 156 56 168 42 L192 52 C180 66 174 92 168 118 Z" fill="#5cb85c" />
        <ellipse cx="190" cy="40" rx="30" ry="22" fill="#5cb85c" />
        <rect x="88" y="140" width="22" height="38" rx="10" fill="#5cb85c" />
        <rect x="144" y="140" width="22" height="38" rx="10" fill="#5cb85c" />
        <ellipse cx="118" cy="138" rx="38" ry="18" fill="#c8ec9a" stroke="none" />
      </g>
      <circle cx="198" cy="33" r="5" fill={INK} />
      <circle cx="200" cy="31" r="1.6" fill="#ffffff" />
      <path d="M200 48 Q209 52 215 44" fill="none" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="184" cy="48" r="5" fill="#f7a8b8" opacity="0.8" />
      <circle cx="104" cy="122" r="5" fill="#4aa64e" />
      <circle cx="130" cy="112" r="7" fill="#4aa64e" />
      <circle cx="146" cy="130" r="4" fill="#4aa64e" />
    </svg>
  );
}

export function Egg({ hatched = false, className }: { hatched?: boolean; className?: string }) {
  return (
    <svg viewBox="0 0 160 190" className={className} aria-hidden="true">
      {hatched && (
        <g stroke={INK} strokeWidth="4" strokeLinejoin="round" style={{ animation: 'dinoPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both' }}>
          <ellipse cx="80" cy="66" rx="34" ry="30" fill="#5cb85c" />
          <circle cx="68" cy="60" r="5" fill={INK} stroke="none" />
          <circle cx="94" cy="60" r="5" fill={INK} stroke="none" />
          <path d="M70 76 Q80 84 90 76" fill="none" strokeLinecap="round" />
        </g>
      )}
      <g stroke={INK} strokeWidth="4" strokeLinejoin="round">
        {hatched ? (
          <path d="M18 100 L36 86 L52 102 L68 86 L84 102 L100 86 L116 102 L132 86 L142 100 C150 150 124 182 80 182 C36 182 10 150 18 100 Z" fill="#fff4d6" />
        ) : (
          <path d="M80 8 C122 8 148 72 148 116 C148 158 120 182 80 182 C40 182 12 158 12 116 C12 72 38 8 80 8 Z" fill="#fff4d6" />
        )}
      </g>
      <g fill="#8fd18a">
        <circle cx="56" cy={hatched ? 128 : 70} r="11" />
        <circle cx="104" cy={hatched ? 146 : 104} r="14" />
        <circle cx="60" cy="152" r="8" />
        {!hatched && <circle cx="98" cy="48" r="7" />}
      </g>
    </svg>
  );
}

export function Volcano({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 170" className={className} aria-hidden="true">
      <g fill="#ffffff" opacity="0.85">
        <circle cx="112" cy="30" r="14" />
        <circle cx="128" cy="18" r="11" />
        <circle cx="98" cy="16" r="9" />
      </g>
      <g stroke={INK} strokeWidth="4" strokeLinejoin="round">
        <path d="M10 166 L86 54 L134 54 L210 166 Z" fill="#a8774f" />
        <path d="M86 54 L134 54 L124 76 L114 66 L104 82 L96 68 Z" fill="#ff7a3d" />
      </g>
      <path d="M60 140 L84 104 M150 140 L132 112" stroke="#8a5f3d" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

export function Fern({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 140" className={className} aria-hidden="true">
      <g stroke={INK} strokeWidth="3.5" strokeLinejoin="round" fill="#4aa64e">
        <path d="M40 138 C38 100 40 60 44 16" fill="none" strokeLinecap="round" />
        {[30, 50, 70, 90, 110].map((y, index) => (
          <g key={y}>
            <path d={`M41 ${y} C26 ${y - 14} 10 ${y - 10} 4 ${y - 2} C16 ${y + 4} 30 ${y + 4} 41 ${y}`} />
            <path d={`M42 ${y + 6} C56 ${y - 8} 70 ${y - 6} 76 ${y + 2} C66 ${y + 10} 52 ${y + 10} 42 ${y + 6}`} opacity={index % 2 ? 1 : 0.9} />
          </g>
        ))}
      </g>
    </svg>
  );
}

export function Footprint({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 44" className={className} aria-hidden="true">
      <g fill="currentColor">
        <ellipse cx="20" cy="30" rx="11" ry="12" />
        <ellipse cx="7" cy="12" rx="4.5" ry="7" transform="rotate(-25 7 12)" />
        <ellipse cx="20" cy="7" rx="4.5" ry="7" />
        <ellipse cx="33" cy="12" rx="4.5" ry="7" transform="rotate(25 33 12)" />
      </g>
    </svg>
  );
}

/** Rolling green hills, for the bottom of the hero and the top of the footer. */
export function Hills({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="0 0 1440 160" preserveAspectRatio="none" className={className} style={flip ? { transform: 'scaleY(-1)' } : undefined} aria-hidden="true">
      <path d="M0 70 C 200 10 380 110 620 60 C 860 10 1060 100 1260 50 C 1340 30 1400 40 1440 50 L1440 160 L0 160 Z" fill="#8fd18a" stroke={INK} strokeWidth="4" />
      <path d="M0 110 C 260 70 460 140 760 100 C 1040 64 1220 130 1440 96 L1440 160 L0 160 Z" fill="#5cb85c" stroke={INK} strokeWidth="4" />
    </svg>
  );
}
