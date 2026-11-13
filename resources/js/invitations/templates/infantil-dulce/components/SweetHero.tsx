import { ArrowDown, CalendarDays, Clock, MapPin } from 'lucide-react';
import { buttonClass, capitalize, cn } from '../../../components/ui/styles';
import { formatDate } from '../../../lib/eventContent';
import { Candy, IceCream, Lollipop } from './Illustrations';
import { Drip, Sprinkles } from './ui';

interface SweetHeroProps {
  firstName: string;
  age: number;
  eventDate: Date | null;
  /** The admin's cover photo, shown in a round frame instead of the ice cream when there is one. */
  photoUrl: string | null;
  place?: string;
}

const PILL_COLORS = ['bg-(--secondary) text-(--secondary-foreground)', 'bg-(--accent) text-(--accent-foreground)', 'bg-(--lilac) text-(--foreground)'];

/**
 * The opening screen: strawberry frosting with sprinkles dripping into the page, floating candies, a three-scoop ice
 * cream, the name in Pacifico, the age on a swirl lollipop and the date, time and place as candy-colored pills.
 */
export function SweetHero({ firstName, age, eventDate, photoUrl, place }: SweetHeroProps) {
  const pills = [
    eventDate && { icon: CalendarDays, label: capitalize(formatDate(eventDate, "EEEE d 'de' MMMM")) },
    eventDate && { icon: Clock, label: formatDate(eventDate, "HH:mm 'hrs'") },
    place && { icon: MapPin, label: place },
  ].filter((pill): pill is { icon: typeof MapPin; label: string } => Boolean(pill));

  return (
    <header className="relative">
      <div className="relative overflow-hidden bg-(--frosting) px-5 pt-14 pb-10 sm:px-8 sm:pt-20">
        <Sprinkles />
        <Candy className="dulce-candy absolute top-[6%] left-[4%] w-14 sm:w-20" />
        <Candy color="#ffd85e" className="dulce-candy absolute top-[12%] right-[5%] w-12 [animation-delay:-1.8s] sm:w-16" />
        <Candy color="#b9a2f0" className="dulce-candy absolute bottom-[8%] left-[44%] hidden w-14 [animation-delay:-3.2s] md:block" />
        <div className="relative mx-auto grid max-w-5xl items-center gap-8 md:grid-cols-[1.3fr_1fr]">
          <div className="text-center md:text-left">
            <span className="inline-block rounded-full bg-(--card) px-4 py-1.5 font-fredoka text-base font-semibold text-(--primary) shadow-sm animate-[fadeUp_0.7s_ease_both]">
              ¡Una fiesta dulcecita!
            </span>
            <h1 className="mt-4 font-pacifico text-[clamp(64px,12vw,124px)] leading-[1.25] text-white [text-shadow:0_5px_0_var(--gold-deep)] animate-[fadeUp_0.8s_0.1s_ease_both]">
              {firstName}
            </h1>
            <p className="mt-6 font-fredoka text-[clamp(20px,3vw,26px)] font-medium animate-[fadeUp_0.8s_0.2s_ease_both]">
              ¡Ven a endulzar su cumpleaños!
            </p>
            {pills.length > 0 && (
              <ul className="mt-6 flex flex-wrap justify-center gap-2 animate-[fadeUp_0.8s_0.3s_ease_both] md:justify-start">
                {pills.map(({ icon: Icon, label }, index) => (
                  <li key={label} className={cn('inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold', PILL_COLORS[index % PILL_COLORS.length])}>
                    <Icon className="size-4" aria-hidden="true" />
                    {label}
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-8 flex flex-wrap justify-center gap-3 animate-[fadeUp_0.8s_0.4s_ease_both] md:justify-start">
              <a href="#rsvp" className={buttonClass('default', 'lg', 'h-12 rounded-full px-6 font-fredoka text-lg font-semibold shadow-[0_5px_0_var(--gold-deep)]')}>
                Confirmar asistencia
              </a>
              <a href="#mensaje" className={buttonClass('outline', 'lg', 'h-12 rounded-full border-0 bg-(--card) px-6 font-fredoka text-lg font-semibold')}>
                Ver detalles
                <ArrowDown aria-hidden="true" />
              </a>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[320px] animate-[fadeUp_0.8s_0.2s_ease_both]">
            {photoUrl ? (
              <div className="mx-auto aspect-square w-[85%] overflow-hidden rounded-full border-8 border-white shadow-xl">
                <img src={photoUrl} alt={firstName} className="size-full object-cover" />
              </div>
            ) : (
              <IceCream className="dulce-motion mx-auto w-[62%] animate-[dulceBob_4s_ease-in-out_infinite]" />
            )}
            {age > 0 && (
              <div className="absolute -bottom-6 -left-2 w-28 rotate-[-14deg] sm:w-32">
                <Lollipop className="w-full drop-shadow-lg" />
                <span className="absolute inset-x-0 top-0 flex aspect-square flex-col items-center justify-center text-center font-fredoka leading-none font-semibold text-(--gold-deep)">
                  <span className="text-[10px]">Cumple</span>
                  <span className="text-[28px]">{age}</span>
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      <Drip color="var(--frosting)" className="-mt-px" />
    </header>
  );
}
