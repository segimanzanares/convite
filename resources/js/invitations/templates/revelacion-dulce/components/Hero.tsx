import { ArrowDown, Baby, CalendarDays, Clock, MapPin } from 'lucide-react';
import { Confetti } from '../../../components/gender-reveal/Confetti';
import { Badge } from '../../../components/ui/primitives';
import { buttonClass, capitalize } from '../../../components/ui/styles';
import { formatDate } from '../../../lib/eventContent';
import type { BabyGender } from '../../../types/invitation';
import { scrollToHash } from '../../../utils/scrollToHash';
import { Cake, DripDivider } from './DulceArt';

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
 * The opening screen on strawberry milk: the cake with its knife next to "Dulce espera" and the question, with the
 * details on a card like a bakery ticket; the frosting drips into the next section. Once the answer is out the slice
 * comes out showing the sponge's color and the title says it.
 */
export function Hero({ names, eventDate, venueName, dueLabel, message, reveal, babyName }: HeroProps) {
  const facts = [
    { icon: CalendarDays, value: capitalize(formatDate(eventDate, "EEEE d 'de' MMMM")) },
    { icon: Clock, value: formatDate(eventDate, "HH:mm 'hrs'") },
    { icon: MapPin, value: venueName ?? '' },
  ].filter((fact) => fact.value);

  return (
    <header className="relative">
      <div className="relative overflow-hidden bg-(--secondary) px-5 pt-14 pb-16 sm:px-8">
        {reveal && <Confetti colors={[`--${reveal}`, '--flame', '--frosting']} count={36} />}
        <div className="relative mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-2">
          <Cake answer={reveal} className="mx-auto w-[min(400px,88vw)] animate-[fadeUp_1s_0.2s_both]" />
          <div className="text-center md:text-left">
            <Badge className="border-transparent bg-(--card) font-semibold text-(--secondary-foreground) animate-[fadeUp_0.9s_0.3s_both]">
              {reveal ? 'El pastel ya habló' : 'Revelación de género'}
            </Badge>
            <h1 className="mt-5 font-shrikhand text-[clamp(50px,10vw,96px)] leading-[0.95] text-balance animate-[fadeUp_0.9s_0.4s_both]">
              {reveal ? (
                <>
                  ¡Es <span className={reveal === 'girl' ? 'text-(--girl)' : 'text-(--boy)'}>{reveal === 'girl' ? 'niña' : 'niño'}</span>!
                </>
              ) : (
                'Dulce espera'
              )}
            </h1>
            {!reveal && (
              <p className="mt-4 text-2xl font-semibold animate-[fadeUp_0.9s_0.45s_both]">
                ¿<span className="text-(--boy-foreground)">Niño</span> o <span className="text-(--girl-foreground)">niña</span>?
              </p>
            )}
            <p className="mt-3 font-shrikhand text-2xl text-(--primary) animate-[fadeUp_0.9s_0.5s_both]">{names}</p>
            <p className="mx-auto mt-3 max-w-md text-lg leading-relaxed text-pretty text-(--muted-foreground) md:mx-0 animate-[fadeUp_0.9s_0.6s_both]">
              {reveal
                ? babyName
                  ? `${babyName} ya viene en camino. Gracias por partir el pastel con nosotros.`
                  : 'Gracias por partir el pastel con nosotros.'
                : message || 'La respuesta está horneada dentro del pastel. Cuando lo partamos, lo sabremos todos juntos.'}
            </p>

            <div className="mx-auto mt-6 max-w-sm rounded-(--radius) border-2 border-dashed border-(--girl)/50 bg-(--card) p-4 text-left text-sm font-medium md:mx-0 animate-[fadeUp_0.9s_0.7s_both]">
              {dueLabel && (
                <p className="mb-2 flex items-center gap-2 border-b border-dashed border-(--border) pb-2 font-semibold text-(--secondary-foreground)">
                  <Baby className="size-4" aria-hidden="true" />
                  {dueLabel}
                </p>
              )}
              <ul className="grid gap-1.5">
                {facts.map(({ icon: Icon, value }) => (
                  <li key={value} className="flex items-center gap-2">
                    <Icon className="size-4 text-(--primary)" aria-hidden="true" />
                    {value}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-7 flex flex-wrap justify-center gap-2 md:justify-start animate-[fadeUp_0.9s_0.8s_both]">
              <a href="#confirmar" onClick={scrollToHash} className={buttonClass('default', 'lg', 'rounded-full')}>
                Confirmar asistencia
              </a>
              <a href="#equipos" onClick={scrollToHash} className={buttonClass('outline', 'lg', 'rounded-full')}>
                Elige tu cupcake
                <ArrowDown aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </div>
      <DripDivider color="--secondary" />
    </header>
  );
}
