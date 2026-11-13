import { CalendarPlus, Clock, MapPin, Navigation } from 'lucide-react';
import { Reveal } from '../../../components/shared/Reveal';
import { Card, Section } from '../../../components/ui/primitives';
import { buttonClass, cn } from '../../../components/ui/styles';
import { useCountdown } from '../../../hooks/useCountdown';
import { downloadEventCalendar, type CalendarOccasion } from '../../../utils/calendar';
import type { ProgramItem, Venue } from '../../../types/wedding';
import { SectionTitle } from './ui';

interface MessageSectionProps {
  index: string;
  firstName: string;
  age: number;
  message: string | null;
  hosts: string;
}

export function MessageSection({ index, firstName, age, message, hosts }: MessageSectionProps) {
  const fallback = `${firstName} llega a los ${age} y lo vamos a celebrar como se debe: buena comida, buena música y los amigos de siempre. Nos encantaría que estuvieras ahí.`;

  return (
    <Section id="plan" className="border-t border-(--border)">
      <div className="grid gap-8 md:grid-cols-[1fr_1.3fr] md:gap-16">
        <SectionTitle index={index} eyebrow="La invitación" title={age > 0 ? `${age} años merecen una buena fiesta` : 'Esto merece una buena fiesta'} flush />
        <Reveal>
          <p className="text-xl leading-relaxed text-pretty sm:text-2xl">{message || fallback}</p>
          {hosts && (
            <p className="mt-8 flex items-center gap-3 text-sm text-(--muted-foreground)">
              <span className="h-px w-8 bg-(--primary)" aria-hidden="true" />
              {hosts}
            </p>
          )}
        </Reveal>
      </div>
    </Section>
  );
}

function VenueRow({ venue }: { venue: Venue }) {
  const media = venue.image ? (
    <img src={venue.image} alt={venue.imageAlt ?? venue.name} loading="lazy" className="size-full min-h-56 object-cover" />
  ) : venue.mapEmbedUrl ? (
    <iframe
      src={venue.mapEmbedUrl}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      title={venue.mapTitle}
      className="size-full min-h-56 border-0 [filter:invert(0.9)_hue-rotate(180deg)_saturate(0.6)]"
    />
  ) : null;

  return (
    <Card className={cn('grid overflow-hidden', media && 'md:grid-cols-[1fr_1.1fr]')}>
      <div className="flex flex-col p-6 sm:p-8">
        <p className="flex items-center gap-2 font-geist-mono text-xs tracking-wider text-(--primary) uppercase">
          <span aria-hidden="true">{venue.icon}</span>
          {venue.tag}
        </p>
        <h3 className="mt-3 font-space-grotesk text-3xl leading-tight font-semibold tracking-tight">{venue.name}</h3>
        <dl className="mt-6 grid gap-4 border-t border-(--border) pt-6 text-sm">
          {venue.time && (
            <div className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-(--muted-foreground)" aria-hidden="true" />
              <div>
                <dt className="sr-only">Hora</dt>
                <dd className="font-geist-mono font-medium">{venue.time}</dd>
              </div>
            </div>
          )}
          {venue.addressLines.length > 0 && (
            <div className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-(--muted-foreground)" aria-hidden="true" />
              <div>
                <dt className="sr-only">Dirección</dt>
                {venue.addressLines.map((line, index) => (
                  <dd key={`${index}-${line}`} className="text-(--muted-foreground)">
                    {line}
                  </dd>
                ))}
              </div>
            </div>
          )}
        </dl>
        {venue.directionsUrl && (
          <a href={venue.directionsUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('default', 'default', 'mt-8 self-start')}>
            <Navigation aria-hidden="true" />
            Abrir en Maps
          </a>
        )}
      </div>
      {media && <div className="border-t border-(--border) md:border-t-0 md:border-l">{media}</div>}
    </Card>
  );
}

export function VenuesSection({ index, venues }: { index: string; venues: Venue[] }) {
  return (
    <Section id="lugar" className="border-t border-(--border) bg-(--surface)">
      <SectionTitle index={index} eyebrow="Ubicación" title="Dónde nos vemos" description="Con un toque abres la ruta desde tu teléfono." />
      <Reveal className="grid gap-4">
        {venues.map((venue) => (
          <VenueRow key={`${venue.tag}-${venue.name}`} venue={venue} />
        ))}
      </Reveal>
    </Section>
  );
}

/** The program as shadcn/ui's Table: the time in mono, the item and its description, one row each. */
export function ProgramSection({ index, items }: { index: string; items: ProgramItem[] }) {
  return (
    <Section id="programa" className="border-t border-(--border)">
      <SectionTitle index={index} eyebrow="Agenda" title="Cómo va la noche" />
      <Reveal>
        <Card className="overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-(--border) bg-(--muted)/50 text-xs text-(--muted-foreground)">
              <tr>
                <th scope="col" className="w-28 px-4 py-3 font-medium sm:w-36 sm:px-6">
                  Hora
                </th>
                <th scope="col" className="px-4 py-3 font-medium sm:px-6">
                  Qué pasa
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border)">
              {items.map((item) => (
                <tr key={`${item.time}-${item.title}`} className="transition-colors hover:bg-(--muted)/40">
                  <td className="px-4 py-5 align-top font-geist-mono font-medium text-(--primary) tabular-nums sm:px-6">{item.time}</td>
                  <td className="px-4 py-5 sm:px-6">
                    <p className="flex items-center gap-2 text-base font-semibold">
                      {item.icon && <span aria-hidden="true">{item.icon}</span>}
                      {item.title}
                    </p>
                    {item.description && <p className="mt-1 text-(--muted-foreground)">{item.description}</p>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Reveal>
    </Section>
  );
}

const UNITS = ['días', 'horas', 'min', 'seg'] as const;

interface CountdownSectionProps {
  index: string;
  targetDateTime: string;
  calendar: CalendarOccasion;
  venues: Venue[];
}

/** Four mono figures on cards with an amber top edge, and the button that saves the date to the calendar. */
export function CountdownSection({ index, targetDateTime, calendar, venues }: CountdownSectionProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDateTime);
  const values = [days, hours, minutes, seconds];

  return (
    <Section className="grafito-glow border-t border-(--border)">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionTitle index={index} eyebrow="Cuenta regresiva" title="Arrancamos en" flush />
        {venues.length > 0 && calendar.dateTime && (
          <Reveal>
            <button type="button" onClick={() => downloadEventCalendar(calendar, venues)} className={buttonClass('outline', 'default', 'bg-transparent')}>
              <CalendarPlus aria-hidden="true" />
              Guardar en mi calendario
            </button>
          </Reveal>
        )}
      </div>
      <Reveal className="mt-10">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4" role="timer" aria-label="Tiempo que falta para la fiesta">
          {UNITS.map((label, unit) => (
            <Card key={label} className="border-t-2 border-t-(--primary) p-5 sm:p-6">
              <p className="font-geist-mono text-[clamp(44px,7vw,68px)] leading-none font-semibold tabular-nums">
                {String(values[unit]).padStart(2, '0')}
              </p>
              <p className="mt-3 text-xs font-medium tracking-wider text-(--muted-foreground) uppercase">{label}</p>
            </Card>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}
