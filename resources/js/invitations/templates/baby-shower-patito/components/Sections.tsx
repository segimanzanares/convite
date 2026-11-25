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
import { Bubble, Duck, Ducklings } from './PatitoArt';

/** The small uppercase eyebrow in teal. */
export const EYEBROW = 'text-xs font-extrabold tracking-[0.28em] text-(--primary) uppercase';

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
}

/** An eyebrow, a Chewy title and a muted lead, centered, with three bubbles. */
export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <Reveal className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
      <p className={EYEBROW}>{eyebrow}</p>
      <h2 className="mt-3 font-chewy text-[clamp(34px,6vw,54px)] leading-[1.05] text-balance">{title}</h2>
      <div className="mt-3 flex items-end justify-center gap-1" aria-hidden="true">
        <Bubble className="size-3" />
        <Bubble className="size-5" />
        <Bubble className="size-3.5" />
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

/** "Patito a patito": a mother duck and her ducklings swim over four cards that count down. */
export function CountdownSection({ targetDateTime, calendar, venues }: CountdownSectionProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDateTime);
  const values = [days, hours, minutes, seconds];

  return (
    <Section className="bg-(--muted)">
      <SectionTitle eyebrow="Cuenta regresiva" title="Patito a patito" description="Así vamos contando el tiempo para conocerte." />
      <Reveal className="mx-auto max-w-3xl">
        <Ducklings className="mx-auto -mt-4 mb-3 w-[min(280px,76vw)]" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" role="timer" aria-label="Tiempo que falta para el baby shower">
          {UNITS.map((label, index) => (
            <Card key={label} className="border-2 py-6 text-center">
              <p className="font-chewy text-[clamp(44px,7.5vw,60px)] leading-none text-(--primary) tabular-nums">{String(values[index]).padStart(2, '0')}</p>
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

/** Deep water to close: the duck floating, the closing words, the names and the date. */
export function Footer({ names, dateLabel, closingMessage, tagline }: FooterProps) {
  const conviteUrl = useConviteUrl();

  return (
    <footer className="ui-dark px-5 pt-14 pb-28 text-center">
      <Duck className="mx-auto w-40" />
      <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-pretty">{closingMessage}</p>
      <p className="mt-8 font-chewy text-5xl">{names}</p>
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
