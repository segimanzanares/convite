import { ArrowDown } from 'lucide-react';
import { differenceInCalendarDays } from 'date-fns';
import { Card } from '../../../components/ui/primitives';
import { buttonClass, capitalize, cn } from '../../../components/ui/styles';
import { formatDate } from '../../../lib/eventContent';

interface GrafitoHeroProps {
  name: string;
  firstName: string;
  age: number;
  eventDate: Date | null;
  /** The admin's cover photo, shown as a framed card beside the name. */
  photoUrl: string | null;
  place?: string;
}

/**
 * The opening screen: the age as a huge outline behind the name, on a grid of hairlines, and a row of stat cards
 * (age, date, time and days to go), as on a dashboard.
 */
export function GrafitoHero({ name, firstName, age, eventDate, photoUrl, place }: GrafitoHeroProps) {
  const daysToGo = eventDate ? Math.max(differenceInCalendarDays(eventDate, new Date()), 0) : null;
  const stats = [
    age > 0 && { label: 'Cumple', value: String(age), unit: 'años' },
    eventDate && { label: 'Fecha', value: formatDate(eventDate, 'dd.MM.yy'), unit: capitalize(formatDate(eventDate, 'EEEE')) },
    eventDate && { label: 'Hora', value: formatDate(eventDate, 'HH:mm'), unit: 'hrs' },
    daysToGo !== null && { label: 'Faltan', value: String(daysToGo), unit: daysToGo === 1 ? 'día' : 'días' },
  ].filter((stat): stat is { label: string; value: string; unit: string } => Boolean(stat));

  return (
    <header className="grafito-glow relative overflow-hidden px-5 pt-16 pb-16 sm:px-8 sm:pt-24 sm:pb-24">
      <div className="grafito-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className={cn('relative mx-auto max-w-5xl', photoUrl && 'grid items-center gap-12 md:grid-cols-[1.3fr_1fr]')}>
        <div className="relative animate-[fadeUp_0.8s_ease_both]">
          {age > 0 && (
            <span
              className="grafito-outline pointer-events-none absolute -top-16 -right-4 font-space-grotesk text-[clamp(180px,32vw,340px)] leading-none font-bold tracking-tighter select-none sm:-top-24"
              aria-hidden="true"
            >
              {age}
            </span>
          )}
          <span className="relative inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--card) px-3 py-1 text-xs font-medium">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-(--primary) opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-(--primary)" />
            </span>
            {age > 0 ? `Cumpleaños ${age}` : 'Cumpleaños'}
            {place && <span className="text-(--muted-foreground)">· {place}</span>}
          </span>
          <h1 className="relative mt-6 font-space-grotesk text-[clamp(52px,10vw,104px)] leading-[0.9] font-bold tracking-tighter text-balance">
            {name}
          </h1>
          <p className="relative mt-6 max-w-md text-lg text-pretty text-(--muted-foreground)">
            {age > 0 ? `${firstName} cumple ${age} y lo vamos a celebrar en grande.` : `Celebramos a ${firstName} en grande.`} Estás en la lista.
          </p>
          <div className="relative mt-8 flex flex-wrap gap-3">
            <a href="#rsvp" className={buttonClass('default', 'lg')}>
              Confirmar asistencia
            </a>
            <a href="#plan" className={buttonClass('outline', 'lg', 'bg-transparent')}>
              Ver detalles
              <ArrowDown aria-hidden="true" />
            </a>
          </div>
        </div>
        {photoUrl && (
          <div className="relative animate-[fadeUp_0.8s_0.15s_ease_both]">
            <img
              src={photoUrl}
              alt={name}
              className="aspect-[4/5] w-full rounded-[calc(var(--radius)+6px)] border border-(--border) object-cover grayscale-[35%]"
            />
          </div>
        )}
      </div>

      {stats.length > 0 && (
        <dl className="relative mx-auto mt-14 grid max-w-5xl grid-cols-2 gap-3 animate-[fadeUp_0.8s_0.3s_ease_both] md:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-4 sm:p-5">
              <dt className="text-xs font-medium text-(--muted-foreground)">{stat.label}</dt>
              <dd className="mt-2 flex flex-wrap items-baseline gap-x-1.5">
                <span className="font-geist-mono text-2xl font-semibold tabular-nums sm:text-3xl">{stat.value}</span>
                <span className="text-xs text-(--muted-foreground)">{stat.unit}</span>
              </dd>
            </Card>
          ))}
        </dl>
      )}
    </header>
  );
}
