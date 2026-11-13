/*
 * Hand-drawn flower ornaments of the boda-floral template. They are colored by the theme's tokens: petals in
 * the rose shades (--gold-light, --gold, --gold-deep) and leaves in the sage ones (--leaf, --leaf-deep).
 *
 * They grow when they come into view (or when `play` turns true): the stems draw themselves, the leaves unfurl
 * and the roses open, each after its own delay. Then the roses breathe, the buds nod and the leaves rustle
 * (components/floral/floral-art.css).
 */
import { type ArtProps, delayStyle, useArt } from '../../../components/floral/art';

interface BloomProps {
  x: number;
  y: number;
  /** 1 draws a bloom about 44 units wide. */
  scale?: number;
  rotate?: number;
  delay?: number;
}

/** A garden rose seen from above: two rings of petals around a tight center. */
function Bloom({ x, y, scale = 1, rotate = 0, delay = 0 }: BloomProps) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <g className="floral-bloom" style={delayStyle(delay)}>
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={`o${angle}`}
            cx="0"
            cy="-11"
            rx="10"
            ry="13"
            transform={`rotate(${angle})`}
            fill="var(--gold-light)"
            stroke="var(--gold-deep)"
            strokeWidth="0.6"
            strokeOpacity="0.35"
          />
        ))}
        <g className="floral-bloom-heart">
          {[36, 108, 180, 252, 324].map((angle) => (
            <ellipse key={`m${angle}`} cx="0" cy="-7" rx="7" ry="9" transform={`rotate(${angle})`} fill="var(--gold)" opacity="0.85" />
          ))}
          <circle r="6.5" fill="var(--gold-deep)" />
          <path d="M-3 -1 C -3 -4, 2 -5, 3 -1 C 4 2, 0 4, -2 2" stroke="var(--gold-light)" strokeWidth="1" fill="none" />
        </g>
      </g>
    </g>
  );
}

interface LeafProps {
  x: number;
  y: number;
  rotate: number;
  length?: number;
  deep?: boolean;
  delay?: number;
}

/** A pointed leaf with its midrib, growing from (x, y) in the given direction. */
function Leaf({ x, y, rotate, length = 30, deep = false, delay = 0 }: LeafProps) {
  const half = length / 2;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <g className="floral-leaf" style={delayStyle(delay)}>
        <path
          d={`M0 0 C ${half * 0.4} ${-half * 0.45}, ${half * 1.3} ${-half * 0.45}, ${length} 0 C ${half * 1.3} ${half * 0.45}, ${half * 0.4} ${half * 0.45}, 0 0 Z`}
          fill={deep ? 'var(--leaf-deep)' : 'var(--leaf)'}
        />
        <path d={`M2 0 L ${length - 4} 0`} stroke="var(--white)" strokeWidth="0.6" opacity="0.5" />
      </g>
    </g>
  );
}

/** A closed bud on its stem. */
function Bud({ x, y, rotate, delay = 0 }: { x: number; y: number; rotate: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <g className="floral-bud" style={delayStyle(delay)}>
        <path d="M0 0 L 0 -12" stroke="var(--leaf-deep)" strokeWidth="1" />
        <path d="M0 -10 C -5 -13, -5 -21, 0 -24 C 5 -21, 5 -13, 0 -10 Z" fill="var(--gold)" />
        <path d="M0 -10 C -4 -12, -5 -15, -4 -17 M0 -10 C 4 -12, 5 -15, 4 -17" stroke="var(--leaf-deep)" strokeWidth="1.2" fill="none" />
      </g>
    </g>
  );
}

/** Small round berries along a sprig. */
function Berries({ x, y, rotate, delay = 0 }: { x: number; y: number; rotate: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <g className="floral-berries" style={delayStyle(delay)}>
        <path d="M0 0 C 6 -4, 12 -4, 20 -2" stroke="var(--leaf-deep)" strokeWidth="0.8" fill="none" />
        <circle cx="9" cy="-6" r="2" fill="var(--gold-deep)" opacity="0.7" />
        <circle cx="15" cy="-6.5" r="2" fill="var(--gold-deep)" opacity="0.7" />
        <circle cx="21" cy="-3" r="2" fill="var(--gold-deep)" opacity="0.7" />
      </g>
    </g>
  );
}

