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
import { Elephant, Giraffe, Leaves } from './SafariArt';

/** The small uppercase eyebrow in jungle green. */
export const EYEBROW = 'text-xs font-semibold tracking-[0.28em] text-(--primary) uppercase';

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
}

/** An eyebrow, a Grandstander title and a muted lead, centered, over three little footprints. */
export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <Reveal className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
      <p className={EYEBROW}>{eyebrow}</p>
      <h2 className="mt-3 font-grandstander text-[clamp(32px,5.5vw,50px)] leading-[1.05] font-bold text-balance">{title}</h2>
      <div className="mt-4 flex justify-center gap-2 text-(--spots)" aria-hidden="true">
        {[0, 1, 2].map((index) => (
          <svg key={index} viewBox="0 0 20 20" className="size-4" style={{ transform: `rotate(${index % 2 ? 12 : -12}deg) translateY(${index % 2 ? 3 : 0}px)` }}>
            <ellipse cx="10" cy="13" rx="6" ry="5" fill="currentColor" />
            <circle cx="5" cy="5" r="2" fill="currentColor" />
            <circle cx="10" cy="3.5" r="2" fill="currentColor" />
            <circle cx="15" cy="5" r="2" fill="currentColor" />
          </svg>
        ))}
      </div>
      {description && <p className="mt-4 text-base leading-relaxed font-light text-pretty text-(--muted-foreground) sm:text-lg">{description}</p>}
    </Reveal>
  );
}

const UNITS = ['Días', 'Horas', 'Minutos', 'Segundos'] as const;

interface CountdownSectionProps {
  targetDateTime: string;
  calendar: CalendarOccasion;
  venues: Venue[];
}

/** "Contando las huellitas": the giraffe peeks over four cards that count down. */
export function CountdownSection({ targetDateTime, calendar, venues }: CountdownSectionProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDateTime);
  const values = [days, hours, minutes, seconds];

  return (
    <Section className="overflow-hidden bg-(--muted)">
      <SectionTitle eyebrow="Cuenta regresiva" title="Contando las huellitas" description="Falta muy poco para celebrar juntos." />
      <Reveal className="relative mx-auto max-w-3xl pt-16">
        <Giraffe className="absolute top-0 right-4 w-16 sm:right-10" wait={-2} />
        <div className="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-4" role="timer" aria-label="Tiempo que falta para el baby shower">
          {UNITS.map((label, index) => (
            <Card key={label} className={index % 2 ? 'bg-(--accent) py-6 text-center' : 'bg-(--secondary) py-6 text-center'}>
              <p className="font-grandstander text-[clamp(42px,7vw,58px)] leading-none font-bold tabular-nums">{String(values[index]).padStart(2, '0')}</p>
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

/** Jungle green to close: the elephant among leaves, the closing words, the names and the date. */
export function Footer({ names, dateLabel, closingMessage, tagline }: FooterProps) {
  const conviteUrl = useConviteUrl();

  return (
    <footer className="ui-dark relative overflow-hidden px-5 pt-16 pb-28 text-center">
      <Leaves className="absolute -bottom-4 -left-8 w-40 opacity-60" />
      <Leaves className="absolute -right-8 -bottom-4 w-40 opacity-60" flip />
      <div className="relative">
        <Elephant className="mx-auto w-36" bubbles={false} />
        <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed font-light text-pretty">{closingMessage}</p>
        <p className="mt-8 font-grandstander text-4xl font-bold sm:text-5xl">{names}</p>
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
