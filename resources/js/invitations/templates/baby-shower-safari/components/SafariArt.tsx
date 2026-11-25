/*
 * Animated illustrations of the baby-shower-safari template, drawn in its tokens (--hide, --coat, --spots, --leaf,
 * --blush): a baby elephant that flaps its ears and blows bubbles through its trunk, a giraffe that peeks in and bobs
 * its head, clusters of leaves that sway, and the leaf curtains of the intro. The motion lives in this template's
 * theme.css.
 */
import type { CSSProperties } from 'react';

function vars(values: Record<string, string | number>): CSSProperties {
  return Object.fromEntries(Object.entries(values).map(([key, value]) => [`--${key}`, typeof value === 'number' ? `${value}s` : value])) as CSSProperties;
}

const BUBBLES = [
  { r: 7, wait: 0, dx: '-14px' },
  { r: 5, wait: -1.1, dx: '12px' },
  { r: 9, wait: -2.2, dx: '-4px' },
  { r: 4, wait: -2.9, dx: '18px' },
  { r: 6, wait: -3.5, dx: '-20px' },
];

/** A baby elephant sitting, its trunk up, flapping an ear and blowing bubbles (when `bubbles` is on). */
export function Elephant({ className, bubbles = true }: { className?: string; bubbles?: boolean }) {
  return (
    <svg viewBox="20 10 180 190" className={className} aria-hidden="true">
      <ellipse cx="100" cy="192" rx="62" ry="6" fill="var(--hide-dark)" opacity="0.12" />
      <path d="M50 150 Q 36 154 38 168" fill="none" stroke="var(--hide-dark)" strokeWidth="3" strokeLinecap="round" />
      <ellipse cx="96" cy="148" rx="50" ry="40" fill="var(--hide)" />
      <ellipse cx="106" cy="158" rx="28" ry="24" fill="var(--hide-light)" />
      <ellipse cx="62" cy="178" rx="18" ry="13" fill="var(--hide)" />
      <ellipse cx="128" cy="179" rx="16" ry="12" fill="var(--hide)" />
      <g fill="var(--card)">
        <circle cx="55" cy="184" r="3" />
        <circle cx="63" cy="186" r="3" />
        <circle cx="122" cy="185" r="2.8" />
        <circle cx="130" cy="186" r="2.8" />
      </g>
      <g className="safari-ear" style={vars({ origin: '100% 45%' })}>
        <ellipse cx="92" cy="96" rx="28" ry="33" fill="var(--hide)" />
        <ellipse cx="92" cy="98" rx="17" ry="22" fill="var(--blush)" opacity="0.55" />
      </g>
      <circle cx="122" cy="94" r="36" fill="var(--hide)" />
      <g className="safari-trunk">
        <path d="M148 102 C 166 106, 174 88, 168 66" fill="none" stroke="var(--hide)" strokeWidth="17" strokeLinecap="round" />
        <ellipse cx="168" cy="64" rx="8.5" ry="4.5" fill="var(--hide-dark)" opacity="0.35" transform="rotate(-10 168 64)" />
        {bubbles &&
          BUBBLES.map(({ r, wait, dx }) => (
            <circle
              key={wait}
              className="safari-bubble"
              style={vars({ wait, dx, every: 3.6 })}
              cx="168"
              cy="54"
              r={r}
              fill="var(--hide-light)"
              fillOpacity="0.7"
              stroke="var(--hide-dark)"
              strokeOpacity="0.55"
              strokeWidth="1.6"
            />
          ))}
      </g>
      <circle className="safari-blink" cx="130" cy="86" r="4.3" fill="var(--hide-dark)" />
      <circle cx="131.5" cy="84.5" r="1.3" fill="white" />
      <circle cx="138" cy="104" r="6.5" fill="var(--blush)" opacity="0.7" />
      <path d="M118 110 Q 124 115 130 111" fill="none" stroke="var(--hide-dark)" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

const SPOTS = [
  { d: 'M66 118 q 10 -6 16 2 q 4 10 -6 14 q -12 2 -10 -16 Z' },
  { d: 'M84 150 q 10 -4 12 6 q 0 10 -10 10 q -8 -4 -2 -16 Z' },
  { d: 'M64 178 q 12 -4 14 6 q 0 10 -12 10 q -8 -6 -2 -16 Z' },
  { d: 'M86 202 q 8 -2 10 6 q -2 8 -10 8 q -6 -6 0 -14 Z' },
  { d: 'M70 56 q 6 -4 10 2 q 2 6 -4 8 q -8 0 -6 -10 Z' },
];

/** A giraffe peeking in from below, bobbing its head and blinking. */
export function Giraffe({ className, wait = 0 }: { className?: string; wait?: number }) {
  return (
    <svg viewBox="20 0 130 230" className={className} aria-hidden="true">
      <g className="safari-bob" style={vars({ origin: '80px 230px', every: 5.5, wait, tilt: '4deg', lift: '-4px' })}>
        <rect x="60" y="78" width="38" height="170" rx="18" fill="var(--coat)" />
        <path d="M60 100 q -10 6 -6 20 M60 140 q -10 6 -6 20" fill="none" stroke="var(--spots)" strokeWidth="5" strokeLinecap="round" />
        <g stroke="var(--coat)" strokeWidth="6" strokeLinecap="round">
          <path d="M72 44 L 68 22" />
          <path d="M92 42 L 96 20" />
        </g>
        <circle cx="68" cy="20" r="6" fill="var(--spots)" />
        <circle cx="96" cy="18" r="6" fill="var(--spots)" />
        <ellipse cx="52" cy="50" rx="13" ry="7" fill="var(--coat)" transform="rotate(-28 52 50)" />
        <ellipse cx="52" cy="50" rx="7" ry="3.5" fill="var(--blush)" opacity="0.7" transform="rotate(-28 52 50)" />
        <ellipse cx="84" cy="62" rx="32" ry="27" fill="var(--coat)" />
        <ellipse cx="108" cy="74" rx="22" ry="17" fill="var(--secondary)" />
        <circle cx="114" cy="70" r="2.6" fill="var(--hide-dark)" />
        <circle cx="104" cy="72" r="2.6" fill="var(--hide-dark)" />
        <path d="M100 84 Q 108 89 116 84" fill="none" stroke="var(--hide-dark)" strokeWidth="2" strokeLinecap="round" />
        <circle className="safari-blink" style={vars({ wait: -1.4 })} cx="88" cy="56" r="4" fill="var(--hide-dark)" />
        <circle cx="89.3" cy="54.6" r="1.2" fill="white" />
        <circle cx="80" cy="72" r="5" fill="var(--blush)" opacity="0.6" />
        {SPOTS.map(({ d }) => (
          <path key={d} d={d} fill="var(--spots)" opacity="0.85" />
        ))}
      </g>
    </svg>
  );
}

interface LeafSpec {
  x: number;
  y: number;
  angle: number;
  size: number;
  tone: string;
  wait: number;
}

/** A pointed leaf with its midrib, rooted at the origin and pointing up, swaying from its stem. */
function Leaf({ x, y, angle, size, tone, wait }: LeafSpec) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle}) scale(${size})`}>
      <g className="safari-sway" style={vars({ every: 5 + (Math.abs(wait) % 2), wait, swing: '5deg' })}>
        <path d="M0 0 C 26 -14, 40 -54, 0 -100 C -40 -54, -26 -14, 0 0 Z" fill={`var(${tone})`} />
        <path d="M0 -4 L 0 -88" stroke="var(--leaf-dark)" strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
        <path d="M0 -30 L 14 -44 M0 -50 L -14 -64 M0 -64 L 12 -76" stroke="var(--leaf-dark)" strokeOpacity="0.35" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    </g>
  );
}

const CLUSTER: LeafSpec[] = [
  { x: 40, y: 200, angle: -38, size: 1.2, tone: '--leaf-dark', wait: 0 },
  { x: 50, y: 200, angle: 4, size: 1.35, tone: '--leaf', wait: -1.5 },
  { x: 60, y: 200, angle: 40, size: 1.05, tone: '--leaf-dark', wait: -2.6 },
  { x: 46, y: 204, angle: -70, size: 0.85, tone: '--leaf', wait: -3.4 },
];

/** A cluster of four swaying leaves growing from the bottom left; `flip` mirrors it. */
export function Leaves({ className, flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg viewBox="-60 40 200 170" className={className} style={flip ? { transform: 'scaleX(-1)' } : undefined} aria-hidden="true">
      {CLUSTER.map((leaf) => (
        <Leaf key={leaf.angle} {...leaf} />
      ))}
    </svg>
  );
}

/** A low row of grass blades and two small bushes, the ground of a scene. */
export function Grass({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 40" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d="M0 40 V 26 Q 40 12 80 24 T 160 22 T 240 24 T 320 20 T 400 24 V 40 Z" fill="var(--accent)" />
      <path d="M0 40 V 32 Q 50 22 100 30 T 200 30 T 300 28 T 400 30 V 40 Z" fill="var(--leaf)" opacity="0.45" />
    </svg>
  );
}
