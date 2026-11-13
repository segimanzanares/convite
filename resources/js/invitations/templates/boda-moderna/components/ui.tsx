import type { ComponentPropsWithoutRef, ReactNode } from 'react';
import { Reveal } from '../../../components/shared/Reveal';
import { cn } from './styles';

/*
 * Small shadcn/ui look-alikes for this template. They read the tokens of theme.css (--card, --border, ...), so
 * inside a .boda-moderna-dark section they render with the dark theme.
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
    <section id={id} className={cn('scroll-mt-6 px-5 py-20 sm:px-8 sm:py-28', dark && 'boda-moderna-dark', className)}>
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  );
}

interface SectionHeaderProps {
  badge: ReactNode;
  title: string;
  description?: string;
}

export function SectionHeader({ badge, title, description }: SectionHeaderProps) {
  return (
    <Reveal className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
      <Badge>{badge}</Badge>
      <h2 className="mt-5 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-balance text-(--muted-foreground) sm:text-lg">{description}</p>}
    </Reveal>
  );
}

/** The "&" between the names, in the serif italic that offsets Geist. */
export function Ampersand({ className }: { className?: string }) {
  return <span className={cn('font-instrument font-normal italic text-(--muted-foreground)', className)}>&amp;</span>;
}
