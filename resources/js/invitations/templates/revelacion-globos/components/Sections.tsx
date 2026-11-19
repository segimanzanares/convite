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
import { BalloonBunch, RisingBalloons } from './GlobosArt';

/** The lemon pill of the eyebrows. */
export const EYEBROW = 'rounded-full bg-(--accent) px-3.5 py-1 text-xs font-bold tracking-[0.18em] text-(--accent-foreground) uppercase';

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
}

/** A lemon pill as the eyebrow, a Sniglet title and a muted lead, centered. */
export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <Reveal className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
      <p className={`mx-auto w-fit ${EYEBROW}`}>{eyebrow}</p>
      <h2 className="mt-4 font-sniglet text-[clamp(32px,5.5vw,52px)] leading-[1.05] text-balance">{title}</h2>
      {description && <p className="mt-4 text-base leading-relaxed text-pretty text-(--muted-foreground) sm:text-lg">{description}</p>}
    </Reveal>
  );
}

const UNITS = [
  { label: 'Días', color: '--girl-soft' },
  { label: 'Horas', color: '--boy-soft' },
  { label: 'Minutos', color: '--accent' },
  { label: 'Segundos', color: '--secondary' },
] as const;

interface CountdownSectionProps {
  targetDateTime: string;
  calendar: CalendarOccasion;
  venues: Venue[];
}

/** Balloons rise behind four pastel cards while the time to pop the balloon runs out. */
export function CountdownSection({ targetDateTime, calendar, venues }: CountdownSectionProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDateTime);
  const values = [days, hours, minutes, seconds];

  return (
    <Section className="relative overflow-hidden bg-(--muted)">
      <RisingBalloons />
      <div className="relative">
        <SectionTitle eyebrow="Cuenta regresiva" title="Falta poquito para reventarlo" description="Cada segundo nos acerca a la gran noticia." />
        <Reveal className="mx-auto max-w-3xl">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" role="timer" aria-label="Tiempo que falta para la revelación">
            {UNITS.map(({ label, color }, index) => (
              <Card key={label} className="py-6 text-center" style={{ backgroundColor: `color-mix(in oklch, var(${color}) 70%, var(--card))` }}>
                <p className="font-sniglet text-[clamp(44px,7vw,64px)] leading-none font-extrabold tabular-nums">{String(values[index]).padStart(2, '0')}</p>
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

/** A grape night to close: a bunch of balloons, the closing words, the names and the date. */
export function Footer({ names, dateLabel, closingMessage, tagline }: FooterProps) {
  const conviteUrl = useConviteUrl();

  return (
    <footer className="ui-dark px-5 pt-20 pb-28 text-center">
      <BalloonBunch className="mx-auto w-28" />
      <p className="mx-auto mt-8 max-w-md text-lg leading-relaxed text-pretty">{closingMessage}</p>
      <p className="mt-8 font-sniglet text-4xl sm:text-5xl">{names}</p>
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
