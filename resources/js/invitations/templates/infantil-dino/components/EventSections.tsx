import { CalendarPlus, Clock, MapPin, Navigation } from 'lucide-react';
import { Reveal } from '../../../components/shared/Reveal';
import { Section } from '../../../components/ui/primitives';
import { buttonClass, cn } from '../../../components/ui/styles';
import { useCountdown } from '../../../hooks/useCountdown';
import { downloadEventCalendar, type CalendarOccasion } from '../../../utils/calendar';
import type { ProgramItem, Venue } from '../../../types/wedding';
import { Dino, Footprint } from './Illustrations';
import { CHUNKY, CHUNKY_SM, SectionTitle } from './ui';

interface MessageSectionProps {
  firstName: string;
  age: number;
  message: string | null;
  hosts: string;
}

/** The message as a speech bubble coming out of the little dinosaur. */
export function MessageSection({ firstName, age, message, hosts }: MessageSectionProps) {
  const fallback = `${firstName} cumple ${age} años y lo vamos a celebrar con una aventura jurásica: juegos, pastel y muchos dinosaurios. ¡Ven con tu mejor rugido!`;

  return (
    <Section id="mensaje">
      <SectionTitle eyebrow="Una invitación prehistórica" title="¡Una fiesta jurásica!" />
      <Reveal className="mx-auto grid max-w-3xl items-end gap-4 sm:grid-cols-[1fr_160px]">
        <div className={cn('relative rounded-[calc(var(--radius)+8px)] bg-(--card) p-7 sm:p-9', CHUNKY)}>
          <p className="text-xl leading-relaxed font-semibold text-pretty sm:text-2xl">{message || fallback}</p>
          {hosts && <p className="mt-5 font-bold text-(--primary)">— {hosts}</p>}
          <span
            className="absolute -bottom-[18px] right-10 hidden size-8 rotate-45 border-r-[3px] border-b-[3px] border-(--foreground) bg-(--card) sm:-right-[18px] sm:bottom-10 sm:block sm:rotate-[-45deg]"
            aria-hidden="true"
          />
        </div>
        <Dino className="mx-auto w-40 -scale-x-100" />
      </Reveal>
    </Section>
  );
}

