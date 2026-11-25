import type { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { CalendarPlus } from 'lucide-react';
import logoHorizontal from '../../../assets/images/logo-horizontal.png';
import { Reveal } from '../../../components/shared/Reveal';
import { Card, Section } from '../../../components/ui/primitives';
import { buttonClass } from '../../../components/ui/styles';
import { useConviteUrl } from '../../../hooks/useConviteUrl';
import { useCountdown } from '../../../hooks/useCountdown';
import type { Venue } from '../../../types/wedding';
import { downloadEventCalendar, type CalendarOccasion } from '../../../utils/calendar';
import { Heart, RainCloud, Rainbow } from './LluviaArt';

/** The small uppercase eyebrow in periwinkle. */
export const EYEBROW = 'text-xs font-bold tracking-[0.28em] text-(--primary) uppercase';

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
}

/** An eyebrow, a Comfortaa title and a muted lead, centered, with three small hearts. */
export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <Reveal className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
      <p className={EYEBROW}>{eyebrow}</p>
      <h2 className="mt-3 font-comfortaa text-[clamp(30px,5.5vw,48px)] leading-[1.1] font-bold tracking-tight text-balance">{title}</h2>
      <div className="mt-4 flex items-center justify-center gap-1.5" aria-hidden="true">
        <Heart className="size-3 text-(--lilac)" />
        <Heart className="size-4 text-(--heart)" />
        <Heart className="size-3 text-(--drop)" />
      </div>
      {description && <p className="mt-4 text-base leading-relaxed text-pretty text-(--muted-foreground) sm:text-lg">{description}</p>}
    </Reveal>
  );
}

const UNITS = ['Días', 'Horas', 'Minutos', 'Segundos'] as const;

interface CountdownSectionProps {
  targetDateTime: string;
  calendar: CalendarOccasion;
  venues: Venue[];
}

/** "Después de la lluvia… llega el arcoíris": the rainbow draws itself over four cards that count down. */
export function CountdownSection({ targetDateTime, calendar, venues }: CountdownSectionProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDateTime);
  const values = [days, hours, minutes, seconds];

  return (
    <Section className="bg-(--muted)">
      <SectionTitle eyebrow="Cuenta regresiva" title="Después de la lluvia, el arcoíris" description="Cada día falta menos para celebrar juntos." />
      <Reveal className="mx-auto max-w-3xl">
        <Rainbow className="mx-auto -mt-4 mb-2 w-[min(280px,74vw)]" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" role="timer" aria-label="Tiempo que falta para el baby shower">
          {UNITS.map((label, index) => (
            <Card key={label} className="py-6 text-center">
              <p className="font-comfortaa text-[clamp(40px,7vw,56px)] leading-none font-bold tabular-nums">{String(values[index]).padStart(2, '0')}</p>
              <p className="mt-2 text-xs font-bold tracking-[0.18em] text-(--muted-foreground) uppercase">{label}</p>
            </Card>
          ))}
        </div>
        {venues.length > 0 && calendar.dateTime && (
          <div className="mt-8 text-center">
            <button type="button" onClick={() => downloadEventCalendar(calendar, venues)} className={buttonClass('outline', 'lg', 'rounded-full')}>
              <CalendarPlus aria-hidden="true" />
              Guardar la fecha
            </button>
          </div>
        )}
      </Reveal>
    </Section>
  );
}

interface FooterProps {
  names: string;
  dateLabel: string;
  closingMessage: string;
  tagline: string | null;
}

/** Dusk to close: the cloud, still raining hearts, the closing words, the names and the date. */
export function Footer({ names, dateLabel, closingMessage, tagline }: FooterProps) {
  const conviteUrl = useConviteUrl();

  return (
    <footer className="ui-dark px-5 pt-14 pb-28 text-center">
      <RainCloud className="mx-auto w-40" wait={-2} />
      <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-pretty">{closingMessage}</p>
      <p className="mt-8 font-comfortaa text-4xl font-bold tracking-tight sm:text-5xl">{names}</p>
      {dateLabel && <p className="mt-3 text-sm tracking-[0.25em] text-(--muted-foreground) tabular-nums">{dateLabel}</p>}
      {tagline && <p className="mx-auto mt-4 max-w-sm text-sm text-pretty text-(--muted-foreground)">{tagline}</p>}
      <div className="mx-auto mt-12 h-px max-w-xs bg-(--border)" />
      <p className="mt-6 text-xs text-(--muted-foreground)">Hecho con cariño en</p>
      <Link href={conviteUrl} className="mx-auto mt-2 block w-fit">
        <img src={logoHorizontal} alt="Convite" className="h-7 opacity-60 brightness-0 invert" />
      </Link>
    </footer>
  );
}
