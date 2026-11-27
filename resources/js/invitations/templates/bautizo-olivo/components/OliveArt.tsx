/*
 * Animated ornaments of the bautizo-olivo template, drawn in its sage, olive and wheat tokens: an olive wreath whose
 * branches grow around the portrait and tie with a wheat bow, an olive sprig between sections, and a little lamb that
 * breathes, nods and wags its tail among daisies that bloom around it. They play when they come into view, or once
 * `play` turns true (components/floral/floral-art.css and this template's theme.css).
 */
import type { CSSProperties } from 'react';
import { type ArtProps, delayStyle, useArt } from '../../../components/floral/art';
import { Butterfly, Sparkle } from '../../../components/floral/pieces';

/** An olive leaf pointing up from its base on the origin. */
const LEAF = 'M0 0 C -5 -7, -5 -19, 0 -26 C 5 -19, 5 -7, 0 0 Z';

interface LeafProps {
  x: number;
  y: number;
  /** The direction the leaf points to, in degrees (0 is right, 90 is down). */
  direction: number;
  scale?: number;
  delay: number;
}

/** An olive leaf that unfurls from its base, then rustles. */
function Leaf({ x, y, direction, scale = 1, delay }: LeafProps) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${direction + 90}) scale(${scale})`}>
      <g className="floral-leaf" style={delayStyle(delay)}>
        <path d={LEAF} fill="var(--primary-light)" stroke="var(--primary)" strokeWidth="0.8" strokeLinejoin="round" />
        <path d="M0 -2 L 0 -22" stroke="var(--primary)" strokeWidth="0.5" opacity="0.7" />
      </g>
    </g>
  );
}

/** An olive that grows on its spot. */
function Olive({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="floral-berries" style={delayStyle(delay)}>
        <ellipse rx="4" ry="5.4" fill="var(--olive-fruit)" />
        <ellipse cx="-1.2" cy="-1.8" rx="1.2" ry="1.6" fill="var(--primary-pale)" opacity="0.6" />
      </g>
    </g>
  );
}

const WREATH_CENTER = 130;
const WREATH_RADIUS = 106;

function onWreath(angle: number, radius = WREATH_RADIUS): [number, number] {
  const radians = (angle * Math.PI) / 180;

  return [WREATH_CENTER + radius * Math.cos(radians), WREATH_CENTER + radius * Math.sin(radians)];
}

/** One side of the wreath: a stem along the circle from `from` to `to` degrees, with leaves and olives. */
function WreathBranch({ from, to, delay }: { from: number; to: number; delay: number }) {
  const direction = Math.sign(to - from);
  const steps = 11;
  const [startX, startY] = onWreath(from);
  const [endX, endY] = onWreath(to);

  return (
    <>
      <path
        className="floral-stem"
        pathLength={1}
        style={delayStyle(delay)}
        d={`M${startX} ${startY} A ${WREATH_RADIUS} ${WREATH_RADIUS} 0 0 ${direction > 0 ? 1 : 0} ${endX} ${endY}`}
        stroke="var(--primary-deep)"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      {Array.from({ length: steps }, (_, index) => {
        const angle = from + ((to - from) * (index + 0.6)) / steps;
        const [x, y] = onWreath(angle);
        const tangent = angle + 90 * direction;
        const scale = 1 - index * 0.035;
        const [oliveX, oliveY] = onWreath(angle + 4 * direction, WREATH_RADIUS - 9);
        return (
          <g key={angle}>
            <Leaf x={x} y={y} direction={tangent - 38} scale={scale} delay={delay + 0.3 + index * 0.09} />
            <Leaf x={x} y={y} direction={tangent + 38} scale={scale * 0.9} delay={delay + 0.36 + index * 0.09} />
            {index % 3 === 1 && <Olive x={oliveX} y={oliveY} delay={delay + 1.3 + index * 0.05} />}
          </g>
        );
      })}
    </>
  );
}

/** An olive wreath: two branches grow up from a wheat bow around the middle, which stays free for a portrait. */
export function OliveWreath({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<SVGSVGElement>(art);

  return (
    <svg ref={ref} viewBox="0 0 260 270" className={`${className} ${artClass}`} style={artStyle} fill="none" aria-hidden="true">
      <WreathBranch from={98} to={258} delay={0} />
      <WreathBranch from={82} to={-78} delay={0.15} />
      <g className="floral-pop" style={delayStyle(1.6)}>
        <path d="M130 236 C 112 220, 98 234, 110 243 C 117 248, 126 241, 130 236 Z" fill="var(--wheat)" stroke="var(--primary-deep)" strokeWidth="0.8" />
        <path d="M130 236 C 148 220, 162 234, 150 243 C 143 248, 134 241, 130 236 Z" fill="var(--wheat)" stroke="var(--primary-deep)" strokeWidth="0.8" />
        <path d="M128 238 C 124 250, 118 258, 110 266 M132 238 C 136 250, 142 258, 150 266" stroke="var(--wheat)" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="130" cy="237" r="4" fill="var(--wheat)" stroke="var(--primary-deep)" strokeWidth="0.8" />
      </g>
      <Sparkle x={130} y={12} scale={0.6} delay={2} color="var(--wheat)" />
      <Sparkle x={24} y={70} scale={0.4} delay={2.4} color="var(--primary)" />
      <Sparkle x={238} y={182} scale={0.45} delay={2.8} color="var(--primary)" />
    </svg>
  );
}

/** An olive sprig between sections: stems draw outward from three olives, with leaves along them. */
export function SprigDivider({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<HTMLDivElement>(art);
  const leaves = [0, 1, 2, 3, 4];

  return (
    <div ref={ref} className={`pointer-events-none flex justify-center ${className}`} aria-hidden="true">
      <svg viewBox="0 0 300 64" className={`h-auto w-[min(360px,82vw)] ${artClass}`} style={artStyle} fill="none">
        <path className="floral-stem" pathLength={1} style={delayStyle(0.1)} d="M138 34 C 110 26, 70 26, 28 36" stroke="var(--primary-deep)" strokeWidth="1.1" strokeLinecap="round" />
        <path className="floral-stem" pathLength={1} style={delayStyle(0.1)} d="M162 34 C 190 26, 230 26, 272 36" stroke="var(--primary-deep)" strokeWidth="1.1" strokeLinecap="round" />
        {leaves.map((index) => {
          const x = 124 - index * 20;
          const y = 30 - Math.sin(((index + 1) / 6) * Math.PI) * 2;
          const scale = 0.8 - index * 0.08;
          return (
            <g key={index}>
              <Leaf x={x} y={y} direction={index % 2 ? 210 : 150} scale={scale} delay={0.4 + index * 0.1} />
              <Leaf x={300 - x} y={y} direction={index % 2 ? -30 : 30} scale={scale} delay={0.4 + index * 0.1} />
            </g>
          );
        })}
        <Olive x={144} y={36} delay={0} />
        <Olive x={156} y={36} delay={0.1} />
        <Olive x={150} y={27} delay={0.2} />
        <Sparkle x={210} y={14} scale={0.45} delay={1.4} color="var(--wheat)" />
      </svg>
    </div>
  );
}

/** A daisy that opens on (x, y). */
function Daisy({ x, y, scale = 1, delay }: { x: number; y: number; scale?: number; delay: number }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <g className="floral-bloom" style={delayStyle(delay)}>
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
          <ellipse key={angle} cx="0" cy="-6" rx="2.6" ry="5.5" transform={`rotate(${angle})`} fill="var(--card)" stroke="var(--primary)" strokeWidth="0.5" />
        ))}
        <circle r="3.2" fill="var(--wheat)" />
      </g>
    </g>
  );
}

/** A grass tuft that grows from its base and sways. */
function Grass({ x, y, delay }: { x: number; y: number; delay: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g className="floral-bud" style={{ ...delayStyle(delay), '--sway': '6deg' } as CSSProperties}>
        <path d="M0 0 C -2 -8, -6 -12, -9 -16 M0 0 C 0 -9, 1 -14, 2 -20 M0 0 C 2 -7, 6 -10, 10 -13" stroke="var(--primary)" strokeWidth="1.2" strokeLinecap="round" />
      </g>
    </g>
  );
}

const FLEECE = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330];

/** A little lamb among daisies: it breathes, nods its head now and then and wags its tail, while a butterfly visits. */
export function Lamb({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<SVGSVGElement>(art);
  const outline = { stroke: 'var(--primary-deep)', strokeWidth: 1, strokeLinejoin: 'round' as const };

  return (
    <svg ref={ref} viewBox="0 0 200 150" className={`${className} ${artClass}`} style={artStyle} fill="none" aria-hidden="true">
      <ellipse className="floral-pop" style={delayStyle(0)} cx="100" cy="132" rx="78" ry="6" fill="var(--primary-pale)" />
      <g className="floral-pop" style={delayStyle(0.2)}>
        <path d="M72 100 L 70 128 M84 104 L 83 130 M110 104 L 112 130 M122 100 L 125 127" stroke="var(--primary-deep)" strokeWidth="4" strokeLinecap="round" />

        <g transform="translate(55 74)">
          <g className="olivo-wag" style={delayStyle(1)}>
            <circle cx="-6" cy="-2" r="6" fill="var(--card)" {...outline} />
            <circle cx="-10" cy="4" r="4.5" fill="var(--card)" {...outline} />
          </g>
        </g>

        <g transform="translate(96 82)">
          <g className="olivo-breathe" style={delayStyle(0.6)}>
            {FLEECE.map((angle) => {
              const radians = (angle * Math.PI) / 180;
              return <circle key={angle} cx={Math.cos(radians) * 38} cy={Math.sin(radians) * 22} r="11" fill="var(--card)" {...outline} />;
            })}
            <ellipse rx="40" ry="24" fill="var(--card)" />
            <path d="M-20 -6 c 3 -3 6 -3 8 0 M4 4 c 3 -3 6 -3 8 0 M-6 12 c 3 -3 6 -3 8 0" stroke="var(--primary-light)" strokeWidth="1" strokeLinecap="round" />
          </g>
        </g>

        <g transform="translate(130 68)">
          <g className="olivo-nod" style={delayStyle(1.4)}>
            <ellipse cx="14" cy="-4" rx="13" ry="16" transform="rotate(24 14 -4)" fill="var(--muted)" {...outline} />
            <ellipse cx="2" cy="-12" rx="9" ry="3.6" transform="rotate(-28 2 -12)" fill="var(--wheat)" {...outline} />
            {[
              [6, -20],
              [13, -23],
              [20, -20],
            ].map(([cx, cy]) => (
              <circle key={cx} cx={cx} cy={cy} r="5" fill="var(--card)" {...outline} />
            ))}
            <path d="M15 -6 Q 18 -3 21 -6" stroke="var(--primary-deep)" strokeWidth="1.2" strokeLinecap="round" />
            <ellipse cx="23" cy="5" rx="2.2" ry="1.4" fill="var(--primary-deep)" />
            <circle cx="12" cy="1" r="2.4" fill="#e8b8a0" opacity="0.7" />
          </g>
        </g>
      </g>

      <Grass x={30} y={132} delay={0.8} />
      <Grass x={150} y={132} delay={0.9} />
      <Grass x={178} y={131} delay={1} />
      <Daisy x={22} y={124} scale={0.9} delay={1.2} />
      <Daisy x={46} y={130} scale={0.7} delay={1.4} />
      <Daisy x={160} y={126} scale={0.8} delay={1.6} />
      <Daisy x={184} y={120} scale={0.6} delay={1.8} />
      <Butterfly x={168} y={34} scale={0.45} rotate={12} delay={2.2} />
      <Sparkle x={30} y={40} scale={0.5} delay={2.6} color="var(--wheat)" />
    </svg>
  );
}
