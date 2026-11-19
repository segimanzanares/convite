/*
 * Animated illustrations of the revelacion-osito template, drawn in its tokens (--fur, --fur-light, --girl, --boy,
 * --honey): a teddy bear that tilts its head and blinks while it holds a rose and a blue balloon, the head of each
 * team's bear (with a bow or a bow tie), a bear asleep on the moon for the countdown and the gift box of the intro.
 * The motion lives in this template's theme.css.
 */
import type { CSSProperties } from 'react';
import type { BabyGender } from '../../../types/invitation';
import { starPath } from '../../../components/gender-reveal/shapes';

const INK = 'var(--fur-dark)';

/** A bear's head around (100, 112): ears, muzzle, blinking eyes and rosy cheeks. Closed eyes for a sleeping bear. */
function BearHead({ asleep = false }: { asleep?: boolean }) {
  return (
    <>
      <circle cx="66" cy="84" r="17" fill="var(--fur)" />
      <circle cx="134" cy="84" r="17" fill="var(--fur)" />
      <circle cx="66" cy="84" r="9" fill="var(--fur-light)" />
      <circle cx="134" cy="84" r="9" fill="var(--fur-light)" />
      <circle cx="100" cy="112" r="40" fill="var(--fur)" />
      <ellipse cx="100" cy="127" rx="19" ry="14" fill="var(--fur-light)" />
      <ellipse cx="100" cy="121" rx="6.5" ry="4.8" fill={INK} />
      <path d="M93 131 Q 100 137 107 131" fill="none" stroke={INK} strokeWidth="2.2" strokeLinecap="round" />
      {asleep ? (
        <g fill="none" stroke={INK} strokeWidth="2.4" strokeLinecap="round">
          <path d="M79 106 Q 85 111 91 106" />
          <path d="M109 106 Q 115 111 121 106" />
        </g>
      ) : (
        <g fill={INK}>
          <circle className="osito-blink" cx="85" cy="106" r="4.4" />
          <circle className="osito-blink" cx="115" cy="106" r="4.4" />
        </g>
      )}
      <circle cx="77" cy="122" r="5.5" fill="var(--girl)" opacity="0.45" />
      <circle cx="123" cy="122" r="5.5" fill="var(--girl)" opacity="0.45" />
    </>
  );
}

function sway(origin: string, every: number, wait: number, swing: number): CSSProperties {
  return { '--origin': origin, '--every': `${every}s`, '--wait': `${wait}s`, '--swing': `${swing}deg` } as CSSProperties;
}

/** A balloon on a string from (x, y) up to its body around (bx, by), swaying from the bear's paw. */
function PawBalloon({ x, y, bx, by, color, every, wait }: { x: number; y: number; bx: number; by: number; color: string; every: number; wait: number }) {
  return (
    <g className="osito-sway" style={sway(`${x}px ${y}px`, every, wait, 6)}>
      <path d={`M${x} ${y} Q ${(x + bx) / 2 + 8} ${(y + by) / 2} ${bx} ${by + 29}`} fill="none" stroke={INK} strokeOpacity="0.45" strokeWidth="1.4" />
      <ellipse cx={bx} cy={by} rx="23" ry="28" fill={`var(${color})`} />
      <path d={`M${bx - 4} ${by + 31} L ${bx} ${by + 26} L ${bx + 4} ${by + 31} Z`} fill={`var(${color})`} />
      <ellipse cx={bx - 8} cy={by - 10} rx="5" ry="9" fill="white" opacity="0.45" transform={`rotate(-20 ${bx - 8} ${by - 10})`} />
    </g>
  );
}

/**
 * The teddy sitting with a rose and a blue balloon, tilting its head as if asking "¿osito u osita?". Once the answer is
 * out it only keeps the balloon of that team, and a bow or a bow tie.
 */
export function Teddy({ className, answer = null }: { className?: string; answer?: BabyGender | null }) {
  return (
    <svg viewBox="0 -10 200 240" className={className} aria-hidden="true">
      {answer !== 'boy' && <PawBalloon x={62} y={160} bx={48} by={34} color="--girl" every={5.2} wait={0} />}
      {answer !== 'girl' && <PawBalloon x={138} y={160} bx={154} by={22} color="--boy" every={4.6} wait={-1.6} />}
      <ellipse cx="100" cy="222" rx="62" ry="6" fill={INK} opacity="0.1" />
      <ellipse cx="100" cy="182" rx="45" ry="39" fill="var(--fur)" />
      <ellipse cx="100" cy="190" rx="27" ry="23" fill="var(--fur-light)" />
      <ellipse cx="66" cy="166" rx="12" ry="19" fill="var(--fur)" transform="rotate(32 66 166)" />
      <ellipse cx="134" cy="166" rx="12" ry="19" fill="var(--fur)" transform="rotate(-32 134 166)" />
      <circle cx="60" cy="157" r="8" fill="var(--fur-light)" />
      <circle cx="140" cy="157" r="8" fill="var(--fur-light)" />
      <ellipse cx="74" cy="214" rx="16" ry="10" fill="var(--fur)" />
      <ellipse cx="126" cy="214" rx="16" ry="10" fill="var(--fur)" />
      <ellipse cx="74" cy="214" rx="8" ry="5.5" fill="var(--fur-light)" />
      <ellipse cx="126" cy="214" rx="8" ry="5.5" fill="var(--fur-light)" />
      <g className="osito-tilt">
        <BearHead />
        {answer === 'girl' && <Bow x={128} y={78} color="--girl" />}
        {answer === 'boy' && <BowTie x={100} y={152} color="--boy" />}
      </g>
    </svg>
  );
}

