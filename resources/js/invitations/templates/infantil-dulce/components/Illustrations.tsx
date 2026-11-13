/*
 * The candy party's own illustrations, drawn flat in sweet colors: an ice cream cone with three scoops, a cupcake
 * with its candle, a swirl lollipop and a wrapped candy. Their parts move on their own (motion.css): the cherry
 * bounces, the sprinkles wiggle, the frosting drips, the flame flickers and the lollipop spins.
 */
import './motion.css';

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
        <path className="dulce-drip" d="M58 148 L58 164 C58 171 67 171 67 164 L67 149" fill="#ff8fc0" />
        <path d="M44 132 C60 150 100 150 116 132 L118 144 C100 156 60 156 42 144 Z" fill="#ff8fc0" />
        <g className="dulce-cherry">
          <circle cx="80" cy="40" r="10" fill="#e8344d" />
          <path d="M80 30 C82 18 90 12 98 10" fill="none" strokeLinecap="round" />
        </g>
      </g>
      <g strokeWidth="5" strokeLinecap="round">
        <path className="dulce-sprinkle" d="M66 70 L72 66" stroke="#ffffff" />
        <path className="dulce-sprinkle" d="M90 64 L96 70" stroke="#7fd8c4" />
        <path className="dulce-sprinkle" d="M78 96 L84 92" stroke="#ffd85e" />
        <path className="dulce-sprinkle" d="M98 88 L102 96" stroke="#b9a2f0" />
        <path className="dulce-sprinkle" d="M62 92 L60 100" stroke="#8fc9ff" />
      </g>
    </svg>
  );
}

export function Cupcake({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 170" className={className} aria-hidden="true">
      <path className="dulce-flame" d="M56 6 C50 14 49 21 56 25 C63 21 62 14 56 6 Z" fill="#ffb347" />
      <path className="dulce-flame" d="M56 13 C53 17 53 21 56 23 C59 21 59 17 56 13 Z" fill="#fff1a8" />
      <g stroke={OUTLINE} strokeWidth="4" strokeLinejoin="round">
        <rect x="50" y="26" width="12" height="36" rx="4" fill="#8fc9ff" />
        <path d="M50 36 L62 30 M50 48 L62 42 M50 60 L62 54" stroke="#ffffff" strokeWidth="3" />
        <path d="M30 96 L44 164 L116 164 L130 96 Z" fill="#b9a2f0" />
        <path d="M54 100 L60 164 M80 100 V164 M106 100 L100 164" stroke="#9a80dc" strokeWidth="3.5" />
        <path d="M22 98 C14 76 36 62 50 66 C50 44 76 36 88 48 C98 30 128 40 124 62 C142 64 148 90 136 100 Z" fill="#ff8fc0" />
        <circle cx="86" cy="34" r="11" fill="#e8344d" />
      </g>
      <g strokeWidth="5" strokeLinecap="round">
        <path className="dulce-sprinkle" d="M48 80 L54 76" stroke="#ffffff" />
        <path className="dulce-sprinkle" d="M76 66 L80 72" stroke="#ffd85e" />
        <path className="dulce-sprinkle" d="M104 74 L110 72" stroke="#7fd8c4" />
        <path className="dulce-sprinkle" d="M66 88 L70 92" stroke="#8fc9ff" />
        <path className="dulce-sprinkle" d="M118 88 L114 92" stroke="#ffffff" />
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
      <g className="dulce-spin">
        {WEDGES.map((wedge) => (
          <path key={wedge} d={wedge} fill="#ffffff" opacity="0.85" />
        ))}
      </g>
      <circle cx="70" cy="70" r="28" fill="#ffffff" stroke={OUTLINE} strokeWidth="3" />
    </svg>
  );
}

/** A wrapped candy with twisted ends, striped in the given color. */
export function Candy({ className, color = '#7fd8c4' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 50" className={className} aria-hidden="true">
      <g stroke={OUTLINE} strokeWidth="3.5" strokeLinejoin="round">
        <path d="M34 25 L8 9 L14 25 L8 41 Z" fill={color} />
        <path d="M66 25 L92 9 L86 25 L92 41 Z" fill={color} />
        <circle cx="50" cy="25" r="17" fill="#ffffff" />
      </g>
      <path d="M40 12 L60 38 M50 9 L66 30 M36 22 L52 41" stroke={color} strokeWidth="4" strokeLinecap="round" />
      <circle cx="50" cy="25" r="17" fill="none" stroke={OUTLINE} strokeWidth="3.5" />
    </svg>
  );
}
