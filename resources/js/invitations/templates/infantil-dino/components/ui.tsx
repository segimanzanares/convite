import type { ReactNode } from 'react';
import { Reveal } from '../../../components/shared/Reveal';
import { cn } from '../../../components/ui/styles';

/** The "chunky" outline of this template: a thick ink border and a solid offset shadow. */
export const CHUNKY = 'border-[3px] border-(--foreground) shadow-[5px_5px_0_var(--foreground)]';

/** A small chunky outline, for buttons, chips and tiles. */
export const CHUNKY_SM = 'border-2 border-(--foreground) shadow-[3px_3px_0_var(--foreground)]';

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
}

/** A tilted yellow sticker as the eyebrow, an extra bold title and a lead, centered. */
export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <Reveal className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
      <span className={cn('inline-block -rotate-2 rounded-full bg-(--accent) px-4 py-1 text-sm font-bold', CHUNKY_SM)}>{eyebrow}</span>
      <h2 className="mt-5 text-[clamp(36px,6vw,58px)] leading-[1] font-extrabold tracking-tight text-balance">{title}</h2>
      {description && <p className="mt-4 text-lg leading-relaxed text-pretty text-(--muted-foreground)">{description}</p>}
    </Reveal>
  );
}
