/*
 * The night sky of the revelacion-estrellas template, drawn in its tokens (--starlight, --feather, --peach, --girl,
 * --boy): twinkling stars and a shooting star, a stork that flies across flapping its wings with a bundle swinging
 * from its beak, a crescent moon and each team's little star. The motion lives in this template's theme.css.
 */
import type { CSSProperties } from 'react';
import type { BabyGender } from '../../../types/invitation';
import { cn } from '../../../components/ui/styles';
import { starPath } from '../../../components/gender-reveal/shapes';

/** Deterministic pseudo-random numbers, so the stars stay in place on every render. */
function noise(seed: number) {
  const value = Math.sin(seed * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

/** A field of twinkling stars (dots and a few sparkles) and a shooting star, filling its positioned parent. */
export function StarrySky({ count = 46, className }: { count?: number; className?: string }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      <svg className="absolute inset-0 size-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 100 100">
        {Array.from({ length: count }, (_, index) => (
          <circle
            key={index}
            className="estrellas-twinkle"
            style={{ '--every': `${(2 + noise(index + 1) * 3).toFixed(2)}s`, '--wait': `${(-noise(index + 2) * 4).toFixed(2)}s` } as CSSProperties}
            cx={(noise(index + 3) * 100).toFixed(2)}
            cy={(noise(index + 4) * 100).toFixed(2)}
            r={(0.15 + noise(index + 5) * 0.25).toFixed(2)}
            fill="var(--starlight)"
          />
        ))}
      </svg>
      {[
        { left: '12%', top: '18%', size: 16, color: '--girl', wait: 0 },
        { left: '84%', top: '30%', size: 12, color: '--boy', wait: -1.2 },
        { left: '70%', top: '78%', size: 14, color: '--starlight', wait: -2.4 },
        { left: '22%', top: '70%', size: 10, color: '--peach', wait: -0.8 },
      ].map(({ left, top, size, color, wait }) => (
        <svg key={left} viewBox="0 0 20 20" className="estrellas-twinkle absolute" style={{ left, top, width: size, height: size, '--wait': `${wait}s` } as CSSProperties}>
          <path d={starPath(10, 10, 10, 0.35)} fill={`var(${color})`} />
        </svg>
      ))}
      <span
        className="estrellas-shoot absolute top-[8%] right-[6%] h-0.5 w-24 rounded-full bg-[linear-gradient(90deg,var(--starlight),transparent)]"
        style={{ rotate: '-30deg', '--every': '8s' } as CSSProperties}
      />
    </div>
  );
}

/** The stork, its wing flapping and the bundle (with a "?", or in the team's color) swinging from its beak. */
export function Stork({ answer = null, className }: { answer?: BabyGender | null; className?: string }) {
  const bundle = answer ? `var(--${answer})` : 'var(--peach)';

  return (
    <svg viewBox="0 0 220 150" className={className} aria-hidden="true">
      {/* Legs and tail */}
      <path d="M84 70 L 44 84 M90 72 L 50 92" stroke="var(--peach)" strokeWidth="3" strokeLinecap="round" />
      <path d="M68 56 L 40 50 L 46 62 L 38 70 L 70 66 Z" fill="var(--night)" opacity="0.85" />
      {/* Body, neck and head */}
      <ellipse cx="100" cy="60" rx="36" ry="17" fill="var(--feather)" />
      <path d="M124 52 C 136 46, 138 36, 148 32" stroke="var(--feather)" strokeWidth="11" strokeLinecap="round" fill="none" />
      <circle cx="152" cy="32" r="11" fill="var(--feather)" />
      <circle cx="155" cy="29" r="1.8" fill="var(--night)" />
      <path d="M160 30 L 196 42 L 160 38 Z" fill="var(--peach)" />
      {/* Bundle */}
      <g className="estrellas-swing">
        <path d="M192 42 L 188 68" stroke="var(--feather)" strokeWidth="1.5" />
        <path d="M178 68 L 188 62 L 198 68 Z" fill={bundle} />
        <circle cx="188" cy="92" r="24" fill={bundle} />
        <path d="M168 84 Q 188 98 208 84" stroke="var(--feather)" strokeOpacity="0.6" strokeWidth="2" fill="none" />
        {answer ? (
          <path d="M188 104 C 176 96, 178 84, 188 90 C 198 84, 200 96, 188 104 Z" fill="var(--feather)" />
        ) : (
          <text x="188" y="104" textAnchor="middle" fontFamily="Gloock, serif" fontSize="22" fill="var(--night)">
            ?
          </text>
        )}
      </g>
      {/* Wing */}
      <g className="estrellas-flap">
        <path d="M104 56 C 88 18, 56 6, 28 12 C 50 22, 66 40, 92 64 Z" fill="var(--feather)" stroke="var(--secondary)" strokeWidth="1.2" />
        <path d="M66 22 C 52 16, 40 14, 28 12 C 40 20, 50 26, 58 34 Z" fill="var(--night)" opacity="0.8" />
      </g>
    </svg>
  );
}

/** The stork crossing its band from side to side, gliding up and down. */
export function FlyingStork({ answer, className }: { answer?: BabyGender | null; className?: string }) {
  return (
    <div className={cn('pointer-events-none relative h-36 overflow-hidden sm:h-44', className)} aria-hidden="true">
      <div className="estrellas-fly absolute top-2 left-0 w-52 sm:w-64">
        <div className="estrellas-glide">
          <Stork answer={answer} className="w-full" />
        </div>
      </div>
    </div>
  );
}

/** A starlight crescent moon with a sleeping face. */
export function Moon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={cn('estrellas-float', className)} style={{ '--every': '7s' } as CSSProperties} aria-hidden="true">
      <path d="M62 8 A 44 44 0 1 0 92 70 A 36 36 0 1 1 62 8 Z" fill="var(--starlight)" />
      <path d="M34 50 Q 39 54 44 50" fill="none" stroke="var(--night)" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="34" cy="62" r="4" fill="var(--girl)" opacity="0.5" />
      <path d="M40 70 Q 46 74 52 70" fill="none" stroke="var(--night)" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Each team's little star with a face: pink for the girls, blue for the boys. */
export function TeamStar({ gender }: { gender: BabyGender }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className="estrellas-float mx-auto w-[66%]"
      style={{ '--every': gender === 'girl' ? '5s' : '6s', '--wait': gender === 'girl' ? '0s' : '-2s' } as CSSProperties}
    >
      <path d={starPath(50, 54, 46, 0.5)} fill={`var(--${gender})`} stroke="var(--feather)" strokeWidth="3" strokeLinejoin="round" />
      <circle cx="40" cy="54" r="3.4" fill="var(--night)" />
      <circle cx="60" cy="54" r="3.4" fill="var(--night)" />
      <path d="M44 63 Q 50 68 56 63" fill="none" stroke="var(--night)" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="33" cy="62" r="4" fill="var(--feather)" opacity="0.5" />
      <circle cx="67" cy="62" r="4" fill="var(--feather)" opacity="0.5" />
      {gender === 'girl' ? (
        <g transform="translate(64 22)" fill="var(--girl-foreground)">
          <path d="M0 0 C -10 -8, -14 4, -1 3 Z" />
          <path d="M0 0 C 10 -8, 14 4, 1 3 Z" />
          <circle cx="0" cy="1" r="3" />
        </g>
      ) : (
        <path d="M50 12 Q 58 4 62 12" fill="none" stroke="var(--boy-foreground)" strokeWidth="3" strokeLinecap="round" />
      )}
    </svg>
  );
}
