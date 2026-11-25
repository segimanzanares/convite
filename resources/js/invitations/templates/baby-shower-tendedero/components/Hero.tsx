import { ArrowDown, Baby, CalendarDays, Clock, MapPin } from 'lucide-react';
import { buttonClass, capitalize } from '../../../components/ui/styles';
import { formatDate } from '../../../lib/eventContent';
import { scrollToHash } from '../../../utils/scrollToHash';
import { Clothesline } from './TendederoArt';

interface HeroProps {
  names: string;
  eventDate: Date | null;
  venueName?: string;
  babyName: string | null;
  dueLabel: string | null;
  message: string | null;
}

/**
 * The opening screen: the clothesline sways across the top (the onesie wears the baby's initial, or a heart), over a
 * handwritten "baby shower", "Preparando el nido" and the details on a linen card.
 */
export function Hero({ names, eventDate, venueName, babyName, dueLabel, message }: HeroProps) {
  const facts = [
    { icon: CalendarDays, value: capitalize(formatDate(eventDate, "EEEE d 'de' MMMM")) },
    { icon: Clock, value: formatDate(eventDate, "HH:mm 'hrs'") },
    { icon: MapPin, value: venueName ?? '' },
  ].filter((fact) => fact.value);

  return (
    <header className="relative overflow-hidden px-5 pb-24 text-center sm:px-8">
      <Clothesline className="mx-auto -mt-2 w-full max-w-4xl animate-[fadeUp_1s_0.2s_both]" letter={babyName?.charAt(0)} />

      <div className="relative mx-auto mt-4 max-w-2xl">
        <p className="font-reenie text-[clamp(30px,6vw,40px)] leading-none text-(--primary) animate-[fadeUp_0.9s_0.3s_both]">baby shower</p>
        <h1 className="mt-3 font-yeseva text-[clamp(44px,9.5vw,84px)] leading-[1.02] text-balance animate-[fadeUp_0.9s_0.4s_both]">
          Preparando el <span className="text-(--primary)">nido</span>
        </h1>
        <p className="mt-4 text-sm font-semibold tracking-[0.3em] text-(--muted-foreground) uppercase animate-[fadeUp_0.9s_0.5s_both]">
          {babyName ? `Para ${babyName} · ${names}` : names}
        </p>
        <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-pretty text-(--muted-foreground) animate-[fadeUp_0.9s_0.55s_both]">
          {message || 'Ya tendimos su ropita y estamos preparando el nido. Nos encantaría que nos acompañes a celebrar la llegada de nuestro bebé.'}
        </p>

        <div className="mx-auto mt-8 max-w-md rounded-(--radius) border border-dashed border-(--twine)/40 bg-(--card) px-6 py-5 shadow-[0_20px_50px_-35px_oklch(0.4_0.06_45/0.6)] animate-[fadeUp_0.9s_0.65s_both]">
          {dueLabel && (
            <p className="flex items-center justify-center gap-2 font-reenie text-2xl leading-none text-(--secondary-foreground)">
              <Baby className="size-4" aria-hidden="true" />
              {dueLabel}
            </p>
          )}
          {facts.length > 0 && (
            <ul className="mt-3 grid gap-2 text-sm font-medium">
              {facts.map(({ icon: Icon, value }) => (
                <li key={value} className="flex items-center justify-center gap-2">
                  <Icon className="size-4 text-(--primary)" aria-hidden="true" />
                  {value}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-2 animate-[fadeUp_0.9s_0.75s_both]">
          <a href="#confirmar" onClick={scrollToHash} className={buttonClass('default', 'lg', 'rounded-full')}>
            Confirmar asistencia
          </a>
          <a href="#detalles" onClick={scrollToHash} className={buttonClass('outline', 'lg', 'rounded-full')}>
            Ver los detalles
            <ArrowDown aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
