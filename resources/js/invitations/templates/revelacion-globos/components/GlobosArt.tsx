/*
 * Animated balloons of the revelacion-globos template, drawn in its tokens (--girl, --boy, --lemon, --primary): the big
 * mystery balloon with pink and blue confetti jiggling inside, balloons that bob on their strings, a bunch that rises
 * behind the countdown and the balloon of each team. The motion lives in this template's theme.css.
 */
import { useId, type CSSProperties, type ReactNode } from 'react';
import { cn } from '../../../components/ui/styles';
import { starPath } from '../../../components/gender-reveal/shapes';

const BODY = 'M50 6 C 22 6 8 30 8 54 C 8 82 30 102 50 108 C 70 102 92 82 92 54 C 92 30 78 6 50 6 Z';
const KNOT = 'M45 116 L50 107 L55 116 Q 50 118 45 116 Z';
const STRING = 'M50 117 C 42 128 58 140 50 158';

interface MotionProps {
  every?: number;
  wait?: number;
  tilt?: number;
  lift?: number;
}

function motion({ every = 5, wait = 0, tilt = 4, lift = -14 }: MotionProps): CSSProperties {
  return { '--every': `${every}s`, '--wait': `${wait}s`, '--tilt': `${tilt}deg`, '--lift': `${lift}px` } as CSSProperties;
}

interface BalloonProps extends MotionProps {
  /** CSS variable of its color, e.g. "--girl". */
  color: string;
  className?: string;
  /** Drawn over the balloon, in its 100 × 160 box. */
  children?: ReactNode;
}

/** One balloon bobbing on its string. */
export function Balloon({ color, className, children, ...timing }: BalloonProps) {
  return (
    <svg viewBox="0 -18 100 178" className={className} aria-hidden="true">
      <g className="globos-bob" style={motion(timing)}>
        <path d={STRING} fill="none" stroke="var(--foreground)" strokeOpacity="0.35" strokeWidth="1.4" strokeLinecap="round" />
        <path d={BODY} fill={`var(${color})`} />
        <path d={KNOT} fill={`var(${color})`} />
        <ellipse cx="30" cy="34" rx="8" ry="15" fill="white" opacity="0.45" transform="rotate(-25 30 34)" />
        {children}
      </g>
    </svg>
  );
}

const CONFETTI = [
  { x: 30, y: 62, color: '--girl', shape: 'strip' },
  { x: 62, y: 44, color: '--boy', shape: 'dot' },
  { x: 44, y: 84, color: '--lemon', shape: 'strip' },
  { x: 70, y: 74, color: '--girl', shape: 'dot' },
  { x: 24, y: 40, color: '--boy', shape: 'strip' },
  { x: 54, y: 96, color: '--boy', shape: 'dot' },
  { x: 78, y: 54, color: '--girl', shape: 'strip' },
  { x: 38, y: 26, color: '--lemon', shape: 'dot' },
  { x: 60, y: 22, color: '--girl', shape: 'strip' },
  { x: 20, y: 76, color: '--lemon', shape: 'dot' },
] as const;

/**
 * The mystery balloon: a clear balloon full of pink, blue and lemon confetti that jiggles while it bobs, with a big
 * question mark. Once the answer is out the question mark becomes a heart (girl) or a star (boy).
 */
