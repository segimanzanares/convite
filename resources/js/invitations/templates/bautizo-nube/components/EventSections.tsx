import { CalendarPlus, Clock, MapPin, Navigation } from 'lucide-react';
import { Reveal } from '../../../components/shared/Reveal';
import { Badge, Card, Section } from '../../../components/ui/primitives';
import { buttonClass, cn } from '../../../components/ui/styles';
import { useCountdown } from '../../../hooks/useCountdown';
import { downloadEventCalendar, type CalendarOccasion } from '../../../utils/calendar';
import type { ProgramItem, Venue } from '../../../types/wedding';
import { CountingSheep } from './NubeArt';
import { SectionTitle } from './ui';

/** A venue as a card: the photo (or the map) on top, the tag as a badge and the details below. */
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
    <Card className="flex flex-col overflow-hidden">
      {media && <div className="relative aspect-[16/10] bg-(--secondary)">{media}</div>}
      <div className="flex flex-1 flex-col p-6">
        <Badge className="w-fit">
          <span aria-hidden="true">{venue.icon}</span>
          {venue.tag}
        </Badge>
        <h3 className="mt-3 font-young-serif text-2xl leading-tight">{venue.name}</h3>
        <div className="mt-3 grid gap-2 text-sm text-(--muted-foreground)">
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
          <a href={venue.directionsUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('secondary', 'default', 'mt-auto self-start rounded-full max-sm:mt-5 sm:mt-6')}>
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
      <SectionTitle eyebrow="Dónde" title="La ceremonia y la fiesta" description="Toca «Cómo llegar» para abrir la ruta en tu teléfono." />
      <Reveal className={cn('mx-auto grid max-w-4xl gap-5', venues.length > 1 && 'sm:grid-cols-2')}>
        {venues.map((venue) => (
          <VenueCard key={`${venue.tag}-${venue.name}`} venue={venue} />
        ))}
      </Reveal>
    </Section>
  );
}

const STEP_COLORS = ['--sky', '--butter', '--blush', '--mint', '--lilac'];

/** The program as numbered steps: each moment on a card with its emoji in a pastel bubble and its time as a badge. */
export function ProgramSection({ items }: { items: ProgramItem[] }) {
  return (
    <Section className="bg-(--muted)">
      <SectionTitle eyebrow="Cuándo" title="Así será el día" description="Paso a pasito, todo lo que viviremos juntos." />
      <Reveal>
        <ol className="mx-auto grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, index) => (
            <li key={`${item.time}-${item.title}`}>
              <Card className="relative h-full p-5">
                <span className="absolute top-4 right-5 text-xs font-bold text-(--muted-foreground) tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                <span
                  className="flex size-12 items-center justify-center rounded-full text-2xl"
                  style={{ backgroundColor: `var(${STEP_COLORS[index % STEP_COLORS.length]})` }}
                  aria-hidden="true"
                >
                  {item.icon || '☁️'}
                </span>
                <p className="mt-4 text-sm font-bold text-(--primary) tabular-nums">{item.time}</p>
                <h3 className="mt-1 font-young-serif text-xl">{item.title}</h3>
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

/** Counting sheep until the big day: the sheep hop over their fence above four pastel cards. */
export function CountdownSection({ targetDateTime, calendar, venues }: CountdownSectionProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDateTime);
  const values = [days, hours, minutes, seconds];

  return (
    <Section>
      <SectionTitle eyebrow="Cuenta regresiva" title="Contando ovejitas" description="…para que llegue el gran día." />
      <Reveal className="mx-auto max-w-3xl">
        <CountingSheep className="mx-auto -mt-4 mb-6 w-[min(340px,90vw)]" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" role="timer" aria-label="Tiempo que falta para el bautizo">
          {UNITS.map((label, index) => (
            <Card key={label} className="py-6 text-center" style={{ backgroundColor: `color-mix(in oklch, var(${STEP_COLORS[index]}) 35%, var(--card))` }}>
              <p className="text-[clamp(44px,7vw,60px)] leading-none font-bold tabular-nums">{String(values[index]).padStart(2, '0')}</p>
              <p className="mt-2 text-xs font-bold tracking-[0.18em] text-(--muted-foreground) uppercase">{label}</p>
            </Card>
          ))}
        </div>
        {venues.length > 0 && calendar.dateTime && (
          <div className="mt-8 text-center">
            <button type="button" onClick={() => downloadEventCalendar(calendar, venues)} className={buttonClass('outline', 'lg', 'rounded-full')}>
              <CalendarPlus aria-hidden="true" />
              Guardar la fecha
            </button>
          </div>
        )}
      </Reveal>
    </Section>
  );
}
