import type { ReactNode } from 'react';
import { Reveal } from '../../../components/shared/Reveal';
import { cn } from '../../../components/ui/styles';

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  /** Centers the title; by default it sits on the left, as in an editorial layout. */
  centered?: boolean;
}

/** Eyebrow in the primary blue with a short rule, a Fraunces title and a muted lead. */
export function SectionTitle({ eyebrow, title, description, centered = false }: SectionTitleProps) {
  return (
    <Reveal className={cn('mb-10 max-w-2xl sm:mb-14', centered && 'mx-auto text-center')}>
      <p className={cn('flex items-center gap-3 text-xs font-semibold tracking-[0.18em] text-(--primary) uppercase', centered && 'justify-center')}>
        <span className="h-px w-8 bg-(--primary)" aria-hidden="true" />
        {eyebrow}
      </p>
      <h2 className="mt-4 font-fraunces text-[clamp(32px,5vw,48px)] leading-[1.05] font-medium tracking-tight text-balance">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-pretty text-(--muted-foreground) sm:text-lg">{description}</p>}
    </Reveal>
  );
}

/** The "&" between the names, in Fraunces italic. */
export function Ampersand({ className }: { className?: string }) {
  return <span className={cn('font-fraunces font-normal italic', className)}>&amp;</span>;
}
