import type { ReactNode } from 'react';
import { Reveal } from '../../../components/shared/Reveal';
import { cn } from '../../../components/ui/styles';

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  className?: string;
}

/**
 * An editorial heading: a numbered small-caps eyebrow over a hairline, a Newsreader italic title and a muted lead,
 * aligned left from tablets up.
 */
export function SectionTitle({ eyebrow, title, description, className }: SectionTitleProps) {
  return (
    <Reveal className={cn('mb-10 max-w-2xl text-center sm:mb-14 sm:text-left', className)}>
      <p className="flex items-center justify-center gap-3 text-xs font-semibold tracking-[0.3em] text-(--primary) uppercase sm:justify-start">
        {eyebrow}
        <span className="h-px w-16 bg-(--primary)/40" aria-hidden="true" />
      </p>
      <h2 className="mt-4 font-newsreader text-[clamp(36px,6vw,60px)] leading-[1.02] font-light italic text-balance">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-pretty text-(--muted-foreground) sm:text-lg">{description}</p>}
    </Reveal>
  );
}
