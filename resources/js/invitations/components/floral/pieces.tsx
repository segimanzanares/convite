/*
 * Pieces shared by the animated ornaments of several templates, colored by the theme's tokens and animated by the
 * classes in floral-art.css. Each is drawn around its own origin, placed at (x, y).
 */
import { type ArtProps, delayStyle, useArt } from './art';

export interface PieceProps {
  x: number;
  y: number;
  rotate?: number;
  /** 1 draws a butterfly about 52 units wide, or a sparkle about 16. */
  scale?: number;
  delay?: number;
}

/** A butterfly with its body on (x, y). Its wings flap now and then while it drifts around. */
export function Butterfly({ x, y, rotate = 0, scale = 1, delay = 0 }: PieceProps) {
  const wings = (
    <>
      <path d="M0 -2 C -8 -20, -27 -22, -25 -7 C -23 1, -9 2, 0 0 Z" fill="var(--gold)" />
      <path d="M0 1 C -11 4, -19 15, -13 20 C -7 23, -2 12, 0 3 Z" fill="var(--gold-light)" />
      <circle cx="-15" cy="-10" r="3" fill="var(--gold-pale)" opacity="0.85" />
      <circle cx="-9" cy="12" r="1.8" fill="var(--gold-pale)" opacity="0.85" />
      <path d="M0 -2 C -8 -20, -27 -22, -25 -7" stroke="var(--gold-deep)" strokeWidth="0.8" fill="none" opacity="0.6" />
    </>
  );

  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <g className="floral-butterfly" style={delayStyle(delay)}>
        <g className="floral-wing" style={delayStyle(delay)}>
          {wings}
          <g transform="scale(-1 1)">{wings}</g>
        </g>
        <ellipse rx="1.8" ry="10" cy="2" fill="var(--gold-deep)" />
        <path d="M-0.5 -7 C -2 -12, -4 -14, -6 -15 M0.5 -7 C 2 -12, 4 -14, 6 -15" stroke="var(--gold-deep)" strokeWidth="0.8" fill="none" />
      </g>
    </g>
  );
}

/** A four-pointed sparkle that appears, then pulses and turns. */
export function Sparkle({ x, y, scale = 1, delay = 0, color = 'var(--gold-light)' }: PieceProps & { color?: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        className="floral-twinkle"
        style={delayStyle(delay)}
        d="M0 -8 C 1 -2, 2 -1, 8 0 C 2 1, 1 2, 0 8 C -1 2, -2 1, -8 0 C -2 -1, -1 -2, 0 -8 Z"
        fill={color}
      />
    </g>
  );
}

/** A butterfly on its own, to hover over a section. */
export function FlyingButterfly({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<SVGSVGElement>(art);

  return (
    <svg ref={ref} viewBox="0 0 80 80" className={`${className} ${artClass}`} style={artStyle} fill="none" aria-hidden="true">
      <Butterfly x={40} y={44} rotate={-14} />
    </svg>
  );
}
