import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { cn } from './styles';

/*
 * shadcn/ui look-alikes for the templates built on its tokens. Inside an element with the `ui-dark` class (where the
 * template's theme.css redeclares the tokens with their dark values) they render with the dark theme.
 */

export function Card({ className, ...props }: ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={cn(
        'rounded-(--radius) border border-(--border) bg-(--card) text-(--card-foreground) shadow-[0_1px_2px_0_rgb(0_0_0/0.05)]',
        className,
      )}
      {...props}
    />
  );
}

export function Badge({ className, ...props }: ComponentPropsWithoutRef<'span'>) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-(--border) bg-(--secondary) px-3 py-1 text-xs font-medium text-(--secondary-foreground) [&_svg]:size-3.5',
        className,
      )}
      {...props}
    />
  );
}

interface SectionProps {
  id?: string;
  className?: string;
  children: ReactNode;
  /** Renders the section with the theme's dark tokens. */
  dark?: boolean;
}

export function Section({ id, className, children, dark = false }: SectionProps) {
  return (
    <section id={id} className={cn('scroll-mt-16 px-5 py-20 sm:px-8 sm:py-28', dark && 'ui-dark', className)}>
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  );
}