function VenueCard({ venue }: { venue: Venue }) {
  return (
    <div className={cn('flex flex-col overflow-hidden rounded-[calc(var(--radius)+4px)] bg-(--card)', CHUNKY)}>
      {venue.image ? (
        <img src={venue.image} alt={venue.imageAlt ?? venue.name} loading="lazy" className="aspect-[16/9] w-full border-b-[3px] border-(--foreground) object-cover" />
      ) : (
        venue.mapEmbedUrl && (
          <iframe
            src={venue.mapEmbedUrl}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title={venue.mapTitle}
            className="aspect-[16/9] w-full border-0 border-b-[3px] border-(--foreground)"
          />
        )
      )}
      <div className="flex flex-1 flex-col p-6">
        <span className={cn('w-fit rounded-full bg-(--secondary) px-3 py-0.5 text-sm font-bold', CHUNKY_SM)}>
          <span aria-hidden="true">{venue.icon}</span> {venue.tag}
        </span>
        <h3 className="mt-4 text-3xl leading-tight font-extrabold">{venue.name}</h3>
        <div className="mt-3 grid gap-1.5 text-base">
          {venue.time && (
            <p className="flex items-center gap-2 font-bold">
              <Clock className="size-4 shrink-0 text-(--primary)" aria-hidden="true" />
              {venue.time}
            </p>
          )}
          {venue.addressLines.length > 0 && (
            <p className="flex gap-2 text-(--muted-foreground)">
              <MapPin className="mt-1 size-4 shrink-0 text-(--primary)" aria-hidden="true" />
              <span>
                {venue.addressLines.map((line, index) => (
                  <span key={`${index}-${line}`} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </p>
          )}
        </div>
        {venue.directionsUrl && (
          <a
            href={venue.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass('default', 'lg', cn('mt-6 self-start rounded-full text-base font-bold', CHUNKY_SM))}
          >
            <Navigation aria-hidden="true" />
            ¿Cómo llego?
          </a>
        )}
      </div>
    </div>
  );
}

export function VenuesSection({ venues }: { venues: Venue[] }) {
  return (
    <Section id="lugar" className="dino-dots border-y-[3px] border-(--foreground) bg-(--muted)">
      <SectionTitle eyebrow="La guarida" title="¿Dónde será la expedición?" description="Toca el botón y te llevamos directo a la fiesta." />
      <Reveal className={cn('grid gap-6', venues.length > 1 ? 'md:grid-cols-2' : 'mx-auto max-w-xl')}>
        {venues.map((venue) => (
          <VenueCard key={`${venue.tag}-${venue.name}`} venue={venue} />
        ))}
      </Reveal>
    </Section>
  );
}

/** The program as a trail of dinosaur footprints, with a chunky card at each stop and the time on a sticker. */
export function ProgramSection({ items }: { items: ProgramItem[] }) {
  return (
    <Section id="programa">
      <SectionTitle eyebrow="La expedición" title="¿Qué vamos a hacer?" description="Sigue las huellas: así será la aventura." />
      <Reveal>
        <ol className="mx-auto flex max-w-xl flex-col items-center">
          {items.map((item, index) => (
            <li key={`${item.time}-${item.title}`} className="flex w-full flex-col items-center">
              {index > 0 && (
                <div className={cn('flex flex-col gap-1 py-2 text-(--primary)', index % 2 ? 'translate-x-3' : '-translate-x-3')} aria-hidden="true">
                  <Footprint className="size-6 -rotate-12" />
                  <Footprint className="size-6 translate-x-5 rotate-12" />
                </div>
              )}
              <div className={cn('relative w-full rounded-[calc(var(--radius)+4px)] bg-(--card) p-5 pr-16 sm:p-6 sm:pr-20', CHUNKY, index % 2 ? 'rotate-1' : '-rotate-1')}>
                <span className={cn('inline-block -rotate-2 rounded-full bg-(--accent) px-3 py-0.5 text-sm font-extrabold tabular-nums', CHUNKY_SM)}>
                  {item.time}
                </span>
                <h3 className="mt-3 text-2xl leading-tight font-extrabold">{item.title}</h3>
                {item.description && <p className="mt-1 text-base text-(--muted-foreground)">{item.description}</p>}
                {item.icon && (
                  <span className="absolute top-1/2 right-5 -translate-y-1/2 text-4xl sm:text-5xl" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}

const UNITS = [
  { label: 'días', className: 'bg-(--primary) text-(--primary-foreground)' },
  { label: 'horas', className: 'bg-(--secondary)' },
  { label: 'minutos', className: 'bg-(--accent)' },
  { label: 'segundos', className: 'bg-(--sky)' },
] as const;

interface CountdownSectionProps {
  targetDateTime: string;
  calendar: CalendarOccasion;
  venues: Venue[];
}

/** Four chunky tiles, each in one of the party colors, and the button that saves the date to the calendar. */
export function CountdownSection({ targetDateTime, calendar, venues }: CountdownSectionProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDateTime);
  const values = [days, hours, minutes, seconds];

  return (
    <Section className="border-y-[3px] border-(--foreground) bg-(--card)">
      <SectionTitle eyebrow="¡Ya casi!" title="Faltan muy poquito" />
      <Reveal>
        <div className="mx-auto grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4" role="timer" aria-label="Tiempo que falta para la fiesta">
          {UNITS.map(({ label, className }, index) => (
            <div key={label} className={cn('rounded-[calc(var(--radius)+4px)] py-6 text-center', CHUNKY, index % 2 ? 'rotate-2' : '-rotate-2', className)}>
              <p className="text-[clamp(48px,7vw,64px)] leading-none font-extrabold tabular-nums">{String(values[index]).padStart(2, '0')}</p>
              <p className="mt-1 text-base font-bold">{label}</p>
            </div>
          ))}
        </div>
        {venues.length > 0 && calendar.dateTime && (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => downloadEventCalendar(calendar, venues)}
              className={buttonClass('outline', 'lg', cn('rounded-full bg-(--card) text-base font-bold', CHUNKY_SM))}
            >
              <CalendarPlus aria-hidden="true" />
              Guardar en mi calendario
            </button>
          </div>
        )}
      </Reveal>
    </Section>
  );
}
