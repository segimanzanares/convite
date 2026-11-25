/*
 * Animated illustrations of the baby-shower-lluvia template, drawn in its tokens (--cloud, --cloud-shade, --drop,
 * --heart, --sun, --lilac, --face): a smiling cloud that floats and rains drops and hearts, an umbrella that sways
 * (and opens in the intro), a rainbow that draws itself and the hearts that drift down the hero. The motion lives in
 * this template's theme.css.
 */
import { useId, type CSSProperties } from 'react';
import { cn } from '../../../components/ui/styles';

function vars(values: Record<string, string | number>): CSSProperties {
  return Object.fromEntries(Object.entries(values).map(([key, value]) => [`--${key}`, typeof value === 'number' ? `${value}s` : value])) as CSSProperties;
}

/** A heart of size s around (cx, cy), as an SVG path. */
function heartPath(cx: number, cy: number, s: number): string {
  return `M${cx} ${cy + s * 0.9} C ${cx - s * 1.5} ${cy - s * 0.1}, ${cx - s * 0.7} ${cy - s * 1.1}, ${cx} ${cy - s * 0.35} C ${cx + s * 0.7} ${cy - s * 1.1}, ${cx + s * 1.5} ${cy - s * 0.1}, ${cx} ${cy + s * 0.9} Z`;
}

/** A raindrop whose tip is at (x, y). */
function dropPath(x: number, y: number): string {
  return `M${x} ${y} C ${x - 4} ${y + 7}, ${x - 7} ${y + 10}, ${x - 7} ${y + 14} A 7 7 0 0 0 ${x + 7} ${y + 14} C ${x + 7} ${y + 10}, ${x + 4} ${y + 7}, ${x} ${y} Z`;
}

/** The puffs of a cloud around (0, 0), about 120 wide: drawn twice, its shade first and a little lower. */
function CloudShape({ fill }: { fill: string }) {
  return (
    <g fill={fill}>
      <circle cx="-38" cy="6" r="28" />
      <circle cx="-4" cy="-14" r="36" />
      <circle cx="34" cy="4" r="28" />
      <rect x="-62" y="4" width="124" height="34" rx="17" />
    </g>
  );
}

const RAIN = [
  { x: 62, kind: 'drop', wait: 0 },
  { x: 84, kind: 'heart', wait: -0.9 },
  { x: 106, kind: 'drop', wait: -1.7 },
  { x: 128, kind: 'heart', wait: -0.4 },
  { x: 150, kind: 'drop', wait: -1.3 },
  { x: 74, kind: 'drop', wait: -2.1 },
  { x: 140, kind: 'drop', wait: -2.4 },
  { x: 116, kind: 'heart', wait: -2.9 },
] as const;

