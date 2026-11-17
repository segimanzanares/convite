/*
 * Animated ornaments of the bautizo-nube template, drawn in its nursery tokens (sky, butter, blush, mint): a crib mobile
 * whose moon, stars, cloud and heart swing on their strings, sheep that hop over a fence one after another, hot-air
 * balloons and clouds that float by, and a rainbow that draws itself between two clouds. They play when they come into
 * view, or once `play` turns true (components/floral/floral-art.css and this template's theme.css).
 */
import type { CSSProperties, ReactNode } from 'react';
import { type ArtProps, delayStyle, useArt } from '../../../components/floral/art';
import { Sparkle } from '../../../components/floral/pieces';
import { cn } from '../../../components/ui/styles';

const OUTLINE = { stroke: 'var(--secondary-foreground)', strokeWidth: 1.2, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };

/** A five-pointed star of radius r around the origin. */
function starPath(r: number): string {
  return (
    Array.from({ length: 10 }, (_, index) => {
      const radius = index % 2 ? r * 0.45 : r;
      const angle = (index * Math.PI) / 5 - Math.PI / 2;
      return `${index ? 'L' : 'M'}${(radius * Math.cos(angle)).toFixed(2)} ${(radius * Math.sin(angle)).toFixed(2)}`;
    }).join(' ') + ' Z'
  );
}

const SMALL_CLOUD = 'M-18 6 C -25 6, -25 -3, -18 -4 C -18 -12, -8 -15, -3 -9 C 0 -17, 13 -17, 15 -7 C 22 -9, 26 0, 19 6 Z';
const HEART = 'M0 6 C -12 -3, -10 -15, 0 -9 C 10 -15, 12 -3, 0 6 Z';

interface HangingProps {
  x: number;
  y: number;
  /** Length of the string. */
  length: number;
  swing: number;
  every: number;
  delay: number;
  children: ReactNode;
}

/** A piece of the mobile, hanging from (x, y) on its string and swinging. */
function Hanging({ x, y, length, swing, every, delay, children }: HangingProps) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="nube-swing" style={{ ...delayStyle(delay), '--swing': `${swing}deg`, '--every': `${every}s` } as CSSProperties}>
        <path className="floral-stem" pathLength={1} style={delayStyle(delay)} d={`M0 0 L 0 ${length}`} stroke="var(--secondary-foreground)" strokeWidth="0.8" opacity="0.6" />
        <g transform={`translate(0 ${length})`}>
          <g className="floral-pop" style={delayStyle(delay + 0.5)}>
            {children}
          </g>
        </g>
      </g>
    </g>
  );
}

