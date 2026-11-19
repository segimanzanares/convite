import { ArrowDown, Baby, CalendarDays, Clock, MapPin } from 'lucide-react';
import { Confetti } from '../../../components/gender-reveal/Confetti';
import { Badge } from '../../../components/ui/primitives';
import { buttonClass, capitalize } from '../../../components/ui/styles';
import { formatDate } from '../../../lib/eventContent';
import type { BabyGender } from '../../../types/invitation';
import { scrollToHash } from '../../../utils/scrollToHash';
import { Teddy } from './OsitoArt';

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
 * The opening screen in two columns: the question and the details on one side, the teddy with its two balloons on a
 * round oat card on the other. Once the answer is out the bear keeps that team's balloon and the title says it.
 */
export function Hero({ names, eventDate, venueName, dueLabel, message, reveal, babyName }: HeroProps) {
  const facts = [
    { icon: CalendarDays, value: capitalize(formatDate(eventDate, "EEEE d 'de' MMMM")) },
    { icon: Clock, value: formatDate(eventDate, "HH:mm 'hrs'") },
    { icon: MapPin, value: venueName ?? '' },
  ].filter((fact) => fact.value);

  return (
    <header className="relative overflow-hidden bg-[linear-gradient(180deg,var(--secondary),var(--background)_70%)] px-5 pt-14 pb-24 sm:px-8">
      {reveal && <Confetti colors={[`--${reveal}`, '--honey', `--${reveal}-soft`]} count={30} />}
      <div className="relative mx-auto grid max-w-5xl items-center gap-10 md:grid-cols-[1.1fr_0.9fr]">
        <div className="text-center md:order-2">
          <div className="relative mx-auto aspect-square w-[min(340px,82vw)] rounded-full bg-(--card) p-6 shadow-[0_30px_70px_-40px_oklch(0.4_0.06_55/0.7)] animate-[fadeUp_1s_0.2s_both]">
            <div className="absolute inset-3 rounded-full border-2 border-dashed border-(--border)" aria-hidden="true" />
            <Teddy answer={reveal} className="relative size-full" />
          </div>
        </div>

        <div className="text-center md:text-left">
          <Badge className="border-transparent bg-(--accent) font-semibold text-(--accent-foreground) animate-[fadeUp_0.9s_0.3s_both]">
            {reveal ? 'La espera terminó' : 'Revelación de género'}
          </Badge>
          <h1 className="mt-5 font-lora text-[clamp(46px,9vw,88px)] leading-[0.98] font-medium text-balance animate-[fadeUp_0.9s_0.4s_both]">
            {reveal ? (
              <>
                ¡Es {reveal === 'girl' ? 'una' : 'un'} <em className={reveal === 'girl' ? 'text-(--girl)' : 'text-(--boy)'}>{reveal === 'girl' ? 'osita' : 'osito'}</em>!
              </>
            ) : (
              <>
                ¿<em className="text-(--boy)">Osito</em> u <em className="text-(--girl)">osita</em>?
              </>
            )}
          </h1>
          <p className="mt-4 font-caveat text-[clamp(30px,6vw,40px)] leading-none text-(--primary) animate-[fadeUp_0.9s_0.5s_both]">{names}</p>
          <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-pretty text-(--muted-foreground) md:mx-0 animate-[fadeUp_0.9s_0.6s_both]">
            {reveal
              ? babyName
                ? `Ya tiene nombre: ${babyName}. Gracias por esperar con nosotros este abrazo tan grande.`
                : 'Gracias por esperar con nosotros este abrazo tan grande.'
              : message || 'Muy pronto conoceremos a nuestro osito… ¿o será osita? Queremos que estés con nosotros cuando lo descubramos.'}
          </p>
          {dueLabel && (
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-(--border) bg-(--card) px-4 py-1.5 text-sm font-semibold animate-[fadeUp_0.9s_0.65s_both]">
              <Baby className="size-4 text-(--primary)" aria-hidden="true" />
              {dueLabel}
            </p>
          )}
          {facts.length > 0 && (
            <ul className="mt-6 grid gap-2 text-sm font-semibold sm:mx-auto sm:max-w-sm md:mx-0 animate-[fadeUp_0.9s_0.7s_both]">
              {facts.map(({ icon: Icon, value }) => (
                <li key={value} className="flex items-center justify-center gap-3 md:justify-start">
                  <span className="flex size-8 items-center justify-center rounded-full bg-(--secondary)">
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
            <a href="#equipos" onClick={scrollToHash} className={buttonClass('outline', 'lg', 'rounded-full')}>
              Haz tu apuesta
              <ArrowDown aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
