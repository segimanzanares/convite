import { ArrowDown, CalendarDays, Clock, MapPin } from 'lucide-react';
import { FlyingButterfly } from '../../../components/floral/pieces';
import type { XvPhoto } from '../../../components/xv/ArchPhoto';
import { Badge } from '../../../components/ui/primitives';
import { buttonClass, capitalize, cn } from '../../../components/ui/styles';
import { formatDate } from '../../../lib/eventContent';
import { scrollToHash } from '../../../utils/scrollToHash';
import { Tiara } from './AuroraArt';
import { AuroraSky } from './ui';

interface AuroraHeroProps {
  name: string;
  eventDate: Date | null;
  venueName?: string;
  photo: XvPhoto | null;
  storyHref: string;
  /** Turns true when the intro sheet opens, so the tiara and the butterflies play while the guest watches. */
  play?: boolean;
}

/**
 * The opening screen in two columns over the auroras: the tiara, the celebrant's name in Bodoni italic, the date, time
 * and place as a description list, and the portrait as a tilted card with a "XV" seal and butterflies around it.
 */
export function AuroraHero({ name, eventDate, venueName, photo, storyHref, play }: AuroraHeroProps) {
  const facts = [
    { icon: CalendarDays, label: 'Fecha', value: capitalize(formatDate(eventDate, "EEEE d 'de' MMMM")) },
    { icon: Clock, label: 'Hora', value: formatDate(eventDate, "HH:mm 'hrs'") },
    { icon: MapPin, label: 'Lugar', value: venueName ?? '' },
  ].filter((fact) => fact.value);

  return (
    <header className="relative flex min-h-[100svh] items-center overflow-hidden px-5 pt-24 pb-20 sm:px-8">
      <AuroraSky />
      <div className="relative mx-auto grid w-full max-w-5xl items-center gap-14 md:grid-cols-[1.15fr_0.85fr]">
        <div className="text-center md:text-left">
          <Tiara play={play} delay={0.3} className="mx-auto w-28 sm:w-32 md:mx-0" />
          <Badge className="mt-4 border-transparent bg-(--accent) font-semibold text-(--accent-foreground) animate-[fadeUp_0.8s_0.2s_both]">
            Mis XV años
          </Badge>
          <h1 className="mt-4 font-bodoni text-[clamp(56px,10vw,108px)] leading-[0.95] italic text-balance animate-[fadeUp_0.9s_0.3s_both]">
            {name}
          </h1>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-(--muted-foreground) text-pretty max-md:mx-auto animate-[fadeUp_0.9s_0.45s_both]">
            Quince años de sueños, una noche para celebrarlos juntos.
          </p>

          {facts.length > 0 && (
            <dl className="mt-8 grid gap-2 sm:grid-cols-3 sm:gap-3 animate-[fadeUp_0.9s_0.6s_both]">
              {facts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center justify-between gap-4 rounded-(--radius) border border-(--border) bg-(--card)/70 px-4 py-2.5 text-left backdrop-blur-sm sm:block sm:py-3">
                  <dt className="flex items-center gap-1.5 text-xs font-medium text-(--muted-foreground)">
                    <Icon className="size-3.5 text-(--primary)" aria-hidden="true" />
                    {label}
                  </dt>
                  <dd className="text-right text-sm leading-snug font-semibold sm:mt-1 sm:text-left">{value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-8 flex flex-wrap justify-center gap-2 md:justify-start animate-[fadeUp_0.9s_0.75s_both]">
            <a href="#confirmar" onClick={scrollToHash} className={buttonClass('default', 'lg', 'rounded-full')}>
              Confirmar asistencia
            </a>
            <a href={storyHref} onClick={scrollToHash} className={buttonClass('outline', 'lg', 'rounded-full')}>
              Conoce mi historia
              <ArrowDown aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-[min(78vw,340px)] animate-[fadeUp_1s_0.4s_both]">
          <div className="absolute inset-0 -rotate-6 rounded-[calc(var(--radius)+12px)] bg-[linear-gradient(150deg,var(--aurora-violet),var(--aurora-pink),var(--aurora-peach))] opacity-70" aria-hidden="true" />
          <div
            className={cn(
              'relative aspect-[4/5] rotate-2 overflow-hidden rounded-[calc(var(--radius)+12px)] border-[6px] border-(--card) bg-(--secondary) shadow-2xl',
              !photo && 'flex items-center justify-center',
            )}
          >
            {photo ? (
              <img
                src={photo.src}
                alt={photo.alt}
                className="size-full object-cover"
                style={photo.position ? { objectPosition: photo.position } : undefined}
              />
            ) : (
              <span className="font-bodoni text-[120px] leading-none italic aurora-text">XV</span>
            )}
          </div>
          <span className="absolute -top-5 -left-5 flex size-20 -rotate-12 items-center justify-center rounded-full border-4 border-(--card) bg-[linear-gradient(135deg,var(--primary),var(--aurora-pink))] font-bodoni text-3xl text-(--primary-foreground) italic shadow-lg">
            XV
          </span>
          {eventDate && (
            <span className="absolute -right-4 -bottom-4 rounded-full border border-(--border) bg-(--card) px-4 py-2 text-sm font-semibold shadow-lg">
              {formatDate(eventDate, "d 'de' MMMM")}
            </span>
          )}
          <FlyingButterfly play={play} delay={1.6} className="absolute -top-10 right-[-18%] w-14 sm:w-16" />
          <FlyingButterfly play={play} delay={2.4} className="absolute bottom-[18%] left-[-22%] w-10 -scale-x-100 sm:w-12" />
        </div>
      </div>
    </header>
  );
}
