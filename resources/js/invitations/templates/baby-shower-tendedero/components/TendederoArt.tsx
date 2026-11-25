/*
 * Animated illustrations of the baby-shower-tendedero template, drawn in its tokens (--rose, --mustard, --sage,
 * --clay, --twine, --pin): a clothesline whose baby clothes sway in the wind, a garland of pennants, a pair of socks
 * and the wooden hanger of the intro. The motion lives in this template's theme.css.
 */
import type { CSSProperties, ReactNode } from 'react';

function vars(values: Record<string, string | number>): CSSProperties {
  return Object.fromEntries(Object.entries(values).map(([key, value]) => [`--${key}`, typeof value === 'number' ? `${value}s` : value])) as CSSProperties;
}

/** A wooden clothespin whose bottom is at (0, 0). */
function Clothespin() {
  return (
    <g>
      <rect x="-3.5" y="-12" width="7" height="18" rx="2" fill="var(--pin)" />
      <path d="M0 -12 V 6" stroke="var(--twine)" strokeOpacity="0.4" strokeWidth="1" />
      <circle cx="0" cy="-3" r="1.6" fill="var(--twine)" opacity="0.6" />
    </g>
  );
}

/** A onesie hanging from (0, 0), about 60 wide and 66 tall, with an optional letter on its chest. */
export function Onesie({ color, letter }: { color: string; letter?: string | null }) {
  return (
    <g>
      <path
        d="M-14 0 Q 0 9 14 0 L 30 10 L 24 27 L 16 23 L 16 56 Q 16 66 6 66 L -6 66 Q -16 66 -16 56 L -16 23 L -24 27 L -30 10 Z"
        fill={`var(${color})`}
      />
      <path d="M-14 0 Q 0 9 14 0" fill="none" stroke="var(--foreground)" strokeOpacity="0.18" strokeWidth="2" />
      <g fill="var(--card)" opacity="0.8">
        <circle cx="-5" cy="60" r="1.6" />
        <circle cx="0" cy="61" r="1.6" />
        <circle cx="5" cy="60" r="1.6" />
      </g>
      {letter ? (
        <text x="0" y="45" textAnchor="middle" fontFamily="'Yeseva One', serif" fontSize="20" fill="var(--card)">
          {letter}
        </text>
      ) : (
        <path d="M0 40 C -7 33, -8 27, -3 26 C -1 26, 0 28, 0 29 C 0 28, 1 26, 3 26 C 8 27, 7 33, 0 40 Z" fill="var(--card)" opacity="0.85" />
      )}
      <Clothespin />
    </g>
  );
}

/** A sock hanging from (0, 0), its cuff striped. */
function Sock({ color }: { color: string }) {
  return (
    <g>
      <path d="M-8 0 H 8 V 30 Q 8 42 -2 42 L -12 42 Q -20 42 -20 35 Q -20 29 -12 28 L -8 27 Z" fill={`var(${color})`} />
      <path d="M-8 6 H 8 M-8 10 H 8" stroke="var(--card)" strokeOpacity="0.7" strokeWidth="2" />
      <Clothespin />
    </g>
  );
}

/** A bib hanging from (0, 0). */
function Bib({ color }: { color: string }) {
  return (
    <g>
      <path d="M-20 2 Q 0 -6 20 2 Q 28 40 0 50 Q -28 40 -20 2 Z" fill={`var(${color})`} />
      <path d="M-9 4 Q 0 14 9 4" fill="none" stroke="var(--card)" strokeOpacity="0.8" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M-14 30 Q 0 40 14 30" fill="none" stroke="var(--card)" strokeOpacity="0.6" strokeWidth="2" strokeDasharray="2 4" strokeLinecap="round" />
      <Clothespin />
    </g>
  );
}

/** A knitted beanie hanging by its pompom from (0, 0). */
function Beanie({ color }: { color: string }) {
  return (
    <g>
      <circle cx="0" cy="4" r="7" fill="var(--card)" />
      <path d="M-20 38 Q -20 8 0 8 Q 20 8 20 38 Z" fill={`var(${color})`} />
      <rect x="-22" y="34" width="44" height="10" rx="4" fill={`var(${color})`} />
      <path d="M-16 39 H 16" stroke="var(--card)" strokeOpacity="0.5" strokeWidth="2" strokeDasharray="3 3" />
      <Clothespin />
    </g>
  );
}

/** The point at x of the twine that sags from (0, 28) to (400, 28), 52 at its lowest. */
function twineY(x: number): number {
  const t = x / 400;
  return 28 + 2 * (1 - t) * t * 48;
}

