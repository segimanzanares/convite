/*
 * Hand-drawn flower ornaments of the boda-floral template. They are colored by the theme's tokens: petals in
 * the rose shades (--gold-light, --gold, --gold-deep) and leaves in the sage ones (--leaf, --leaf-deep).
 */

interface BloomProps {
  x: number;
  y: number;
  /** 1 draws a bloom about 44 units wide. */
  scale?: number;
  rotate?: number;
}

/** A garden rose seen from above: two rings of petals around a tight center. */
function Bloom({ x, y, scale = 1, rotate = 0 }: BloomProps) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
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
      {[36, 108, 180, 252, 324].map((angle) => (
        <ellipse key={`m${angle}`} cx="0" cy="-7" rx="7" ry="9" transform={`rotate(${angle})`} fill="var(--gold)" opacity="0.85" />
      ))}
      <circle r="6.5" fill="var(--gold-deep)" />
      <path d="M-3 -1 C -3 -4, 2 -5, 3 -1 C 4 2, 0 4, -2 2" stroke="var(--gold-light)" strokeWidth="1" fill="none" />
    </g>
  );
}

interface LeafProps {
  x: number;
  y: number;
  rotate: number;
  length?: number;
  deep?: boolean;
}

/** A pointed leaf with its midrib, growing from (x, y) in the given direction. */
function Leaf({ x, y, rotate, length = 30, deep = false }: LeafProps) {
  const half = length / 2;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <path
        d={`M0 0 C ${half * 0.4} ${-half * 0.45}, ${half * 1.3} ${-half * 0.45}, ${length} 0 C ${half * 1.3} ${half * 0.45}, ${half * 0.4} ${half * 0.45}, 0 0 Z`}
        fill={deep ? 'var(--leaf-deep)' : 'var(--leaf)'}
      />
      <path d={`M2 0 L ${length - 4} 0`} stroke="var(--white)" strokeWidth="0.6" opacity="0.5" />
    </g>
  );
}

/** A closed bud on its stem. */
function Bud({ x, y, rotate }: { x: number; y: number; rotate: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <path d="M0 0 L 0 -12" stroke="var(--leaf-deep)" strokeWidth="1" />
      <path d="M0 -10 C -5 -13, -5 -21, 0 -24 C 5 -21, 5 -13, 0 -10 Z" fill="var(--gold)" />
      <path d="M0 -10 C -4 -12, -5 -15, -4 -17 M0 -10 C 4 -12, 5 -15, 4 -17" stroke="var(--leaf-deep)" strokeWidth="1.2" fill="none" />
    </g>
  );
}

/** Small round berries along a sprig. */
function Berries({ x, y, rotate }: { x: number; y: number; rotate: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <path d="M0 0 C 6 -4, 12 -4, 20 -2" stroke="var(--leaf-deep)" strokeWidth="0.8" fill="none" />
      <circle cx="9" cy="-6" r="2" fill="var(--gold-deep)" opacity="0.7" />
      <circle cx="15" cy="-6.5" r="2" fill="var(--gold-deep)" opacity="0.7" />
      <circle cx="21" cy="-3" r="2" fill="var(--gold-deep)" opacity="0.7" />
    </g>
  );
}

/** One half of the garland (the right one); the left half is its mirror image. */
function SprayHalf() {
  return (
    <>
      <path d="M180 50 C 215 44, 255 46, 300 36" stroke="var(--leaf-deep)" strokeWidth="1" fill="none" opacity="0.7" />
      <Leaf x={198} y={48} rotate={-28} length={34} />
      <Leaf x={204} y={50} rotate={22} length={30} deep />
      <Leaf x={240} y={45} rotate={-24} length={28} deep />
      <Leaf x={246} y={46} rotate={18} length={26} />
      <Leaf x={278} y={40} rotate={-14} length={24} />
      <Bloom x={226} y={44} scale={0.55} rotate={20} />
      <Bud x={262} y={44} rotate={60} />
      <Berries x={284} y={39} rotate={-12} />
    </>
  );
}

/** A horizontal garland with a rose in the middle, used between sections. */
export function FloralSpray({ className = '' }: { className?: string }) {
  return (
    <div className={`flex justify-center pointer-events-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 360 96" className="w-[min(440px,88vw)] h-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
        <SprayHalf />
        <g transform="translate(360 0) scale(-1 1)">
          <SprayHalf />
        </g>
        <Leaf x={168} y={58} rotate={150} length={30} deep />
        <Leaf x={192} y={58} rotate={30} length={30} deep />
        <Bloom x={160} y={46} scale={0.6} rotate={-15} />
        <Bloom x={200} y={46} scale={0.6} rotate={25} />
        <Bloom x={180} y={44} scale={0.85} />
      </svg>
    </div>
  );
}

/** A cluster of roses, leaves and buds for a corner, drawn for the top-left one. */
export function CornerBouquet({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 260" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10 70 C 60 60, 110 40, 170 6" stroke="var(--leaf-deep)" strokeWidth="1.2" opacity="0.7" />
      <path d="M70 10 C 60 60, 40 110, 6 170" stroke="var(--leaf-deep)" strokeWidth="1.2" opacity="0.7" />
      <Leaf x={70} y={58} rotate={-30} length={58} />
      <Leaf x={92} y={50} rotate={-62} length={46} deep />
      <Leaf x={120} y={36} rotate={-20} length={50} />
      <Leaf x={150} y={20} rotate={-42} length={40} deep />
      <Leaf x={58} y={70} rotate={120} length={58} />
      <Leaf x={50} y={92} rotate={152} length={46} deep />
      <Leaf x={36} y={120} rotate={110} length={50} />
      <Leaf x={20} y={150} rotate={132} length={40} deep />
      <Leaf x={64} y={64} rotate={45} length={64} deep />
      <Leaf x={80} y={80} rotate={30} length={44} />
      <Leaf x={80} y={80} rotate={62} length={44} />
      <Bud x={168} y={14} rotate={60} />
      <Bud x={14} y={168} rotate={-150} />
      <Berries x={132} y={34} rotate={-30} />
      <Berries x={34} y={132} rotate={120} />
      <Bloom x={112} y={48} scale={0.8} rotate={10} />
      <Bloom x={48} y={112} scale={0.8} rotate={-20} />
      <Bloom x={62} y={62} scale={1.35} />
      <Bloom x={102} y={100} scale={0.55} rotate={40} />
    </svg>
  );
}
