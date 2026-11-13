/*
 * Animated illustrations of the xv-disco template: a mirror ball that drops in on its chain, sways and turns while its
 * rays sweep the room, an equalizer, spotlights and music notes. The ball plays when it comes into view, or once
 * `play` turns true (components/floral/floral-art.css); the rest loops on its own (theme.css).
 */
import { useId, type CSSProperties } from 'react';
import { type ArtProps, delayStyle, useArt } from '../../../components/floral/art';
import { Sparkle } from '../../../components/floral/pieces';
import { cn } from '../../../components/ui/styles';

/** An id that SVG's url(#…) references accept (React's own ids carry punctuation). */
function useSvgId(): string {
  return `disco${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
}

/** Deterministic pseudo-random in [0, 1), so the pieces render the same every time. */
function seeded(index: number, salt: number): number {
  const x = Math.sin(index * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

/** The mirror's tiles, one row of the pattern: [x, y, fill]. The pattern is 36 units wide, as far as a turn slides. */
const TILES: [number, number, string][] = [
  [0, 0, 'oklch(0.9 0.02 300)'],
  [12, 0, 'oklch(0.62 0.05 300)'],
  [24, 0, 'oklch(0.78 0.08 345)'],
  [0, 12, 'oklch(0.5 0.06 300)'],
  [12, 12, 'oklch(0.86 0.08 200)'],
  [24, 12, 'oklch(0.7 0.04 300)'],
];

const RAY_COLORS = ['var(--neon-pink)', 'var(--neon-cyan)', 'var(--neon-gold)', 'var(--neon-violet)'];

/** A mirror ball hanging from its chain: it drops in, then sways and turns, with rays of light sweeping around it. */
export function DiscoBall({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<SVGSVGElement>(art);
  const id = useSvgId();

  return (
    <svg ref={ref} viewBox="0 0 240 250" className={`${className} ${artClass}`} style={artStyle} fill="none" aria-hidden="true">
      <defs>
        <pattern id={`${id}-tiles`} width="36" height="24" patternUnits="userSpaceOnUse">
          {TILES.map(([x, y, fill]) => (
            <rect key={`${x}-${y}`} x={x + 0.6} y={y + 0.6} width="10.8" height="10.8" rx="1.2" fill={fill} />
          ))}
        </pattern>
        <radialGradient id={`${id}-shade`} cx="0.36" cy="0.3" r="0.8">
          <stop offset="0" stopColor="white" stopOpacity="0.55" />
          <stop offset="0.45" stopColor="white" stopOpacity="0" />
          <stop offset="1" stopColor="black" stopOpacity="0.6" />
        </radialGradient>
        <clipPath id={`${id}-ball`}>
          <circle r="58" />
        </clipPath>
      </defs>
      <g transform="translate(120 0)">
        <g className="floral-bud" style={{ ...delayStyle(0), '--sway': '3deg' } as CSSProperties}>
          <path d="M0 0 L 0 70" stroke="var(--muted-foreground)" strokeWidth="1.2" strokeDasharray="3 2" />
          <rect x="-6" y="68" width="12" height="7" rx="1.5" fill="var(--muted-foreground)" />
          <g transform="translate(0 134)">
            <g className="disco-rays" opacity="0.55">
              {Array.from({ length: 16 }, (_, index) => {
                const angle = (index / 16) * Math.PI * 2;
                const length = index % 2 ? 96 : 116;
                return (
                  <path
                    key={index}
                    d={`M${Math.cos(angle) * 66} ${Math.sin(angle) * 66} L ${Math.cos(angle) * length} ${Math.sin(angle) * length}`}
                    stroke={RAY_COLORS[index % RAY_COLORS.length]}
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                );
              })}
            </g>
            <g clipPath={`url(#${id}-ball)`}>
              <circle r="58" fill="oklch(0.4 0.04 300)" />
              <g className="disco-tiles">
                <rect x="-58" y="-58" width="160" height="116" fill={`url(#${id}-tiles)`} />
              </g>
              <circle r="58" fill={`url(#${id}-shade)`} />
            </g>
            <circle r="58" stroke="oklch(1 0 0 / 0.25)" strokeWidth="1" />
            <Sparkle x={-24} y={-30} scale={1.1} delay={0.8} color="white" />
            <Sparkle x={28} y={-6} scale={0.7} delay={1.4} color="var(--neon-cyan)" />
            <Sparkle x={-6} y={30} scale={0.6} delay={2} color="var(--neon-pink)" />
          </g>
        </g>
      </g>
    </svg>
  );
}

/** Bars of an equalizer that bounce to the music, painted pink to cyan. `className` sets its height (h-12 without one). */
export function Equalizer({ bars = 28, className }: { bars?: number; className?: string }) {
  return (
    <div className={cn('flex items-end justify-center gap-[3px]', className ?? 'h-12')} aria-hidden="true">
      {Array.from({ length: bars }, (_, index) => (
        <span
          key={index}
          className="disco-bar w-1.5 rounded-full bg-[linear-gradient(to_top,var(--neon-pink),var(--neon-violet),var(--neon-cyan))]"
          style={
            {
              height: `${40 + seeded(index, 1) * 60}%`,
              '--every': `${0.45 + seeded(index, 2) * 0.7}s`,
              '--wait': `${-seeded(index, 3) * 2}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** Two cones of light, pink and cyan, sweeping the room from the top corners. */
export function Spotlights() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <span
        className="disco-spotlight left-[-12%] bg-[linear-gradient(to_bottom,var(--neon-pink),transparent_85%)]"
        style={{ '--from': '-30deg', '--to': '12deg', '--every': '7s' } as CSSProperties}
      />
      <span
        className="disco-spotlight right-[-12%] bg-[linear-gradient(to_bottom,var(--neon-cyan),transparent_85%)]"
        style={{ '--from': '28deg', '--to': '-14deg', '--every': '9s' } as CSSProperties}
      />
    </div>
  );
}

const NOTES = ['♪', '♫', '♬', '♩'];

/** Music notes that rise and fade from the bottom of a section. */
export function FloatingNotes({ count = 10 }: { count?: number }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <span
          key={index}
          className={cn('disco-note text-2xl', index % 2 ? 'text-(--neon-cyan)' : 'text-(--neon-pink)')}
          style={
            {
              left: `${5 + seeded(index, 4) * 90}%`,
              fontSize: `${18 + seeded(index, 5) * 18}px`,
              '--every': `${5 + seeded(index, 6) * 4}s`,
              '--wait': `${seeded(index, 7) * 6}s`,
              '--drift': `${(seeded(index, 8) - 0.5) * 80}px`,
              '--turn': `${(seeded(index, 9) - 0.5) * 60}deg`,
            } as CSSProperties
          }
        >
          {NOTES[index % NOTES.length]}
        </span>
      ))}
    </div>
  );
}
