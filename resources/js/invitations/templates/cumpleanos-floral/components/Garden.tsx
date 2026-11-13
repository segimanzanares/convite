/*
 * The animated garden of the cumpleanos-floral template: cosmos, tulips and butterflies in the theme's pinks
 * (--gold-light, --gold, --gold-deep) with sage leaves (--leaf, --leaf-deep). They grow when they come into
 * view, or once `play` turns true (components/floral/floral-art.css).
 */
import type { CSSProperties } from 'react';
import { type ArtProps, delayStyle, useArt } from '../../../components/floral/art';
import { Butterfly, type PieceProps } from '../../../components/floral/pieces';

function swayStyle(delay: number, sway: number): CSSProperties {
  return { ...delayStyle(delay), '--sway': `${sway}deg` } as CSSProperties;
}

/** A cosmos seen from the front: eight notched petals around a dotted center. */
function Cosmos({ x, y, rotate = 0, scale = 1, delay = 0 }: PieceProps) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <g className="floral-bloom" style={delayStyle(delay)}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <path
            key={angle}
            d="M0 -3 C -6 -6, -7 -16, -4 -21 L -2 -19 L 0 -22 L 2 -19 L 4 -21 C 7 -16, 6 -6, 0 -3 Z"
            transform={`rotate(${angle})`}
            fill="var(--gold-light)"
            stroke="var(--gold-deep)"
            strokeWidth="0.5"
            strokeOpacity="0.4"
          />
        ))}
        <g className="floral-bloom-heart" style={delayStyle(delay)}>
          {[22, 67, 112, 157, 202, 247, 292, 337].map((angle) => (
            <path key={angle} d="M0 -3 L 0 -12" transform={`rotate(${angle})`} stroke="var(--gold)" strokeWidth="1.2" />
          ))}
          <circle r="5" fill="var(--gold-deep)" />
          {[0, 72, 144, 216, 288].map((angle) => (
            <circle key={angle} cx="0" cy="-2.6" r="0.9" transform={`rotate(${angle})`} fill="var(--gold-pale)" />
          ))}
        </g>
      </g>
    </g>
  );
}

/** A slender leaf growing from (x, y) in the given direction. */
function Blade({ x, y, rotate, length = 24, deep = false, delay = 0 }: { x: number; y: number; rotate: number; length?: number; deep?: boolean; delay?: number }) {
  const width = length * 0.2;
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <path
        className="floral-leaf"
        style={delayStyle(delay)}
        d={`M0 0 C ${length * 0.3} ${-width}, ${length * 0.7} ${-width}, ${length} 0 C ${length * 0.7} ${width * 0.6}, ${length * 0.3} ${width * 0.6}, 0 0 Z`}
        fill={deep ? 'var(--leaf-deep)' : 'var(--leaf)'}
      />
    </g>
  );
}

/** A closed cosmos bud, pointing up from (x, y). */
function Bud({ x, y, rotate = 0, delay = 0 }: { x: number; y: number; rotate?: number; delay?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate})`}>
      <g className="floral-bud" style={delayStyle(delay)}>
        <path d="M0 0 L 0 -9" stroke="var(--leaf-deep)" strokeWidth="1" />
        <path d="M0 -8 C -5 -10, -4 -18, 0 -20 C 4 -18, 5 -10, 0 -8 Z" fill="var(--gold)" />
        <path d="M0 -8 C -3 -10, -4 -13, -3 -15 M0 -8 C 3 -10, 4 -13, 3 -15" stroke="var(--leaf-deep)" strokeWidth="1" fill="none" />
      </g>
    </g>
  );
}

interface PlantProps {
  x: number;
  /** The ground line. */
  y: number;
  height: number;
  lean?: number;
  delay?: number;
}

/** A tulip on its stem, with a leaf, rooted at (x, y). */
function Tulip({ x, y, height, lean = 0, delay = 0 }: PlantProps) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${lean})`}>
      <g className="floral-bud" style={swayStyle(delay, 3)}>
        <path d={`M0 0 C 2 ${-height * 0.4}, -2 ${-height * 0.7}, 0 ${-height + 2}`} stroke="var(--leaf-deep)" strokeWidth="1.4" fill="none" />
        <Blade x={0} y={-height * 0.2} rotate={-62} length={height * 0.5} delay={delay + 0.3} />
        <g transform={`translate(0 ${-height})`}>
          <path d="M-7 0 C -10 -9, -7 -16, -5 -19 L -2 -12 L 0 -20 L 2 -12 L 5 -19 C 7 -16, 10 -9, 7 0 C 4 4, -4 4, -7 0 Z" fill="var(--gold)" />
          <path d="M-2 -12 C -2 -6, -1 -1, 0 2 M2 -12 C 2 -6, 1 -1, 0 2" stroke="var(--gold-deep)" strokeWidth="0.8" fill="none" opacity="0.7" />
        </g>
      </g>
    </g>
  );
}

