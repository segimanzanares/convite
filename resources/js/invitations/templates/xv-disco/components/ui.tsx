import type { ReactNode } from 'react';
import { Reveal } from '../../../components/shared/Reveal';

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
}

/** An "on air" eyebrow with a pulsing neon dot, an Unbounded title and a muted lead, centered. */
export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <Reveal className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
      <span className="inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--card)/60 px-3 py-1 text-xs font-semibold tracking-[0.2em] text-(--accent-foreground) uppercase">
        <span className="size-1.5 rounded-full bg-(--neon-pink) shadow-[0_0_8px_2px_var(--neon-pink)] animate-[pulse_1.6s_infinite]" aria-hidden="true" />
        {eyebrow}
      </span>
      <h2 className="mt-5 font-unbounded text-[clamp(28px,5vw,46px)] leading-[1.1] font-semibold text-balance">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-pretty text-(--muted-foreground) sm:text-lg">{description}</p>}
    </Reveal>
  );
}
