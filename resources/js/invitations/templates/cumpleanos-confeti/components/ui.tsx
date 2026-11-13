import type { CSSProperties, ReactNode } from 'react';
import { Sparkles } from 'lucide-react';
import { Reveal } from '../../../components/shared/Reveal';
import { cn } from '../../../components/ui/styles';

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
}

/** A rose badge with a sparkle, a DM Serif title and a muted lead, centered. */
export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <Reveal className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-(--secondary) px-3 py-1 text-xs font-semibold text-(--secondary-foreground)">
        <Sparkles className="size-3.5" aria-hidden="true" />
        {eyebrow}
      </span>
      <h2 className="mt-4 font-dm-serif text-[clamp(34px,5.5vw,52px)] leading-[1.05] text-balance">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-pretty text-(--muted-foreground) sm:text-lg">{description}</p>}
    </Reveal>
  );
}

const COLORS = ['--confetti-rose', '--confetti-lilac', '--confetti-butter', '--confetti-sky'];

/** Fixed positions, so the confetti looks scattered but renders the same every time. */
const PIECES = [
  [6, 12, 18],
  [18, 78, -30],
  [30, 8, 60],
  [44, 88, 12],
  [58, 18, -45],
  [70, 70, 35],
  [82, 10, -15],
  [92, 58, 70],
  [12, 45, 40],
  [88, 88, -60],
  [50, 50, 25],
  [36, 36, -20],
] as const;

/** Scattered confetti pieces (strips and dots) drifting in place, behind a section's content. */
export function Confetti({ className, count = PIECES.length }: { className?: string; count?: number }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      {PIECES.slice(0, count).map(([left, top, turn], index) => (
        <span
          key={index}
          className={cn(
            'confeti-piece absolute animate-[confetiDrift_6s_ease-in-out_infinite]',
            index % 3 === 0 ? 'size-2.5 rounded-full' : 'h-1.5 w-4 rounded-full',
          )}
          style={
            {
              left: `${left}%`,
              top: `${top}%`,
              '--turn': `${turn}deg`,
              backgroundColor: `var(${COLORS[index % COLORS.length]})`,
              animationDelay: `${(index % 5) * -1.2}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** The confetti that bursts out from the center when the intro card opens. */
export function ConfettiBurst() {
  return (
    <div className="pointer-events-none absolute top-1/2 left-1/2" aria-hidden="true">
      {Array.from({ length: 28 }, (_, index) => {
        const angle = (index / 28) * Math.PI * 2;
        const distance = 140 + (index % 4) * 50;
        return (
          <span
            key={index}
            className={cn(
              'confeti-piece absolute animate-[confetiBurst_1s_cubic-bezier(0.2,0.7,0.3,1)_forwards]',
              index % 3 === 0 ? 'size-2.5 rounded-full' : 'h-1.5 w-4 rounded-full',
            )}
            style={
              {
                backgroundColor: `var(${COLORS[index % COLORS.length]})`,
                '--burst-x': `${Math.cos(angle) * distance}px`,
                '--burst-y': `${Math.sin(angle) * distance}px`,
                '--burst-turn': `${(index % 2 ? 1 : -1) * 280}deg`,
              } as CSSProperties
            }
          />
        );
      })}
    </div>
  );
}
