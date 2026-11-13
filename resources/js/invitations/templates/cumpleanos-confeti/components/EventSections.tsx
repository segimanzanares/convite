import { CalendarPlus, Clock, Heart, MapPin, Navigation } from 'lucide-react';
import { Reveal } from '../../../components/shared/Reveal';
import { Card, Section } from '../../../components/ui/primitives';
import { buttonClass, cn } from '../../../components/ui/styles';
import { useCountdown } from '../../../hooks/useCountdown';
import { downloadEventCalendar, type CalendarOccasion } from '../../../utils/calendar';
import type { ProgramItem, Venue } from '../../../types/wedding';
import { Confetti, SectionTitle } from './ui';

interface MessageSectionProps {
  firstName: string;
  age: number;
  message: string | null;
  hosts: string;
}

export function MessageSection({ firstName, age, message, hosts }: MessageSectionProps) {
  const fallback = `${firstName} cumple ${age} y no se nos ocurre mejor manera de celebrarlo que rodeada de la gente que más quiere. Prepárate para una noche de risas, brindis y mucho baile.`;

  return (
    <Section id="mensaje">
      <SectionTitle eyebrow="Una nota especial" title="¡Hagamos de este cumpleaños algo inolvidable!" />
      <Reveal>
        <Card className="relative mx-auto max-w-3xl overflow-hidden p-8 text-center sm:p-12">
          <Heart className="mx-auto size-6 fill-(--primary) text-(--primary)" aria-hidden="true" />
          <p className="mt-6 text-lg leading-relaxed text-pretty sm:text-xl">{message || fallback}</p>
          {hosts && <p className="mt-8 text-sm font-semibold text-(--secondary-foreground)">— {hosts}</p>}
        </Card>
      </Reveal>
    </Section>
  );
}

function VenueCard({ venue }: { venue: Venue }) {
  return (
    <Card className="flex flex-col overflow-hidden">
      {venue.image ? (
        <img src={venue.image} alt={venue.imageAlt ?? venue.name} loading="lazy" className="aspect-[16/9] w-full object-cover" />
      ) : (
        venue.mapEmbedUrl && (
          <iframe
            src={venue.mapEmbedUrl}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title={venue.mapTitle}
            className="aspect-[16/9] w-full border-0"
          />
        )
      )}
      <div className="flex flex-1 flex-col p-6">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-(--accent) px-3 py-1 text-xs font-semibold text-(--accent-foreground)">
          <span aria-hidden="true">{venue.icon}</span>
          {venue.tag}
        </span>
        <h3 className="mt-4 font-dm-serif text-3xl leading-tight">{venue.name}</h3>
        <div className="mt-4 grid gap-2 text-sm text-(--muted-foreground)">
          {venue.time && (
            <p className="flex items-center gap-2">
              <Clock className="size-4 shrink-0 text-(--primary)" aria-hidden="true" />
              <span className="font-medium text-(--foreground)">{venue.time}</span>
            </p>
          )}
          {venue.addressLines.length > 0 && (
            <p className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-(--primary)" aria-hidden="true" />
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
            className={buttonClass('secondary', 'default', 'mt-6 self-start rounded-full')}
          >
            <Navigation aria-hidden="true" />
            Cómo llegar
          </a>
        )}
      </div>
    </Card>
  );
}

export function VenuesSection({ venues }: { venues: Venue[] }) {
  return (
    <Section id="lugar" className="bg-(--muted)">
      <SectionTitle
        eyebrow="El lugar"
        title="Aquí será la fiesta"
        description="Toca el botón para abrir la ruta desde tu teléfono."
      />
      <Reveal className={cn('grid gap-4', venues.length > 1 ? 'md:grid-cols-2' : 'mx-auto max-w-xl')}>
        {venues.map((venue) => (
          <VenueCard key={`${venue.tag}-${venue.name}`} venue={venue} />
        ))}
      </Reveal>
    </Section>
  );
}

/** The program as a stepper of cards: a numbered rose dot, the time as a badge and the item's emoji. */
export function ProgramSection({ items }: { items: ProgramItem[] }) {
  return (
    <Section id="programa">
      <SectionTitle eyebrow="El plan" title="Lo que viene esa noche" description="Cada momento, pensado para disfrutarlo juntos." />
      <Reveal>
        <ol className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2">
          {items.map((item, index) => (
            <li key={`${item.time}-${item.title}`}>
              <Card className="flex h-full gap-4 p-5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-(--primary) font-dm-serif text-lg text-(--primary-foreground)">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <span className="inline-flex items-center rounded-full border border-(--border) px-2.5 py-0.5 text-xs font-semibold text-(--secondary-foreground) tabular-nums">
                    {item.time}
                  </span>
                  <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
                  {item.description && (
                    <p className="mt-1 text-sm leading-relaxed text-(--muted-foreground)">{item.description}</p>
                  )}
                </div>
                {item.icon && (
                  <span className="text-3xl leading-none" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
              </Card>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}

const UNITS = ['días', 'horas', 'minutos', 'segundos'] as const;

interface CountdownSectionProps {
  targetDateTime: string;
  calendar: CalendarOccasion;
  venues: Venue[];
}

/** Four tiles over the rose-to-lilac wash, with the button that saves the date to the calendar. */
export function CountdownSection({ targetDateTime, calendar, venues }: CountdownSectionProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDateTime);
  const values = [days, hours, minutes, seconds];

  return (
    <section className="confeti-wash relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      <Confetti count={6} />
      <div className="relative mx-auto max-w-4xl">
        <SectionTitle eyebrow="Cuenta regresiva" title="¡Ya casi es la fiesta!" />
        <Reveal>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4" role="timer" aria-label="Tiempo que falta para la fiesta">
            {UNITS.map((label, index) => (
              <Card key={label} className="py-6 text-center">
                <p className="font-dm-serif text-[clamp(48px,7vw,64px)] leading-none text-(--primary) tabular-nums">
                  {String(values[index]).padStart(2, '0')}
                </p>
                <p className="mt-2 text-sm font-medium text-(--muted-foreground)">{label}</p>
              </Card>
            ))}
          </div>
          {venues.length > 0 && calendar.dateTime && (
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => downloadEventCalendar(calendar, venues)}
                className={buttonClass('outline', 'lg', 'rounded-full')}
              >
                <CalendarPlus aria-hidden="true" />
                Guardar en mi calendario
              </button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
