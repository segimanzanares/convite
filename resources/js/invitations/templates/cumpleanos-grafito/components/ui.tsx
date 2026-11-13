import type { ReactNode } from 'react';
import { Reveal } from '../../../components/shared/Reveal';
import { cn } from '../../../components/ui/styles';

interface SectionTitleProps {
  /** Short label in mono, numbered like a chapter (e.g. "01"). */
  index: string;
  eyebrow: string;
  title: string;
  description?: ReactNode;
  /** Leaves out the bottom margin, for a title that sits beside other content. */
  flush?: boolean;
}

/** A numbered mono eyebrow in amber, a Space Grotesk title and a muted lead, aligned to the left. */
export function SectionTitle({ index, eyebrow, title, description, flush = false }: SectionTitleProps) {
  return (
    <Reveal className={cn('max-w-2xl', !flush && 'mb-10 sm:mb-12')}>
      <p className="font-geist-mono text-xs tracking-wider text-(--primary) uppercase">
        <span className="text-(--muted-foreground)">{index} /</span> {eyebrow}
      </p>
      <h2 className="mt-3 font-space-grotesk text-[clamp(30px,5vw,46px)] leading-[1.05] font-semibold tracking-tight text-balance">
        {title}
      </h2>
      {description && <p className="mt-4 text-base leading-relaxed text-pretty text-(--muted-foreground)">{description}</p>}
    </Reveal>
  );
}

/** A keyboard key, as shadcn/ui's Kbd. */
export function Kbd({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded border border-(--border) bg-(--muted) px-1 font-geist-mono text-[11px] font-medium text-(--muted-foreground)',
        className,
      )}
    >
      {children}
    </kbd>
  );
}
