import type { ReactNode } from 'react';
import { Clock, MapPin, Navigation } from 'lucide-react';
import { Reveal } from '../shared/Reveal';
import { Badge, Card, Section } from '../ui/primitives';
import { buttonClass, cn } from '../ui/styles';
import type { ProgramItem, Venue } from '../../types/wedding';

/*
 * Sections shared by the gender reveal templates, built on shadcn/ui's tokens. Each template passes its own heading
 * (its fonts and texts) and the classes of its display font; the colors come from its theme.css, which also declares
 * the tokens of the two teams: --girl, --girl-soft, --girl-foreground, --boy, --boy-soft and --boy-foreground.
 */

interface SharedSectionProps {
  /** The template's own section heading. */
  heading: ReactNode;
  /** Classes of the template's display font, for the card titles. */
  titleClassName?: string;
  className?: string;
}

function VenueCard({ venue, titleClassName }: { venue: Venue; titleClassName?: string }) {
  const media = venue.image ? (
    <img src={venue.image} alt={venue.imageAlt ?? venue.name} loading="lazy" className="absolute inset-0 size-full object-cover" />
  ) : venue.mapEmbedUrl ? (
    <iframe
      src={venue.mapEmbedUrl}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      title={venue.mapTitle}
      className="absolute inset-0 size-full border-0"
    />
  ) : null;

  return (
    <Card className="flex flex-col overflow-hidden">
      {media && <div className="relative aspect-[16/10] bg-(--secondary)">{media}</div>}
      <div className="flex flex-1 flex-col p-6">
        <Badge className="w-fit">
          {venue.icon && <span aria-hidden="true">{venue.icon}</span>}
          {venue.tag}
        </Badge>
        <h3 className={cn('mt-3 text-2xl leading-tight', titleClassName)}>{venue.name}</h3>
        <div className="mt-3 grid gap-2 text-sm text-(--muted-foreground)">
          {venue.time && (
            <p className="flex items-center gap-2">
              <Clock className="size-4 shrink-0 text-(--primary)" aria-hidden="true" />
              <span className="font-semibold text-(--foreground)">{venue.time}</span>
            </p>
          )}
          {venue.addressLines.length > 0 && (
            <p className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-(--primary)" aria-hidden="true" />
              <span>
                {venue.addressLines.map((line, index) => (
                  <span key={`${index}-${line}`} className="block">
                    {line}
                  </span>
                ))}
              </span>
            </p>
          )}
        </div>
        {venue.directionsUrl && (
          <a
            href={venue.directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonClass('secondary', 'default', 'mt-auto self-start rounded-full max-sm:mt-5 sm:mt-6')}
          >
            <Navigation aria-hidden="true" />
            Cómo llegar
          </a>
        )}
      </div>
    </Card>
  );
}

/** The venues as cards: the photo (or the map) on top, the tag as a badge and the details below. */
export function VenuesSection({ venues, heading, titleClassName, className }: SharedSectionProps & { venues: Venue[] }) {
  return (
    <Section className={className}>
      {heading}
      <Reveal className={cn('mx-auto grid max-w-4xl gap-5', venues.length > 1 && 'sm:grid-cols-2')}>
        {venues.map((venue) => (
          <VenueCard key={`${venue.tag}-${venue.name}`} venue={venue} titleClassName={titleClassName} />
        ))}
      </Reveal>
    </Section>
  );
}

interface ProgramSectionProps extends SharedSectionProps {
  items: ProgramItem[];
  /** Emoji of the moments without an icon. */
  fallbackIcon: string;
}

/**
 * The program as a timeline: each moment on a card, its emoji in a bubble that alternates the teams' colors and its
 * time as a badge.
 */
export function ProgramSection({ items, heading, titleClassName, className, fallbackIcon }: ProgramSectionProps) {
  return (
    <Section className={className}>
      {heading}
      <Reveal>
        <ol className="relative mx-auto grid max-w-2xl gap-4 before:absolute before:top-6 before:bottom-6 before:left-6 before:w-0.5 before:bg-[linear-gradient(var(--girl),var(--boy))] before:opacity-40 sm:before:left-7">
          {items.map((item, index) => (
            <li key={`${item.time}-${item.title}`} className="relative flex gap-4 sm:gap-5">
              <span
                className={cn(
                  'relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full text-2xl ring-4 ring-(--background) sm:size-14',
                  index % 2 === 0 ? 'bg-(--girl-soft)' : 'bg-(--boy-soft)',
                )}
                aria-hidden="true"
              >
                {item.icon || fallbackIcon}
              </span>
              <Card className="flex-1 p-5">
                <p className="text-sm font-bold text-(--primary) tabular-nums">{item.time}</p>
                <h3 className={cn('mt-1 text-xl', titleClassName)}>{item.title}</h3>
                {item.description && <p className="mt-1 text-sm leading-relaxed text-(--muted-foreground)">{item.description}</p>}
              </Card>
            </li>
          ))}
        </ol>
      </Reveal>
    </Section>
  );
}
