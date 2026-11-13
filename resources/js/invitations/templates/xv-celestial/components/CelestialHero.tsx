import { Fireflies } from '../../../components/xv/Fireflies';
import type { XvPhoto } from '../../../components/xv/ArchPhoto';
import { scrollToHash } from '../../../utils/scrollToHash';
import { CrescentMoon, CrownConstellation, ShootingStars } from './CelestialArt';

interface CelestialHeroProps {
  name: string;
  /** Line above the name, e.g. "Bajo un cielo de estrellas". */
  eyebrow: string;
  /** Short date in the pill, e.g. "12 · JUN · 2027". */
  shortDate: string;
  /** Long date under the pill. */
  dateLabel: string;
  storyHref: string;
  rsvpHref: string;
  /** Optional portrait, framed like a full moon with a star on its orbit. */
  photo?: XvPhoto;
  /** Turns true when the story cover opens, so the moon and the constellation draw themselves while the guest watches. */
  play?: boolean;
}

/** The portrait as a full moon: a round photo inside thin rings, with a small star circling it. */
function MoonPortrait({ photo }: { photo: XvPhoto }) {
  return (
    <div className="relative w-[min(46vw,200px)] lg:w-[300px] aspect-square shrink-0 mb-10 lg:mb-0 opacity-0 animate-[fadeUp_1.4s_0.2s_forwards]">
      <div className="absolute -inset-5 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--gold-light)_28%,transparent)_40%,transparent_70%)]" aria-hidden="true" />
      <div className="absolute -inset-3 rounded-full border border-dashed border-gold-light/30" aria-hidden="true" />
      <div className="celestial-orbit absolute -inset-3" aria-hidden="true">
        <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 size-2 rounded-full bg-gold-light shadow-[0_0_12px_4px_color-mix(in_srgb,var(--gold-light)_60%,transparent)]" />
      </div>
      <div className="absolute inset-0 rounded-full border border-gold-light/60 p-[6px]">
        <div className="relative size-full rounded-full overflow-hidden bg-[var(--dark-to)]">
          <img
            src={photo.src}
            alt={photo.alt}
            loading="eager"
            className="absolute inset-0 size-full object-cover"
            style={photo.position ? { objectPosition: photo.position } : undefined}
          />
        </div>
      </div>
    </div>
  );
}

/**
 * The opening screen as a night sky: twinkling stars, shooting stars, a crescent moon and a constellation in the shape
 * of a tiara around the celebrant's name, with the portrait framed like a full moon.
 */
export function CelestialHero({ name, eyebrow, shortDate, dateLabel, storyHref, rsvpHref, photo, play }: CelestialHeroProps) {
  return (
    <section
      data-tone="dark"
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden text-center px-6 pt-24 pb-28 bg-[radial-gradient(ellipse_at_50%_15%,var(--dark-to)_0%,var(--dark-from)_72%)]"
    >
      <Fireflies count={46} className="[&>span]:!bg-gold-pale" />
      <ShootingStars />
      <CrescentMoon play={play} delay={0.6} className="absolute top-[5%] right-[4%] sm:right-[9%] w-[min(30vw,170px)]" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-[linear-gradient(to_top,color-mix(in_srgb,var(--dark-to)_55%,transparent),transparent)]" aria-hidden="true" />

      <div className="relative w-full flex flex-col lg:flex-row items-center justify-center lg:gap-20">
        {photo && <MoonPortrait photo={photo} />}

        <div className="relative max-w-[520px] opacity-0 animate-[fadeUp_1.4s_0.4s_forwards]">
          <CrownConstellation play={play} delay={1.2} className="mx-auto w-[min(56vw,220px)] h-auto mb-2" />
          <p className="font-display text-[clamp(10px,2.6vw,12px)] tracking-[0.45em] text-gold-light/85 uppercase mb-4 leading-[2] text-balance">
            {eyebrow}
          </p>
          <h1 className="font-script text-[clamp(56px,15vw,104px)] leading-[1.05] text-gold-pale [text-shadow:0_0_32px_color-mix(in_srgb,var(--gold-light)_45%,transparent)]">
            {name}
          </h1>

          <div className="flex items-center justify-center gap-4 mt-5" aria-label="Mis quince años">
            <span className="h-px w-12 bg-[linear-gradient(to_right,transparent,var(--color-gold-light))]" />
            <span className="font-display text-[clamp(52px,13vw,76px)] leading-none text-gold-light">XV</span>
            <span className="h-px w-12 bg-[linear-gradient(to_left,transparent,var(--color-gold-light))]" />
          </div>
          <p className="font-display text-[11px] tracking-[0.6em] text-gold-light/80 uppercase mt-2">Años</p>

          <div className="inline-flex items-center gap-3 mt-8 rounded-full border border-gold-light/40 bg-[color-mix(in_srgb,var(--dark-from)_50%,transparent)] py-2.5 px-6 backdrop-blur-[2px]">
            <span className="text-gold-light text-xs" aria-hidden="true">☾</span>
            <span className="font-display text-[clamp(13px,3.6vw,16px)] tracking-[0.3em] text-gold-pale">{shortDate}</span>
            <span className="text-gold-light text-xs" aria-hidden="true">✦</span>
          </div>
          <p className="mt-5 text-[clamp(16px,4vw,19px)] italic font-light text-gold-pale/80 first-letter:uppercase">{dateLabel}</p>
        </div>
      </div>

      <div className="relative mt-10 flex flex-col sm:flex-row items-center gap-3 opacity-0 animate-[fadeUp_1.2s_1.2s_forwards]">
        <a
          href={storyHref}
          onClick={scrollToHash}
          className="font-display text-[11px] tracking-[0.3em] uppercase rounded-full bg-gold-light text-[var(--dark-from)] py-3.5 px-8 transition-colors duration-300 hover:bg-gold-pale"
        >
          Lee mi historia
        </a>
        <a
          href={rsvpHref}
          onClick={scrollToHash}
          className="font-display text-[11px] tracking-[0.3em] uppercase rounded-full border border-gold-light/50 text-gold-pale py-3.5 px-8 transition-colors duration-300 hover:bg-gold-light/10"
        >
          Confirma tu lugar
        </a>
      </div>

      <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-0 animate-[fadeIn_1s_2.4s_forwards]" aria-hidden="true">
        <span className="font-display text-[10px] tracking-[0.4em] text-gold-light/80 uppercase">Desliza</span>
        <div className="w-px h-9 bg-[linear-gradient(to_bottom,var(--color-gold-light),transparent)] animate-[pulse_2s_infinite]" />
      </div>
    </section>
  );
}