/** A crib mobile: the bar draws itself and its moon, stars, cloud and heart drop on their strings and swing. */
export function BabyMobile({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<SVGSVGElement>(art);

  return (
    <svg ref={ref} viewBox="0 0 240 190" className={`${className} ${artClass}`} style={artStyle} fill="none" aria-hidden="true">
      <g transform="translate(120 0)">
        <g className="nube-swing" style={{ ...delayStyle(0), '--swing': '2.5deg', '--every': '7s' } as CSSProperties}>
          <path className="floral-stem" pathLength={1} style={delayStyle(0)} d="M0 0 L 0 22" {...OUTLINE} />
          <path className="floral-stem" pathLength={1} style={delayStyle(0.2)} d="M-82 34 Q 0 12 82 34" {...OUTLINE} strokeWidth="1.6" />
          <circle className="floral-pop" style={delayStyle(0.1)} cx="0" cy="23" r="3.5" fill="var(--butter)" {...OUTLINE} />

          <Hanging x={-74} y={31} length={46} swing={9} every={4.6} delay={0.5}>
            <path d="M6 -14 A 14 14 0 1 0 6 14 A 18 18 0 0 1 6 -14 Z" fill="var(--butter)" {...OUTLINE} />
          </Hanging>
          <Hanging x={-38} y={24} length={78} swing={7} every={5.4} delay={0.7}>
            <path d={starPath(13)} fill="var(--butter)" {...OUTLINE} />
          </Hanging>
          <Hanging x={0} y={21} length={104} swing={5} every={6.2} delay={0.9}>
            <path d={SMALL_CLOUD} fill="var(--white)" {...OUTLINE} transform="scale(1.3)" />
            <circle cx="-6" cy="0" r="1.3" fill="var(--secondary-foreground)" />
            <circle cx="6" cy="0" r="1.3" fill="var(--secondary-foreground)" />
            <path d="M-3 4 Q 0 7 3 4" stroke="var(--secondary-foreground)" strokeWidth="1" strokeLinecap="round" />
          </Hanging>
          <Hanging x={38} y={24} length={66} swing={8} every={5} delay={1.1}>
            <path d={starPath(11)} fill="var(--mint)" {...OUTLINE} />
          </Hanging>
          <Hanging x={74} y={31} length={50} swing={10} every={4.2} delay={1.3}>
            <path d={HEART} fill="var(--blush)" {...OUTLINE} transform="scale(1.1)" />
          </Hanging>
        </g>
      </g>
      <Sparkle x={20} y={90} scale={0.5} delay={2.2} color="var(--butter)" />
      <Sparkle x={222} y={120} scale={0.45} delay={2.8} color="var(--sky)" />
    </svg>
  );
}

/** A woolly sheep with its feet on the origin, facing right. */
function Sheep() {
  return (
    <g>
      <path d="M-10 -2 L -10 -9 M-3 -2 L -3 -9 M6 -2 L 6 -9 M12 -2 L 12 -9" stroke="var(--foreground)" strokeWidth="2.6" strokeLinecap="round" />
      {[
        [-12, -16],
        [-4, -21],
        [5, -21],
        [12, -15],
        [4, -11],
        [-6, -11],
      ].map(([cx, cy]) => (
        <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="7" fill="var(--white)" {...OUTLINE} />
      ))}
      <ellipse cx="0" cy="-16" rx="13" ry="7" fill="var(--white)" />
      <ellipse cx="19" cy="-19" rx="5.5" ry="6.5" fill="var(--foreground)" transform="rotate(20 19 -19)" />
      <ellipse cx="15" cy="-23" rx="4" ry="1.8" fill="var(--foreground)" transform="rotate(-30 15 -23)" />
      <circle cx="21" cy="-20" r="0.9" fill="var(--white)" />
    </g>
  );
}

/** Sheep hopping over a fence one after another, under a moon and twinkling stars: counting sheep until the big day. */
export function CountingSheep({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<SVGSVGElement>(art);

  return (
    <svg ref={ref} viewBox="0 0 260 110" className={`${className} ${artClass}`} style={artStyle} fill="none" aria-hidden="true">
      <path className="floral-stem" pathLength={1} style={delayStyle(0)} d="M14 96 C 80 90, 180 90, 246 96" stroke="var(--mint)" strokeWidth="3" strokeLinecap="round" />
      <g className="floral-pop" style={delayStyle(0.3)}>
        <path d="M122 96 L 122 66 M146 96 L 146 66 M114 74 L 154 74 M114 86 L 154 86" stroke="var(--accent-foreground)" strokeWidth="3" strokeLinecap="round" />
      </g>
      {[0, 1.6, 3.2].map((offset) => (
        <g key={offset} transform="translate(52 94)">
          <g className="nube-hop" style={delayStyle(0.8 + offset)}>
            <Sheep />
          </g>
        </g>
      ))}
      <path className="floral-pop" style={delayStyle(0.4)} d="M212 14 A 13 13 0 1 0 212 40 A 17 17 0 0 1 212 14 Z" fill="var(--butter)" {...OUTLINE} />
      <Sparkle x={40} y={24} scale={0.5} delay={1} color="var(--butter)" />
      <Sparkle x={168} y={16} scale={0.4} delay={1.6} color="var(--sky)" />
      <Sparkle x={96} y={36} scale={0.35} delay={2.2} color="var(--butter)" />
    </svg>
  );
}

interface BalloonProps {
  className?: string;
  /** The envelope's main color token. */
  color: string;
  stripe: string;
  every?: number;
  wait?: number;
}

/** A hot-air balloon that bobs and sways on the breeze. */
export function Balloon({ className, color, stripe, every = 7, wait = 0 }: BalloonProps) {
  return (
    <svg
      viewBox="0 0 60 90"
      className={cn('nube-float pointer-events-none', className)}
      style={{ '--every': `${every}s`, '--wait': `${wait}s` } as CSSProperties}
      fill="none"
      aria-hidden="true"
    >
      <path d="M30 4 C 12 4, 4 18, 4 30 C 4 44, 18 52, 24 60 L 36 60 C 42 52, 56 44, 56 30 C 56 18, 48 4, 30 4 Z" fill={`var(${color})`} {...OUTLINE} />
      <path d="M30 4 C 22 12, 20 40, 26 60 M30 4 C 38 12, 40 40, 34 60" fill={`var(${stripe})`} stroke="var(--secondary-foreground)" strokeWidth="1" />
      <path d="M24 60 L 23 72 M36 60 L 37 72" stroke="var(--secondary-foreground)" strokeWidth="0.9" />
      <rect x="21" y="72" width="18" height="12" rx="3" fill="var(--accent-foreground)" opacity="0.8" />
    </svg>
  );
}

const PUFF = 'M-50 12 C -63 12, -64 -6, -50 -8 C -50 -24, -28 -31, -18 -18 C -12 -35, 16 -37, 22 -16 C 34 -27, 57 -16, 50 0 C 64 2, 63 12, 50 12 Z';

/** [left %, top %, width in px, opacity, seconds per drift, drift in px]. */
const PUFFS = [
  [-4, 10, 180, 0.95, 30, 70],
  [70, 6, 150, 0.85, 26, -60],
  [80, 62, 200, 0.7, 34, -80],
  [2, 70, 140, 0.7, 24, 50],
] as const;

/** Puffy clouds drifting behind a section's content. */
export function CloudPuffs({ className, count = PUFFS.length }: { className?: string; count?: number }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      {PUFFS.slice(0, count).map(([left, top, width, opacity, every, dx], index) => (
        <svg
          key={`${left}-${top}`}
          viewBox="-66 -40 132 56"
          className="nube-drift absolute h-auto"
          style={{ left: `${left}%`, top: `${top}%`, width, opacity, '--every': `${every}s`, '--dx': `${dx}px`, '--wait': `${index * -5}s` } as CSSProperties}
        >
          <path d={PUFF} fill="var(--white)" stroke="var(--border)" strokeWidth="1.5" />
        </svg>
      ))}
    </div>
  );
}

const RAINBOW_BANDS = ['--blush', '--butter', '--mint', '--sky', '--lilac'];

/** A rainbow that draws itself band by band between two clouds that pop in. */
export function Rainbow({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<SVGSVGElement>(art);

  return (
    <svg ref={ref} viewBox="0 0 220 120" className={`${className} ${artClass}`} style={artStyle} fill="none" aria-hidden="true">
      {RAINBOW_BANDS.map((color, index) => {
        const radius = 84 - index * 9;
        return (
          <path
            key={color}
            className="floral-stem"
            pathLength={1}
            style={delayStyle(0.2 + index * 0.15)}
            d={`M${110 - radius} 100 A ${radius} ${radius} 0 0 1 ${110 + radius} 100`}
            stroke={`var(${color})`}
            strokeWidth="9"
            strokeLinecap="round"
          />
        );
      })}
      {/* The scale lives on the wrapper: floral-pop's CSS transform would replace a transform attribute. */}
      <g transform="translate(30 100) scale(1.4)">
        <path className="floral-pop" style={delayStyle(0)} d={SMALL_CLOUD} fill="var(--white)" {...OUTLINE} />
      </g>
      <g transform="translate(190 100) scale(1.4)">
        <path className="floral-pop" style={delayStyle(0.1)} d={SMALL_CLOUD} fill="var(--white)" {...OUTLINE} />
      </g>
      <Sparkle x={110} y={8} scale={0.55} delay={1.4} color="var(--butter)" />
      <Sparkle x={20} y={40} scale={0.4} delay={1.8} color="var(--sky)" />
      <Sparkle x={200} y={36} scale={0.4} delay={2.2} color="var(--blush)" />
    </svg>
  );
}
