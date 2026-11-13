import type { CSSProperties, ReactNode } from 'react';
import { Reveal } from '../../../components/shared/Reveal';
import { cn } from '../../../components/ui/styles';
import { initials } from '../../../lib/eventContent';

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
}

/** A small uppercase eyebrow between two gradient rules, a Bodoni italic title and a muted lead, centered. */
export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <Reveal className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
      <p className="flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.25em] text-(--primary) uppercase">
        <span className="h-px w-8 bg-[linear-gradient(to_right,transparent,var(--aurora-pink))]" aria-hidden="true" />
        {eyebrow}
        <span className="h-px w-8 bg-[linear-gradient(to_left,transparent,var(--aurora-pink))]" aria-hidden="true" />
      </p>
      <h2 className="mt-4 font-bodoni text-[clamp(36px,6vw,58px)] leading-[1.05] italic text-balance">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-pretty text-(--muted-foreground) sm:text-lg">{description}</p>}
    </Reveal>
  );
}

/** [color token, left %, top %, size in px, seconds per drift, x and y drift in px]. */
const BLOBS = [
  ['--aurora-violet', -10, -15, 420, 19, 60, 40],
  ['--aurora-pink', 55, -10, 380, 23, -50, 50],
  ['--aurora-peach', 70, 55, 340, 17, -40, -40],
  ['--aurora-mint', -5, 60, 300, 21, 50, -30],
] as const;

/** Soft auroras of violet, pink, peach and mint drifting behind a section's content. */
export function AuroraSky({ className, count = BLOBS.length }: { className?: string; count?: number }) {
  return (
    <div className={cn('pointer-events-none absolute inset-0 overflow-hidden', className)} aria-hidden="true">
      {BLOBS.slice(0, count).map(([color, left, top, size, every, dx, dy], index) => (
        <span
          key={color}
          className="aurora-blob"
          style={
            {
              left: `${left}%`,
              top: `${top}%`,
              width: size,
              height: size,
              backgroundColor: `var(${color})`,
              '--every': `${every}s`,
              '--wait': `${index * -4}s`,
              '--dx': `${dx}px`,
              '--dy': `${dy}px`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

/** A shadcn/ui-like Avatar with the person's initials on an aurora gradient. */
export function Avatar({ name, className }: { name: string; className?: string }) {
  return (
    <span
      className={cn(
        'flex size-12 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--aurora-violet),var(--aurora-pink))] text-sm font-bold text-(--primary-foreground) ring-4 ring-(--card)',
        className,
      )}
      aria-hidden="true"
    >
      {initials(...name.split(/\s+/).slice(0, 2))}
    </span>
  );
}
