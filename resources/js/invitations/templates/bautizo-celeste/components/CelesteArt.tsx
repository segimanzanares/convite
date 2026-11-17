/*
 * Animated ornaments of the bautizo-celeste template, drawn in its powder blue, silver and cloud white: a dove that
 * flies in with an olive sprig and keeps beating its wings, clouds that drift across the sky, a scallop shell that
 * pours water drop by drop into a baptismal font, and a small cross with rays between sections. They play when they
 * come into view, or once `play` turns true (components/floral/floral-art.css and this template's theme.css).
 */
import type { CSSProperties } from 'react';
import { type ArtProps, delayStyle, useArt } from '../../../components/floral/art';
import { Sparkle } from '../../../components/floral/pieces';

const LEAF = 'M0 0 C 3 -3, 9 -3, 12 0 C 9 3, 3 3, 0 0 Z';

/** One wing with its shoulder on the origin, pointing back and up. */
function Wing({ fill }: { fill: string }) {
  return (
    <>
      <path
        d="M0 0 C -4 -20, -20 -40, -50 -48 C -44 -38, -42 -30, -40 -24 C -44 -22, -50 -20, -54 -17 C -40 -9, -20 -2, 0 0 Z"
        fill={fill}
        stroke="var(--gold)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M-12 -5 C -22 -12, -30 -20, -38 -30 M-20 -4 C -30 -9, -38 -13, -46 -17" stroke="var(--gold)" strokeWidth="0.7" opacity="0.7" />
    </>
  );
}

interface DoveProps {
  x: number;
  y: number;
  scale?: number;
  delay?: number;
  /** Flies in from the lower left before gliding in place. */
  flyIn?: boolean;
  /** Carries an olive sprig in its beak. */
  branch?: boolean;
}

/** A dove in profile, facing right, with its body on (x, y): the wings beat while it glides. */
function Dove({ x, y, scale = 1, delay = 0, flyIn = false, branch = true }: DoveProps) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className={flyIn ? 'celeste-fly-in' : undefined} style={delayStyle(delay)}>
        <g className="celeste-glide" style={delayStyle(delay)}>
          <g transform="translate(8 -6) scale(0.86)">
            <g className="celeste-wing" style={delayStyle(delay + 0.18)}>
              <Wing fill="var(--gold-pale)" />
            </g>
          </g>
          <path
            d="M-44 10 C -34 3, -22 0, -10 -2 C 4 -4, 14 -6, 22 -12 C 27 -18, 35 -20, 41 -16 C 44 -14, 46 -11, 47 -9 C 45 0, 37 9, 22 13 C 8 17, -10 17, -24 15 L -52 25 L -50 17 L -60 13 Z"
            fill="var(--white)"
            stroke="var(--gold)"
            strokeWidth="1.2"
            strokeLinejoin="round"
          />
          <path d="M47 -9 L 55 -7 L 46 -4 Z" fill="var(--gold-light)" stroke="var(--gold)" strokeWidth="0.8" strokeLinejoin="round" />
          <circle cx="38" cy="-12" r="1.6" fill="var(--gold-deep)" />
          {branch && (
            <g>
              <path d="M53 -6 C 58 0, 61 8, 60 19" stroke="#7d9b74" strokeWidth="1.1" fill="none" strokeLinecap="round" />
              {(
                [
                  [56, -2, 60],
                  [59, 4, 20],
                  [60, 10, 70],
                  [61, 15, 15],
                ] as const
              ).map(([lx, ly, angle]) => (
                <path key={`${lx}-${ly}`} d={LEAF} transform={`translate(${lx} ${ly}) rotate(${angle})`} fill="#a9c39d" stroke="#7d9b74" strokeWidth="0.6" />
              ))}
            </g>
          )}
          <g transform="translate(-2 -4)">
            <g className="celeste-wing" style={delayStyle(delay)}>
              <Wing fill="var(--white)" />
            </g>
          </g>
        </g>
      </g>
    </g>
  );
}

/** A dove on its own, to fly over a section. */
export function FlyingDove({ className = '', flyIn = false, branch = true, ...art }: ArtProps & { flyIn?: boolean; branch?: boolean }) {
  const { ref, artClass, artStyle } = useArt<SVGSVGElement>(art);

  return (
    <svg ref={ref} viewBox="0 0 170 120" className={`${className} ${artClass}`} style={artStyle} fill="none" aria-hidden="true">
      <Dove x={86} y={70} flyIn={flyIn} branch={branch} />
      <Sparkle x={150} y={22} scale={0.5} delay={2.4} color="var(--gold-light)" />
      <Sparkle x={20} y={30} scale={0.4} delay={3} color="var(--gold-light)" />
    </svg>
  );
}

