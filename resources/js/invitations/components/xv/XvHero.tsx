import { FlyingButterfly } from '../floral/pieces';
import { Fireflies } from './Fireflies';
import { GardenVine } from './GardenVine';
import { ArchPhoto, type XvPhoto } from './ArchPhoto';
import { scrollToHash } from '../../utils/scrollToHash';

interface XvHeroProps {
  name: string;
  /** Line above the name, e.g. "Una noche en el jardín encantado". */
  eyebrow: string;
  /** Short date shown in the frame, e.g. "05 · DIC · 2026". */
  shortDate: string;
  /** Long date shown under the frame. */
  dateLabel: string;
  /** Anchor targets for the two call-to-action buttons. */
  storyHref: string;
  rsvpHref: string;
  /** Optional portrait. On mobile it crowns the arch; on desktop it sits beside it. */
  photo?: XvPhoto;
  /** Turns true when the story cover opens, so the vines grow and the butterflies arrive while the guest watches. */
  play?: boolean;
}

export function XvHero({ name, eyebrow, shortDate, dateLabel, storyHref, rsvpHref, photo, play }: XvHeroProps) {
  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden text-center px-6 py-24 bg-[radial-gradient(ellipse_at_50%_35%,var(--color-ivory)_0%,var(--color-cream)_45%,var(--color-gold-pale)_100%)]">
      <Fireflies count={16} className="[&>span]:!bg-gold [&>span]:!opacity-60" />

      <GardenVine play={play} delay={0.8} className="absolute -top-2 -left-4 w-[min(38vw,260px)] opacity-90" />
      <GardenVine play={play} delay={1.1} className="absolute -top-2 -right-4 w-[min(38vw,260px)] opacity-90" flip />
      <FlyingButterfly play={play} delay={2.6} className="absolute top-[38%] left-[6%] w-11 sm:w-16" />
      <FlyingButterfly play={play} delay={3.4} className="absolute bottom-[16%] right-[7%] w-9 sm:w-14 -scale-x-100" />

      <div className="relative w-full flex flex-col lg:flex-row items-center justify-center lg:gap-16">
        {photo && (
          <ArchPhoto
            photo={photo}
            eager
            // On mobile the portrait overlaps the arch's apex like a medallion.
            className="z-[1] w-[min(50vw,230px)] -mb-[72px] lg:mb-0 lg:w-[360px] shrink-0 opacity-0 animate-[fadeUp_1.4s_0.15s_forwards]"
          />
        )}

        {/* Garden-gate arch framing the name */}
        <div
          className={[
            'relative w-full max-w-[460px] pb-10 px-[clamp(20px,6vw,48px)] opacity-0 animate-[fadeUp_1.4s_0.3s_forwards]',
            photo ? 'pt-[104px] lg:pt-[clamp(84px,14vw,96px)]' : 'pt-[clamp(84px,14vw,96px)]',
          ].join(' ')}
        >
          <div className="absolute inset-0 rounded-t-full border border-gold/50" aria-hidden="true" />
          <div className="absolute inset-[8px] rounded-t-full border border-gold/25" aria-hidden="true" />

          <p className="relative font-display text-[clamp(9px,2.4vw,11px)] tracking-[0.42em] text-gold uppercase mb-5 leading-[2] text-balance">
            {eyebrow}
          </p>

          <h1 className="relative font-script text-[clamp(54px,15vw,96px)] leading-[1.02] text-gold-deep [text-shadow:0_2px_24px_var(--color-ivory)]">
            {name}
          </h1>

          <div className="relative flex items-center justify-center gap-4 mt-6" aria-label="Mis quince años">
            <span className="h-px w-10 bg-[linear-gradient(to_right,transparent,var(--color-gold))]" />
            <span className="font-display text-[clamp(10px,2.6vw,12px)] tracking-[0.5em] text-gold-deep uppercase">Mis</span>
            <span className="font-display font-light text-[clamp(52px,14vw,78px)] leading-none text-gold">XV</span>
            <span className="font-display text-[clamp(10px,2.6vw,12px)] tracking-[0.5em] text-gold-deep uppercase">Años</span>
            <span className="h-px w-10 bg-[linear-gradient(to_left,transparent,var(--color-gold))]" />
          </div>

          <div className="relative inline-block mt-8 border-y border-gold/50 py-2.5 px-6">
            <span className="font-display text-[clamp(13px,3.6vw,16px)] tracking-[0.35em] text-gold-deep">{shortDate}</span>
          </div>
        </div>
      </div>

      <p className="relative mt-6 text-[clamp(16px,4vw,19px)] italic font-light text-[var(--text-body)] first-letter:uppercase opacity-0 animate-[fadeUp_1.2s_0.9s_forwards]">
        {dateLabel}
      </p>

      <div className="relative mt-9 flex flex-col sm:flex-row items-center gap-3 opacity-0 animate-[fadeUp_1.2s_1.2s_forwards]">
        <a
          href={storyHref}
          onClick={scrollToHash}
          className="font-display text-[10px] tracking-[0.3em] uppercase bg-gold-deep text-ivory py-3.5 px-7 transition-colors duration-300 hover:bg-[var(--dark-from)]"
        >
          Descubre mi historia
        </a>
        <a
          href={rsvpHref}
          onClick={scrollToHash}
          className="font-display text-[10px] tracking-[0.3em] uppercase border border-gold-deep/50 text-gold-deep py-3.5 px-7 transition-colors duration-300 hover:bg-gold-deep/5"
        >
          Confirma tu asistencia
        </a>
      </div>

      <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-0 animate-[fadeIn_1s_2.4s_forwards]" aria-hidden="true">
        <span className="font-display text-[9px] tracking-[0.4em] text-gold uppercase">Desliza</span>
        <div className="w-px h-9 bg-[linear-gradient(to_bottom,var(--color-gold),transparent)] animate-[pulse_2s_infinite]" />
      </div>
    </section>
  );
}
