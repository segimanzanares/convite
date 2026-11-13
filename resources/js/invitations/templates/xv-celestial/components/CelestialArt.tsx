/*
 * Moonlit line-art ornaments of the xv-celestial template: a crescent moon that draws itself and lights up, a
 * constellation shaped like a tiara, the phases of the moon between sections, stars hanging on threads and shooting
 * stars. They play when they come into view, or once `play` turns true (components/floral/floral-art.css); the
 * shooting stars and the portrait's orbit are animated by theme.css.
 */
import { useId, type CSSProperties } from 'react';
import { type ArtProps, delayStyle, useArt } from '../../../components/floral/art';
import { Sparkle } from '../../../components/floral/pieces';

/** A five-pointed star around (0, 0), `radius` units from the center to each point. */
function starPath(radius: number): string {
  const points = Array.from({ length: 10 }, (_, index) => {
    const angle = (index * Math.PI) / 5 - Math.PI / 2;
    const length = index % 2 === 0 ? radius : radius * 0.45;
    return `${(Math.cos(angle) * length).toFixed(2)} ${(Math.sin(angle) * length).toFixed(2)}`;
  });

  return `M${points.join(' L ')} Z`;
}

/** An id that SVG's url(#…) references accept (React's own ids carry punctuation). */
function useSvgId(): string {
  return `celestial${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
}

/**
 * A crescent moon with its craters and a star hanging from a thread: the outline draws itself, then the moon lights
 * up and glows softly while small stars twinkle around it.
 */
export function CrescentMoon({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<SVGSVGElement>(art);
  const id = useSvgId();

  return (
    <svg ref={ref} viewBox="0 0 160 160" className={`${className} ${artClass}`} style={artStyle} fill="none" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-halo`}>
          <stop offset="0.45" stopColor="var(--gold-light)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--gold-light)" stopOpacity="0" />
        </radialGradient>
        <mask id={`${id}-shadow`}>
          <rect width="160" height="160" fill="white" />
          <circle cx="100" cy="64" r="40" fill="black" />
        </mask>
        <mask id={`${id}-disc`}>
          <circle cx="80" cy="80" r="46" fill="white" />
        </mask>
      </defs>
      <g className="floral-pop" style={delayStyle(1.1)}>
        <circle className="celestial-glow" cx="66" cy="94" r="62" fill={`url(#${id}-halo)`} />
      </g>
      <circle className="floral-pop" style={delayStyle(0.9)} cx="80" cy="80" r="46" fill="var(--gold-light)" mask={`url(#${id}-shadow)`} />
      <g fill="var(--gold)" opacity="0.35">
        {[
          [55, 90, 6, 1.4],
          [66, 112, 4, 1.55],
          [48, 70, 3, 1.7],
          [76, 124, 2.5, 1.8],
        ].map(([cx, cy, r, delay]) => (
          <circle key={`${cx}-${cy}`} className="floral-pop" style={delayStyle(delay)} cx={cx} cy={cy} r={r} />
        ))}
      </g>
      <g stroke="var(--gold-pale)" strokeWidth="1.2" strokeLinecap="round">
        <circle className="floral-stem" pathLength={1} style={delayStyle(0)} cx="80" cy="80" r="46" mask={`url(#${id}-shadow)`} />
        <circle className="floral-stem" pathLength={1} style={delayStyle(0.3)} cx="100" cy="64" r="40" mask={`url(#${id}-disc)`} />
      </g>
      <g transform="translate(134 0)">
        <g className="floral-bud" style={{ ...delayStyle(1.6), '--sway': '8deg' } as CSSProperties}>
          <path d="M0 0 L 0 34" stroke="var(--gold-light)" strokeWidth="0.7" opacity="0.7" />
          <path d={starPath(8)} transform="translate(0 42)" fill="var(--gold-light)" />
        </g>
      </g>
      <Sparkle x={18} y={34} scale={0.7} delay={1.9} />
      <Sparkle x={146} y={118} scale={0.55} delay={2.4} />
      <Sparkle x={26} y={146} scale={0.45} delay={2.8} />
    </svg>
  );
}

const CROWN_STARS: [number, number, number][] = [
  [14, 86, 2.2],
  [40, 52, 2.6],
  [66, 74, 2],
  [100, 20, 3.4],
  [134, 74, 2],
  [160, 52, 2.6],
  [186, 86, 2.2],
];

