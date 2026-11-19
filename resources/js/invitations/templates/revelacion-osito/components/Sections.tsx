import type { CSSProperties, ReactNode } from 'react';
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
import { starPath } from '../../../components/gender-reveal/shapes';
import { SleepyMoon } from './OsitoArt';

/** The handwritten eyebrow. */
export const EYEBROW = 'font-caveat text-2xl leading-none text-(--primary)';

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
}

/** A handwritten Caveat eyebrow, a Lora title and a muted lead, centered, with a small stitched line. */
export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <Reveal className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
      <p className={EYEBROW}>{eyebrow}</p>
      <h2 className="mt-2 font-lora text-[clamp(32px,5.5vw,50px)] leading-[1.08] font-medium text-balance">{title}</h2>
      <div className="mx-auto mt-4 h-0 w-20 border-t-2 border-dashed border-(--fur-light)" aria-hidden="true" />
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

/** "Unas noches más": the bear sleeps on the moon over four cards that count down. */
export function CountdownSection({ targetDateTime, calendar, venues }: CountdownSectionProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDateTime);
  const values = [days, hours, minutes, seconds];

  return (
    <Section className="bg-(--muted)">
      <SectionTitle eyebrow="Cuenta regresiva" title="Unas cuantas noches más" description="…y por fin sabremos quién viene en camino." />
      <Reveal className="mx-auto max-w-3xl">
        <SleepyMoon className="mx-auto -mt-6 mb-4 w-[min(300px,80vw)]" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" role="timer" aria-label="Tiempo que falta para la revelación">
          {UNITS.map((label, index) => (
            <Card key={label} className="relative overflow-hidden py-6 text-center">
              <svg viewBox="0 0 20 20" className="osito-twinkle absolute top-2 right-2 size-4" style={{ '--wait': `${-index * 0.7}s` } as CSSProperties} aria-hidden="true">
                <path d={starPath(10, 10, 9)} fill="var(--honey)" />
              </svg>
              <p className="font-lora text-[clamp(42px,7vw,58px)] leading-none font-medium tabular-nums">{String(values[index]).padStart(2, '0')}</p>
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

/** Cocoa to close: the sleeping bear on its moon, the closing words in handwriting, the names and the date. */
export function Footer({ names, dateLabel, closingMessage, tagline }: FooterProps) {
  const conviteUrl = useConviteUrl();

  return (
    <footer className="ui-dark px-5 pt-16 pb-28 text-center">
      <SleepyMoon className="mx-auto w-48 [--fur-dark:var(--foreground)]" />
      <p className="mx-auto mt-6 max-w-md font-caveat text-[28px] leading-snug text-pretty">{closingMessage}</p>
      <p className="mt-8 font-lora text-4xl font-medium sm:text-5xl">{names}</p>
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
