import type { XvPhoto } from '../../../components/xv/ArchPhoto';
import { OliveWreath } from './OliveArt';

interface OlivoHeroProps {
  name: string;
  monogram: string;
  dateLabel: string;
  photo: XvPhoto | null;
  /** Turns true when the book opens, so the wreath grows while the guest watches. */
  play?: boolean;
}

function Rule() {
  return (
    <div className="flex items-center justify-center gap-3 text-(--primary)" aria-hidden="true">
      <span className="h-px w-14 bg-[linear-gradient(to_right,transparent,var(--primary))] sm:w-20" />
      <span className="size-1.5 rounded-full bg-[var(--wheat)]" />
      <span className="h-px w-14 bg-[linear-gradient(to_left,transparent,var(--primary))] sm:w-20" />
    </div>
  );
}

/**
 * The opening screen on natural linen: an olive wreath grows around the baby's portrait (or the monogram) and ties
 * itself with a wheat bow, over the invitation, the name in script and the date between two rules.
 */
export function OlivoHero({ name, monogram, dateLabel, photo, play }: OlivoHeroProps) {
  return (
    <section className="olivo-linen relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-28 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,var(--card)_0%,transparent_65%)]" aria-hidden="true" />

      <p className="relative font-display text-[clamp(10px,1.3vw,13px)] tracking-[0.55em] text-(--primary) uppercase opacity-0 animate-[fadeUp_1.2s_0.2s_forwards]">
        Mi bautizo
      </p>

      <div className="relative mt-6 w-[min(330px,80vw)] aspect-[260/270]">
        <OliveWreath play={play} delay={0.4} className="absolute inset-0 size-full" />
        <div className="absolute top-[48.15%] left-1/2 flex size-[60%] -translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full border border-(--primary)/50 bg-(--card) p-1.5 opacity-0 shadow-[0_18px_40px_-22px_var(--dark-from)] animate-[fadeIn_1.4s_0.5s_forwards]">
          {photo ? (
            <img
              src={photo.src}
              alt={photo.alt}
              className="size-full rounded-full object-cover"
              style={photo.position ? { objectPosition: photo.position } : undefined}
            />
          ) : (
            <span className="font-script text-[clamp(56px,14vw,84px)] leading-none text-(--primary-deep)">{monogram}</span>
          )}
        </div>
      </div>

      <p className="relative mt-6 max-w-[480px] text-[clamp(17px,2.4vw,21px)] text-balance font-light italic text-[var(--foreground-soft)] opacity-0 animate-[fadeUp_1.2s_1s_forwards]">
        Con el corazón lleno de gratitud, te invitamos al bautizo de
      </p>
      <h1 className="relative mt-2 font-script text-[clamp(60px,11vw,118px)] leading-[1.05] text-(--primary-deep) opacity-0 animate-[fadeUp_1.4s_1.2s_forwards]">
        {name}
      </h1>
      {dateLabel && (
        <div className="relative mt-5 opacity-0 animate-[fadeUp_1.2s_1.5s_forwards]">
          <Rule />
          <p className="mt-4 font-display text-[clamp(11px,1.7vw,15px)] tracking-[0.35em] text-(--primary-deep) uppercase">{dateLabel}</p>
        </div>
      )}

      <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-0 animate-[fadeIn_1s_2.8s_forwards]">
        <span className="font-display text-[10px] tracking-[0.4em] text-(--primary) uppercase">Descubrir</span>
        <div className="h-10 w-px animate-[pulse_2s_infinite] bg-[linear-gradient(to_bottom,var(--primary),transparent)]" />
      </div>
    </section>
  );
}
