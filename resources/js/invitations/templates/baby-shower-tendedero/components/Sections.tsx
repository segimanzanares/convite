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
import { Pennants, Socks } from './TendederoArt';

/** The handwritten eyebrow. */
export const EYEBROW = 'font-reenie text-[28px] leading-none text-(--primary)';

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
}

/** A handwritten eyebrow, a Yeseva One title and a muted lead, centered, over a short garland of pennants. */
export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <Reveal className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
      <p className={EYEBROW}>{eyebrow}</p>
      <h2 className="mt-2 font-yeseva text-[clamp(30px,5.5vw,48px)] leading-[1.1] text-balance">{title}</h2>
      <Pennants className="mx-auto mt-3 w-40" count={5} />
      {description && <p className="mt-3 text-base leading-relaxed text-pretty text-(--muted-foreground) sm:text-lg">{description}</p>}
    </Reveal>
  );
}

const UNITS = ['Días', 'Horas', 'Minutos', 'Segundos'] as const;

interface CountdownSectionProps {
  targetDateTime: string;
  calendar: CalendarOccasion;
  venues: Venue[];
}

/** "Contando los días": two socks hang over four cards that count down. */
export function CountdownSection({ targetDateTime, calendar, venues }: CountdownSectionProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDateTime);
  const values = [days, hours, minutes, seconds];

  return (
    <Section className="bg-(--muted)">
      <SectionTitle eyebrow="falta poquito" title="Contando los días" description="Mientras tanto, seguimos doblando ropita." />
      <Reveal className="mx-auto max-w-3xl">
        <Socks className="mx-auto -mt-4 mb-2 w-44" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" role="timer" aria-label="Tiempo que falta para el baby shower">
          {UNITS.map((label, index) => (
            <Card key={label} className="border-dashed py-6 text-center">
              <p className="font-yeseva text-[clamp(40px,7vw,56px)] leading-none tabular-nums">{String(values[index]).padStart(2, '0')}</p>
              <p className="mt-2 text-xs font-semibold tracking-[0.18em] text-(--muted-foreground) uppercase">{label}</p>
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

/** Clay to close: a garland of pennants, the closing words in handwriting, the names and the date. */
export function Footer({ names, dateLabel, closingMessage, tagline }: FooterProps) {
  const conviteUrl = useConviteUrl();

  return (
    <footer className="ui-dark px-5 pb-28 text-center">
      <Pennants className="mx-auto w-full max-w-3xl" count={11} />
      <p className="mx-auto mt-10 max-w-md font-reenie text-[30px] leading-tight text-pretty">{closingMessage}</p>
      <p className="mt-8 font-yeseva text-4xl sm:text-5xl">{names}</p>
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
