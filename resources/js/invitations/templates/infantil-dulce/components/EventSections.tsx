import { CalendarPlus, Clock, MapPin, Navigation } from 'lucide-react';
import { Reveal } from '../../../components/shared/Reveal';
import { Card, Section } from '../../../components/ui/primitives';
import { buttonClass, cn } from '../../../components/ui/styles';
import { useCountdown } from '../../../hooks/useCountdown';
import { downloadEventCalendar, type CalendarOccasion } from '../../../utils/calendar';
import type { ProgramItem, Venue } from '../../../types/wedding';
import { Candy, Cupcake, Donut, IcePop } from './Illustrations';
import { SectionTitle, Sprinkles } from './ui';

interface MessageSectionProps {
  firstName: string;
  age: number;
  message: string | null;
  hosts: string;
}

export function MessageSection({ firstName, age, message, hosts }: MessageSectionProps) {
  const fallback = `${firstName} cumple ${age} años y lo celebraremos con una tarde llena de dulces, juegos y mucha diversión. ¡Te esperamos para compartir el pastel!`;

  return (
    <Section id="mensaje" className="pt-10 sm:pt-14">
      <Reveal>
        <Card className="relative mx-auto max-w-3xl border-0 px-7 pt-20 pb-10 text-center shadow-[0_20px_50px_-30px_oklch(0.45_0.15_355/0.5)] sm:px-12">
          <span className="absolute -top-14 left-1/2 flex size-28 -translate-x-1/2 items-center justify-center rounded-full bg-(--accent) ring-8 ring-(--background)">
            <Cupcake className="w-20" />
          </span>
          <p className="font-fredoka text-sm font-semibold tracking-wider text-(--primary) uppercase">Una nota dulce</p>
          <h2 className="mt-2 font-fredoka text-[clamp(32px,5vw,46px)] leading-tight font-semibold">¡Ven a endulzar el día!</h2>
          <p className="mt-5 text-lg leading-relaxed text-pretty sm:text-xl">{message || fallback}</p>
          {hosts && <p className="mt-6 font-fredoka font-semibold text-(--gold-deep)">— {hosts}</p>}
        </Card>
      </Reveal>
    </Section>
  );
}

function VenueCard({ venue }: { venue: Venue }) {
  return (
    <Card className="flex flex-col overflow-hidden border-0 shadow-[0_20px_50px_-30px_oklch(0.45_0.15_355/0.5)]">
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
      <div className="flex flex-1 flex-col p-6 sm:p-8">
        <span className="w-fit rounded-full bg-(--accent) px-3 py-1 font-fredoka text-sm font-semibold text-(--accent-foreground)">
          <span aria-hidden="true">{venue.icon}</span> {venue.tag}
        </span>
        <h3 className="mt-4 font-fredoka text-3xl leading-tight font-semibold">{venue.name}</h3>
        <div className="mt-3 grid gap-1.5">
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
          <a href={venue.directionsUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('default', 'lg', 'mt-6 self-start rounded-full font-fredoka text-base font-semibold')}>
            <Navigation aria-hidden="true" />
            ¿Cómo llego?
          </a>
        )}
      </div>
    </Card>
  );
}

export function VenuesSection({ venues }: { venues: Venue[] }) {
  return (
    <Section id="lugar" className="relative overflow-hidden bg-(--muted)">
      <SectionTitle eyebrow="La dulcería" title="¿Dónde será la fiesta?" description="Toca el botón y te llevamos directo." />
      <Reveal className={cn('grid gap-6', venues.length > 1 ? 'md:grid-cols-2' : 'mx-auto max-w-xl')}>
        {venues.map((venue) => (
          <VenueCard key={`${venue.tag}-${venue.name}`} venue={venue} />
        ))}
      </Reveal>
      <Donut className="dulce-float pointer-events-none absolute top-8 right-[3%] w-16 sm:top-12 sm:right-[6%] sm:w-24" />
    </Section>
  );
}

