/*
 * Gold line-art ornaments of the boda-clasica template: interlaced rings and laurel branches that draw themselves
 * when they come into view (or once `play` turns true), with sparkles that keep twinkling
 * (components/floral/floral-art.css).
 */
import { type ArtProps, delayStyle, useArt } from '../../../components/floral/art';
import { Sparkle } from '../../../components/floral/pieces';

/** A ring's outline as a path, so it can draw itself starting from its left side. */
function ringPath(cx: number, cy: number, r: number): string {
  return `M${cx - r} ${cy} a ${r} ${r} 0 1 1 ${r * 2} 0 a ${r} ${r} 0 1 1 ${-r * 2} 0`;
}

interface LineLeafProps {
  x: number;
  y: number;
  rotate: number;
  length?: number;
  delay?: number;
  color: string;
}

/** An outlined leaf with its midrib, growing from (x, y) in the given direction. */
function LineLeaf({ x, y, rotate, length = 14, delay = 0, color }: LineLeafProps) {
  const width = length * 0.32;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <g className="floral-leaf" style={delayStyle(delay)} stroke={color} strokeWidth="0.9" fill="none">
        <path d={`M0 0 C ${length * 0.3} ${-width}, ${length * 0.75} ${-width}, ${length} 0 C ${length * 0.75} ${width}, ${length * 0.3} ${width}, 0 0 Z`} />
        <path d={`M1 0 L ${length * 0.8} 0`} strokeWidth="0.5" />
      </g>
    </g>
  );
}

/** One laurel branch (the right one), from the center outward; the left one is its mirror image. */
function Branch({ color, stem }: { color: string; stem: string }) {
  const leaves = [
    [170, 32, -1],
    [190, 31, -3],
    [210, 29, -6],
    [230, 26, -9],
    [250, 22, -13],
  ];

  return (
    <>
      <path className="floral-stem" pathLength={1} style={delayStyle(0.2)} d={stem} stroke={color} strokeWidth="1" />
      {leaves.map(([x, y, slope], index) => (
        <g key={x}>
          <LineLeaf x={x} y={y} rotate={slope - 38} length={15 - index} delay={0.4 + index * 0.15} color={color} />
          <LineLeaf x={x + 6} y={y} rotate={slope + 34} length={14 - index} delay={0.48 + index * 0.15} color={color} />
        </g>
      ))}
      <LineLeaf x={266} y={18} rotate={-14} length={11} delay={1.2} color={color} />
    </>
  );
}

/** Two interlaced wedding rings with a diamond, between laurel twigs and sparkles, for the hero. */
export function WeddingRings({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<SVGSVGElement>(art);

  return (
    <svg ref={ref} viewBox="0 0 200 100" className={`${className} ${artClass}`} style={artStyle} fill="none" aria-hidden="true">
      <path className="floral-stem" pathLength={1} style={delayStyle(0)} d={ringPath(84, 58, 24)} stroke="var(--gold-light)" strokeWidth="2.6" />
      <path className="floral-stem" pathLength={1} style={delayStyle(0.1)} d={ringPath(84, 58, 20.5)} stroke="var(--gold)" strokeWidth="0.7" />
      <path className="floral-stem" pathLength={1} style={delayStyle(0.35)} d={ringPath(116, 58, 24)} stroke="var(--gold-light)" strokeWidth="2.6" />
      <path className="floral-stem" pathLength={1} style={delayStyle(0.45)} d={ringPath(116, 58, 20.5)} stroke="var(--gold)" strokeWidth="0.7" />
      {/* The diamond on top of the first ring. */}
      <g className="floral-pop" style={delayStyle(1.2)} stroke="var(--gold-light)" strokeWidth="0.9">
        <path d="M76 30 L 80 25 L 88 25 L 92 30 L 84 39 Z" fill="var(--gold-pale)" fillOpacity="0.35" />
        <path d="M76 30 L 92 30 M80 25 L 82 30 L 84 39 L 86 30 L 88 25" />
      </g>
      <Sparkle x={94} y={22} scale={0.7} delay={1.7} />
      <Sparkle x={150} y={30} scale={0.55} delay={2.3} />
      <Sparkle x={52} y={84} scale={0.5} delay={2.8} />
      <Sparkle x={140} y={88} scale={0.4} delay={3.4} />
      {/* Laurel twigs on both sides. */}
      <path className="floral-stem" pathLength={1} style={delayStyle(0.6)} d="M50 62 C 38 58, 26 56, 10 58" stroke="var(--gold)" strokeWidth="0.9" />
      <path className="floral-stem" pathLength={1} style={delayStyle(0.6)} d="M150 62 C 162 58, 174 56, 190 58" stroke="var(--gold)" strokeWidth="0.9" />
      {[
        [42, 59, 0.8],
        [30, 57, 1],
        [18, 57, 1.2],
      ].map(([x, y, delay]) => (
        <g key={x}>
          <LineLeaf x={x} y={y} rotate={-150} length={11} delay={delay} color="var(--gold)" />
          <LineLeaf x={x} y={y} rotate={155} length={10} delay={delay + 0.08} color="var(--gold)" />
          <LineLeaf x={200 - x} y={y} rotate={-30} length={11} delay={delay} color="var(--gold)" />
          <LineLeaf x={200 - x} y={y} rotate={25} length={10} delay={delay + 0.08} color="var(--gold)" />
        </g>
      ))}
    </svg>
  );
}

/** Two laurel branches growing outward from a diamond, used between sections. */
export function LaurelDivider({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<HTMLDivElement>(art);
  const color = 'var(--gold)';
  const stem = 'M158 32 C 190 31, 230 27, 272 16';

  return (
    <div ref={ref} className={`flex justify-center pointer-events-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 300 56" className={`w-[min(360px,82vw)] h-auto ${artClass}`} style={artStyle} fill="none">
        <Branch color={color} stem={stem} />
        <g transform="translate(300 0) scale(-1 1)">
          <Branch color={color} stem={stem} />
        </g>
        <path className="floral-pop" style={delayStyle(0)} d="M150 22 L 158 32 L 150 42 L 142 32 Z" stroke={color} strokeWidth="1" fill="var(--gold-pale)" />
        <path className="floral-pop" style={delayStyle(0.15)} d="M150 27 L 154 32 L 150 37 L 146 32 Z" fill={color} />
        <Sparkle x={166} y={14} scale={0.55} delay={1.3} color="var(--gold)" />
      </svg>
    </div>
  );
}
