import { ArrowDown, Clock, MapPin, PartyPopper } from 'lucide-react';
import { Card } from '../../../components/ui/primitives';
import { buttonClass, capitalize, cn } from '../../../components/ui/styles';
import { formatDate } from '../../../lib/eventContent';
import { Confetti } from './ui';

interface ConfetiHeroProps {
  name: string;
  age: number;
  eventDate: Date | null;
  /** The admin's cover photo; without one the name card is a rose-to-lilac gradient with confetti. */
  photoUrl: string | null;
  venueName?: string;
  place?: string;
}

/**
 * The opening screen as a bento grid of cards: the name (over the cover photo when there is one), the age, a calendar
 * leaf with the date, the time and place, and the calls to action.
 */
export function ConfetiHero({ name, age, eventDate, photoUrl, venueName, place }: ConfetiHeroProps) {
  return (
    <header className="confeti-wash relative overflow-hidden px-4 pt-10 pb-16 sm:px-8 sm:pt-16 sm:pb-24">
      <Confetti />
      <div className="relative mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        <Card
          className={cn(
            'relative col-span-2 flex min-h-[340px] flex-col justify-end overflow-hidden p-6 sm:min-h-[420px] sm:p-8 md:row-span-2',
            'animate-[fadeUp_0.8s_ease_both]',
            !photoUrl && 'bg-[linear-gradient(140deg,var(--primary),var(--confetti-lilac))] text-(--primary-foreground)',
          )}
        >
          {photoUrl ? (
            <>
              <img src={photoUrl} alt={name} className="absolute inset-0 size-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.2_0.05_350/0.85),transparent_65%)]" />
            </>
          ) : (
            <Confetti className="opacity-70" count={8} />
          )}
          <div className={cn('relative', photoUrl && 'text-white')}>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              <PartyPopper className="size-3.5" aria-hidden="true" />
              ¡Estás invitado!
            </span>
            <h1 className="mt-4 font-dm-serif text-[clamp(48px,8vw,84px)] leading-[0.95] text-balance">{name}</h1>
            <p className="mt-3 text-base opacity-90 sm:text-lg">celebra su cumpleaños y quiere verte ahí</p>
          </div>
        </Card>

        {age > 0 && (
          <Card className="flex flex-col justify-between bg-(--primary) p-5 text-(--primary-foreground) animate-[fadeUp_0.8s_0.1s_ease_both] sm:p-6">
            <p className="text-sm font-medium opacity-85">Cumple</p>
            <p className="font-dm-serif text-[clamp(64px,9vw,96px)] leading-none">{age}</p>
            <p className="text-sm font-medium opacity-85">años</p>
          </Card>
        )}

        {eventDate && (
          <Card className={cn('overflow-hidden text-center animate-[fadeUp_0.8s_0.2s_ease_both]', age <= 0 && 'col-span-2 md:col-span-1')}>
            <p className="bg-(--accent) py-2 text-xs font-semibold tracking-[0.2em] text-(--accent-foreground) uppercase">
              {formatDate(eventDate, 'MMMM')}
            </p>
            <p className="pt-3 font-dm-serif text-[clamp(56px,8vw,80px)] leading-none">{formatDate(eventDate, 'd')}</p>
            <p className="pt-1 pb-4 text-sm font-medium text-(--muted-foreground)">{capitalize(formatDate(eventDate, 'EEEE · yyyy'))}</p>
          </Card>
        )}

        <Card className="col-span-2 flex flex-col justify-between gap-5 p-5 animate-[fadeUp_0.8s_0.3s_ease_both] sm:p-6">
          <dl className="grid gap-3 text-sm">
            {eventDate && (
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-(--secondary) text-(--secondary-foreground)">
                  <Clock className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <dt className="text-(--muted-foreground)">Hora</dt>
                  <dd className="font-semibold">{formatDate(eventDate, "HH:mm 'hrs'")}</dd>
                </div>
              </div>
            )}
            {venueName && (
              <div className="flex items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-(--accent) text-(--accent-foreground)">
                  <MapPin className="size-4" aria-hidden="true" />
                </span>
                <div>
                  <dt className="text-(--muted-foreground)">Lugar</dt>
                  <dd className="font-semibold">
                    {venueName}
                    {place && <span className="font-normal text-(--muted-foreground)"> · {place}</span>}
                  </dd>
                </div>
              </div>
            )}
          </dl>
          <div className="flex flex-wrap gap-2">
            <a href="#rsvp" className={buttonClass('default', 'default', 'rounded-full')}>
              Confirmar asistencia
            </a>
            <a href="#mensaje" className={buttonClass('outline', 'default', 'rounded-full')}>
              Ver detalles
              <ArrowDown aria-hidden="true" />
            </a>
          </div>
        </Card>
      </div>
    </header>
  );
}
