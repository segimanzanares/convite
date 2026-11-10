import { Reveal } from '../shared/Reveal';
import { Fireflies } from './Fireflies';

interface ClosingChapterProps {
  kicker?: string;
  message: string;
  signature: string;
  dateLabel: string;
}

/** Storybook ending ("Y colorín colorado…") on a dark garden-at-night band. */
export function ClosingChapter({ kicker = 'Y colorín colorado…', message, signature, dateLabel }: ClosingChapterProps) {
  return (
    <section className="relative overflow-hidden max-w-full py-[110px] px-6 text-center bg-[radial-gradient(ellipse_at_50%_0%,var(--dark-to),var(--dark-from)_70%)]">
      <Fireflies count={20} />
      <Reveal className="relative max-w-[560px] mx-auto">
        <p className="font-display text-[10px] tracking-[0.5em] text-gold-light/80 uppercase mb-6">{kicker}</p>
        <p className="text-[clamp(19px,3vw,24px)] font-light italic leading-[1.7] text-gold-pale">{message}</p>
        <div className="flex items-center justify-center gap-3 my-8" aria-hidden="true">
          <span className="h-px w-14 bg-[linear-gradient(to_right,transparent,var(--color-gold-light))]" />
          <span className="w-1.5 h-1.5 rotate-45 bg-gold-light" />
          <span className="h-px w-14 bg-[linear-gradient(to_left,transparent,var(--color-gold-light))]" />
        </div>
        <p className="font-script text-[clamp(40px,8vw,56px)] text-gold-light leading-tight">{signature}</p>
        <p className="font-display text-[10px] tracking-[0.4em] text-gold-light/70 mt-3">{dateLabel}</p>
      </Reveal>
    </section>
  );
}