/** A constellation shaped like a tiara: the stars appear one by one, then the lines join them. */
export function CrownConstellation({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<SVGSVGElement>(art);
  const lines = CROWN_STARS.slice(1).map(([x, y], index) => `M${CROWN_STARS[index][0]} ${CROWN_STARS[index][1]} L ${x} ${y}`);

  return (
    <svg ref={ref} viewBox="0 0 200 110" className={`${className} ${artClass}`} style={artStyle} fill="none" aria-hidden="true">
      <g stroke="var(--gold-light)" strokeWidth="0.8" strokeLinecap="round" opacity="0.55">
        {lines.map((line, index) => (
          <path key={line} className="floral-stem" pathLength={1} style={delayStyle(1.2 + index * 0.25)} d={line} />
        ))}
        <path className="floral-stem" pathLength={1} style={delayStyle(2.8)} d="M14 86 Q 100 104 186 86" />
      </g>
      <g fill="var(--gold-light)">
        {CROWN_STARS.map(([x, y, r], index) => (
          <circle key={`${x}-${y}`} className="floral-pop" style={delayStyle(index * 0.15)} cx={x} cy={y} r={r} />
        ))}
      </g>
      <Sparkle x={100} y={20} scale={1.1} delay={1.4} />
      <Sparkle x={40} y={52} scale={0.6} delay={2.2} />
      <Sparkle x={160} y={52} scale={0.6} delay={2.6} />
    </svg>
  );
}

/** Fixed streaks: [top %, left %, seconds between passes, seconds before the first]. */
const STREAKS = [
  [12, 78, 9, 3],
  [30, 96, 13, 7.5],
  [6, 48, 17, 12],
] as const;

/** Shooting stars that cross the night sky every few seconds. */
export function ShootingStars() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {STREAKS.map(([top, left, every, wait]) => (
        <span
          key={`${top}-${left}`}
          className="celestial-shooting-star"
          style={{ top: `${top}%`, left: `${left}%`, '--angle': '160deg', '--every': `${every}s`, '--wait': `${wait}s` } as CSSProperties}
        />
      ))}
    </div>
  );
}

/** The lit part of each phase: how far the shadow slides off the disc (null is the full moon). */
const PHASES = [5, 10, null, -10, -5];

/** The phases of the moon, from crescent to full and back, between two rules that draw themselves. */
export function MoonPhasesDivider({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<HTMLDivElement>(art);
  const id = useSvgId();

  return (
    <div ref={ref} className={`flex justify-center pointer-events-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 300 40" className={`w-[min(380px,84vw)] h-auto ${artClass}`} style={artStyle} fill="none">
        <defs>
          {PHASES.map((shift, index) =>
            shift === null ? null : (
              <mask key={index} id={`${id}-phase${index}`}>
                <rect width="300" height="40" fill="white" />
                <circle cx={90 + index * 30 + shift} cy="20" r="7.5" fill="black" />
              </mask>
            ),
          )}
        </defs>
        <g stroke="var(--gold)" strokeWidth="0.9" strokeLinecap="round">
          <path className="floral-stem" pathLength={1} style={delayStyle(0.6)} d="M72 20 L 18 20" />
          <path className="floral-stem" pathLength={1} style={delayStyle(0.6)} d="M228 20 L 282 20" />
        </g>
        {PHASES.map((shift, index) => {
          const cx = 90 + index * 30;
          return (
            <g key={index} className="floral-pop" style={delayStyle(Math.abs(index - 2) * 0.18)}>
              <circle cx={cx} cy="20" r="7" stroke="var(--gold)" strokeWidth="0.8" fill="var(--gold-pale)" />
              <circle cx={cx} cy="20" r="7" fill="var(--gold)" mask={shift === null ? undefined : `url(#${id}-phase${index})`} />
            </g>
          );
        })}
        <path className="floral-pop" style={delayStyle(1.2)} d="M14 20 L 18 16 L 22 20 L 18 24 Z" fill="var(--gold)" />
        <path className="floral-pop" style={delayStyle(1.2)} d="M278 20 L 282 16 L 286 20 L 282 24 Z" fill="var(--gold)" />
        <Sparkle x={150} y={5} scale={0.45} delay={1.4} color="var(--gold)" />
      </svg>
    </div>
  );
}

/** Threads hanging from the top: [x, length, star radius, sway in degrees, delay]. */
const THREADS = [
  [18, 118, 9, 6, 0],
  [56, 64, 6.5, 9, 0.35],
  [96, 158, 11, 5, 0.15],
  [136, 92, 7, 8, 0.5],
  [176, 132, 8.5, 6, 0.25],
] as const;

/** Stars hanging on threads that drop down and then swing gently, for the top of a section. */
export function HangingStars({ className = '', flip = false, ...art }: ArtProps & { flip?: boolean }) {
  const { ref, artClass, artStyle } = useArt<SVGSVGElement>(art);

  return (
    <svg
      ref={ref}
      viewBox="0 0 200 190"
      className={`${className} ${artClass}`}
      style={{ ...artStyle, ...(flip ? { transform: 'scaleX(-1)' } : {}) }}
      fill="none"
      aria-hidden="true"
    >
      {THREADS.map(([x, length, radius, sway, delay]) => (
        <g key={x} transform={`translate(${x} 0)`}>
          <g className="floral-bud" style={{ ...delayStyle(delay), '--sway': `${sway}deg` } as CSSProperties}>
            <path d={`M0 0 L 0 ${length}`} stroke="var(--gold)" strokeWidth="0.7" opacity="0.55" />
            <circle cy={length * 0.45} r="1.2" fill="var(--gold)" opacity="0.6" />
            <path d={starPath(radius)} transform={`translate(0 ${length + radius * 0.8})`} fill="var(--gold-light)" stroke="var(--gold)" strokeWidth="0.8" strokeLinejoin="round" />
          </g>
        </g>
      ))}
    </svg>
  );
}
