import type { ReactNode } from 'react';
import { Reveal } from '../../../components/shared/Reveal';
import { Badge } from '../../../components/ui/primitives';
import { cn } from '../../../components/ui/styles';

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
