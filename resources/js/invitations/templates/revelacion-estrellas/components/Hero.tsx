import { ArrowDown, Baby, CalendarDays, Clock, MapPin } from 'lucide-react';
import { Confetti } from '../../../components/gender-reveal/Confetti';
import { Badge } from '../../../components/ui/primitives';
import { buttonClass, capitalize } from '../../../components/ui/styles';
import { formatDate } from '../../../lib/eventContent';
import type { BabyGender } from '../../../types/invitation';
import { scrollToHash } from '../../../utils/scrollToHash';
import { FlyingStork, Moon, StarrySky } from './EstrellasArt';

interface HeroProps {
  names: string;
  eventDate: Date | null;
  venueName?: string;
  dueLabel: string | null;
  message: string | null;
  reveal: BabyGender | null;
  babyName: string | null;
}

/**
 * The opening screen, a night sky from indigo to rose: the moon floats, the stork crosses with its bundle over "Una
 * cigüeña viene en camino" and the details follow as chips. Once the answer is out the bundle takes the team's color,
 * sparks of that color fall and the title says it.
 */
export function Hero({ names, eventDate, venueName, dueLabel, message, reveal, babyName }: HeroProps) {
  const facts = [
    { icon: CalendarDays, value: capitalize(formatDate(eventDate, "EEEE d 'de' MMMM")) },
    { icon: Clock, value: formatDate(eventDate, "HH:mm 'hrs'") },
    { icon: MapPin, value: venueName ?? '' },
  ].filter((fact) => fact.value);

  return (
    <header className="ui-dark relative overflow-hidden px-5 pt-6 pb-24 text-center sm:px-8">
      <StarrySky />
      {reveal && <Confetti colors={[`--${reveal}`, '--starlight']} count={36} />}
      <Moon className="absolute top-8 right-[8%] w-16 sm:right-[14%] sm:w-24" />
      <FlyingStork answer={reveal} className="-mx-5 sm:-mx-8" />

      <div className="relative mx-auto max-w-2xl">
        <Badge className="border-(--border) bg-transparent font-semibold text-(--foreground) animate-[fadeUp_0.9s_0.3s_both]">
          {reveal ? 'La cigüeña ya llegó' : 'Revelación de género'}
        </Badge>
        <h1 className="mt-5 font-gloock text-[clamp(44px,9vw,84px)] leading-[1.02] text-balance animate-[fadeUp_0.9s_0.4s_both]">
          {reveal ? (
            <>
              ¡Es <span className={reveal === 'girl' ? 'text-(--girl)' : 'text-(--boy)'}>{reveal === 'girl' ? 'niña' : 'niño'}</span>!
            </>
          ) : (
            'Una cigüeña viene en camino'
          )}
        </h1>
        {!reveal && (
          <p className="mt-4 text-xl font-semibold animate-[fadeUp_0.9s_0.45s_both]">
            ¿<span className="text-(--boy)">Niño</span> o <span className="text-(--girl)">niña</span>?
          </p>
        )}
        <p className="mt-4 font-gloock text-[clamp(24px,5vw,32px)] text-(--primary) animate-[fadeUp_0.9s_0.5s_both]">{names}</p>
        <p className="mx-auto mt-3 max-w-md text-lg leading-relaxed text-pretty text-(--muted-foreground) animate-[fadeUp_0.9s_0.6s_both]">
          {reveal
            ? babyName
              ? `${babyName} es la estrella más nueva de nuestro cielo. Gracias por mirar hacia arriba con nosotros.`
              : 'Ya tenemos una estrella nueva en el cielo. Gracias por mirar hacia arriba con nosotros.'
            : message || 'Trae un pequeño paquete, y bajo las estrellas descubriremos si es un niño o una niña.'}
        </p>
        {dueLabel && (
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-(--peach) px-4 py-1.5 text-sm font-bold text-(--night) animate-[fadeUp_0.9s_0.65s_both]">
            <Baby className="size-4" aria-hidden="true" />
            {dueLabel}
          </p>
        )}
        {facts.length > 0 && (
          <ul className="mt-6 flex flex-wrap justify-center gap-2 animate-[fadeUp_0.9s_0.7s_both]">
            {facts.map(({ icon: Icon, value }) => (
              <li key={value} className="flex items-center gap-2 rounded-full border border-(--border) bg-(--card)/60 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                <Icon className="size-4 text-(--primary)" aria-hidden="true" />
                {value}
              </li>
            ))}
          </ul>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-2 animate-[fadeUp_0.9s_0.8s_both]">
          <a href="#confirmar" onClick={scrollToHash} className={buttonClass('default', 'lg', 'rounded-full')}>
            Confirmar asistencia
          </a>
          <a href="#equipos" onClick={scrollToHash} className={buttonClass('outline', 'lg', 'rounded-full bg-transparent')}>
            Pide tu deseo
            <ArrowDown aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
