import { CalendarPlus, Clock, MapPin, Navigation } from 'lucide-react';
import { Reveal } from '../../../components/shared/Reveal';
import { Badge, Card, Section } from '../../../components/ui/primitives';
import { buttonClass } from '../../../components/ui/styles';
import { useCountdown } from '../../../hooks/useCountdown';
import { downloadEventCalendar, type CalendarOccasion } from '../../../utils/calendar';
import type { ProgramItem, Venue } from '../../../types/wedding';
import { AuroraSky, SectionTitle } from './ui';

/** A venue as a horizontal card: the photo (or the map) on the left and the details on the right. */
function VenueCard({ venue }: { venue: Venue }) {
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
    <Card className="grid overflow-hidden sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      {media && <div className="relative min-h-[200px] bg-(--secondary)">{media}</div>}
      <div className="flex flex-col p-6 sm:p-7">
        <Badge className="w-fit border-transparent bg-(--accent) font-semibold text-(--accent-foreground)">
          <span aria-hidden="true">{venue.icon}</span>
          {venue.tag}
        </Badge>
        <h3 className="mt-4 font-bodoni text-[28px] leading-tight italic">{venue.name}</h3>
        <div className="mt-4 grid gap-2.5 text-sm text-(--muted-foreground)">
          {venue.time && (
            <p className="flex items-center gap-2">
              <Clock className="size-4 shrink-0 text-(--primary)" aria-hidden="true" />
              <span className="font-semibold text-(--foreground)">{venue.time}</span>
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
          <a href={venue.directionsUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('outline', 'default', 'mt-6 self-start rounded-full')}>
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
    <Section>
      <SectionTitle
        eyebrow="Dónde"
        title="Te espero aquí"
        description="Los lugares donde viviremos esta noche; toca «Cómo llegar» para abrir la ruta."
      />
      <Reveal className="mx-auto grid max-w-4xl gap-5">
        {venues.map((venue) => (
          <VenueCard key={`${venue.tag}-${venue.name}`} venue={venue} />
        ))}
      </Reveal>
    </Section>
  );
}

/** The program as a vertical timeline on an aurora-colored line, each moment on a card with its emoji. */
export function ProgramSection({ items }: { items: ProgramItem[] }) {
  return (
    <Section className="bg-(--muted)">
      <SectionTitle eyebrow="Cuándo" title="Así será mi noche" description="Cada momento, pensado para vivirlo contigo." />
      <Reveal>
        <ol className="relative mx-auto grid max-w-2xl gap-4 before:absolute before:top-4 before:bottom-4 before:left-[23px] before:w-0.5 before:rounded-full before:bg-[linear-gradient(to_bottom,var(--aurora-violet),var(--aurora-pink),var(--aurora-peach))]">
          {items.map((item) => (
            <li key={`${item.time}-${item.title}`} className="relative flex gap-4">
              <span className="relative z-[1] flex size-12 shrink-0 items-center justify-center rounded-full border border-(--border) bg-(--card) text-xl shadow-sm" aria-hidden="true">
                {item.icon || '✨'}
              </span>
              <Card className="flex-1 p-4 sm:p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <h3 className="text-base font-bold sm:text-lg">{item.title}</h3>
                  <span className="text-sm font-semibold text-(--primary) tabular-nums">{item.time}</span>
                </div>
                {item.description && <p className="mt-1 text-sm leading-relaxed text-(--muted-foreground)">{item.description}</p>}
              </Card>
            </li>
          ))}
        </ol>
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

/** One card split in four by separators, with the numbers painted in aurora, over the auroras. */
export function CountdownSection({ targetDateTime, calendar, venues }: CountdownSectionProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDateTime);
  const values = [days, hours, minutes, seconds];

  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      <AuroraSky count={3} />
      <div className="relative mx-auto max-w-4xl">
        <SectionTitle eyebrow="Cuenta regresiva" title="Falta muy poco" />
        <Reveal>
          <Card className="grid grid-cols-2 divide-(--border) bg-(--card)/80 backdrop-blur-sm sm:grid-cols-4 sm:divide-x" role="timer" aria-label="Tiempo que falta para la fiesta">
            {UNITS.map((label, index) => (
              <div key={label} className="px-4 py-7 text-center max-sm:[&:nth-child(-n+2)]:border-b max-sm:[&:nth-child(-n+2)]:border-(--border) max-sm:odd:border-r max-sm:odd:border-(--border)">
                <p className="font-bodoni text-[clamp(52px,8vw,76px)] leading-none italic tabular-nums aurora-text">
                  {String(values[index]).padStart(2, '0')}
                </p>
                <p className="mt-2 text-xs font-semibold tracking-[0.2em] text-(--muted-foreground) uppercase">{label}</p>
              </div>
            ))}
          </Card>
          {venues.length > 0 && calendar.dateTime && (
            <div className="mt-8 text-center">
              <button type="button" onClick={() => downloadEventCalendar(calendar, venues)} className={buttonClass('outline', 'lg', 'rounded-full')}>
                <CalendarPlus aria-hidden="true" />
                Guardar la fecha
              </button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
