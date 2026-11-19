import { ArrowDown, Baby, CalendarDays, Clock, MapPin } from 'lucide-react';
import { Confetti } from '../../../components/gender-reveal/Confetti';
import { Badge } from '../../../components/ui/primitives';
import { buttonClass, capitalize } from '../../../components/ui/styles';
import { formatDate } from '../../../lib/eventContent';
import type { BabyGender } from '../../../types/invitation';
import { scrollToHash } from '../../../utils/scrollToHash';
import { BalloonBunch, MysteryBalloon } from './GlobosArt';

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
 * The opening screen: the mystery balloon bobs between two bunches of balloons over "¿Niño o niña?", with the names,
 * the date, the time and the place as chips. Once the answer is out the balloon takes the team's color, confetti of
 * that color rains and the title says it.
 */
export function Hero({ names, eventDate, venueName, dueLabel, message, reveal, babyName }: HeroProps) {
  const facts = [
    { icon: CalendarDays, value: capitalize(formatDate(eventDate, "EEEE d 'de' MMMM")) },
    { icon: Clock, value: formatDate(eventDate, "HH:mm 'hrs'") },
    { icon: MapPin, value: venueName ?? '' },
  ].filter((fact) => fact.value);

  return (
    <header
      className="relative overflow-hidden px-5 pt-12 pb-24 text-center sm:px-8"
      style={{ background: 'radial-gradient(circle at 12% 30%, var(--girl-soft), transparent 40%), radial-gradient(circle at 88% 60%, var(--boy-soft), transparent 40%), var(--background)' }}
    >
      {reveal && <Confetti colors={[`--${reveal}`, `--${reveal}-soft`, '--lemon']} count={40} />}
      <BalloonBunch className="absolute top-[6%] -left-4 w-24 sm:top-[14%] sm:left-[6%] sm:w-40" />
      <BalloonBunch wait={-2} className="absolute top-[20%] -right-4 w-20 sm:top-[52%] sm:right-[6%] sm:w-36" />

      <div className="relative mx-auto max-w-2xl">
        <MysteryBalloon answer={reveal} className="mx-auto w-[min(190px,46vw)] animate-[fadeUp_1s_0.2s_both]" />

        <Badge className="mt-4 border-transparent bg-(--accent) font-bold text-(--accent-foreground) animate-[fadeUp_0.9s_0.4s_both]">
          {reveal ? '¡Ya lo sabemos!' : 'Revelación de género'}
        </Badge>
        <h1 className="mt-4 font-sniglet text-[clamp(52px,12vw,108px)] leading-[0.95] font-extrabold text-balance animate-[fadeUp_0.9s_0.5s_both]">
          {reveal ? (
            <>
              ¡Es <span className={reveal === 'girl' ? 'text-(--girl)' : 'text-(--boy)'}>{reveal === 'girl' ? 'niña' : 'niño'}</span>!
            </>
          ) : (
            <>
              ¿<span className="text-(--boy)">Niño</span> o <span className="text-(--girl)">niña</span>?
            </>
          )}
        </h1>
        <p className="mt-5 font-sniglet text-[clamp(24px,5vw,34px)] text-(--primary) animate-[fadeUp_0.9s_0.6s_both]">{names}</p>
        <p className="mx-auto mt-3 max-w-md text-lg leading-relaxed text-pretty text-(--muted-foreground) animate-[fadeUp_0.9s_0.7s_both]">
          {reveal
            ? babyName
              ? `${reveal === 'girl' ? 'Bienvenida' : 'Bienvenido'}, ${babyName}. Gracias por reventar el globo con nosotros.`
              : 'Gracias por reventar el globo con nosotros y llenar de color esta gran noticia.'
            : message || 'Un globo, dos colores y una noticia que nos tiene flotando. Ven a descubrir con nosotros si nuestro bebé será niño o niña.'}
        </p>

        {dueLabel && (
          <p className="mt-5 inline-flex items-center gap-2 rounded-full bg-(--secondary) px-4 py-1.5 text-sm font-bold text-(--secondary-foreground) animate-[fadeUp_0.9s_0.75s_both]">
            <Baby className="size-4" aria-hidden="true" />
            {dueLabel}
          </p>
        )}

        {facts.length > 0 && (
          <ul className="mt-6 flex flex-wrap justify-center gap-2 animate-[fadeUp_0.9s_0.8s_both]">
            {facts.map(({ icon: Icon, value }) => (
              <li key={value} className="flex items-center gap-2 rounded-full border border-(--border) bg-(--card)/85 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                <Icon className="size-4 text-(--primary)" aria-hidden="true" />
                {value}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-8 flex flex-wrap justify-center gap-2 animate-[fadeUp_0.9s_0.9s_both]">
          <a href="#confirmar" onClick={scrollToHash} className={buttonClass('default', 'lg', 'rounded-full')}>
            Confirmar asistencia
          </a>
          <a href="#equipos" onClick={scrollToHash} className={buttonClass('outline', 'lg', 'rounded-full')}>
            ¿Tú qué crees?
            <ArrowDown aria-hidden="true" />
          </a>
        </div>
      </div>
    </header>
  );
}