/** [left %, top %, width in px, opacity, seconds per drift, drift in px, seconds of wait]. */
const CLOUDS = [
  [-6, 14, 220, 0.9, 30, 80, 0],
  [62, 8, 180, 0.75, 26, -70, -6],
  [74, 44, 260, 0.6, 34, -90, -12],
  [4, 58, 160, 0.55, 24, 60, -4],
  [36, 30, 120, 0.45, 22, 50, -9],
] as const;

const CLOUD = 'M-50 12 C -63 12, -64 -6, -50 -8 C -50 -24, -28 -31, -18 -18 C -12 -35, 16 -37, 22 -16 C 34 -27, 57 -16, 50 0 C 64 2, 63 12, 50 12 Z';

/** White clouds drifting slowly behind a section's content. */
export function Clouds({ className = '', count = CLOUDS.length }: { className?: string; count?: number }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      {CLOUDS.slice(0, count).map(([left, top, width, opacity, every, dx, wait]) => (
        <svg
          key={`${left}-${top}`}
          viewBox="-66 -40 132 56"
          className="celeste-cloud absolute h-auto"
          style={{ left: `${left}%`, top: `${top}%`, width, opacity, '--every': `${every}s`, '--dx': `${dx}px`, '--wait': `${wait}s` } as CSSProperties}
        >
          <path d={CLOUD} fill="var(--white)" />
          <path d="M-50 12 C -40 6, 40 6, 50 12" fill="none" stroke="var(--gold-light)" strokeWidth="1" opacity="0.6" />
        </svg>
      ))}
    </div>
  );
}