/** A cosmos on a tall stem rooted at (x, y), opening once the stem has grown. */
function CosmosStem({ x, y, height, lean = 0, delay = 0, scale = 0.6 }: PlantProps & { scale?: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${lean})`}>
      <g className="floral-bud" style={swayStyle(delay, 4)}>
        <path d={`M0 0 C -3 ${-height * 0.35}, 3 ${-height * 0.65}, 0 ${-height}`} stroke="var(--leaf-deep)" strokeWidth="1.2" fill="none" />
        <Blade x={0} y={-height * 0.45} rotate={-30} length={height * 0.28} deep delay={delay + 0.4} />
        <Cosmos x={0} y={-height} scale={scale} delay={delay + 0.6} />
      </g>
    </g>
  );
}

/** A circlet of leaves and cosmos, open at the top, framing the celebrant's age. */
export function AgeWreath({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<SVGSVGElement>(art);
  const center = 120;
  const radius = 92;
  const at = (degrees: number): [number, number] => [
    center + radius * Math.cos((degrees * Math.PI) / 180),
    center + radius * Math.sin((degrees * Math.PI) / 180),
  ];
  const arc = (from: number, to: number, sweep: 0 | 1) => {
    const [x1, y1] = at(from);
    const [x2, y2] = at(to);
    return `M${x1} ${y1} A ${radius} ${radius} 0 0 ${sweep} ${x2} ${y2}`;
  };
  // Leaves grow from the bottom up each side: along increasing angles on the left, decreasing on the right.
  const steps = Array.from({ length: 11 }, (_, index) => index);

  return (
    <svg ref={ref} viewBox="0 0 240 240" className={`${className} ${artClass}`} style={artStyle} fill="none" aria-hidden="true">
      <path className="floral-stem" pathLength={1} d={arc(92, 262, 1)} stroke="var(--leaf-deep)" strokeWidth="1.2" opacity="0.7" />
      <path className="floral-stem" pathLength={1} d={arc(88, -82, 0)} stroke="var(--leaf-deep)" strokeWidth="1.2" opacity="0.7" />
      {steps.map((index) => {
        const left = 104 + index * 14;
        const right = 76 - index * 14;
        const delay = 0.3 + index * 0.09;
        const length = index % 2 ? 18 : 23;
        return (
          <g key={index}>
            <Blade x={at(left)[0]} y={at(left)[1]} rotate={left + 55} length={length} delay={delay} />
            <Blade x={at(left)[0]} y={at(left)[1]} rotate={left + 125} length={length - 4} deep delay={delay + 0.05} />
            <Blade x={at(right)[0]} y={at(right)[1]} rotate={right - 55} length={length} delay={delay} />
            <Blade x={at(right)[0]} y={at(right)[1]} rotate={right - 125} length={length - 4} deep delay={delay + 0.05} />
          </g>
        );
      })}
      <Bud x={at(262)[0]} y={at(262)[1]} rotate={82} delay={1.4} />
      <Bud x={at(-82)[0]} y={at(-82)[1]} rotate={-82} delay={1.4} />
      <Cosmos x={at(160)[0]} y={at(160)[1]} scale={0.5} rotate={10} delay={0.9} />
      <Cosmos x={at(215)[0]} y={at(215)[1]} scale={0.42} rotate={-15} delay={1.15} />
      <Cosmos x={at(20)[0]} y={at(20)[1]} scale={0.5} rotate={-10} delay={0.95} />
      <Cosmos x={at(-35)[0]} y={at(-35)[1]} scale={0.42} rotate={20} delay={1.2} />
      <Cosmos x={100} y={207} scale={0.45} rotate={-20} delay={0.45} />
      <Cosmos x={140} y={207} scale={0.45} rotate={25} delay={0.5} />
      <Cosmos x={120} y={212} scale={0.7} delay={0.25} />
    </svg>
  );
}

/** A bed of tulips and cosmos growing from a bottom corner (drawn for the left one) with a butterfly. */
export function Meadow({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<SVGSVGElement>(art);
  const ground = 130;

  return (
    <svg ref={ref} viewBox="0 0 200 130" className={`${className} ${artClass}`} style={artStyle} fill="none" aria-hidden="true">
      <Blade x={6} y={ground} rotate={-70} length={44} deep delay={0.1} />
      <Blade x={14} y={ground} rotate={-100} length={36} delay={0.2} />
      <Tulip x={24} y={ground} height={92} lean={-6} delay={0.2} />
      <CosmosStem x={48} y={ground} height={108} lean={4} delay={0.35} scale={0.7} />
      <Blade x={58} y={ground} rotate={-78} length={40} delay={0.4} />
      <Tulip x={74} y={ground} height={72} lean={9} delay={0.5} />
      <CosmosStem x={98} y={ground} height={58} lean={12} delay={0.65} scale={0.5} />
      <Blade x={108} y={ground} rotate={-60} length={30} deep delay={0.7} />
      <Tulip x={124} y={ground} height={40} lean={16} delay={0.8} />
      <Blade x={138} y={ground} rotate={-40} length={24} delay={0.9} />
      <Butterfly x={150} y={34} scale={0.62} rotate={18} delay={1.6} />
    </svg>
  );
}

/** A horizontal sprig with a cosmos in the middle and a butterfly over it, used between sections. */
export function CosmosSprig({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<HTMLDivElement>(art);

  return (
    <div ref={ref} className={`flex justify-center pointer-events-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 260 80" className={`w-[min(380px,82vw)] h-auto ${artClass}`} style={artStyle} fill="none">
        <path className="floral-stem" pathLength={1} d="M130 46 C 170 42, 205 48, 244 38" stroke="var(--leaf-deep)" strokeWidth="1" opacity="0.7" />
        <path className="floral-stem" pathLength={1} d="M130 46 C 90 42, 55 48, 16 38" stroke="var(--leaf-deep)" strokeWidth="1" opacity="0.7" />
        <Blade x={150} y={45} rotate={-24} length={24} delay={0.35} />
        <Blade x={156} y={46} rotate={20} length={20} deep delay={0.45} />
        <Blade x={200} y={45} rotate={-18} length={22} deep delay={0.65} />
        <Blade x={226} y={42} rotate={14} length={18} delay={0.8} />
        <Blade x={110} y={45} rotate={204} length={24} delay={0.35} />
        <Blade x={104} y={46} rotate={160} length={20} deep delay={0.45} />
        <Blade x={60} y={45} rotate={198} length={22} deep delay={0.65} />
        <Blade x={34} y={42} rotate={166} length={18} delay={0.8} />
        <Bud x={244} y={38} rotate={70} delay={1} />
        <Bud x={16} y={38} rotate={-70} delay={1} />
        <Cosmos x={180} y={44} scale={0.42} rotate={15} delay={0.6} />
        <Cosmos x={80} y={44} scale={0.42} rotate={-15} delay={0.6} />
        <Cosmos x={130} y={44} scale={0.72} delay={0.2} />
        <Butterfly x={204} y={18} scale={0.42} rotate={20} delay={1.2} />
      </svg>
    </div>
  );
}
