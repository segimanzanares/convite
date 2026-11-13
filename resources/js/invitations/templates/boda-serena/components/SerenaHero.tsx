import { CalendarDays, Clock, MapPin } from 'lucide-react';
import type { ComponentType } from 'react';
import { buttonClass, capitalize, cn } from '../../../components/ui/styles';
import { Ampersand } from './ui';

export interface HeroFact {
  Icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

interface SerenaHeroProps {
  names: [string, string];
  photoUrl: string | null;
  /** e.g. "sábado 6 de noviembre". */
  dayLabel: string;
  /** e.g. "18:00 hrs". */
  timeLabel: string;
  /** The town of the first venue. */
  place?: string;
}

/**
 * Full-height photo under a slate gradient, the names in Fraunces at the bottom and a frosted card with the date,
 * the time and the place. Without a photo, a slate-to-blue gradient takes its place.
 */
export function SerenaHero({ names, photoUrl, dayLabel, timeLabel, place }: SerenaHeroProps) {
  const facts: HeroFact[] = [
    { Icon: CalendarDays, label: 'Fecha', value: capitalize(dayLabel) },
    { Icon: Clock, label: 'Hora', value: timeLabel },
    { Icon: MapPin, label: 'Lugar', value: place ?? '' },
  ].filter((fact) => fact.value);

  return (
    <header className="ui-dark relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden px-5 pt-28 pb-10 sm:px-8 sm:pb-14">
      {photoUrl ? (
        <img src={photoUrl} alt="" className="absolute inset-0 -z-20 size-full object-cover object-[50%_25%]" />
      ) : (
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(80%_60%_at_70%_20%,oklch(0.488_0.217_264.376),transparent),linear-gradient(to_bottom,oklch(0.208_0.042_265.755),oklch(0.129_0.042_264.695))]" />
      )}
      <div
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,oklch(0.129_0.042_264.695/0.15)_0%,oklch(0.129_0.042_264.695/0.35)_45%,oklch(0.129_0.042_264.695/0.92)_100%)]"
        aria-hidden="true"
      />

      <div className="mx-auto w-full max-w-5xl">
        <p className="animate-[fadeUp_0.9s_ease_both] text-xs font-semibold tracking-[0.25em] text-white/80 uppercase">
          Nos casamos y queremos celebrarlo contigo
        </p>
        <h1 className="mt-5 animate-[fadeUp_0.9s_0.15s_ease_both] font-fraunces text-[clamp(52px,12vw,128px)] leading-[0.9] font-medium tracking-tight text-white">
          {names[0]}
          <br />
          <Ampersand className="mr-4 text-(--primary)" />
          {names[1]}
        </h1>

        <div className="mt-10 flex animate-[fadeUp_0.9s_0.3s_ease_both] flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          {facts.length > 0 && (
            <dl
              className={cn(
                'grid divide-white/15 overflow-hidden rounded-(--radius) border border-white/15 bg-white/10 text-white backdrop-blur-md',
                'max-sm:divide-y sm:grid-flow-col sm:divide-x',
              )}
            >
              {facts.map(({ Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 px-5 py-4">
                  <Icon className="size-4 shrink-0 text-white/70" aria-hidden="true" />
                  <div>
                    <dt className="text-[11px] font-medium tracking-wider text-white/60 uppercase">{label}</dt>
                    <dd className="text-sm font-medium">{value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          )}
          <a href="#rsvp" className={buttonClass('default', 'lg', 'self-start rounded-full px-7 lg:self-auto')}>
            Quiero confirmar
          </a>
        </div>
      </div>
    </header>
  );
}
