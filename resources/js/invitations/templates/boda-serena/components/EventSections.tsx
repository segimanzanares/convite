import { useState } from 'react';
import { CalendarPlus, Clock, MapPin, Navigation } from 'lucide-react';
import { Reveal } from '../../../components/shared/Reveal';
import { Card, Section } from '../../../components/ui/primitives';
import { buttonClass, cn } from '../../../components/ui/styles';
import { useCountdown } from '../../../hooks/useCountdown';
import { downloadEventCalendar, type CalendarOccasion } from '../../../utils/calendar';
import type { ProgramItem, Venue } from '../../../types/wedding';
import { SectionTitle } from './ui';

const DEFAULT_MESSAGE =
  'Nos conocimos sin buscarnos y, desde entonces, elegimos caminar juntos cada día. Ahora queremos celebrar ese «sí» rodeados de las personas que más queremos, y sería un honor que tú estuvieras ahí.';

function Avatar({ name }: { name: string }) {
  return (
    <span className="flex size-14 items-center justify-center rounded-full border-4 border-(--background) bg-(--accent) font-fraunces text-xl font-medium text-(--accent-foreground)">
      {name.charAt(0)}
    </span>
  );
}

export function StorySection({
  names,
  message,
  families,
}: {
  names: [string, string];
  message: string | null;
  families: string;
}) {
  return (
    <Section id="historia">
      <div className="grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-center md:gap-16">
        <div>
          <SectionTitle eyebrow="Con todo nuestro cariño" title="Queremos compartir este día contigo" />
          <Reveal>
            <p className="text-lg leading-relaxed text-pretty text-(--muted-foreground) sm:text-xl">
              {message || DEFAULT_MESSAGE}
            </p>
          </Reveal>
        </div>
        {families && (
          <Reveal>
            <Card className="p-6 sm:p-8">
              <div className="flex -space-x-3">
                <Avatar name={names[0]} />
                <Avatar name={names[1]} />
              </div>
              <p className="mt-6 text-sm font-medium text-(--muted-foreground)">Con la bendición de</p>
              <p className="mt-1 font-fraunces text-2xl leading-snug font-medium">{families}</p>
            </Card>
          </Reveal>
        )}
      </div>
    </Section>
  );
}

function VenuePanel({ venue }: { venue: Venue }) {
  return (
    <Card className="grid overflow-hidden md:grid-cols-2">
      {venue.image && (
        <img
          src={venue.image}
          alt={venue.imageAlt ?? venue.name}
          loading="lazy"
          className="aspect-[4/3] size-full object-cover md:aspect-auto md:min-h-full"
        />
      )}
      <div className={cn('flex flex-col p-6 sm:p-8', !venue.image && 'md:col-span-2')}>
        <p className="text-sm font-medium text-(--primary)">
          <span aria-hidden="true">{venue.icon}</span> {venue.tag}
        </p>
        <h3 className="mt-2 font-fraunces text-3xl leading-tight font-medium tracking-tight">{venue.name}</h3>
        <dl className="mt-6 grid gap-4 text-sm">
          <div className="flex gap-3">
            <Clock className="mt-0.5 size-4 shrink-0 text-(--muted-foreground)" aria-hidden="true" />
            <div>
              <dt className="sr-only">Hora</dt>
              <dd className="font-medium">{venue.time}</dd>
            </div>
          </div>
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
        </dl>
        {venue.mapEmbedUrl && (
          <div className="mt-6 h-44 overflow-hidden rounded-[calc(var(--radius)-6px)] border border-(--border) bg-(--muted)">
            <iframe
              src={venue.mapEmbedUrl}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title={venue.mapTitle}
              className="size-full border-0"
            />
          </div>
        )}
        {venue.directionsUrl && (
          <a
            href={venue.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass('default', 'default', 'mt-6 self-start rounded-full')}
          >
            <Navigation aria-hidden="true" />
            Abrir en el mapa
          </a>
        )}
      </div>
    </Card>
  );
}

