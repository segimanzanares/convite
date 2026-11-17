import { CalendarPlus, MapPin, Navigation } from 'lucide-react';
import { Reveal } from '../../../components/shared/Reveal';
import { Card, Section } from '../../../components/ui/primitives';
import { buttonClass } from '../../../components/ui/styles';
import { useCountdown } from '../../../hooks/useCountdown';
import { downloadEventCalendar, type CalendarOccasion } from '../../../utils/calendar';
import type { ProgramItem, Venue } from '../../../types/wedding';
import { Candle } from './LuzArt';
import { SectionTitle } from './ui';

/** A venue as a numbered card: the number, the tag and the details on one side, the photo (or the map) on the other. */
function VenueCard({ venue, index }: { venue: Venue; index: number }) {
  const media = venue.image ? (
    <img src={venue.image} alt={venue.imageAlt ?? venue.name} loading="lazy" className="absolute inset-0 size-full object-cover" />
  ) : venue.mapEmbedUrl ? (
    <iframe
      src={venue.mapEmbedUrl}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      title={venue.mapTitle}
      className="absolute inset-0 size-full border-0"
    />
  ) : null;

  return (
    <Card className="grid overflow-hidden md:grid-cols-2">
      <div className="flex flex-col p-7 sm:p-9">
        <div className="flex items-baseline gap-4">
          <span className="font-newsreader text-5xl font-light text-(--primary) tabular-nums">{String(index + 1).padStart(2, '0')}</span>
          <span className="text-xs font-semibold tracking-[0.28em] text-(--muted-foreground) uppercase">{venue.tag}</span>
        </div>
        <h3 className="mt-4 font-newsreader text-3xl leading-tight italic">{venue.name}</h3>
        {venue.time && <p className="mt-2 text-sm font-semibold text-(--primary)">{venue.time}</p>}
        {venue.addressLines.length > 0 && (
          <p className="mt-4 flex gap-2 text-sm text-(--muted-foreground)">
            <MapPin className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>
              {venue.addressLines.map((line, lineIndex) => (
                <span key={`${lineIndex}-${line}`} className="block">
                  {line}
                </span>
              ))}
            </span>
          </p>
        )}
        {venue.directionsUrl && (
          <a href={venue.directionsUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('outline', 'default', 'mt-6 self-start rounded-full md:mt-auto')}>
            <Navigation aria-hidden="true" />
            Cómo llegar
          </a>
        )}
      </div>
      {media && <div className="relative min-h-[220px] bg-(--secondary)">{media}</div>}
    </Card>
  );
}

export function VenuesSection({ venues }: { venues: Venue[] }) {
  return (
    <Section>
      <SectionTitle eyebrow="Dónde" title="La ceremonia y la celebración" description="Te esperamos primero en la parroquia y después a la mesa." />
      <Reveal className="grid gap-5">
        {venues.map((venue, index) => (
          <VenueCard key={`${venue.tag}-${venue.name}`} venue={venue} index={index} />
        ))}
      </Reveal>
    </Section>
  );
}

/** The program as a table: the time, then the moment and its description, with a dotted leader between them. */
export function ProgramSection({ items }: { items: ProgramItem[] }) {
  return (
    <Section className="bg-(--muted)">
      <SectionTitle eyebrow="Cuándo" title="El orden del día" />
      <Reveal>
        <Card>
          <ol className="divide-y divide-(--border)">
            {items.map((item) => (
              <li key={`${item.time}-${item.title}`} className="grid grid-cols-[auto_1fr] gap-x-5 px-6 py-5 sm:grid-cols-[120px_1fr] sm:px-10">
                <span className="pt-1 text-sm font-semibold text-(--primary) tabular-nums">{item.time}</span>
                <div>
                  <h3 className="flex items-baseline gap-3 font-newsreader text-xl italic sm:text-2xl">
                    {item.title}
                    <span className="hidden h-0 flex-1 border-b border-dotted border-(--input) sm:block" aria-hidden="true" />
                    {item.icon && (
                      <span className="text-lg not-italic" aria-hidden="true">
                        {item.icon}
                      </span>
                    )}
                  </h3>
                  {item.description && <p className="mt-1 text-sm leading-relaxed text-(--muted-foreground)">{item.description}</p>}
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </Reveal>
    </Section>
  );
}

const UNITS = ['Días', 'Horas', 'Minutos', 'Segundos'] as const;

interface CountdownSectionProps {
  targetDateTime: string;
  calendar: CalendarOccasion;
  venues: Venue[];
}

/** A candle burns at night while the days, hours, minutes and seconds run, split by hairlines. */
export function CountdownSection({ targetDateTime, calendar, venues }: CountdownSectionProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDateTime);
  const values = [days, hours, minutes, seconds];

  return (
    <section className="ui-dark relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      <div className="luz-halo pointer-events-none absolute inset-0" aria-hidden="true" />
      <Reveal className="relative mx-auto max-w-4xl text-center">
        <Candle className="mx-auto h-36 w-auto" />
        <p className="mt-6 text-xs font-semibold tracking-[0.35em] text-(--primary) uppercase">Cuenta regresiva</p>
        <h2 className="mt-3 font-newsreader text-[clamp(34px,5.5vw,52px)] font-light italic">Mientras la vela espera</h2>
        <div className="mt-10 grid grid-cols-2 border-y border-(--border) sm:grid-cols-4" role="timer" aria-label="Tiempo que falta para el bautizo">
          {UNITS.map((label, index) => (
            <div key={label} className="border-(--border) px-3 py-7 max-sm:[&:nth-child(-n+2)]:border-b max-sm:odd:border-r sm:[&:not(:first-child)]:border-l">
              <p className="font-newsreader text-[clamp(52px,8vw,80px)] leading-none font-light tabular-nums">{String(values[index]).padStart(2, '0')}</p>
              <p className="mt-2 text-[11px] font-semibold tracking-[0.3em] text-(--muted-foreground) uppercase">{label}</p>
            </div>
          ))}
        </div>
        {venues.length > 0 && calendar.dateTime && (
          <button type="button" onClick={() => downloadEventCalendar(calendar, venues)} className={buttonClass('outline', 'lg', 'mt-10 rounded-full bg-transparent')}>
            <CalendarPlus aria-hidden="true" />
            Guardar la fecha
          </button>
        )}
      </Reveal>
    </section>
  );
}