function Bow({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`} fill={`var(${color})`}>
      <path d="M0 0 C -14 -12, -20 6, -2 4 Z" />
      <path d="M0 0 C 14 -12, 20 6, 2 4 Z" />
      <circle cx="0" cy="1.5" r="4" />
    </g>
  );
}

function BowTie({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <g transform={`translate(${x} ${y})`} fill={`var(${color})`}>
      <path d="M0 0 L -16 -9 L -16 9 Z" />
      <path d="M0 0 L 16 -9 L 16 9 Z" />
      <circle cx="0" cy="0" r="4.5" />
    </g>
  );
}

/** The head of each team's bear: a bow for the osita, a bow tie for the osito, on a rose or blue circle. */
export function TeamBear({ gender }: { gender: BabyGender }) {
  return (
    <svg viewBox="40 56 120 120" className="mx-auto w-[78%]">
      <circle cx="100" cy="116" r="58" fill={`var(--${gender}-soft)`} />
      <g className="osito-tilt" style={{ animationDelay: gender === 'girl' ? '0s' : '-3s' }}>
        <BearHead />
        {gender === 'girl' ? <Bow x={130} y={76} color="--girl" /> : <BowTie x={100} y={158} color="--boy" />}
      </g>
    </svg>
  );
}

const STARS = [
  { x: 30, y: 30, r: 7, wait: 0 },
  { x: 210, y: 24, r: 5, wait: -1.2 },
  { x: 196, y: 120, r: 6, wait: -2.1 },
  { x: 22, y: 110, r: 4.5, wait: -0.6 },
];

/** A bear asleep on a honey crescent moon, its Zzz floating up, among twinkling stars. */
export function SleepyMoon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 170" className={className} aria-hidden="true">
      <defs>
        <mask id="osito-moon-mask">
          <rect width="240" height="170" fill="white" />
          <circle cx="152" cy="62" r="56" fill="black" />
        </mask>
      </defs>
      {STARS.map(({ x, y, r, wait }) => (
        <path key={`${x}-${y}`} className="osito-twinkle" style={{ '--wait': `${wait}s` } as CSSProperties} d={starPath(x, y, r)} fill="var(--honey)" />
      ))}
      <circle cx="120" cy="96" r="66" fill="var(--honey)" mask="url(#osito-moon-mask)" />
      <g transform="translate(46 64) scale(0.55)">
        <ellipse cx="100" cy="166" rx="52" ry="28" fill="var(--fur)" />
        <BearHead asleep />
      </g>
      {['Z', 'z', 'z'].map((letter, index) => (
        <text
          key={index}
          className="osito-zzz"
          style={{ '--wait': `${-index * 1.2}s` } as CSSProperties}
          x={126}
          y={54}
          fontFamily="Caveat, cursive"
          fontWeight="700"
          fontSize={22 - index * 4}
          fill="var(--fur-dark)"
        >
          {letter}
        </text>
      ))}
    </svg>
  );
}

/** The gift box of the intro: rose and blue ribbons and a bow; when its root gets .is-open the lid flies off and the bear peeks out. */
export function GiftBox({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 210" className={className} aria-hidden="true">
      <g className="osito-peek">
        <g transform="translate(0 -36)">
          <BearHead />
        </g>
      </g>
      <rect x="38" y="100" width="124" height="100" rx="8" fill="var(--card)" stroke="var(--border)" strokeWidth="2" />
      <rect x="92" y="100" width="16" height="100" fill="var(--girl)" />
      <rect x="38" y="140" width="124" height="14" fill="var(--boy)" opacity="0.85" />
      <g className="osito-lid">
        <rect x="30" y="80" width="140" height="26" rx="6" fill="var(--card)" stroke="var(--border)" strokeWidth="2" />
        <rect x="92" y="80" width="16" height="26" fill="var(--girl)" />
        <path d="M100 80 C 72 50, 64 82, 100 80 Z" fill="var(--girl)" />
        <path d="M100 80 C 128 50, 136 82, 100 80 Z" fill="var(--boy)" />
        <circle cx="100" cy="79" r="6" fill="var(--honey)" />
      </g>
    </svg>
  );
}
