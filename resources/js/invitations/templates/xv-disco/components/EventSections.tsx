import { CalendarPlus, Clock, MapPin, Navigation } from 'lucide-react';
import { Reveal } from '../../../components/shared/Reveal';
import { Card, Section } from '../../../components/ui/primitives';
import { buttonClass, cn } from '../../../components/ui/styles';
import { useCountdown } from '../../../hooks/useCountdown';
import { downloadEventCalendar, type CalendarOccasion } from '../../../utils/calendar';
import type { ProgramItem, Venue } from '../../../types/wedding';
import { Equalizer, Spotlights } from './DiscoArt';
import { SectionTitle } from './ui';

/** A venue as a stage: the photo (or the map) with the stage number over it, a neon rule and the details. */
function VenueCard({ venue, index }: { venue: Venue; index: number }) {
  return (
    <Card className="group flex flex-col overflow-hidden transition-shadow hover:shadow-[0_0_30px_-8px_var(--neon-pink)]">
      <div className="relative aspect-[16/9] bg-(--secondary)">
        {venue.image ? (
          <img src={venue.image} alt={venue.imageAlt ?? venue.name} loading="lazy" className="size-full object-cover" />
        ) : (
          venue.mapEmbedUrl && (
            <iframe
              src={venue.mapEmbedUrl}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title={venue.mapTitle}
              className="size-full border-0"
            />
          )
        )}
        <span className="absolute top-3 left-3 rounded-full bg-(--background)/80 px-3 py-1 font-unbounded text-[11px] font-semibold tracking-[0.2em] text-(--accent-foreground) uppercase backdrop-blur-sm">
          Escenario {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <span className="h-0.5 bg-[linear-gradient(to_right,var(--neon-pink),var(--neon-violet),var(--neon-cyan))]" aria-hidden="true" />
      <div className="flex flex-1 flex-col p-6">
        <p className="flex items-center gap-2 text-sm font-semibold text-(--primary)">
          <span aria-hidden="true">{venue.icon}</span>
          {venue.tag}
        </p>
        <h3 className="mt-2 font-unbounded text-xl leading-snug font-semibold">{venue.name}</h3>
        <div className="mt-4 grid gap-2 text-sm text-(--muted-foreground)">
          {venue.time && (
            <p className="flex items-center gap-2">
              <Clock className="size-4 shrink-0 text-(--accent-foreground)" aria-hidden="true" />
              <span className="font-semibold text-(--foreground)">{venue.time}</span>
            </p>
          )}
          {venue.addressLines.length > 0 && (
            <p className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-(--accent-foreground)" aria-hidden="true" />
              <span>
                {venue.addressLines.map((line, lineIndex) => (
                  <span key={`${lineIndex}-${line}`} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </p>
          )}
        </div>
        {venue.directionsUrl && (
          <a href={venue.directionsUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('secondary', 'default', 'mt-6 self-start rounded-full')}>
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
      <SectionTitle eyebrow="Dónde" title="Los escenarios de la noche" description="Toca «Cómo llegar» para abrir la ruta desde tu teléfono." />
      <Reveal className={cn('grid gap-5', venues.length > 1 ? 'md:grid-cols-2' : 'mx-auto max-w-xl')}>
        {venues.map((venue, index) => (
          <VenueCard key={`${venue.tag}-${venue.name}`} venue={venue} index={index} />
        ))}
      </Reveal>
    </Section>
  );
}

/** The program as the setlist of the night: a numbered track per moment, with its time and emoji. */
export function ProgramSection({ items }: { items: ProgramItem[] }) {
  return (
    <Section className="bg-(--surface)">
      <SectionTitle eyebrow="Setlist" title="El orden de la noche" description="Del primer brindis a la última canción." />
      <Reveal>
        <Card className="mx-auto max-w-3xl overflow-hidden">
          <ol className="divide-y divide-(--border)">
            {items.map((item, index) => (
              <li key={`${item.time}-${item.title}`} className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-(--muted) sm:gap-6 sm:px-7">
                <span className="w-8 shrink-0 font-unbounded text-sm font-semibold text-(--muted-foreground) tabular-nums group-hover:text-(--primary)">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold sm:text-lg">{item.title}</h3>
                  {item.description && <p className="mt-0.5 text-sm leading-relaxed text-(--muted-foreground)">{item.description}</p>}
                </div>
                <span className="shrink-0 rounded-full bg-(--accent) px-2.5 py-1 text-xs font-semibold text-(--accent-foreground) tabular-nums">{item.time}</span>
                {item.icon && (
                  <span className="hidden text-2xl leading-none sm:block" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
              </li>
            ))}
          </ol>
        </Card>
      </Reveal>
    </Section>
  );
}

const UNITS = ['días', 'horas', 'min', 'seg'] as const;

interface CountdownSectionProps {
  targetDateTime: string;
  calendar: CalendarOccasion;
  venues: Venue[];
}

/** Four neon tiles under the spotlights, over the equalizer, with the button that saves the date. */
export function CountdownSection({ targetDateTime, calendar, venues }: CountdownSectionProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDateTime);
  const values = [days, hours, minutes, seconds];

  return (
    <section className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      <Spotlights />
      <div className="relative mx-auto max-w-4xl">
        <SectionTitle eyebrow="Cuenta regresiva" title="La pista se abre en" />
        <Reveal>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4" role="timer" aria-label="Tiempo que falta para la fiesta">
            {UNITS.map((label, index) => (
              <Card key={label} className="disco-neon-frame py-6 text-center">
                <p className="font-unbounded text-[clamp(44px,7vw,64px)] leading-none font-extrabold tabular-nums disco-gradient-text">
                  {String(values[index]).padStart(2, '0')}
                </p>
                <p className="mt-2 text-sm font-semibold tracking-[0.2em] text-(--muted-foreground) uppercase">{label}</p>
              </Card>
            ))}
          </div>
          <Equalizer bars={40} className="mt-10 h-12" />
          {venues.length > 0 && calendar.dateTime && (
            <div className="mt-8 text-center">
              <button type="button" onClick={() => downloadEventCalendar(calendar, venues)} className={buttonClass('outline', 'lg', 'rounded-full bg-transparent')}>
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
