/*
 * Animated illustrations of the baby-shower-patito template, drawn in its tokens (--duck, --duck-shade, --beak,
 * --water, --water-deep, --bubble, --bubble-edge, --tub, --eye): a rubber duck that bobs on sliding waves among
 * rising bubbles, a row of ducklings, the bathtub of the intro (the duck pops out of its foam) and the bubbles that
 * float up the hero. The motion lives in this template's theme.css.
 */
import type { CSSProperties } from 'react';

function vars(values: Record<string, string | number>): CSSProperties {
  return Object.fromEntries(Object.entries(values).map(([key, value]) => [`--${key}`, typeof value === 'number' ? `${value}s` : value])) as CSSProperties;
}

/** A rubber duck facing left, about 150 wide, its body resting around y = 160. */
function DuckShape({ wait = 0 }: { wait?: number }) {
  return (
    <g>
      <path d="M150 118 Q 176 92 170 82 Q 160 102 146 106 Z" fill="var(--duck-shade)" />
      <ellipse cx="106" cy="134" rx="64" ry="34" fill="var(--duck)" />
      <ellipse cx="116" cy="132" rx="28" ry="15" fill="var(--duck-shade)" transform="rotate(-14 116 132)" />
      <path d="M100 128 q 14 -10 34 -4" fill="none" stroke="var(--duck)" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
      <circle cx="72" cy="84" r="33" fill="var(--duck)" />
      <path d="M68 52 q 2 -14 14 -10 q -8 3 -6 12" fill="var(--duck-shade)" />
      <path d="M44 86 Q 20 80 16 92 Q 26 104 46 98 Z" fill="var(--beak)" />
      <path d="M20 93 Q 32 95 44 92" fill="none" stroke="var(--eye)" strokeOpacity="0.35" strokeWidth="1.6" strokeLinecap="round" />
      <circle className="patito-blink" style={vars({ wait })} cx="64" cy="76" r="5.2" fill="var(--eye)" />
      <circle cx="65.8" cy="74.2" r="1.6" fill="white" />
      <circle cx="82" cy="94" r="6.5" fill="var(--beak)" opacity="0.3" />
    </g>
  );
}

/** A wave line from x = -40 to x = width + 40, with a crest every 40 units, filled down to `bottom`. */
function wavePath(y: number, width: number, bottom: number): string {
  let path = `M-40 ${y}`;
  for (let x = -40; x < width + 40; x += 40) {
    path += ` q 10 -7 20 0 q 10 7 20 0`;
  }
  return `${path} V ${bottom} H -40 Z`;
}

const DUCK_BUBBLES = [
  { cx: 170, r: 7, wait: 0, dx: '6px' },
  { cx: 182, r: 4, wait: -1.4, dx: '-6px' },
  { cx: 30, r: 6, wait: -2.3, dx: '-4px' },
  { cx: 150, r: 5, wait: -3.1, dx: '10px' },
  { cx: 44, r: 3.5, wait: -4.2, dx: '8px' },
];

/** The rubber duck bobbing on two sliding waves, bubbles rising around it. */
export function Duck({ className, bubbles = true }: { className?: string; bubbles?: boolean }) {
  return (
    <svg viewBox="0 10 200 190" className={className} aria-hidden="true">
      {bubbles &&
        DUCK_BUBBLES.map(({ cx, r, wait, dx }) => (
          <circle
            key={cx}
            className="patito-rise"
            style={vars({ wait, dx, every: 5, rise: '130px' })}
            cx={cx}
            cy="160"
            r={r}
            fill="var(--bubble)"
            stroke="var(--bubble-edge)"
            strokeWidth="1.5"
          />
        ))}
      <path className="patito-waves" style={vars({ every: 5 })} d={wavePath(150, 200, 200)} fill="var(--water-deep)" opacity="0.45" />
      <g className="patito-bob" style={vars({ origin: '100px 160px' })}>
        <DuckShape />
      </g>
      <path className="patito-waves" style={vars({ every: 3.5 })} d={wavePath(160, 200, 200)} fill="var(--water)" />
    </svg>
  );
}

const DUCKLINGS = [
  { x: 10, scale: 0.5, wait: 0 },
  { x: 110, scale: 0.38, wait: -0.8 },
  { x: 190, scale: 0.38, wait: -1.6 },
];