/** A bank of clouds across the bottom (or, flipped, the top) of a section. */
export function CloudBank({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  /** [center x, height, half width] of each cloud along the bank. */
  const bumps = [
    [0, 70, 80],
    [130, 95, 95],
    [270, 75, 85],
    [400, 105, 100],
    [550, 80, 90],
    [690, 100, 95],
    [830, 78, 85],
    [960, 98, 95],
    [1090, 80, 90],
    [1210, 90, 85],
  ];
  const back = bumps.map(([x, h, r]) => `M${x - r} 120 A ${r} ${h} 0 0 1 ${x + r} 120 Z`).join(' ');
  const front = bumps.map(([x, h, r]) => `M${x + 60 - r * 0.8} 120 A ${r * 0.8} ${h * 0.7} 0 0 1 ${x + 60 + r * 0.8} 120 Z`).join(' ');

  return (
    <svg
      viewBox="0 0 1200 120"
      preserveAspectRatio="none"
      className={`pointer-events-none block h-[70px] w-full sm:h-[110px] ${flip ? 'rotate-180' : ''} ${className}`}
      aria-hidden="true"
    >
      <path d={back} fill="var(--color-gold-pale)" opacity="0.9" />
      <path d={front} fill="var(--color-ivory)" />
    </svg>
  );
}

const SHELL_RIBS = [-60, -36, -12, 12, 36, 60];

/**
 * A scallop shell, tilted, that pours water drop by drop into a baptismal font; each drop sends a ripple across the
 * water. The shell and the font draw themselves first.
 */
export function ShellFont({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<SVGSVGElement>(art);
  const line = { stroke: 'var(--gold)', strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };

  return (
    <svg ref={ref} viewBox="0 0 160 150" className={`${className} ${artClass}`} style={artStyle} fill="none" aria-hidden="true">
      <g transform="translate(66 20) rotate(160)">
        <path className="floral-pop" style={delayStyle(0.6)} d="M0 0 L -22 -20 C -20 -33, -8 -41, 0 -41 C 8 -41, 20 -33, 22 -20 Z" fill="var(--gold-pale)" />
        <path className="floral-stem" pathLength={1} style={delayStyle(0)} d="M0 0 L -22 -20 C -20 -33, -8 -41, 0 -41 C 8 -41, 20 -33, 22 -20 Z" strokeWidth="1.3" {...line} />
        {SHELL_RIBS.map((angle, index) => (
          <path
            key={angle}
            className="floral-stem"
            pathLength={1}
            style={delayStyle(0.4 + index * 0.06)}
            d={`M0 -2 L ${Math.sin((angle * Math.PI) / 180) * 30} ${-Math.cos((angle * Math.PI) / 180) * 36}`}
            strokeWidth="0.8"
            {...line}
          />
        ))}
        <path className="floral-stem" pathLength={1} style={delayStyle(0.3)} d="M-6 0 L -10 5 L 10 5 L 6 0" strokeWidth="1" {...line} />
      </g>

      {[0, 0.8, 1.6].map((offset) => (
        <g key={offset} transform="translate(80 62)">
          <path className="celeste-drop" style={delayStyle(1.4 + offset)} d="M0 -4 C 2 -1, 3 1, 3 2.5 A 3 3 0 0 1 -3 2.5 C -3 1, -2 -1, 0 -4 Z" fill="var(--gold)" />
        </g>
      ))}

      <path className="floral-stem" pathLength={1} style={delayStyle(0.5)} d="M38 108 C 42 130, 118 130, 122 108" strokeWidth="1.3" {...line} />
      <path className="floral-pop" style={delayStyle(1)} d="M42 108 C 46 122, 114 122, 118 108 Z" fill="var(--gold-light)" opacity="0.5" />
      <ellipse className="floral-pop" style={delayStyle(0.9)} cx="80" cy="108" rx="42" ry="6" fill="var(--gold-pale)" stroke="var(--gold)" strokeWidth="1" />
      {[0, 0.8, 1.6].map((offset) => (
        <g key={offset} transform="translate(80 108)">
          <ellipse className="celeste-ripple" style={delayStyle(1.4 + offset)} rx="22" ry="3.4" stroke="var(--gold)" strokeWidth="0.9" />
        </g>
      ))}
      <path className="floral-stem" pathLength={1} style={delayStyle(0.8)} d="M72 125 L 68 142 M88 125 L 92 142 M58 142 L 102 142" strokeWidth="1.2" {...line} />
      <Sparkle x={128} y={70} scale={0.5} delay={2} color="var(--gold-light)" />
      <Sparkle x={30} y={86} scale={0.4} delay={2.6} color="var(--gold-light)" />
    </svg>
  );
}

/** A small Latin cross that sends out rays, with silver rules drawing outward on both sides; between sections. */
export function CrossDivider({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<HTMLDivElement>(art);
  const rays = [-150, -120, -90, -60, -30, 0, 30, 60, 90, 120, 150, 180];

  return (
    <div ref={ref} className={`pointer-events-none flex justify-center ${className}`} aria-hidden="true">
      <svg viewBox="0 0 300 60" className={`h-auto w-[min(360px,82vw)] ${artClass}`} style={artStyle} fill="none">
        <g stroke="var(--gold)" strokeLinecap="round">
          <path className="floral-stem" pathLength={1} style={delayStyle(0.3)} d="M128 30 L 26 30" strokeWidth="1" />
          <path className="floral-stem" pathLength={1} style={delayStyle(0.3)} d="M172 30 L 274 30" strokeWidth="1" />
          <path className="floral-stem" pathLength={1} style={delayStyle(0.6)} d="M120 35 L 70 35" strokeWidth="0.6" />
          <path className="floral-stem" pathLength={1} style={delayStyle(0.6)} d="M180 35 L 230 35" strokeWidth="0.6" />
          {rays.map((angle, index) => {
            const radians = (angle * Math.PI) / 180;
            return (
              <path
                key={angle}
                className="floral-stem"
                pathLength={1}
                style={delayStyle(0.8 + index * 0.05)}
                d={`M${150 + 15 * Math.cos(radians)} ${28 + 15 * Math.sin(radians)} L ${150 + (index % 2 ? 19 : 23) * Math.cos(radians)} ${28 + (index % 2 ? 19 : 23) * Math.sin(radians)}`}
                strokeWidth="0.7"
                opacity="0.7"
              />
            );
          })}
        </g>
        <g className="floral-pop" style={delayStyle(0)}>
          <path d="M150 16 L 150 42 M142 24 L 158 24" stroke="var(--gold-deep)" strokeWidth="2" strokeLinecap="round" />
        </g>
        <circle className="floral-pop" style={delayStyle(1.1)} cx="24" cy="30" r="2" fill="var(--gold)" />
        <circle className="floral-pop" style={delayStyle(1.1)} cx="276" cy="30" r="2" fill="var(--gold)" />
        <Sparkle x={196} y={14} scale={0.5} delay={1.4} color="var(--gold-light)" />
        <Sparkle x={104} y={48} scale={0.4} delay={1.8} color="var(--gold-light)" />
      </svg>
    </div>
  );
}