/** A stem that draws itself from its start. */
function Stem({ d, width = 1, delay = 0 }: { d: string; width?: number; delay?: number }) {
  return (
    <path
      d={d}
      pathLength={1}
      className="floral-stem"
      style={delayStyle(delay)}
      stroke="var(--leaf-deep)"
      strokeWidth={width}
      fill="none"
      opacity="0.7"
    />
  );
}

/** One half of the garland (the right one); the left half is its mirror image. */
function SprayHalf() {
  return (
    <>
      <Stem d="M180 50 C 215 44, 255 46, 300 36" delay={0.1} />
      <Leaf x={198} y={48} rotate={-28} length={34} delay={0.35} />
      <Leaf x={204} y={50} rotate={22} length={30} deep delay={0.45} />
      <Leaf x={240} y={45} rotate={-24} length={28} deep delay={0.65} />
      <Leaf x={246} y={46} rotate={18} length={26} delay={0.75} />
      <Leaf x={278} y={40} rotate={-14} length={24} delay={0.95} />
      <Bloom x={226} y={44} scale={0.55} rotate={20} delay={0.7} />
      <Bud x={262} y={44} rotate={60} delay={1.05} />
      <Berries x={284} y={39} rotate={-12} delay={1.15} />
    </>
  );
}

/** A horizontal garland with a rose in the middle, used between sections. */
export function FloralSpray({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<HTMLDivElement>(art);

  return (
    <div ref={ref} className={`flex justify-center pointer-events-none ${className}`} aria-hidden="true">
      <svg
        viewBox="0 0 360 96"
        className={`w-[min(440px,88vw)] h-auto ${artClass}`}
        style={artStyle}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <SprayHalf />
        <g transform="translate(360 0) scale(-1 1)">
          <SprayHalf />
        </g>
        <Leaf x={168} y={58} rotate={150} length={30} deep delay={0.2} />
        <Leaf x={192} y={58} rotate={30} length={30} deep delay={0.2} />
        <Bloom x={160} y={46} scale={0.6} rotate={-15} delay={0.4} />
        <Bloom x={200} y={46} scale={0.6} rotate={25} delay={0.5} />
        <Bloom x={180} y={44} scale={0.85} delay={0.15} />
      </svg>
    </div>
  );
}

/** A cluster of roses, leaves and buds for a corner, drawn for the top-left one. It sways from that corner. */
export function CornerBouquet({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<SVGSVGElement>(art);

  return (
    <svg
      ref={ref}
      viewBox="0 0 260 260"
      className={`${className} ${artClass}`}
      style={artStyle}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <g className="floral-sway">
        <Stem d="M10 70 C 60 60, 110 40, 170 6" width={1.2} />
        <Stem d="M70 10 C 60 60, 40 110, 6 170" width={1.2} delay={0.1} />
        <Leaf x={70} y={58} rotate={-30} length={58} delay={0.2} />
        <Leaf x={92} y={50} rotate={-62} length={46} deep delay={0.35} />
        <Leaf x={120} y={36} rotate={-20} length={50} delay={0.55} />
        <Leaf x={150} y={20} rotate={-42} length={40} deep delay={0.75} />
        <Leaf x={58} y={70} rotate={120} length={58} delay={0.25} />
        <Leaf x={50} y={92} rotate={152} length={46} deep delay={0.4} />
        <Leaf x={36} y={120} rotate={110} length={50} delay={0.6} />
        <Leaf x={20} y={150} rotate={132} length={40} deep delay={0.8} />
        <Leaf x={64} y={64} rotate={45} length={64} deep delay={0.3} />
        <Leaf x={80} y={80} rotate={30} length={44} delay={0.45} />
        <Leaf x={80} y={80} rotate={62} length={44} delay={0.5} />
        <Bud x={168} y={14} rotate={60} delay={1.1} />
        <Bud x={14} y={168} rotate={-150} delay={1.2} />
        <Berries x={132} y={34} rotate={-30} delay={1} />
        <Berries x={34} y={132} rotate={120} delay={1.05} />
        <Bloom x={112} y={48} scale={0.8} rotate={10} delay={0.7} />
        <Bloom x={48} y={112} scale={0.8} rotate={-20} delay={0.8} />
        <Bloom x={62} y={62} scale={1.35} delay={0.45} />
        <Bloom x={102} y={100} scale={0.55} rotate={40} delay={0.95} />
      </g>
    </svg>
  );
}
