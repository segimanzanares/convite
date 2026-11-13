import { ArrowDown, CalendarDays, MapPin } from 'lucide-react';
import type { CoupleInfo } from '../../../types/wedding';
import { buttonClass, capitalize } from './styles';
import { Ampersand, Badge } from './ui';

interface ModernHeroProps {
  couple: CoupleInfo;
  /** The cover photo; without one the hero shows the names alone, centered. */
  photoUrl: string | null;
  /** The town of the first venue, e.g. its last address line. */
  place?: string;
}

export function ModernHero({ couple, photoUrl, place }: ModernHeroProps) {
  return (
    <header className="relative overflow-hidden px-5 pt-16 pb-20 sm:px-8 sm:pt-24 sm:pb-28">
      <div className="boda-moderna-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className={
          photoUrl
            ? 'relative mx-auto grid max-w-5xl items-center gap-12 md:grid-cols-[1.1fr_1fr]'
            : 'relative mx-auto max-w-3xl text-center'
        }
      >
        <div className="animate-[fadeUp_0.8s_ease_both]">
          <Badge>
            <span className="size-1.5 rounded-full bg-(--foreground)" aria-hidden="true" />
            Nos casamos {couple.year}
          </Badge>
          <h1 className="mt-6 text-[clamp(44px,9vw,84px)] leading-[0.95] font-semibold tracking-tighter">
            {couple.names[0]}
            <br />
            <Ampersand className="mr-3" />
            {couple.names[1]}
          </h1>
          <div
            className={`mt-8 flex flex-col gap-2.5 text-sm text-(--muted-foreground) sm:text-base ${photoUrl ? '' : 'items-center'}`}
          >
            {couple.dateLabel && (
              <p className="inline-flex items-center gap-2">
                <CalendarDays className="size-4 shrink-0" aria-hidden="true" />
                {capitalize(couple.dateLabel)}
              </p>
            )}
            {place && (
              <p className="inline-flex items-center gap-2">
                <MapPin className="size-4 shrink-0" aria-hidden="true" />
                {place}
              </p>
            )}
          </div>
          <div className={`mt-10 flex flex-wrap gap-3 ${photoUrl ? '' : 'justify-center'}`}>
            <a href="#rsvp" className={buttonClass('default', 'lg')}>
              Confirmar asistencia
            </a>
            <a href="#detalles" className={buttonClass('outline', 'lg')}>
              Ver detalles
              <ArrowDown aria-hidden="true" />
            </a>
          </div>
        </div>

        {photoUrl && (
          <div className="relative animate-[fadeUp_0.8s_0.2s_ease_both]">
            <div className="rounded-[calc(var(--radius)+8px)] border border-(--border) bg-(--card) p-2 shadow-xl">
              <img
                src={photoUrl}
                alt={`${couple.names[0]} y ${couple.names[1]}`}
                className="aspect-[4/5] w-full rounded-(--radius) object-cover"
              />
            </div>
            {couple.footerDateLabel && (
              <div className="absolute -bottom-5 left-5 rounded-(--radius) border border-(--border) bg-(--background) px-4 py-3 shadow-lg">
                <p className="text-xs text-(--muted-foreground)">Guarda la fecha</p>
                <p className="font-geist-mono text-sm font-medium">{couple.footerDateLabel}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
