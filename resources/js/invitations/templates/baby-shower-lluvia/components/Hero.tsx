import { ArrowDown, Baby, CalendarDays, Clock, MapPin } from 'lucide-react';
import { Badge } from '../../../components/ui/primitives';
import { buttonClass, capitalize } from '../../../components/ui/styles';
import { formatDate } from '../../../lib/eventContent';
import { scrollToHash } from '../../../utils/scrollToHash';
import { HeartDrizzle, RainCloud, Umbrella } from './LluviaArt';

interface HeroProps {
  names: string;
  eventDate: Date | null;
  venueName?: string;
  babyName: string | null;
  dueLabel: string | null;
  message: string | null;
}

/**
 * The opening screen in two columns: "Lluvia de amor" and the details on one side; on the other, a cloud rains drops
 * and hearts over an umbrella, while more hearts drift down the whole hero.
 */
export function Hero({ names, eventDate, venueName, babyName, dueLabel, message }: HeroProps) {
  const facts = [
    { icon: CalendarDays, value: capitalize(formatDate(eventDate, "EEEE d 'de' MMMM")) },
    { icon: Clock, value: formatDate(eventDate, "HH:mm 'hrs'") },
    { icon: MapPin, value: venueName ?? '' },
  ].filter((fact) => fact.value);

  return (
    <header className="relative overflow-hidden bg-[linear-gradient(180deg,var(--muted),var(--background)_75%)] px-5 pt-14 pb-24 sm:px-8">
      <HeartDrizzle />
      <div className="relative mx-auto grid max-w-5xl items-center gap-6 md:grid-cols-[1.1fr_0.9fr] md:gap-10">
        <div className="relative mx-auto w-[min(320px,78vw)] md:order-2 animate-[fadeUp_1s_0.2s_both]">
          <RainCloud className="relative z-10 mx-auto w-[72%]" />
          <Umbrella className="mx-auto -mt-14 w-[62%]" />
        </div>

        <div className="text-center md:text-left">
          <Badge className="border-transparent bg-(--accent) font-semibold text-(--accent-foreground) animate-[fadeUp_0.9s_0.3s_both]">Baby shower</Badge>
          <h1 className="mt-5 font-comfortaa text-[clamp(46px,9.5vw,86px)] leading-[0.98] font-bold tracking-tight text-balance animate-[fadeUp_0.9s_0.4s_both]">
            Lluvia de <span className="text-(--primary)">amor</span>
          </h1>
          <p className="mt-3 font-comfortaa text-[clamp(22px,4.5vw,30px)] font-semibold text-(--secondary-foreground) animate-[fadeUp_0.9s_0.5s_both]">
            para {babyName ?? 'nuestro bebé'}
          </p>
          <p className="mt-2 text-sm font-semibold tracking-[0.2em] text-(--muted-foreground) uppercase animate-[fadeUp_0.9s_0.55s_both]">{names}</p>
          <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-pretty text-(--muted-foreground) md:mx-0 animate-[fadeUp_0.9s_0.6s_both]">
            {message || 'El pronóstico dice que viene una lluvia de amor, abrazos y risas. Ven a celebrar con nosotros la llegada del bebé.'}
          </p>
          {dueLabel && (
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-(--secondary) px-4 py-1.5 text-sm font-semibold text-(--secondary-foreground) animate-[fadeUp_0.9s_0.65s_both]">
              <Baby className="size-4" aria-hidden="true" />
              {dueLabel}
            </p>
          )}
          {facts.length > 0 && (
            <ul className="mt-6 grid gap-2 text-sm font-semibold sm:mx-auto sm:max-w-sm md:mx-0 animate-[fadeUp_0.9s_0.7s_both]">
              {facts.map(({ icon: Icon, value }) => (
                <li key={value} className="flex items-center justify-center gap-3 md:justify-start">
                  <span className="flex size-8 items-center justify-center rounded-full bg-(--card) shadow-sm">
                    <Icon className="size-4 text-(--primary)" aria-hidden="true" />
                  </span>
                  {value}
                </li>
              ))}
            </ul>
          )}
          <div className="mt-8 flex flex-wrap justify-center gap-2 md:justify-start animate-[fadeUp_0.9s_0.8s_both]">
            <a href="#confirmar" onClick={scrollToHash} className={buttonClass('default', 'lg', 'rounded-full')}>
              Confirmar asistencia
            </a>
            <a href="#detalles" onClick={scrollToHash} className={buttonClass('outline', 'lg', 'rounded-full')}>
              Ver los detalles
              <ArrowDown aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
