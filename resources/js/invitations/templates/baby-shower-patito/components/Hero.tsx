import { ArrowDown, Baby, CalendarDays, Clock, MapPin } from 'lucide-react';
import { Badge } from '../../../components/ui/primitives';
import { buttonClass, capitalize } from '../../../components/ui/styles';
import { formatDate } from '../../../lib/eventContent';
import { scrollToHash } from '../../../utils/scrollToHash';
import { Duck, FloatingBubbles } from './PatitoArt';

interface HeroProps {
  names: string;
  eventDate: Date | null;
  venueName?: string;
  babyName: string | null;
  dueLabel: string | null;
  message: string | null;
}

/**
 * The opening screen in two columns: "¡Un patito viene en camino!" and the details on one side, the rubber duck
 * bobbing on the waves inside a round aqua card on the other, while bubbles float up the hero.
 */
export function Hero({ names, eventDate, venueName, babyName, dueLabel, message }: HeroProps) {
  const facts = [
    { icon: CalendarDays, value: capitalize(formatDate(eventDate, "EEEE d 'de' MMMM")) },
    { icon: Clock, value: formatDate(eventDate, "HH:mm 'hrs'") },
    { icon: MapPin, value: venueName ?? '' },
  ].filter((fact) => fact.value);

  return (
    <header
      className="relative overflow-hidden px-5 pt-14 pb-24 sm:px-8"
      style={{ background: 'radial-gradient(circle at 85% 20%, var(--secondary), transparent 45%), radial-gradient(circle at 10% 90%, var(--accent), transparent 45%), var(--background)' }}
    >
      <FloatingBubbles />
      <div className="relative mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <div className="md:order-2">
          <div className="relative mx-auto aspect-square w-[min(330px,80vw)] overflow-hidden rounded-full border-8 border-(--card) bg-[linear-gradient(180deg,var(--accent),var(--muted))] shadow-[0_30px_70px_-40px_oklch(0.4_0.08_215/0.8)] animate-[fadeUp_1s_0.2s_both]">
            <Duck className="absolute inset-x-0 bottom-0 mx-auto w-[90%]" />
          </div>
        </div>

        <div className="text-center md:text-left">
          <Badge className="border-transparent bg-(--secondary) font-bold text-(--secondary-foreground) animate-[fadeUp_0.9s_0.3s_both]">Baby shower</Badge>
          <h1 className="mt-5 font-chewy text-[clamp(48px,10vw,92px)] leading-[0.95] text-balance animate-[fadeUp_0.9s_0.4s_both]">
            ¡Un <span className="text-(--primary)">patito</span> viene en camino!
          </h1>
          <p className="mt-4 font-chewy text-[clamp(26px,5vw,34px)] leading-tight text-(--secondary-foreground) animate-[fadeUp_0.9s_0.5s_both]">
            {babyName ? `${babyName} · ${names}` : names}
          </p>
          <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-pretty text-(--muted-foreground) md:mx-0 animate-[fadeUp_0.9s_0.55s_both]">
            {message || 'Ya estamos chapoteando de gusto. Ven a celebrar con nosotros la llegada de nuestro bebé con juegos, burbujas y mucho cariño.'}
          </p>
          {dueLabel && (
            <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-(--accent) px-4 py-1.5 text-sm font-bold text-(--accent-foreground) animate-[fadeUp_0.9s_0.6s_both]">
              <Baby className="size-4" aria-hidden="true" />
              {dueLabel}
            </p>
          )}
          {facts.length > 0 && (
            <ul className="mt-6 grid gap-2 text-sm font-bold sm:mx-auto sm:max-w-sm md:mx-0 animate-[fadeUp_0.9s_0.7s_both]">
              {facts.map(({ icon: Icon, value }) => (
                <li key={value} className="flex items-center justify-center gap-3 md:justify-start">
                  <span className="flex size-8 items-center justify-center rounded-full bg-(--secondary)">
                    <Icon className="size-4 text-(--secondary-foreground)" aria-hidden="true" />
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
