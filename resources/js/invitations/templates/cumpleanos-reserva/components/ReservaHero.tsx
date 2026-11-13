import type { CelebrantInfo } from '../../../types/birthday';
import { ToastGlasses } from './BrassOrnaments';

interface ReservaHeroProps {
  celebrant: CelebrantInfo;
  /** The admin's cover photo, shown faintly behind the label. */
  backgroundImageUrl?: string | null;
  /** Turns true when the envelope opens, so the glasses draw themselves and toast while the guest watches. */
  play?: boolean;
}

/** The year the celebrant was born, from the event's year and the age they turn, or null without a date. */
function birthYear(celebrant: CelebrantInfo): number | null {
  const eventYear = Number(celebrant.eventDateTime.slice(0, 4));

  return eventYear && celebrant.age ? eventYear - celebrant.age : null;
}

function Rule({ className = '' }: { className?: string }) {
  return (
    <div className={`relative flex items-center justify-center gap-3 text-gold-light ${className}`} aria-hidden="true">
      <span className="w-16 sm:w-24 h-px bg-[linear-gradient(to_right,transparent,var(--color-gold-light))]" />
      <span className="w-2 h-2 rotate-45 border border-current" />
      <span className="w-16 sm:w-24 h-px bg-[linear-gradient(to_left,transparent,var(--color-gold-light))]" />
    </div>
  );
}

/**
 * The opening screen, laid out like the label of an aged bottle: a framed panel on midnight navy with brass rays,
 * the celebrant's name, the age as the "vintage" and the year they were born.
 */
export function ReservaHero({ celebrant, backgroundImageUrl, play }: ReservaHeroProps) {
  const since = birthYear(celebrant);

  return (
    <section
      data-tone="dark"
      className="min-h-screen max-w-full flex items-center justify-center relative pt-20 pb-32 px-6 overflow-hidden text-center bg-[radial-gradient(ellipse_at_50%_35%,var(--dark-to)_0%,var(--dark-from)_70%)]"
    >
      {backgroundImageUrl && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-25 mix-blend-luminosity"
          style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        />
      )}
      <div className="reserva-rays absolute inset-0" aria-hidden="true" />

      <div className="relative w-full max-w-[540px] border border-gold-light/50 p-2 opacity-0 animate-[fadeUp_1.4s_0.3s_forwards]">
        <div className="border border-gold-light/25 px-6 py-10 sm:px-12 bg-[color-mix(in_srgb,var(--dark-from)_55%,transparent)] backdrop-blur-[2px]">
          <ToastGlasses play={play} delay={1.4} className="mx-auto -mt-2 mb-3 w-[78px] sm:w-[92px] h-auto" />
          <p className="font-display text-[10px] sm:text-[11px] tracking-[0.5em] text-gold-light uppercase">
            Gran reserva
          </p>
          <Rule className="mt-4 mb-6" />

          <p className="font-display text-[clamp(10px,1.3vw,12px)] tracking-[0.4em] text-gold-pale/80 uppercase">
            Te invitamos a brindar por
          </p>
          <h1 className="font-script text-[clamp(42px,6.5vw,68px)] text-gold-pale leading-[1.1] mt-4 [text-wrap:balance]">
            {celebrant.name}
          </h1>

          <div className="mt-6 flex items-center justify-center gap-5 opacity-0 animate-[fadeUp_1.4s_0.9s_forwards]">
            <span className="h-px flex-1 bg-gold-light/40" />
            <span className="[font-family:var(--font-script)] font-bold text-[clamp(80px,11vw,116px)] text-gold leading-none">
              {celebrant.age}
            </span>
            <span className="h-px flex-1 bg-gold-light/40" />
          </div>
          <p className="font-display text-[11px] tracking-[0.6em] text-gold-light uppercase mt-3">Años</p>

          {since && (
            <p className="font-script text-[17px] text-gold-pale/75 mt-4">Añejado desde {since}</p>
          )}

          <Rule className="mt-6 mb-5" />
          <p className="font-display text-[clamp(11px,1.6vw,14px)] tracking-[0.35em] text-gold-pale uppercase">
            {celebrant.dateLabel}
          </p>
        </div>
      </div>

      <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-0 animate-[fadeIn_1s_2.5s_forwards]">
        <span className="font-display text-[10px] tracking-[0.4em] text-gold-light uppercase">Descubrir</span>
        <div className="w-px h-10 bg-[linear-gradient(to_bottom,var(--color-gold-light),transparent)] animate-[pulse_2s_infinite]" />
      </div>
    </section>
  );
}
