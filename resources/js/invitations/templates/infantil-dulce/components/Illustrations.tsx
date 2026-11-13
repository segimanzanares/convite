/*
 * The candy party's own illustrations, drawn flat in sweet colors: an ice cream cone with three scoops, a cupcake
 * and a swirl lollipop.
 */

const OUTLINE = '#8a2a5c';

export function IceCream({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 260" className={className} aria-hidden="true">
      <g stroke={OUTLINE} strokeWidth="4" strokeLinejoin="round">
        <path d="M40 140 L80 252 L120 140 Z" fill="#f2b56b" />
        <path d="M52 150 L96 214 M68 146 L104 194 M86 146 L110 170 M108 150 L64 214 M92 146 L56 194 M74 146 L50 170" stroke="#d98f3e" strokeWidth="3" />
        <circle cx="52" cy="122" r="30" fill="#7fd8c4" />
        <circle cx="108" cy="122" r="30" fill="#ffd85e" />
        <circle cx="80" cy="82" r="34" fill="#ff8fc0" />
        <path d="M44 132 C60 150 100 150 116 132 L118 144 C100 156 60 156 42 144 Z" fill="#ff8fc0" />
        <circle cx="80" cy="40" r="10" fill="#e8344d" />
        <path d="M80 30 C82 18 90 12 98 10" fill="none" strokeLinecap="round" />
      </g>
      <g strokeWidth="5" strokeLinecap="round">
        <path d="M66 70 L72 66" stroke="#ffffff" />
        <path d="M90 64 L96 70" stroke="#7fd8c4" />
        <path d="M78 96 L84 92" stroke="#ffd85e" />
        <path d="M98 88 L102 96" stroke="#b9a2f0" />
        <path d="M62 92 L60 100" stroke="#8fc9ff" />
      </g>
    </svg>
  );
}

export function Cupcake({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 170" className={className} aria-hidden="true">
      <g stroke={OUTLINE} strokeWidth="4" strokeLinejoin="round">
        <path d="M30 96 L44 164 L116 164 L130 96 Z" fill="#b9a2f0" />
        <path d="M54 100 L60 164 M80 100 V164 M106 100 L100 164" stroke="#9a80dc" strokeWidth="3.5" />
        <path d="M22 98 C14 76 36 62 50 66 C50 44 76 36 88 48 C98 30 128 40 124 62 C142 64 148 90 136 100 Z" fill="#ff8fc0" />
        <circle cx="86" cy="34" r="11" fill="#e8344d" />
      </g>
      <g strokeWidth="5" strokeLinecap="round">
        <path d="M48 80 L54 76" stroke="#ffffff" />
        <path d="M76 66 L80 72" stroke="#ffd85e" />
        <path d="M104 74 L110 72" stroke="#7fd8c4" />
        <path d="M66 88 L70 92" stroke="#8fc9ff" />
        <path d="M118 88 L114 92" stroke="#ffffff" />
      </g>
    </svg>
  );
}

/** Wedges of the pinwheel lollipop: six white slices around the center. */
const WEDGES = Array.from({ length: 6 }, (_, index) => {
  const from = (index * 60 * Math.PI) / 180;
  const to = ((index * 60 + 30) * Math.PI) / 180;
  const point = (angle: number) => `${(70 + 58 * Math.cos(angle)).toFixed(1)} ${(70 + 58 * Math.sin(angle)).toFixed(1)}`;
  return `M70 70 L${point(from)} A58 58 0 0 1 ${point(to)} Z`;
});

/** A pinwheel lollipop; its white center (a circle of 40% of the width, centered on a square from the top) holds a label. */
export function Lollipop({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 140 220" className={className} aria-hidden="true">
      <rect x="64" y="120" width="12" height="96" rx="6" fill="#ffffff" stroke={OUTLINE} strokeWidth="4" />
      <circle cx="70" cy="70" r="62" fill="#ff8fc0" stroke={OUTLINE} strokeWidth="4" />
      {WEDGES.map((wedge) => (
        <path key={wedge} d={wedge} fill="#ffffff" opacity="0.85" />
      ))}
      <circle cx="70" cy="70" r="28" fill="#ffffff" stroke={OUTLINE} strokeWidth="3" />
    </svg>
  );
}
