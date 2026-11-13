import { ArrowDown, CalendarDays, Clock, MapPin } from 'lucide-react';
import { buttonClass, capitalize, cn } from '../../../components/ui/styles';
import { formatDate } from '../../../lib/eventContent';
import { Dino, Fern, Hills, Pterodactyl, Volcano } from './Illustrations';
import { CHUNKY, CHUNKY_SM } from './ui';

interface DinoHeroProps {
  firstName: string;
  age: number;
  eventDate: Date | null;
  /** The admin's cover photo, shown as a chunky polaroid when there is one. */
  photoUrl: string | null;
  place?: string;
}

/**
 * The opening screen: a jungle with a smoking volcano, ferns, a pterodactyl and a friendly dinosaur on green hills,
 * the name in big extra bold letters, the age on an orange sticker and the date, time and place as chunky chips.
 */
export function DinoHero({ firstName, age, eventDate, photoUrl, place }: DinoHeroProps) {
  const chips = [
    eventDate && { icon: CalendarDays, label: capitalize(formatDate(eventDate, "EEEE d 'de' MMMM")) },
    eventDate && { icon: Clock, label: formatDate(eventDate, "HH:mm 'hrs'") },
    place && { icon: MapPin, label: place },
  ].filter((chip): chip is { icon: typeof MapPin; label: string } => Boolean(chip));

  return (
    <header className="relative overflow-hidden bg-[linear-gradient(180deg,var(--sky)_0%,var(--background)_75%)] px-5 pt-14 pb-48 sm:px-8 sm:pt-20 sm:pb-56">
      <Pterodactyl className="dino-flight absolute top-[7%] left-0 w-16 sm:top-[9%] sm:w-24" />
      <Volcano className="absolute bottom-20 -left-10 w-48 sm:bottom-24 sm:left-[3%] sm:w-56" />
      <Fern className="absolute right-[38%] bottom-24 hidden w-14 sm:block" />

      <div className="relative mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[1.2fr_1fr]">
        <div className="text-center md:text-left">
          <span className={cn('inline-block -rotate-3 rounded-full bg-(--accent) px-4 py-1.5 text-base font-extrabold animate-[fadeUp_0.7s_ease_both]', CHUNKY_SM)}>
            ¡Rawr! Estás invitado
          </span>
          <h1 className="mt-6 text-[clamp(64px,12vw,128px)] leading-[0.85] font-extrabold tracking-tight animate-[fadeUp_0.8s_0.1s_ease_both]">
            {firstName}
          </h1>
          <p className="mt-4 text-[clamp(20px,3vw,28px)] font-bold animate-[fadeUp_0.8s_0.2s_ease_both]">
            ¡Celebra con nosotros su fiesta jurásica!
          </p>
          {chips.length > 0 && (
            <ul className="mt-6 flex flex-wrap justify-center gap-2 animate-[fadeUp_0.8s_0.3s_ease_both] md:justify-start">
              {chips.map(({ icon: Icon, label }) => (
                <li key={label} className={cn('inline-flex items-center gap-2 rounded-full bg-(--card) px-3.5 py-1.5 text-sm font-semibold', CHUNKY_SM)}>
                  <Icon className="size-4 text-(--primary)" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-3 animate-[fadeUp_0.8s_0.4s_ease_both] md:justify-start">
            <a href="#rsvp" className={buttonClass('default', 'lg', cn('rounded-full text-base font-bold', CHUNKY_SM))}>
              Confirmar asistencia
            </a>
            <a href="#mensaje" className={buttonClass('outline', 'lg', cn('rounded-full bg-(--card) text-base font-bold', CHUNKY_SM))}>
              Ver detalles
              <ArrowDown aria-hidden="true" />
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-sm animate-[fadeUp_0.8s_0.2s_ease_both]">
          {age > 0 && (
            <div
              className={cn(
                'absolute top-0 left-0 z-10 flex size-28 -rotate-6 flex-col items-center justify-center rounded-full bg-(--secondary) sm:size-32',
                CHUNKY,
              )}
            >
              <span className="text-sm leading-none font-bold">¡Cumple</span>
              <span className="text-6xl leading-[0.9] font-extrabold">{age}!</span>
            </div>
          )}
          {photoUrl ? (
            <div className={cn('-rotate-3 rounded-(--radius) bg-(--card) p-3 pb-10', CHUNKY)}>
              <img src={photoUrl} alt={firstName} className="aspect-square w-full rounded-[calc(var(--radius)-6px)] object-cover" />
            </div>
          ) : (
            <Dino className="dino-motion relative z-0 w-full translate-y-20 animate-[dinoBob_3s_ease-in-out_infinite] md:translate-y-44" />
          )}
        </div>
      </div>

      <Fern className="absolute right-2 bottom-16 w-16 sm:right-[6%] sm:w-20" />
      <Hills className="absolute inset-x-0 -bottom-1 h-28 w-full sm:h-36" />
    </header>
  );
}