/** A smiling cloud that floats and blinks, raining drops and hearts (when `rain` is on). */
export function RainCloud({ className, rain = true, wait = 0 }: { className?: string; rain?: boolean; wait?: number }) {
  return (
    <svg viewBox="30 20 160 190" className={className} aria-hidden="true">
      {rain &&
        RAIN.map(({ x, kind, wait: delay }) => (
          <path
            key={`${x}-${delay}`}
            className="lluvia-fall"
            style={vars({ wait: delay, every: 2.8, fall: '70px' })}
            d={kind === 'drop' ? dropPath(x, 112) : heartPath(x, 120, 7)}
            fill={kind === 'drop' ? 'var(--drop)' : 'var(--heart)'}
          />
        ))}
      <g className="lluvia-float" style={vars({ every: 6, wait, dx: '4px', lift: '-5px' })}>
        <g transform="translate(110 78)">
          <g transform="translate(0 6)">
            <CloudShape fill="var(--cloud-shade)" />
          </g>
          <CloudShape fill="var(--cloud)" />
        </g>
        <circle className="lluvia-blink" style={vars({ wait })} cx="94" cy="84" r="4.2" fill="var(--face)" />
        <circle className="lluvia-blink" style={vars({ wait })} cx="126" cy="84" r="4.2" fill="var(--face)" />
        <circle cx="84" cy="95" r="6" fill="var(--heart)" opacity="0.45" />
        <circle cx="136" cy="95" r="6" fill="var(--heart)" opacity="0.45" />
        <path d="M102 94 Q 110 101 118 94" fill="none" stroke="var(--face)" strokeWidth="2.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

const PANELS = [20, 65, 110, 155, 200];

/**
 * An umbrella with lilac and butter panels and a heart on top, swaying from its handle. `closed` makes it wait folded
 * until an ancestor gets .is-open (the intro).
 */
export function Umbrella({ className, closed = false }: { className?: string; closed?: boolean }) {
  const clipId = useId();
  const edge = 'M20 100 Q 22 22 110 22 Q 198 22 200 100 Q 177 86 155 100 Q 132 86 110 100 Q 88 86 65 100 Q 42 86 20 100 Z';

  return (
    <svg viewBox="0 0 220 240" className={cn(closed && 'lluvia-closed', className)} aria-hidden="true">
      <g className="lluvia-sway" style={vars({ origin: '110px 228px', every: 5.5 })}>
        <path d="M110 92 V 210 q 0 18 -16 18 q -12 0 -12 -12" fill="none" stroke="var(--face)" strokeWidth="5" strokeLinecap="round" />
        <g className="lluvia-canopy">
          <clipPath id={clipId}>
            <path d={edge} />
          </clipPath>
          <path d={edge} fill="var(--lilac)" />
          <g clipPath={`url(#${clipId})`} fill="var(--sun)">
            {PANELS.slice(0, -1).map((x, index) =>
              index % 2 ? <path key={x} d={`M110 10 L ${x} 110 L ${PANELS[index + 1]} 110 Z`} /> : null,
            )}
          </g>
          <path d={edge} fill="none" stroke="var(--face)" strokeOpacity="0.25" strokeWidth="2" />
          <path d={heartPath(110, 16, 8)} fill="var(--heart)" />
        </g>
      </g>
    </svg>
  );
}

const ARCS = [
  { r: 96, color: '--heart' },
  { r: 82, color: '--sun' },
  { r: 68, color: '--drop' },
  { r: 54, color: '--lilac' },
];

/** A rainbow that draws itself band by band between two small clouds. */
export function Rainbow({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 130" className={className} aria-hidden="true">
      {ARCS.map(({ r, color }, index) => (
        <path
          key={r}
          className="lluvia-draw"
          style={vars({ wait: index * 0.25 })}
          d={`M${120 - r} 118 A ${r} ${r} 0 0 1 ${120 + r} 118`}
          pathLength={1}
          fill="none"
          stroke={`var(${color})`}
          strokeWidth="12"
          strokeLinecap="round"
        />
      ))}
      <g transform="translate(30 112) scale(0.36)">
        <CloudShape fill="var(--cloud)" />
      </g>
      <g transform="translate(210 112) scale(0.36)">
        <CloudShape fill="var(--cloud)" />
      </g>
    </svg>
  );
}

const DRIFT = [
  { left: '6%', size: 14, wait: 0, every: 11 },
  { left: '18%', size: 10, wait: -4, every: 9 },
  { left: '31%', size: 16, wait: -7, every: 12 },
  { left: '46%', size: 9, wait: -2, every: 10 },
  { left: '58%', size: 13, wait: -9, every: 13 },
  { left: '71%', size: 11, wait: -5, every: 9.5 },
  { left: '84%', size: 15, wait: -1, every: 11.5 },
  { left: '93%', size: 9, wait: -6, every: 10.5 },
];

/** Hearts and drops drifting down behind the content of their (relative, overflow-hidden) parent. */
export function HeartDrizzle() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {DRIFT.map(({ left, size, wait, every }, index) => (
        <svg
          key={left}
          viewBox="0 0 20 20"
          className="lluvia-drift absolute -top-6"
          style={{ left, width: size, height: size, ...vars({ wait, every, dx: `${index % 2 ? -24 : 24}px` }) }}
        >
          {index % 3 === 1 ? <path d={dropPath(10, 2)} fill="var(--drop)" /> : <path d={heartPath(10, 10, 6)} fill="var(--heart)" opacity="0.7" />}
        </svg>
      ))}
    </div>
  );
}

/** A small heart, e.g. for the section titles. */
export function Heart({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
      <path d={heartPath(10, 10, 6)} fill="currentColor" />
    </svg>
  );
}
