import type { ReactNode } from 'react';
import { Reveal } from '../../../components/shared/Reveal';
import { cn } from '../../../components/ui/styles';
import { initials } from '../../../lib/eventContent';

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
}

/** A butter-yellow pill as the eyebrow, a Young Serif title and a muted lead, centered. */
export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <Reveal className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
      <p className="mx-auto w-fit rounded-full bg-(--accent) px-3.5 py-1 text-xs font-bold tracking-[0.18em] text-(--accent-foreground) uppercase">
        {eyebrow}
      </p>
      <h2 className="mt-4 font-young-serif text-[clamp(32px,5.5vw,52px)] leading-[1.1] text-balance">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-pretty text-(--muted-foreground) sm:text-lg">{description}</p>}
    </Reveal>
  );
}

const AVATAR_COLORS = ['--sky', '--butter', '--blush', '--mint', '--lilac'];

/** A shadcn/ui-like Avatar with the person's initials on a pastel. */
export function Avatar({ name, index = 0, className }: { name: string; index?: number; className?: string }) {
  return (
    <span
      className={cn('flex size-12 shrink-0 items-center justify-center rounded-full text-sm font-bold text-(--foreground) ring-4 ring-(--card)', className)}
      style={{ backgroundColor: `var(${AVATAR_COLORS[index % AVATAR_COLORS.length]})` }}
      aria-hidden="true"
    >
      {initials(...name.split(/\s+/).slice(0, 2))}
    </span>
  );
}