interface HungItem {
  x: number;
  every: number;
  wait: number;
  render: (letter?: string | null) => ReactNode;
}

const CLOTHES: HungItem[] = [
  { x: 52, every: 3.4, wait: 0, render: () => <Beanie color="--mustard" /> },
  { x: 120, every: 3.9, wait: -1.2, render: (letter) => <Onesie color="--rose" letter={letter} /> },
  { x: 182, every: 3.1, wait: -0.6, render: () => <Sock color="--sage" /> },
  { x: 206, every: 3.3, wait: -2, render: () => <Sock color="--sage" /> },
  { x: 268, every: 4.1, wait: -1.6, render: () => <Bib color="--clay" /> },
  { x: 340, every: 3.7, wait: -0.3, render: () => <Onesie color="--mustard" /> },
];

/** The clothesline: a twine that sags across, with baby clothes swaying from their clothespins. */
export function Clothesline({ className, letter = null }: { className?: string; letter?: string | null }) {
  return (
    <svg viewBox="0 0 400 140" className={className} aria-hidden="true">
      <path d="M0 28 Q 200 124 400 28" fill="none" stroke="var(--twine)" strokeWidth="2" />
      {CLOTHES.map(({ x, every, wait, render }) => (
        <g key={x} transform={`translate(${x} ${twineY(x) - 2})`}>
          <g className="tende-sway" style={vars({ every, wait, swing: '7deg' })}>
            {render(letter)}
          </g>
        </g>
      ))}
    </svg>
  );
}

const PENNANT_COLORS = ['--clay', '--mustard', '--sage', '--rose'];

/** A garland of pennants, swaying a little, to divide sections. */
export function Pennants({ className, count = 9 }: { className?: string; count?: number }) {
  const step = 400 / (count + 1);

  return (
    <svg viewBox="0 0 400 60" className={className} aria-hidden="true">
      <path d="M0 10 Q 200 40 400 10" fill="none" stroke="var(--twine)" strokeWidth="1.5" />
      {Array.from({ length: count }, (_, index) => {
        const x = step * (index + 1);
        const t = x / 400;
        const y = 10 + 2 * (1 - t) * t * 30;
        return (
          <g key={x} transform={`translate(${x} ${y})`}>
            <path className="tende-sway" style={vars({ every: 3 + (index % 3) * 0.5, wait: -index * 0.4, swing: '5deg' })} d="M-10 0 H 10 L 0 20 Z" fill={`var(${PENNANT_COLORS[index % PENNANT_COLORS.length]})`} />
          </g>
        );
      })}
    </svg>
  );
}

/** A pair of socks on a short piece of twine. */
export function Socks({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 80" className={className} aria-hidden="true">
      <path d="M0 10 Q 80 30 160 10" fill="none" stroke="var(--twine)" strokeWidth="2" />
      <g transform="translate(64 18)">
        <g className="tende-sway" style={vars({ every: 3.2, swing: '8deg' })}>
          <Sock color="--rose" />
        </g>
      </g>
      <g transform="translate(96 18)">
        <g className="tende-sway" style={vars({ every: 3.6, wait: -1, swing: '8deg' })}>
          <Sock color="--mustard" />
        </g>
      </g>
    </svg>
  );
}

/** The intro's wooden hanger holding a onesie with a handwritten tag, swinging from its hook. */
export function Hanger({ className, letter = null }: { className?: string; letter?: string | null }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <g className="tende-sway" style={vars({ every: 4, swing: '5deg' })}>
        <path d="M100 10 q 12 0 12 12 q 0 10 -12 14 V 44" fill="none" stroke="var(--twine)" strokeWidth="4" strokeLinecap="round" />
        <path d="M100 44 L 30 78 Q 24 82 30 84 H 170 Q 176 82 170 78 Z" fill="var(--pin)" />
        <g transform="translate(100 88) scale(1.5)">
          <Onesie color="--rose" letter={letter} />
        </g>
        <g transform="translate(132 150) rotate(-8)">
          <rect x="0" y="0" width="54" height="26" rx="4" fill="var(--card)" stroke="var(--border)" />
          <circle cx="7" cy="13" r="2.5" fill="var(--twine)" />
          <text x="31" y="18" textAnchor="middle" fontFamily="'Reenie Beanie', cursive" fontSize="17" fill="var(--foreground)">
            ¡hola!
          </text>
        </g>
      </g>
    </svg>
  );
}