/** One tab per venue, as shadcn/ui's Tabs; with a single venue the tab list is left out. */
export function VenuesSection({ venues }: { venues: Venue[] }) {
  const [selected, setSelected] = useState(0);
  const venue = venues[Math.min(selected, venues.length - 1)];

  return (
    <Section id="lugares" className="border-t border-(--border)">
      <SectionTitle
        eyebrow="Dónde nos vemos"
        title="Los lugares de la celebración"
        description="Guarda estas direcciones; con un toque abres la ruta desde tu teléfono."
      />
      <Reveal>
        {venues.length > 1 && (
          <div
            role="tablist"
            aria-label="Lugares"
            className="mb-6 inline-flex max-w-full gap-1 overflow-x-auto rounded-full bg-(--muted) p-1"
          >
            {venues.map((item, index) => (
              <button
                key={`${item.tag}-${item.name}`}
                type="button"
                role="tab"
                id={`venue-tab-${index}`}
                aria-selected={index === selected}
                aria-controls="venue-panel"
                onClick={() => setSelected(index)}
                className={cn(
                  'shrink-0 cursor-pointer rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap transition-[background-color,color,box-shadow]',
                  'outline-none focus-visible:ring-[3px] focus-visible:ring-(--ring)/50',
                  index === selected
                    ? 'bg-(--background) text-(--foreground) shadow-sm'
                    : 'text-(--muted-foreground) hover:text-(--foreground)',
                )}
              >
                {item.tag}
              </button>
            ))}
          </div>
        )}
        <div
          id="venue-panel"
          role={venues.length > 1 ? 'tabpanel' : undefined}
          aria-labelledby={venues.length > 1 ? `venue-tab-${selected}` : undefined}
        >
          <VenuePanel key={selected} venue={venue} />
        </div>
      </Reveal>
    </Section>
  );
}

export function ProgramSection({ items }: { items: ProgramItem[] }) {
  return (
    <Section id="programa" className="serena-glow border-t border-(--border)">
      <SectionTitle
        eyebrow="Paso a paso"
        title="Así será nuestro día"
        description="Una guía para que no te pierdas ningún momento."
        centered
      />
      <Reveal className="mx-auto max-w-2xl">
        <ol className="relative">
          <span className="absolute top-2 bottom-2 left-[5px] w-px bg-(--border) sm:left-[111px]" aria-hidden="true" />
          {items.map((item) => (
            <li
              key={`${item.time}-${item.title}`}
              className="relative grid gap-1 pb-8 pl-8 last:pb-0 sm:grid-cols-[96px_1fr] sm:gap-8 sm:pl-0"
            >
              <span
                className="absolute top-1.5 left-0 size-[11px] rounded-full border-2 border-(--primary) bg-(--background) sm:left-[106px]"
                aria-hidden="true"
              />
              <p className="pt-0.5 text-sm font-semibold text-(--primary) tabular-nums sm:text-right">{item.time}</p>
              <Card className="p-5 sm:ml-2">
                <h3 className="flex items-center gap-2 font-semibold">
                  {item.icon && <span aria-hidden="true">{item.icon}</span>}
                  {item.title}
                </h3>
                {item.description && (
                  <p className="mt-1.5 text-sm leading-relaxed text-(--muted-foreground)">{item.description}</p>
                )}
              </Card>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}

const UNIT_LABELS = ['días', 'horas', 'min', 'seg'] as const;

interface CountdownBandProps {
  targetDateTime: string;
  calendar: CalendarOccasion;
  venues: Venue[];
}

/** The countdown on a band of the primary blue, with the button that saves the date to the calendar. */
export function CountdownBand({ targetDateTime, calendar, venues }: CountdownBandProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDateTime);
  const values = [days, hours, minutes, seconds];

  return (
    <section className="px-5 py-6 sm:px-8">
      <Reveal className="mx-auto max-w-5xl overflow-hidden rounded-[calc(var(--radius)+12px)] bg-(--primary) px-6 py-12 text-(--primary-foreground) sm:px-12 sm:py-16">
        <div className="flex flex-col items-center gap-10 lg:flex-row lg:justify-between">
          <div className="text-center lg:text-left">
            <p className="text-xs font-semibold tracking-[0.2em] uppercase opacity-80">La cuenta atrás</p>
            <p className="mt-3 font-fraunces text-3xl font-medium sm:text-4xl">Cada día falta menos</p>
            {venues.length > 0 && calendar.dateTime && (
              <button
                type="button"
                onClick={() => downloadEventCalendar(calendar, venues)}
                className={buttonClass(
                  'outline',
                  'default',
                  'mt-6 rounded-full border-white/30 bg-transparent text-(--primary-foreground) hover:bg-white/10',
                )}
              >
                <CalendarPlus aria-hidden="true" />
                Guardar en mi calendario
              </button>
            )}
          </div>
          <div className="flex items-start gap-2 sm:gap-4" role="timer" aria-label="Tiempo que falta para la boda">
            {UNIT_LABELS.map((label, index) => (
              <div key={label} className="flex items-start gap-2 sm:gap-4">
                {index > 0 && (
                  <span className="pt-1 font-fraunces text-3xl opacity-40 sm:text-5xl" aria-hidden="true">
                    :
                  </span>
                )}
                <div className="text-center">
                  <p className="font-fraunces text-4xl font-medium tabular-nums sm:text-6xl">
                    {String(values[index]).padStart(2, '0')}
                  </p>
                  <p className="mt-1 text-xs font-medium tracking-wider uppercase opacity-75">{label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
