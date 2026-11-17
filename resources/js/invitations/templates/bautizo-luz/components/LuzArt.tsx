/*
 * Animated ornaments of the bautizo-luz template, drawn in its candle gold, wax and stained-glass tokens: the baptismal
 * candle with a flame that flickers over a breathing glow, a rose window that draws itself and turns slowly, a dove
 * that hovers among rays of light, drops that fall into the water of the font and ripple, and a small flame between
 * rules. The drawn pieces play when they come into view, or once `play` turns true (components/floral/floral-art.css
 * and this template's theme.css); flames, glows and rays move on their own.
 */
import { useId, type CSSProperties } from 'react';
import { type ArtProps, delayStyle, useArt } from '../../../components/floral/art';
import { Sparkle } from '../../../components/floral/pieces';
import { cn } from '../../../components/ui/styles';

/** An id that SVG's url(#…) references accept (React's own ids carry punctuation). */
function useSvgId(): string {
  return `luz${useId().replace(/[^a-zA-Z0-9]/g, '')}`;
}

const FLAME = 'M0 0 C -10 -6, -11 -22, 0 -40 C 11 -22, 10 -6, 0 0 Z';
const FLAME_CORE = 'M0 0 C -5 -3, -5 -12, 0 -22 C 5 -12, 5 -3, 0 0 Z';

/** A flame with its base on the origin, flickering; `catchFire` makes it catch first. */
function Flame({ wait = 0, catchFire = false }: { wait?: number; catchFire?: boolean }) {
  return (
    <g className={catchFire ? 'origin-bottom animate-[luzCatch_0.7s_ease-out_both] [transform-box:fill-box]' : undefined}>
      <g className="luz-flame" style={{ '--wait': `${wait}s` } as CSSProperties}>
        <path d={FLAME} fill="var(--flame)" />
        <path d={FLAME_CORE} fill="var(--flame-core)" />
        <ellipse cx="0" cy="-4" rx="2.4" ry="4" fill="var(--glass-blue)" opacity="0.55" />
      </g>
    </g>
  );
}

interface CandleProps {
  className?: string;
  /** Unlit, the candle shows only its wick. */
  lit?: boolean;
  /** Plays the flame catching when it turns lit. */
  catchFire?: boolean;
  /** Seconds of offset for the flicker, so candles side by side don't move in step. */
  wait?: number;
}

/** The baptismal candle: a tall wax candle with a cross and a ribbon, its flame flickering over a breathing glow. */
export function Candle({ className, lit = true, catchFire = false, wait = 0 }: CandleProps) {
  const id = useSvgId();

  return (
    <svg viewBox="0 0 80 200" className={cn('overflow-visible', className)} fill="none" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-glow`}>
          <stop offset="0" stopColor="var(--flame)" stopOpacity="0.75" />
          <stop offset="0.45" stopColor="var(--flame)" stopOpacity="0.22" />
          <stop offset="1" stopColor="var(--flame)" stopOpacity="0" />
        </radialGradient>
      </defs>
      {lit && (
        <g className={catchFire ? 'animate-[fadeIn_0.9s_ease-out_both]' : undefined}>
          <circle className="luz-glow" style={{ '--wait': `${wait}s` } as CSSProperties} cx="40" cy="44" r="44" fill={`url(#${id}-glow)`} />
        </g>
      )}
      <path d="M40 62 L 40 72" stroke="var(--foreground)" strokeWidth="1.6" strokeLinecap="round" />
      {lit && (
        <g transform="translate(40 64)">
          <Flame wait={wait} catchFire={catchFire} />
        </g>
      )}
      <path d="M25 74 C 25 70, 55 70, 55 74 L 55 186 L 25 186 Z" fill="var(--wax)" stroke="var(--border)" strokeWidth="1" />
      <path d="M31 72 C 31 80, 34 84, 33 92 C 32 96, 29 96, 29 90 L 29 73" fill="var(--wax)" stroke="var(--border)" strokeWidth="0.8" />
      <path d="M40 104 L 40 132 M31 113 L 49 113" stroke="var(--primary)" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M25 150 L 55 150 M25 156 L 55 156" stroke="var(--primary)" strokeWidth="1" opacity="0.7" />
      <path d="M40 153 C 34 160, 30 170, 33 178 M40 153 C 46 160, 50 170, 47 178" stroke="var(--primary)" strokeWidth="1" opacity="0.7" />
      <ellipse cx="40" cy="188" rx="26" ry="6" fill="var(--primary)" opacity="0.85" />
      <ellipse cx="40" cy="186" rx="18" ry="3" fill="var(--flame)" opacity="0.4" />
    </svg>
  );
}