/** The program as the menu of a sweet shop: a striped header and one line per item, with a dotted leader to its time. */
export function ProgramSection({ items }: { items: ProgramItem[] }) {
  return (
    <Section id="programa" className="relative overflow-hidden">
      <SectionTitle eyebrow="El menú del día" title="¿Qué vamos a hacer?" description="Una tarde con todos los sabores." />
      <Reveal>
        <Card className="mx-auto max-w-2xl overflow-hidden border-0 shadow-[0_20px_50px_-30px_oklch(0.45_0.15_355/0.5)]">
          <div className="dulce-stripes border-b-4 border-dotted border-(--frosting) py-5 text-center">
            <p className="inline-block rounded-full bg-(--card) px-5 py-1 font-pacifico text-2xl text-(--primary)">Menú de la fiesta</p>
          </div>
          <ol className="divide-y-2 divide-dashed divide-(--border) px-6 sm:px-10">
            {items.map((item) => (
              <li key={`${item.time}-${item.title}`} className="flex gap-4 py-5">
                {item.icon && (
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-(--muted) text-2xl" aria-hidden="true">
                    {item.icon}
                  </span>
                )}
                <div className="min-w-0 flex-1">
                  <p className="flex items-baseline gap-2 font-fredoka text-xl font-semibold">
                    <span>{item.title}</span>
                    <span className="mb-1 min-w-6 flex-1 border-b-[3px] border-dotted border-(--frosting)" aria-hidden="true" />
                    <span className="shrink-0 text-base text-(--primary) tabular-nums">{item.time}</span>
                  </p>
                  {item.description && <p className="mt-0.5 text-(--muted-foreground)">{item.description}</p>}
                </div>
              </li>
            ))}
          </ol>
        </Card>
      </Reveal>
      <IcePop className="pointer-events-none absolute bottom-6 left-[3%] hidden w-14 sm:block lg:left-[6%] lg:w-20" />
      <Candy color="#ffd85e" className="dulce-candy pointer-events-none absolute top-12 right-[4%] w-12 sm:w-16" />
    </Section>
  );
}

const UNITS = [
  { label: 'días', className: 'bg-(--primary) text-(--primary-foreground)' },
  { label: 'horas', className: 'bg-(--secondary) text-(--secondary-foreground)' },
  { label: 'minutos', className: 'bg-(--accent) text-(--accent-foreground)' },
  { label: 'segundos', className: 'bg-(--lilac) text-(--foreground)' },
] as const;

interface CountdownSectionProps {
  targetDateTime: string;
  calendar: CalendarOccasion;
  venues: Venue[];
}

/** Four candy-colored circles like gumballs, and the button that saves the date to the calendar. */
export function CountdownSection({ targetDateTime, calendar, venues }: CountdownSectionProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDateTime);
  const values = [days, hours, minutes, seconds];

  return (
    <section className="dulce-stripes relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28">
      <div className="relative mx-auto max-w-4xl">
        <SectionTitle eyebrow="Cuenta regresiva" title="¡Falta poquito!" />
        <Reveal>
          <div className="mx-auto grid max-w-3xl grid-cols-2 justify-items-center gap-5 sm:grid-cols-4" role="timer" aria-label="Tiempo que falta para la fiesta">
            {UNITS.map(({ label, className }, index) => (
              <div
                key={label}
                className={cn(
                  'relative flex size-32 flex-col items-center justify-center rounded-full shadow-[inset_-8px_-10px_0_rgb(0_0_0/0.08),0_14px_30px_-16px_rgb(0_0_0/0.35)] sm:size-36',
                  className,
                )}
              >
                <span className="absolute top-5 left-7 size-4 rounded-full bg-white/60" aria-hidden="true" />
                <span className="font-fredoka text-[44px] leading-none font-semibold tabular-nums sm:text-5xl">{String(values[index]).padStart(2, '0')}</span>
                <span className="mt-1 text-sm font-bold">{label}</span>
              </div>
            ))}
          </div>
          {venues.length > 0 && calendar.dateTime && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => downloadEventCalendar(calendar, venues)}
                className={buttonClass('outline', 'lg', 'rounded-full border-0 bg-(--card) font-fredoka text-base font-semibold shadow-sm')}
              >
                <CalendarPlus aria-hidden="true" />
                Guardar en mi calendario
              </button>
            </div>
          )}
        </Reveal>
      </div>
      <Sprinkles className="opacity-60" />
      <Cupcake className="dulce-float pointer-events-none absolute right-[4%] bottom-6 hidden w-20 sm:block lg:w-24" />
      <Candy color="#b9a2f0" className="dulce-candy pointer-events-none absolute top-10 left-[4%] w-12 [animation-delay:-2s] sm:w-16" />
    </section>
  );
}