/** Mother duck and two ducklings swimming in a row. */
export function Ducklings({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 280 110" className={className} aria-hidden="true">
      {DUCKLINGS.map(({ x, scale, wait }) => (
        <g key={x} transform={`translate(${x} ${96 - 168 * scale}) scale(${scale})`}>
          <g className="patito-bob" style={vars({ origin: '100px 160px', wait, every: 2.8 })}>
            <DuckShape wait={wait} />
          </g>
        </g>
      ))}
      <path className="patito-waves" style={vars({ every: 3 })} d={wavePath(92, 280, 110)} fill="var(--water)" />
    </svg>
  );
}

const FOAM = [
  { cx: 34, cy: 96, r: 14 },
  { cx: 58, cy: 86, r: 18 },
  { cx: 160, cy: 86, r: 18 },
  { cx: 186, cy: 96, r: 14 },
  { cx: 84, cy: 92, r: 13 },
  { cx: 136, cy: 92, r: 13 },
  { cx: 110, cy: 98, r: 12 },
];

/** The intro's clawfoot bathtub full of foam; the duck pops out of it when an ancestor gets .is-open. */
export function Bathtub({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 220 200" className={className} aria-hidden="true">
      <g className="patito-pop-up">
        <g transform="translate(56 6) scale(0.6)">
          <DuckShape />
        </g>
      </g>
      {FOAM.map(({ cx, cy, r }) => (
        <circle key={cx} cx={cx} cy={cy} r={r} fill="var(--tub)" stroke="var(--bubble-edge)" strokeWidth="1.5" />
      ))}
      <rect x="14" y="98" width="192" height="12" rx="6" fill="var(--tub)" stroke="var(--border)" strokeWidth="2" />
      <path d="M22 110 H 198 Q 196 168 150 172 H 70 Q 24 168 22 110 Z" fill="var(--tub)" stroke="var(--border)" strokeWidth="2" />
      <path d="M40 124 H 180" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" />
      <g fill="var(--beak)">
        <path d="M60 170 l -8 18 h 12 l 4 -16 Z" />
        <path d="M160 170 l 8 18 h -12 l -4 -16 Z" />
      </g>
      {[
        { cx: 186, cy: 70, r: 6, wait: 0 },
        { cx: 30, cy: 66, r: 5, wait: -1.6 },
        { cx: 172, cy: 54, r: 4, wait: -2.6 },
      ].map(({ cx, cy, r, wait }) => (
        <circle key={cx} className="patito-rise" style={vars({ wait, every: 4, rise: '60px' })} cx={cx} cy={cy} r={r} fill="var(--bubble)" stroke="var(--bubble-edge)" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

const FLOATING = [
  { left: '5%', size: 18, wait: 0, every: 9 },
  { left: '14%', size: 10, wait: -3, every: 7 },
  { left: '27%', size: 14, wait: -6, every: 10 },
  { left: '64%', size: 12, wait: -2, every: 8 },
  { left: '78%', size: 20, wait: -5, every: 11 },
  { left: '90%', size: 11, wait: -1, every: 7.5 },
];

/** Bubbles floating up behind the content of their (relative, overflow-hidden) parent. */
export function FloatingBubbles() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {FLOATING.map(({ left, size, wait, every }, index) => (
        <svg
          key={left}
          viewBox="0 0 20 20"
          className="patito-rise absolute bottom-0"
          style={{ left, width: size, height: size, ...vars({ wait, every, rise: '75vh', dx: `${index % 2 ? -18 : 18}px` }) }}
        >
          <circle cx="10" cy="10" r="9" fill="var(--bubble)" stroke="var(--bubble-edge)" strokeWidth="1.2" />
          <circle cx="7" cy="7" r="2.2" fill="white" />
        </svg>
      ))}
    </div>
  );
}

/** A single bubble, e.g. for the section titles. */
export function Bubble({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <circle cx="10" cy="10" r="8.5" fill="var(--card)" stroke="var(--water-deep)" strokeWidth="1.5" />
      <circle cx="7" cy="7" r="2" fill="var(--water)" />
    </svg>
  );
}
