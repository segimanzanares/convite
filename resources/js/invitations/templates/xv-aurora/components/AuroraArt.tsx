/*
 * Animated ornaments of the xv-aurora template, drawn in its violet, pink and peach tokens: a tiara that draws itself
 * and sets its gems, a rose that blooms on its stem and a ribbon of aurora between sections. They play when they come
 * into view, or once `play` turns true (components/floral/floral-art.css).
 */
import { useId, type CSSProperties } from 'react';
import { type ArtProps, delayStyle, useArt } from '../../../components/floral/art';
import { Sparkle } from '../../../components/floral/pieces';

/** An id that SVG's url(#…) references accept (React's own ids carry punctuation). */
function useSvgId(): string {
  return `aurora${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
}

const TIARA_GEMS: [number, number, number, string, number][] = [
  [80, 15, 5.5, '--aurora-pink', 1.3],
  [40, 41, 3.5, '--aurora-violet', 1.5],
  [120, 41, 3.5, '--aurora-violet', 1.5],
  [58, 60, 2.6, '--aurora-peach', 1.7],
  [102, 60, 2.6, '--aurora-peach', 1.7],
  [80, 52, 3.2, '--aurora-mint', 1.9],
];

/** A tiara: the frame and its filigree draw themselves, the gems are set one after another and sparkles twinkle. */
export function Tiara({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<SVGSVGElement>(art);
  const stroke = { stroke: 'var(--primary)', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  return (
    <svg ref={ref} viewBox="0 0 160 90" className={`${className} ${artClass}`} style={artStyle} fill="none" aria-hidden="true">
      <path
        className="floral-stem"
        pathLength={1}
        style={delayStyle(0)}
        d="M24 66 C 30 54, 36 47, 40 41 C 44 51, 50 57, 58 57 C 62 44, 68 31, 80 15 C 92 31, 98 44, 102 57 C 110 57, 116 51, 120 41 C 124 47, 130 54, 136 66"
        strokeWidth="1.6"
        {...stroke}
      />
      <path className="floral-stem" pathLength={1} style={delayStyle(0.3)} d="M20 74 Q 80 88 140 74" strokeWidth="1.6" {...stroke} />
      <path className="floral-stem" pathLength={1} style={delayStyle(0.4)} d="M24 66 Q 80 80 136 66" strokeWidth="1" {...stroke} />
      <path className="floral-stem" pathLength={1} style={delayStyle(0.8)} d="M66 68 Q 80 40 94 68" strokeWidth="0.9" {...stroke} />
      <path className="floral-stem" pathLength={1} style={delayStyle(0.9)} d="M44 66 Q 50 54 58 62 M116 66 Q 110 54 102 62" strokeWidth="0.9" {...stroke} />
      {TIARA_GEMS.map(([cx, cy, r, color, delay]) => (
        <circle
          key={`${cx}-${cy}`}
          className="floral-pop"
          style={delayStyle(delay)}
          cx={cx}
          cy={cy}
          r={r}
          fill={`var(${color})`}
          stroke="var(--primary)"
          strokeWidth="0.8"
        />
      ))}
      {[30, 50, 70, 90, 110, 130].map((x, index) => (
        <circle key={x} className="floral-pop" style={delayStyle(2 + index * 0.08)} cx={x} cy={74 + Math.sin((x / 160) * Math.PI) * 6} r="1.4" fill="var(--primary)" />
      ))}
      <Sparkle x={80} y={4} scale={0.55} delay={2.2} color="var(--aurora-pink)" />
      <Sparkle x={12} y={34} scale={0.6} delay={2.6} color="var(--aurora-violet)" />
      <Sparkle x={148} y={30} scale={0.5} delay={3} color="var(--aurora-pink)" />
    </svg>
  );
}

/** One petal pointing up from the flower's center. */
const PETAL = 'M0 0 C -11 -5, -13 -21, 0 -25 C 13 -21, 11 -5, 0 0 Z';

/** A rose that grows on its stem: the stem draws itself, the leaves unfurl, then the flower opens and breathes. */
export function BloomingRose({ className = '', flip = false, ...art }: ArtProps & { flip?: boolean }) {
  const { ref, artClass, artStyle } = useArt<SVGSVGElement>(art);

  return (
    <svg
      ref={ref}
      viewBox="0 0 120 170"
      className={`${className} ${artClass}`}
      style={{ ...artStyle, ...(flip ? { transform: 'scaleX(-1)' } : {}) }}
      fill="none"
      aria-hidden="true"
    >
      <path className="floral-stem" pathLength={1} style={delayStyle(0)} d="M60 166 C 56 140, 66 112, 60 64" stroke="var(--secondary-foreground)" strokeWidth="1.4" strokeLinecap="round" />
      {(
        [
          [60, 128, -40, 0.6],
          [61, 104, 45, 0.8],
        ] as const
      ).map(([x, y, angle, delay]) => (
        <g key={y} transform={`translate(${x} ${y}) rotate(${angle})`}>
          <g className="floral-leaf" style={delayStyle(delay)}>
            <path d="M0 0 C -6 -8, -6 -20, 0 -26 C 6 -20, 6 -8, 0 0 Z" fill="var(--aurora-mint)" stroke="var(--secondary-foreground)" strokeWidth="0.8" />
            <path d="M0 -2 L 0 -22" stroke="var(--secondary-foreground)" strokeWidth="0.5" opacity="0.6" />
          </g>
        </g>
      ))}
      <g transform="translate(60 58)">
        <g className="floral-bloom" style={delayStyle(1)}>
          <g fill="var(--aurora-pink)" stroke="var(--accent-foreground)" strokeWidth="0.8" strokeLinejoin="round">
            {[0, 72, 144, 216, 288].map((angle) => (
              <path key={angle} d={PETAL} transform={`rotate(${angle})`} />
            ))}
          </g>
          <g fill="var(--accent)" stroke="var(--accent-foreground)" strokeWidth="0.7" strokeLinejoin="round">
            {[36, 108, 180, 252, 324].map((angle) => (
              <path key={angle} d={PETAL} transform={`rotate(${angle}) scale(0.66)`} />
            ))}
          </g>
          <g className="floral-bloom-heart">
            <path d="M0 0 m -5 0 a 5 5 0 1 1 5 5 a 3.4 3.4 0 1 1 -3.4 -3.4 a 1.8 1.8 0 1 1 1.8 1.8" stroke="var(--accent-foreground)" strokeWidth="0.9" strokeLinecap="round" />
          </g>
        </g>
      </g>
      <Sparkle x={22} y={40} scale={0.5} delay={2} color="var(--aurora-violet)" />
      <Sparkle x={100} y={24} scale={0.42} delay={2.5} color="var(--aurora-pink)" />
    </svg>
  );
}

/** A ribbon of aurora: two waves in violet, pink and peach that flow out from a sparkle, between sections. */
export function RibbonDivider({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<HTMLDivElement>(art);
  const id = useSvgId();

  return (
    <div ref={ref} className={`pointer-events-none flex justify-center ${className}`} aria-hidden="true">
      <svg viewBox="0 0 320 48" className={`h-auto w-[min(420px,86vw)] ${artClass}`} style={artStyle} fill="none">
        <defs>
          <linearGradient id={`${id}-ribbon`} x1="0" x2="1">
            <stop offset="0" stopColor="var(--aurora-mint)" />
            <stop offset="0.35" stopColor="var(--aurora-violet)" />
            <stop offset="0.65" stopColor="var(--aurora-pink)" />
            <stop offset="1" stopColor="var(--aurora-peach)" />
          </linearGradient>
        </defs>
        <g stroke={`url(#${id}-ribbon)`} strokeLinecap="round">
          <path className="floral-stem" pathLength={1} style={delayStyle(0.2)} d="M144 24 C 120 6, 100 6, 80 24 S 40 42, 12 24" strokeWidth="2" />
          <path className="floral-stem" pathLength={1} style={delayStyle(0.2)} d="M176 24 C 200 42, 220 42, 240 24 S 280 6, 308 24" strokeWidth="2" />
          <path className="floral-stem" pathLength={1} style={delayStyle(0.5)} d="M144 28 C 122 40, 104 38, 86 28 S 50 14, 26 26" strokeWidth="1" opacity="0.7" />
          <path className="floral-stem" pathLength={1} style={delayStyle(0.5)} d="M176 20 C 198 8, 216 10, 234 20 S 270 34, 294 22" strokeWidth="1" opacity="0.7" />
        </g>
        <g transform="translate(160 24)">
          <g className="floral-bud" style={{ ...delayStyle(0), '--sway': '12deg' } as CSSProperties}>
            <path d="M0 -12 C 1.5 -3, 3 -1.5, 12 0 C 3 1.5, 1.5 3, 0 12 C -1.5 3, -3 1.5, -12 0 C -3 -1.5, -1.5 -3, 0 -12 Z" fill="var(--primary)" />
          </g>
        </g>
        <Sparkle x={60} y={10} scale={0.4} delay={1.2} color="var(--aurora-pink)" />
        <Sparkle x={262} y={40} scale={0.4} delay={1.6} color="var(--aurora-violet)" />
      </svg>
    </div>
  );
}
