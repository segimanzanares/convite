import type { XvPhoto } from '../../../components/xv/ArchPhoto';
import { CloudBank, Clouds, FlyingDove, ShellFont } from './CelesteArt';

interface CelesteHeroProps {
  name: string;
  dateLabel: string;
  photo: XvPhoto | null;
  /** Turns true when the envelope opens, so the dove flies in while the guest watches. */
  play?: boolean;
}

/**
 * The opening screen, a morning sky: clouds drift behind the text and a dove flies in with an olive sprig. The baby's
 * portrait sits in a round silver frame (or, without one, the shell pours water into the font), over the name in
 * script and the date on a pill.
 */
export function CelesteHero({ name, dateLabel, photo, play }: CelesteHeroProps) {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-[linear-gradient(180deg,var(--sky-top)_0%,var(--surface)_60%,var(--card)_100%)] px-6 pt-24 pb-36 text-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_22%,rgba(255,255,255,0.95),transparent_42%)]" aria-hidden="true" />
      <Clouds />
      <FlyingDove play={play} delay={0.5} flyIn className="absolute top-[7%] left-[3%] w-[110px] sm:top-[10%] sm:left-[8%] sm:w-[170px]" />
      <FlyingDove play={play} delay={1.3} flyIn branch={false} className="absolute top-[16%] right-[4%] hidden w-[90px] -scale-x-100 sm:block lg:right-[12%]" />

      <div className="relative">
        <p className="font-display text-[clamp(10px,1.3vw,13px)] tracking-[0.45em] text-(--primary-deep) uppercase opacity-0 animate-[fadeUp_1.2s_0.3s_forwards]">
          Con la bendición de Dios
        </p>

        <div className="mx-auto mt-8 opacity-0 animate-[fadeUp_1.3s_0.6s_forwards]">
          {photo ? (
            <div className="relative mx-auto size-[min(230px,58vw)] rounded-full border border-[var(--silver)] p-2 shadow-[0_24px_60px_-28px_var(--dark-from)]">
              <div className="absolute -inset-3 rounded-full border border-dashed border-(--primary-light)" aria-hidden="true" />
              <img
                src={photo.src}
                alt={photo.alt}
                className="size-full rounded-full object-cover"
                style={photo.position ? { objectPosition: photo.position } : undefined}
              />
            </div>
          ) : (
            <ShellFont play={play} delay={0.8} className="mx-auto w-[150px] sm:w-[180px]" />
          )}
        </div>

        <p className="mt-9 text-[clamp(17px,2.4vw,21px)] font-light italic text-[var(--foreground-soft)] opacity-0 animate-[fadeUp_1.2s_0.9s_forwards]">
          te invitamos con alegría al bautizo de
        </p>
        <h1 className="mt-1 font-script text-[clamp(58px,10vw,112px)] leading-[1.05] text-(--primary-deep) opacity-0 animate-[fadeUp_1.4s_1.1s_forwards] [text-shadow:0_2px_30px_var(--card)]">
          {name}
        </h1>

        {dateLabel && (
          <p className="mx-auto mt-7 w-fit rounded-full border border-(--primary)/40 bg-(--card)/70 px-6 py-2.5 font-display text-[clamp(11px,1.6vw,14px)] tracking-[0.3em] text-(--primary-deep) uppercase backdrop-blur-sm opacity-0 animate-[fadeUp_1.2s_1.4s_forwards]">
            {dateLabel}
          </p>
        )}
        <p className="mx-auto mt-6 max-w-[420px] text-[16px] italic text-[var(--muted-foreground)] opacity-0 animate-[fadeUp_1.2s_1.6s_forwards]">
          «Dejen que los niños vengan a mí» — Mateo 19, 14
        </p>
      </div>

      <div className="absolute inset-x-0 bottom-0">
        <CloudBank />
      </div>
      <div className="absolute bottom-6 flex flex-col items-center gap-2 opacity-0 animate-[fadeIn_1s_2.6s_forwards]">
        <span className="font-display text-[10px] tracking-[0.4em] text-(--primary) uppercase">Descubrir</span>
        <div className="h-10 w-px animate-[pulse_2s_infinite] bg-[linear-gradient(to_bottom,var(--primary),transparent)]" />
      </div>
    </section>
  );
}
