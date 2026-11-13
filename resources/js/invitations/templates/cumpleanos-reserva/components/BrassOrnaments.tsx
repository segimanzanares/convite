/*
 * Brass line-art ornaments of the cumpleanos-reserva template: two glasses that draw themselves and then toast
 * every few seconds with rising bubbles, and an art-deco fan between sections. They play when they come into view,
 * or once `play` turns true (components/floral/floral-art.css).
 */
import type { CSSProperties } from 'react';
import { type ArtProps, delayStyle, useArt } from '../../../components/floral/art';
import { Sparkle } from '../../../components/floral/pieces';

interface FluteProps {
  /** Where the foot rests. */
  x: number;
  y: number;
  /** The glass's resting lean, in degrees. */
  lean: number;
  /** How far it tips toward the other glass in the toast. */
  tilt: number;
  delay: number;
  toastDelay: number;
}

/** A champagne flute with its foot on (x, y): the outline draws itself, then it fills and toasts. */
function Flute({ x, y, lean, tilt, delay, toastDelay }: FluteProps) {
  const outline = { stroke: 'var(--gold-light)', strokeWidth: 1.4, strokeLinecap: 'round' as const, fill: 'none' };

  return (
    <g transform={`translate(${x} ${y}) rotate(${lean})`}>
      <g className="floral-clink" style={{ ...delayStyle(toastDelay), '--tilt': `${tilt}deg` } as CSSProperties}>
        <path className="floral-pop" style={delayStyle(delay + 1)} d="M-7.6 -78 C -7.6 -62, -5 -50, 0 -45 C 5 -50, 7.6 -62, 7.6 -78 Z" fill="var(--gold)" fillOpacity="0.45" />
        {[
          [-2.5, -50, 0],
          [2, -54, 0.9],
          [0, -58, 1.7],
        ].map(([cx, cy, offset]) => (
          <circle key={offset} className="floral-rise" style={delayStyle(delay + 1.6 + offset)} cx={cx} cy={cy} r="1" fill="var(--gold-pale)" />
        ))}
        <path className="floral-stem" pathLength={1} style={delayStyle(delay)} d="M-9 -86 C -9 -64, -6 -48, 0 -42 C 6 -48, 9 -64, 9 -86" {...outline} />
        <path className="floral-stem" pathLength={1} style={delayStyle(delay + 0.5)} d="M0 -42 L 0 -4" {...outline} />
        <path className="floral-stem" pathLength={1} style={delayStyle(delay + 0.8)} d="M-11 0 C -7 -4, 7 -4, 11 0" {...outline} />
      </g>
    </g>
  );
}

/** Two champagne flutes that toast, for the top of the hero's label. */
export function ToastGlasses({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<SVGSVGElement>(art);

  return (
    <svg ref={ref} viewBox="0 0 120 104" className={`${className} ${artClass}`} style={artStyle} fill="none" aria-hidden="true">
      <Flute x={47} y={100} lean={-7} tilt={9} delay={0} toastDelay={2.4} />
      <Flute x={73} y={100} lean={7} tilt={-9} delay={0.2} toastDelay={2.4} />
      <g transform="translate(60 12)">
        <g className="floral-flash" style={delayStyle(2.4)}>
          <path d="M0 -7 L 1.5 -1.5 L 7 0 L 1.5 1.5 L 0 7 L -1.5 1.5 L -7 0 L -1.5 -1.5 Z" fill="var(--gold-light)" />
          <path d="M-9 -9 L -5 -5 M9 -9 L 5 -5 M-9 9 L -5 5 M9 9 L 5 5" stroke="var(--gold-light)" strokeWidth="0.8" />
        </g>
      </g>
      <Sparkle x={16} y={30} scale={0.5} delay={2} />
      <Sparkle x={106} y={46} scale={0.45} delay={2.7} />
    </svg>
  );
}

/** An art-deco fan over a diamond, with stepped rules on both sides, used between sections. */
export function DecoDivider({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<HTMLDivElement>(art);
  const color = 'var(--gold)';
  const rays = [-160, -140, -120, -100, -80, -60, -40, -20];

  return (
    <div ref={ref} className={`flex justify-center pointer-events-none ${className}`} aria-hidden="true">
      <svg viewBox="0 0 300 64" className={`w-[min(360px,82vw)] h-auto ${artClass}`} style={artStyle} fill="none">
        <g stroke={color} strokeLinecap="round">
          {rays.map((angle, index) => {
            const radians = (angle * Math.PI) / 180;
            const length = index % 2 ? 22 : 30;
            return (
              <path
                key={angle}
                className="floral-stem"
                pathLength={1}
                style={delayStyle(0.2 + index * 0.06)}
                d={`M${150 + 9 * Math.cos(radians)} ${50 + 9 * Math.sin(radians)} L ${150 + length * Math.cos(radians)} ${50 + length * Math.sin(radians)}`}
                strokeWidth="0.9"
              />
            );
          })}
          <path className="floral-stem" pathLength={1} style={delayStyle(0.7)} d="M114 50 A 36 36 0 0 1 186 50" strokeWidth="0.8" />
          <path className="floral-stem" pathLength={1} style={delayStyle(0.3)} d="M140 50 L 24 50" strokeWidth="1" />
          <path className="floral-stem" pathLength={1} style={delayStyle(0.3)} d="M160 50 L 276 50" strokeWidth="1" />
          <path className="floral-stem" pathLength={1} style={delayStyle(0.6)} d="M112 55 L 70 55 L 64 59 L 44 59" strokeWidth="0.7" />
          <path className="floral-stem" pathLength={1} style={delayStyle(0.6)} d="M188 55 L 230 55 L 236 59 L 256 59" strokeWidth="0.7" />
        </g>
        <path className="floral-pop" style={delayStyle(0)} d="M150 42 L 158 50 L 150 58 L 142 50 Z" stroke={color} strokeWidth="1" fill="var(--gold-pale)" />
        <path className="floral-pop" style={delayStyle(0.1)} d="M150 46.5 L 153.5 50 L 150 53.5 L 146.5 50 Z" fill={color} />
        <path className="floral-pop" style={delayStyle(1)} d="M20 50 L 24 46 L 28 50 L 24 54 Z" fill={color} />
        <path className="floral-pop" style={delayStyle(1)} d="M272 50 L 276 46 L 280 50 L 276 54 Z" fill={color} />
        <Sparkle x={182} y={14} scale={0.55} delay={1.2} color={color} />
      </svg>
    </div>
  );
}
