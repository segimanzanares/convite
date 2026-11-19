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
import { Cupcake, DripDivider, KitchenTimer } from './DulceArt';

/** The eyebrow: a strawberry label with stitched edges. */
export const EYEBROW = 'rounded-full border border-dashed border-(--girl) bg-(--card) px-3.5 py-1 text-xs font-bold tracking-[0.18em] text-(--girl-foreground) uppercase';

interface SectionTitleProps {
  eyebrow: string;
  title: string;
  description?: ReactNode;
}

/** A stitched strawberry label as the eyebrow, a Shrikhand title and a muted lead, centered. */
export function SectionTitle({ eyebrow, title, description }: SectionTitleProps) {
  return (
    <Reveal className="mx-auto mb-10 max-w-2xl text-center sm:mb-14">
      <p className={`mx-auto w-fit ${EYEBROW}`}>{eyebrow}</p>
      <h2 className="mt-4 font-shrikhand text-[clamp(32px,5.5vw,50px)] leading-[1.1] text-balance">{title}</h2>
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

/** "Horneando la sorpresa": the kitchen timer turns over four cards like recipe tags. */
export function CountdownSection({ targetDateTime, calendar, venues }: CountdownSectionProps) {
  const { days, hours, minutes, seconds } = useCountdown(targetDateTime);
  const values = [days, hours, minutes, seconds];

  return (
    <Section className="bg-(--muted)">
      <SectionTitle eyebrow="Cuenta regresiva" title="Horneando la sorpresa" description="El pastel ya está en el horno; solo falta esperar." />
      <Reveal className="mx-auto max-w-3xl">
        <KitchenTimer className="mx-auto -mt-4 mb-6 w-28" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4" role="timer" aria-label="Tiempo que falta para la revelación">
          {UNITS.map((label, index) => (
            <Card key={label} className="border-2 border-dashed py-6 text-center" style={{ borderColor: `var(${index % 2 ? '--boy' : '--girl'})` }}>
              <p className="font-shrikhand text-[clamp(40px,7vw,56px)] leading-none tabular-nums">{String(values[index]).padStart(2, '0')}</p>
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

/** Chocolate to close, dripping from above: two cupcakes, the closing words, the names and the date. */
export function Footer({ names, dateLabel, closingMessage, tagline }: FooterProps) {
  const conviteUrl = useConviteUrl();

  return (
    <footer className="ui-dark text-center">
      <DripDivider color="--cream" className="bg-(--background)" />
      <div className="px-5 pt-14 pb-28">
        <div className="mx-auto flex w-44 gap-2">
          <Cupcake gender="girl" className="w-full" />
          <Cupcake gender="boy" className="w-full" />
        </div>
        <p className="mx-auto mt-8 max-w-md text-lg leading-relaxed text-pretty">{closingMessage}</p>
        <p className="mt-8 font-shrikhand text-4xl sm:text-5xl">{names}</p>
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
