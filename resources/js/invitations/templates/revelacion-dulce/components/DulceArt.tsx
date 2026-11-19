/*
 * Animated bakery of the revelacion-dulce template, drawn in its tokens (--frosting, --sponge, --chocolate, --girl,
 * --boy, --flame): a two-tier cake with a "?" topper, a flickering candle and a knife hovering over it, which once the
 * answer is out cuts a slice that slides away to show a sponge of that color; sprinkles falling, a cupcake for each
 * team, a kitchen timer for the countdown, the bakery box of the intro and the frosting drips between sections. The
 * motion lives in this template's theme.css.
 */
import type { CSSProperties } from 'react';
import type { BabyGender } from '../../../types/invitation';
import { cn } from '../../../components/ui/styles';

const DRIPS = 'M72 86 L168 86 L168 96 Q 162 110 156 96 Q 150 92 146 100 Q 140 116 134 100 Q 128 90 120 98 Q 112 112 106 98 Q 100 90 94 100 Q 88 118 82 100 Q 76 92 72 98 Z';

const SPRINKLES = [
  { x: 24, color: '--girl', every: 4.2, wait: 0 },
  { x: 44, color: '--boy', every: 5, wait: -1.8 },
  { x: 196, color: '--girl', every: 4.6, wait: -3 },
  { x: 214, color: '--boy', every: 5.4, wait: -0.8 },
  { x: 60, color: '--flame', every: 6, wait: -4 },
  { x: 182, color: '--flame', every: 5.6, wait: -2.4 },
];

/** Sprinkles falling at the sides of a 240-wide box. */
function FallingSprinkles() {
  return (
    <g>
      {SPRINKLES.map(({ x, color, every, wait }, index) => (
        <rect
          key={x}
          className="dulce-sprinkle"
          style={{ '--every': `${every}s`, '--wait': `${wait}s`, '--spin': `${index % 2 ? -260 : 240}deg` } as CSSProperties}
          x={x}
          y={10}
          width="4"
          height="11"
          rx="2"
          fill={`var(${color})`}
        />
      ))}
    </g>
  );
}

/**
 * The cake. Before the answer a knife hovers over it; after, a slice of the bottom tier slides out and the cut shows a
 * sponge of the team's color.
 */
export function Cake({ className, answer = null }: { className?: string; answer?: BabyGender | null }) {
  return (
    <svg viewBox="0 0 240 230" className={className} aria-hidden="true">
      <FallingSprinkles />
      <ellipse cx="120" cy="212" rx="104" ry="13" fill="var(--card)" stroke="var(--border)" strokeWidth="2" />

      {/* Bottom tier: frosting outside, with a band of strawberry and blueberry dots */}
      <rect x="38" y="128" width="164" height="82" rx="10" fill="var(--frosting)" stroke="var(--border)" strokeWidth="2" />
      {answer && (
        <g>
          <rect x="150" y="130" width="40" height="78" fill={`var(--${answer})`} />
          {[146, 168, 190].map((y) => (
            <rect key={y} x="150" y={y} width="40" height="5" fill="var(--frosting)" />
          ))}
        </g>
      )}
      {Array.from({ length: 9 }, (_, index) => (
        <circle key={index} cx={52 + index * 17} cy="168" r="4.5" fill={index % 2 ? 'var(--boy)' : 'var(--girl)'} opacity={answer && index >= 6 && index <= 8 ? 0 : 1} />
      ))}
      {answer && (
        <g className="dulce-slice">
          <rect x="150" y="128" width="40" height="82" rx="3" fill="var(--frosting)" stroke="var(--border)" strokeWidth="2" />
          <circle cx="158" cy="168" r="4.5" fill="var(--boy)" />
          <circle cx="175" cy="168" r="4.5" fill="var(--girl)" />
        </g>
      )}

      {/* Top tier with chocolate drips */}
      <rect x="72" y="80" width="96" height="52" rx="8" fill="var(--sponge)" />
      <path d={DRIPS} fill="var(--chocolate)" />
      <rect x="72" y="78" width="96" height="10" rx="5" fill="var(--chocolate)" />

      {/* Candle */}
      <rect x="146" y="56" width="7" height="24" rx="2" fill="var(--girl-soft)" stroke="var(--girl)" strokeWidth="1.2" />
      <path className="dulce-flame" d="M149.5 40 C 144 48, 145 55, 149.5 55 C 154 55, 155 48, 149.5 40 Z" fill="var(--flame)" />

      {/* Topper */}
      <path d="M110 78 L 110 40" stroke="var(--chocolate)" strokeWidth="2" />
      <circle cx="110" cy="32" r="17" fill="var(--card)" stroke="var(--chocolate)" strokeWidth="2" />
      {answer ? (
        <path d="M110 41 C 98 33, 100 22, 110 28 C 120 22, 122 33, 110 41 Z" fill={`var(--${answer})`} />
      ) : (
        <text x="110" y="41" textAnchor="middle" fontFamily="Shrikhand, serif" fontSize="25" fill="var(--chocolate)">
          ?
        </text>
      )}

      {!answer && (
        <g className="dulce-knife">
          <rect x="164" y="26" width="12" height="30" rx="4" fill="var(--chocolate)" />
          <path d="M163 56 L 177 56 L 175 106 Q 171 116 167 104 Z" fill="var(--muted)" stroke="var(--muted-foreground)" strokeWidth="1.5" strokeLinejoin="round" />
        </g>
      )}
    </svg>
  );
}