export function MysteryBalloon({ className, answer = null }: { className?: string; answer?: 'girl' | 'boy' | null }) {
  // Safe in url(#...) references, whatever characters React's ids carry
  const id = `globos${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;

  return (
    <svg viewBox="0 -18 100 178" className={className} aria-hidden="true">
      <defs>
        <clipPath id={`${id}-clip`}>
          <path d={BODY} />
        </clipPath>
        <radialGradient id={`${id}-glass`} cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="white" stopOpacity="0.95" />
          <stop offset="1" stopColor="var(--secondary)" stopOpacity="0.85" />
        </radialGradient>
      </defs>
      <g className="globos-bob" style={motion({ every: 6, tilt: 3, lift: -10 })}>
        <path d={STRING} fill="none" stroke="var(--foreground)" strokeOpacity="0.4" strokeWidth="1.2" strokeLinecap="round" />
        <path d={BODY} fill={answer ? `var(--${answer})` : `url(#${id}-glass)`} stroke="var(--primary)" strokeOpacity="0.35" strokeWidth="1.2" />
        <path d={KNOT} fill="var(--primary)" opacity="0.6" />
        {!answer && (
          <g clipPath={`url(#${id}-clip)`}>
            {CONFETTI.map(({ x, y, color, shape }, index) => (
              <g key={index} className="globos-jiggle" style={motion({ every: 1.8 + (index % 4) * 0.4, wait: -index * 0.3 })}>
                {shape === 'dot' ? (
                  <circle cx={x} cy={y} r="3.2" fill={`var(${color})`} />
                ) : (
                  <rect x={x - 2} y={y - 4.5} width="4" height="9" rx="1" fill={`var(${color})`} transform={`rotate(${index * 37} ${x} ${y})`} />
                )}
              </g>
            ))}
          </g>
        )}
        <ellipse cx="30" cy="34" rx="7" ry="14" fill="white" opacity="0.7" transform="rotate(-25 30 34)" />
        {answer === 'girl' ? (
          <path className="globos-wink" d="M50 72 C 34 60, 36 44, 50 52 C 64 44, 66 60, 50 72 Z" fill="white" />
        ) : answer === 'boy' ? (
          <path className="globos-wink" d={starPath(50, 56, 15)} fill="white" />
        ) : (
          <text
            className="globos-wink"
            x="50"
            y="68"
            textAnchor="middle"
            fontFamily="Sniglet, sans-serif"
            fontWeight="800"
            fontSize="40"
            fill="var(--primary)"
          >
            ?
          </text>
        )}
      </g>
    </svg>
  );
}

/** Three balloons tied together, for the sides of the hero and the RSVP's thanks. */
export function BalloonBunch({ className, wait = 0 }: { className?: string; wait?: number }) {
  return (
    <div className={className} aria-hidden="true">
      <div className="relative aspect-[5/6]">
        <Balloon color="--girl" every={5.4} wait={wait} tilt={6} className="absolute top-[6%] left-0 w-[46%]" />
        <Balloon color="--lemon" every={6.2} wait={wait - 1.5} tilt={3} className="absolute top-0 left-[27%] w-[46%]" />
        <Balloon color="--boy" every={4.8} wait={wait - 3} tilt={5} className="absolute top-[8%] right-0 w-[46%]" />
      </div>
    </div>
  );
}

const RISING = [
  { color: '--girl', left: '6%', size: 'w-10', every: 9, wait: 0, dx: 24 },
  { color: '--boy', left: '20%', size: 'w-8', every: 11, wait: -4, dx: -18 },
  { color: '--lemon', left: '36%', size: 'w-7', every: 10, wait: -7, dx: 14 },
  { color: '--boy', left: '62%', size: 'w-9', every: 12, wait: -2, dx: -26 },
  { color: '--girl', left: '78%', size: 'w-8', every: 9.5, wait: -6, dx: 20 },
  { color: '--lemon', left: '90%', size: 'w-6', every: 10.5, wait: -9, dx: -12 },
];

/** Balloons that rise from the bottom of their box and leave, one after another, behind the countdown. */
export function RisingBalloons() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-full overflow-hidden" aria-hidden="true">
      {RISING.map(({ color, left, size, every, wait, dx }) => (
        <div key={left} className={cn('globos-rise absolute bottom-0', size)} style={{ left, '--every': `${every}s`, '--wait': `${wait}s`, '--dx': `${dx}px` } as CSSProperties}>
          <Balloon color={color} every={3} tilt={8} lift={-4} className="w-full opacity-70" />
        </div>
      ))}
    </div>
  );
}

/** The balloon of each team: pink with a bow-shaped heart for the girls, blue with a star for the boys. */
export function TeamBalloon({ gender }: { gender: 'girl' | 'boy' }) {
  return (
    <Balloon color={`--${gender}`} every={gender === 'girl' ? 4.6 : 5.2} wait={gender === 'girl' ? 0 : -2} tilt={5} className="mx-auto w-[70%]">
      {gender === 'girl' ? (
        <path d="M50 66 C 36 56, 38 42, 50 49 C 62 42, 64 56, 50 66 Z" fill="white" opacity="0.9" />
      ) : (
        <path d={starPath(50, 54, 13)} fill="white" opacity="0.9" />
      )}
    </Balloon>
  );
}