const PETAL = 'M0 -28 C -14 -36, -16 -54, 0 -64 C 16 -54, 14 -36, 0 -28 Z';
const GLASS = ['--glass-blue', '--glass-rose', '--glass-gold', '--glass-green'];

/** A rose window: its tracery draws itself, its panes of colored glass light up one after another and it turns slowly. */
export function RoseWindow({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<SVGSVGElement>(art);
  const tracery = { stroke: 'var(--primary)', strokeLinecap: 'round' as const };

  return (
    <svg ref={ref} viewBox="0 0 200 200" className={`${className} ${artClass}`} style={artStyle} fill="none" aria-hidden="true">
      <g transform="translate(100 100)">
        <g className="luz-turn">
          {Array.from({ length: 12 }, (_, index) => (
            <g key={index} transform={`rotate(${index * 30})`}>
              <path className="floral-pop" style={delayStyle(0.9 + index * 0.07)} d={PETAL} fill={`var(${GLASS[index % GLASS.length]})`} fillOpacity="0.55" />
              <path className="floral-stem" pathLength={1} style={delayStyle(0.5 + index * 0.05)} d={PETAL} strokeWidth="1" {...tracery} />
              <circle className="floral-pop" style={delayStyle(1.5 + index * 0.05)} cx="0" cy="-80" r="8" fill={`var(${GLASS[(index + 2) % GLASS.length]})`} fillOpacity="0.5" stroke="var(--primary)" strokeWidth="0.8" />
              <path className="floral-stem" pathLength={1} style={delayStyle(0.3)} d="M0 -66 L 0 -72" strokeWidth="0.8" {...tracery} />
            </g>
          ))}
          <circle className="floral-stem" pathLength={1} style={delayStyle(0)} r="94" strokeWidth="1.6" {...tracery} />
          <circle className="floral-stem" pathLength={1} style={delayStyle(0.2)} r="70" strokeWidth="1" {...tracery} />
          <circle className="floral-stem" pathLength={1} style={delayStyle(0.4)} r="26" strokeWidth="1.2" {...tracery} />
          <circle className="floral-pop" style={delayStyle(1.2)} r="22" fill="var(--glass-gold)" fillOpacity="0.6" />
          <path className="floral-pop" style={delayStyle(1.6)} d="M0 -14 L 0 14 M-10 -4 L 10 -4" stroke="var(--primary)" strokeWidth="2.4" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  );
}

/** One wing with its shoulder on the origin, spread to the left. */
function Wing() {
  return (
    <>
      <path d="M0 0 C -14 -14, -38 -22, -62 -14 C -52 -8, -44 -4, -40 0 C -46 2, -52 4, -56 8 C -36 10, -18 8, 0 6 Z" fill="var(--wax)" stroke="var(--primary)" strokeWidth="1" strokeLinejoin="round" />
      <path d="M-12 -2 C -24 -8, -36 -12, -50 -12 M-14 4 C -26 4, -38 4, -48 6" stroke="var(--primary)" strokeWidth="0.6" opacity="0.6" />
    </>
  );
}

/** The dove of the Holy Spirit, wings spread, hovering among rays of light that pulse. */
export function DescendingDove({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<SVGSVGElement>(art);

  return (
    <svg ref={ref} viewBox="0 0 160 120" className={`${className} ${artClass}`} style={artStyle} fill="none" aria-hidden="true">
      <g stroke="var(--flame)" strokeLinecap="round">
        {Array.from({ length: 18 }, (_, index) => {
          const angle = (index * 20 * Math.PI) / 180;
          const inner = 30;
          const outer = index % 2 ? 50 : 60;
          return (
            <path
              key={index}
              className="luz-ray"
              style={{ '--wait': `${(index % 6) * -0.6}s` } as CSSProperties}
              d={`M${80 + inner * Math.cos(angle)} ${58 + inner * Math.sin(angle)} L ${80 + outer * Math.cos(angle)} ${58 + outer * Math.sin(angle)}`}
              strokeWidth="1.2"
            />
          );
        })}
      </g>
      <g className="luz-hover" style={delayStyle(0.4)}>
        <g className="floral-pop" style={delayStyle(0)}>
          <g transform="translate(74 52)">
            <g className="luz-wing" style={delayStyle(0.6)}>
              <Wing />
            </g>
          </g>
          <g transform="translate(86 52) scale(-1 1)">
            <g className="luz-wing" style={delayStyle(0.6)}>
              <Wing />
            </g>
          </g>
          <path d="M74 70 L 80 90 L 86 70 Z" fill="var(--wax)" stroke="var(--primary)" strokeWidth="1" strokeLinejoin="round" />
          <ellipse cx="80" cy="56" rx="8" ry="17" fill="var(--wax)" stroke="var(--primary)" strokeWidth="1" />
          <circle cx="80" cy="36" r="7" fill="var(--wax)" stroke="var(--primary)" strokeWidth="1" />
          <path d="M78 42 L 80 47 L 82 42 Z" fill="var(--flame)" />
        </g>
      </g>
      <Sparkle x={20} y={20} scale={0.45} delay={1.4} color="var(--flame)" />
      <Sparkle x={142} y={98} scale={0.4} delay={2} color="var(--flame)" />
    </svg>
  );
}

/** Drops fall one after another into the water of the font, each sending ripples across it. */
export function BaptismalWater({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<SVGSVGElement>(art);
  const id = useSvgId();

  return (
    <svg ref={ref} viewBox="0 0 240 120" className={`${className} ${artClass}`} style={artStyle} fill="none" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}-water`} cx="0.5" cy="0.4">
          <stop offset="0" stopColor="var(--glass-blue)" stopOpacity="0.55" />
          <stop offset="1" stopColor="var(--glass-blue)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse className="floral-pop" style={delayStyle(0)} cx="120" cy="84" rx="116" ry="22" fill={`url(#${id}-water)`} />
      <ellipse className="floral-stem" pathLength={1} style={delayStyle(0.2)} cx="120" cy="84" rx="104" ry="15" stroke="var(--primary)" strokeWidth="0.8" opacity="0.6" />
      {[0, 1.2, 2.4].map((offset) => (
        <g key={offset}>
          <g transform="translate(120 20)">
            <path className="luz-drop" style={delayStyle(0.8 + offset)} d="M0 -6 C 3 -1, 4.5 2, 4.5 4 A 4.5 4.5 0 0 1 -4.5 4 C -4.5 2, -3 -1, 0 -6 Z" fill="var(--glass-blue)" stroke="var(--flame-core)" strokeWidth="0.6" />
          </g>
          <g transform="translate(120 84)">
            <ellipse className="luz-ripple" style={delayStyle(0.8 + offset)} rx="96" ry="13" stroke="var(--flame)" strokeWidth="1" />
          </g>
          <g transform="translate(120 84)">
            <ellipse className="luz-ripple" style={delayStyle(1.1 + offset)} rx="60" ry="8" stroke="var(--flame-core)" strokeWidth="0.8" />
          </g>
        </g>
      ))}
      <Sparkle x={40} y={40} scale={0.45} delay={1.6} color="var(--flame)" />
      <Sparkle x={206} y={28} scale={0.4} delay={2.2} color="var(--flame-core)" />
    </svg>
  );
}

/** A small flame between two rules that draw outward, used between sections. */
export function FlameDivider({ className = '', ...art }: ArtProps) {
  const { ref, artClass, artStyle } = useArt<HTMLDivElement>(art);

  return (
    <div ref={ref} className={`pointer-events-none flex justify-center ${className}`} aria-hidden="true">
      <svg viewBox="0 0 300 50" className={`h-auto w-[min(320px,80vw)] ${artClass}`} style={artStyle} fill="none">
        <g stroke="var(--primary)" strokeLinecap="round">
          <path className="floral-stem" pathLength={1} style={delayStyle(0.2)} d="M136 34 L 30 34" strokeWidth="0.8" />
          <path className="floral-stem" pathLength={1} style={delayStyle(0.2)} d="M164 34 L 270 34" strokeWidth="0.8" />
        </g>
        <circle className="floral-pop" style={delayStyle(0.9)} cx="26" cy="34" r="2" fill="var(--primary)" />
        <circle className="floral-pop" style={delayStyle(0.9)} cx="274" cy="34" r="2" fill="var(--primary)" />
        <g transform="translate(150 40) scale(0.62)">
          <g className="floral-pop" style={delayStyle(0)}>
            <Flame />
          </g>
        </g>
        <path d="M144 40 L 156 40" stroke="var(--primary)" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </div>
  );
}