/** Each team's cupcake: a frosting swirl of its color that wobbles, a cherry or a blueberry on top. */
export function Cupcake({ gender, className }: { gender: BabyGender; className?: string }) {
  const frosting = `var(--${gender})`;

  return (
    <svg viewBox="0 0 120 130" className={cn('mx-auto w-[72%]', className)} aria-hidden="true">
      <path d="M26 76 L94 76 L85 124 L35 124 Z" fill="var(--chocolate)" />
      {[38, 52, 66, 80].map((x) => (
        <path key={x} d={`M${x} 76 L ${x - 3} 124`} stroke="var(--frosting)" strokeOpacity="0.35" strokeWidth="3" />
      ))}
      <g className="dulce-wobble" style={{ '--every': gender === 'girl' ? '2.8s' : '3.2s', '--wait': gender === 'girl' ? '0s' : '-1s' } as CSSProperties}>
        <ellipse cx="60" cy="72" rx="38" ry="14" fill={frosting} />
        <ellipse cx="60" cy="58" rx="29" ry="12" fill={frosting} />
        <ellipse cx="60" cy="46" rx="19" ry="10" fill={frosting} />
        <path d="M54 38 Q 60 24 66 38 Z" fill={frosting} />
        <ellipse cx="48" cy="58" rx="9" ry="3.5" fill="white" opacity="0.35" />
        {[
          [44, 70, 30],
          [72, 66, -40],
          [60, 52, 70],
          [80, 74, 10],
          [38, 60, -20],
        ].map(([x, y, angle]) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="3" height="8" rx="1.5" fill="var(--frosting)" transform={`rotate(${angle} ${x} ${y})`} />
        ))}
        <circle cx="60" cy="27" r="7" fill={`var(--${gender}-foreground)`} />
        <path d="M60 20 Q 64 12 70 12" fill="none" stroke="var(--chocolate)" strokeWidth="1.6" strokeLinecap="round" />
      </g>
    </svg>
  );
}

/** A round kitchen timer whose dial keeps turning, for the countdown ("horneando la sorpresa"). */
export function KitchenTimer({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 124" className={className} aria-hidden="true">
      <rect x="52" y="6" width="16" height="12" rx="4" fill="var(--chocolate)" />
      <circle cx="60" cy="66" r="50" fill="var(--girl)" />
      <circle cx="60" cy="66" r="38" fill="var(--frosting)" />
      <g className="dulce-dial">
        {Array.from({ length: 12 }, (_, index) => {
          const angle = (index * Math.PI) / 6;
          const long = index % 3 === 0;
          return (
            <line
              key={index}
              x1={60 + Math.sin(angle) * 33}
              y1={66 - Math.cos(angle) * 33}
              x2={60 + Math.sin(angle) * (long ? 24 : 28)}
              y2={66 - Math.cos(angle) * (long ? 24 : 28)}
              stroke={long ? 'var(--boy)' : 'var(--chocolate)'}
              strokeWidth={long ? 3.5 : 2}
              strokeLinecap="round"
            />
          );
        })}
      </g>
      <path d="M60 24 L 55 14 L 65 14 Z" fill="var(--chocolate)" />
      <circle cx="60" cy="66" r="9" fill="var(--chocolate)" />
    </svg>
  );
}

/** The bakery box of the intro: a little cake behind its window, the lid flips open when its root gets .is-open. */
export function BakeryBox({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 190" className={className} aria-hidden="true">
      <rect x="30" y="72" width="140" height="104" rx="8" fill="var(--girl-soft)" stroke="var(--girl)" strokeWidth="2" />
      <rect x="56" y="92" width="88" height="62" rx="31" fill="var(--card)" stroke="var(--girl)" strokeWidth="2" />
      <g transform="translate(70 96) scale(0.25)">
        <rect x="38" y="128" width="164" height="82" rx="10" fill="var(--frosting)" />
        <rect x="72" y="80" width="96" height="52" rx="8" fill="var(--sponge)" />
        <path d={DRIPS} fill="var(--chocolate)" />
        {Array.from({ length: 9 }, (_, index) => (
          <circle key={index} cx={52 + index * 17} cy="168" r="6" fill={index % 2 ? 'var(--boy)' : 'var(--girl)'} />
        ))}
      </g>
      <g className="dulce-lid">
        <path d="M22 58 L178 58 L172 78 L28 78 Z" fill="var(--girl)" />
        <rect x="70" y="40" width="60" height="22" rx="11" fill="var(--card)" stroke="var(--girl)" strokeWidth="2" />
        <text x="100" y="56" textAnchor="middle" fontFamily="Shrikhand, serif" fontSize="12" fill="var(--chocolate)">
          ¿?
        </text>
      </g>
    </svg>
  );
}

/** A band of frosting dripping down, in the given color, to join two sections. */
export function DripDivider({ color, className }: { color: string; className?: string }) {
  return (
    <svg viewBox="0 0 400 40" preserveAspectRatio="none" className={cn('block h-8 w-full sm:h-10', className)} aria-hidden="true">
      <path
        d="M0 0 H400 V10 Q 392 34 384 12 Q 376 6 368 14 Q 356 40 344 14 Q 334 4 322 12 Q 310 28 300 12 Q 290 4 278 14 Q 266 38 254 12 Q 244 4 232 10 Q 222 24 212 10 Q 202 4 190 14 Q 178 36 166 12 Q 156 4 144 12 Q 134 26 124 10 Q 114 4 102 14 Q 90 38 78 12 Q 68 4 56 10 Q 46 24 36 12 Q 26 4 16 14 Q 8 30 0 12 Z"
        fill={`var(${color})`}
      />
    </svg>
  );
}
