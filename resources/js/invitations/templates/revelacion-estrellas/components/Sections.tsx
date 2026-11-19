import type { ReactNode } from 'react';
import { Link } from '@inertiajs/react';
import { CalendarPlus } from 'lucide-react';
import logoHorizontal from '../../../assets/images/logo-horizontal.png';
import { Reveal } from '../../../components/shared/Reveal';
import { Card, Section } from '../../../components/ui/primitives';
import { buttonClass, cn } from '../../../components/ui/styles';
import { useConviteUrl } from '../../../hooks/useConviteUrl';
import { useCountdown } from '../../../hooks/useCountdown';
import type { Venue } from '../../../types/wedding';
import { downloadEventCalendar, type CalendarOccasion } from '../../../utils/calendar';
import { starPath } from '../../../components/gender-reveal/shapes';
import { Moon, StarrySky } from './EstrellasArt';

/** The eyebrow: small caps between two little stars. */
export const EYEBROW = 'text-xs font-bold tracking-[0.3em] text-(--primary) uppercase';

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
  className?: string;
}

function TinyStar() {
  return (
    <svg viewBox="0 0 20 20" className="size-3" aria-hidden="true">
      <path d={starPath(10, 10, 10, 0.4)} fill="var(--peach)" />
    </svg>
  );
}

/** Small caps between two peach stars, a Gloock title and a muted lead, centered. */
export function SectionTitle({ eyebrow, title, description, className }: SectionTitleProps) {
  return (
    <Reveal className={cn('mx-auto mb-10 max-w-2xl text-center sm:mb-14', className)}>
      <p className={cn('flex items-center justify-center gap-3', EYEBROW)}>
        <TinyStar />
        {eyebrow}
        <TinyStar />
      </p>
      <h2 className="mt-4 font-gloock text-[clamp(32px,5.5vw,50px)] leading-[1.1] text-balance">{title}</h2>
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

/** "Contando estrellas": four translucent cards on a night sky with twinkling stars and a shooting star. */
export function CountdownSection({ targetDateTime, calendar, venues }: CountdownSectionProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDateTime);
  const values = [days, hours, minutes, seconds];

  return (
    <Section dark className="relative overflow-hidden">
      <StarrySky count={30} />
      <div className="relative">
        <SectionTitle eyebrow="Cuenta regresiva" title="Contando estrellas" description="Cada noche que pasa, la cigüeña está un poco más cerca." />
        <Reveal className="mx-auto max-w-3xl">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" role="timer" aria-label="Tiempo que falta para la revelación">
            {UNITS.map((label, index) => (
              <Card key={label} className="bg-(--card)/70 py-6 text-center backdrop-blur-sm">
                <p className="font-gloock text-[clamp(42px,7vw,58px)] leading-none tabular-nums">{String(values[index]).padStart(2, '0')}</p>
                <p className="mt-2 text-xs font-bold tracking-[0.18em] text-(--muted-foreground) uppercase">{label}</p>
              </Card>
            ))}
          </div>
          {venues.length > 0 && calendar.dateTime && (
            <div className="mt-8 text-center">
              <button type="button" onClick={() => downloadEventCalendar(calendar, venues)} className={buttonClass('outline', 'lg', 'rounded-full bg-transparent')}>
                <CalendarPlus aria-hidden="true" />
                Guardar la fecha
              </button>
            </div>
          )}
        </Reveal>
      </div>
    </Section>
  );
}

interface FooterProps {
  names: string;
  dateLabel: string;
  closingMessage: string;
  tagline: string | null;
}

/** The night again to close: the sleeping moon among the stars, the closing words, the names and the date. */
export function Footer({ names, dateLabel, closingMessage, tagline }: FooterProps) {
  const conviteUrl = useConviteUrl();

  return (
    <footer className="ui-dark relative overflow-hidden px-5 pt-20 pb-28 text-center">
      <StarrySky count={34} />
      <div className="relative">
        <Moon className="mx-auto w-20" />
        <p className="mx-auto mt-8 max-w-md text-lg leading-relaxed text-pretty">{closingMessage}</p>
        <p className="mt-8 font-gloock text-4xl sm:text-5xl">{names}</p>
        {dateLabel && <p className="mt-3 text-sm tracking-[0.25em] text-(--muted-foreground) tabular-nums">{dateLabel}</p>}
        {tagline && <p className="mx-auto mt-4 max-w-sm text-sm text-pretty text-(--muted-foreground)">{tagline}</p>}
        <div className="mx-auto mt-12 h-px max-w-xs bg-(--border)" />
        <p className="mt-6 text-xs text-(--muted-foreground)">Hecho con cariño en</p>
        <Link href={conviteUrl} className="mx-auto mt-2 block w-fit">
          <img src={logoHorizontal} alt="Convite" className="h-7 opacity-60 brightness-0 invert" />
        </Link>
      </div>
    </footer>
  );
}
