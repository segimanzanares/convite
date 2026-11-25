import { ArrowDown, Baby, CalendarDays, Clock, MapPin } from 'lucide-react';
import { Badge } from '../../../components/ui/primitives';
import { buttonClass, capitalize } from '../../../components/ui/styles';
import { formatDate } from '../../../lib/eventContent';
import { scrollToHash } from '../../../utils/scrollToHash';
import { Elephant, Giraffe, Grass, Leaves } from './SafariArt';

interface HeroProps {
  names: string;
  eventDate: Date | null;
  venueName?: string;
  babyName: string | null;
  dueLabel: string | null;
  message: string | null;
}

/**
 * The opening screen: leaves sway in the corners, the giraffe peeks in on the right and the elephant blows bubbles
 * over the grass, under "Una pequeña gran aventura", the names and the details as chips.
 */
export function Hero({ names, eventDate, venueName, babyName, dueLabel, message }: HeroProps) {
  const facts = [
    { icon: CalendarDays, value: capitalize(formatDate(eventDate, "EEEE d 'de' MMMM")) },
    { icon: Clock, value: formatDate(eventDate, "HH:mm 'hrs'") },
    { icon: MapPin, value: venueName ?? '' },
  ].filter((fact) => fact.value);

  return (
    <header
      className="relative overflow-hidden px-5 pt-14 text-center sm:px-8"
      style={{ background: 'radial-gradient(circle at 50% 0%, var(--secondary), transparent 55%), var(--background)' }}
    >
      <Leaves className="absolute -top-6 -left-10 w-36 rotate-[160deg] sm:w-52" flip />
      <Leaves className="absolute -top-6 -right-10 w-36 rotate-[200deg] sm:w-52" />

      <div className="relative mx-auto max-w-3xl">
        <Badge className="border-transparent bg-(--accent) font-semibold text-(--accent-foreground) animate-[fadeUp_0.9s_0.2s_both]">Baby shower</Badge>
        <h1 className="mt-5 font-grandstander text-[clamp(44px,9vw,84px)] leading-[0.98] font-bold text-balance animate-[fadeUp_0.9s_0.3s_both]">
          Una pequeña <span className="text-(--primary)">gran aventura</span>
        </h1>
        <p className="mt-4 font-grandstander text-[clamp(26px,5vw,36px)] leading-tight font-semibold text-(--secondary-foreground) animate-[fadeUp_0.9s_0.4s_both]">
          {babyName ? `${babyName} viene en camino` : names}
        </p>
        {babyName && <p className="mt-1 text-(--muted-foreground) animate-[fadeUp_0.9s_0.45s_both]">con {names}</p>}
        <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed font-light text-pretty text-(--muted-foreground) animate-[fadeUp_0.9s_0.5s_both]">
          {message || 'La familia está por crecer y queremos celebrarlo contigo: una tarde de juegos, antojos y mucho cariño para recibir a nuestro bebé.'}
        </p>
        {dueLabel && (
          <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--card) px-4 py-1.5 text-sm font-medium animate-[fadeUp_0.9s_0.55s_both]">
            <Baby className="size-4 text-(--primary)" aria-hidden="true" />
            {dueLabel}
          </p>
        )}
        {facts.length > 0 && (
          <ul className="mt-6 flex flex-wrap justify-center gap-2 text-sm font-medium animate-[fadeUp_0.9s_0.6s_both]">
            {facts.map(({ icon: Icon, value }) => (
              <li key={value} className="flex items-center gap-2 rounded-full bg-(--secondary) px-4 py-2 text-(--secondary-foreground)">
                <Icon className="size-4" aria-hidden="true" />
                {value}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-2 animate-[fadeUp_0.9s_0.7s_both]">
          <a href="#confirmar" onClick={scrollToHash} className={buttonClass('default', 'lg', 'rounded-full')}>
            Confirmar asistencia
          </a>
          <a href="#detalles" onClick={scrollToHash} className={buttonClass('outline', 'lg', 'rounded-full')}>
            Ver los detalles
            <ArrowDown aria-hidden="true" />
          </a>
        </div>
      </div>

      <Grass className="absolute inset-x-0 bottom-0 h-12 w-full" />
      <div className="relative mx-auto mt-6 flex max-w-xl items-end justify-center pb-2 animate-[fadeUp_1s_0.8s_both]">
        <Elephant className="relative z-10 w-[min(260px,60vw)]" />
        <Giraffe className="-ml-6 w-[min(130px,30vw)] translate-y-3" />
      </div>
    </header>
  );
}
