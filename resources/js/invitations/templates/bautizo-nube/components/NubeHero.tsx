import { ArrowDown, CalendarDays, Clock, MapPin } from 'lucide-react';
import type { XvPhoto } from '../../../components/xv/ArchPhoto';
import { Badge } from '../../../components/ui/primitives';
import { buttonClass, capitalize } from '../../../components/ui/styles';
import { formatDate } from '../../../lib/eventContent';
import { scrollToHash } from '../../../utils/scrollToHash';
import { BabyMobile, Balloon, CloudPuffs } from './NubeArt';

interface NubeHeroProps {
  name: string;
  monogram: string;
  eventDate: Date | null;
  venueName?: string;
  photo: XvPhoto | null;
  storyHref: string;
  /** Turns true when the intro dialog opens, so the mobile drops its pieces while the guest watches. */
  play?: boolean;
}

/**
 * The opening screen, a nursery sky: the crib mobile hangs over the baby's portrait in a round frame, balloons and
 * clouds float by, and the name, the date, the time and the place follow as chips.
 */
export function NubeHero({ name, monogram, eventDate, venueName, photo, storyHref, play }: NubeHeroProps) {
  const facts = [
    { icon: CalendarDays, value: capitalize(formatDate(eventDate, "EEEE d 'de' MMMM")) },
    { icon: Clock, value: formatDate(eventDate, "HH:mm 'hrs'") },
    { icon: MapPin, value: venueName ?? '' },
  ].filter((fact) => fact.value);

  return (
    <header className="relative overflow-hidden bg-[linear-gradient(180deg,var(--secondary)_0%,var(--background)_70%)] px-5 pt-4 pb-24 text-center sm:px-8">
      <CloudPuffs />
      <Balloon color="--blush" stripe="--butter" every={8} className="absolute top-[22%] left-[4%] w-12 sm:left-[10%] sm:w-16" />
      <Balloon color="--mint" stripe="--sky" every={9} wait={-3} className="absolute top-[48%] right-[5%] w-10 sm:right-[12%] sm:w-14" />
      <Balloon color="--butter" stripe="--lilac" every={7} wait={-5} className="absolute top-[66%] left-[8%] hidden w-9 sm:block" />

      <div className="relative mx-auto max-w-2xl">
        <BabyMobile play={play} delay={0.2} className="mx-auto w-[min(280px,78vw)]" />
        <div className="relative mx-auto -mt-4 size-[min(220px,60vw)] rounded-full bg-(--card) p-2 shadow-[0_24px_60px_-28px_oklch(0.4_0.1_240/0.6)] animate-[fadeUp_1s_0.5s_both]">
          <div className="absolute -inset-3 rounded-full border-2 border-dashed border-(--sky)" aria-hidden="true" />
          {photo ? (
            <img
              src={photo.src}
              alt={photo.alt}
              className="size-full rounded-full object-cover"
              style={photo.position ? { objectPosition: photo.position } : undefined}
            />
          ) : (
            <span className="flex size-full items-center justify-center rounded-full bg-(--secondary) font-young-serif text-6xl text-(--primary)">{monogram}</span>
          )}
        </div>

        <Badge className="mt-8 border-transparent bg-(--accent) font-bold text-(--accent-foreground) animate-[fadeUp_0.9s_0.7s_both]">Mi bautizo</Badge>
        <h1 className="mt-4 font-young-serif text-[clamp(48px,10vw,96px)] leading-[1.02] text-balance animate-[fadeUp_0.9s_0.8s_both]">{name}</h1>
        <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-pretty text-(--muted-foreground) animate-[fadeUp_0.9s_0.9s_both]">
          Un regalito del cielo llegó a nuestra familia, y queremos celebrar su bautizo contigo.
        </p>

        {facts.length > 0 && (
          <ul className="mt-7 flex flex-wrap justify-center gap-2 animate-[fadeUp_0.9s_1s_both]">
            {facts.map(({ icon: Icon, value }) => (
              <li key={value} className="flex items-center gap-2 rounded-full border border-(--border) bg-(--card)/80 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                <Icon className="size-4 text-(--primary)" aria-hidden="true" />
                {value}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-2 animate-[fadeUp_0.9s_1.1s_both]">
          <a href="#confirmar" onClick={scrollToHash} className={buttonClass('default', 'lg', 'rounded-full')}>
            Confirmar asistencia
          </a>
          <a href={storyHref} onClick={scrollToHash} className={buttonClass('outline', 'lg', 'rounded-full')}>
            Ver detalles
            <ArrowDown aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
