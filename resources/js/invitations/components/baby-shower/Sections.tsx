import type { ComponentProps, ReactNode } from 'react';
import { Info, Shirt } from 'lucide-react';
import { GallerySection, GiftsSection as RevealGiftsSection } from '../gender-reveal/DetailSections';
import { VenuesSection } from '../gender-reveal/EventSections';
import { RsvpSection as RevealRsvpSection } from '../gender-reveal/RsvpSection';
import { Reveal } from '../shared/Reveal';
import { Card, Section } from '../ui/primitives';
import { cn } from '../ui/styles';
import type { HonorGroup } from '../xv/HonorSection';
import { initials } from '../../lib/eventContent';
import type { DiaperSize } from '../../types/invitation';
import type { DressCodeData, ProgramItem } from '../../types/wedding';

/*
 * Sections shared by the baby shower templates, built on shadcn/ui's tokens only: each template passes its own heading
 * (its fonts and texts) and the classes of its display font, and its theme.css sets the colors. The two pastel tones
 * that alternate in the lists are --secondary and --accent. The venues, the gallery, the gifts and the RSVP are the
 * gender reveal's, whose look does not depend on the teams' tokens (the gifts get their colors here).
 */

export { GallerySection, VenuesSection };

interface SharedSectionProps {
  /** The template's own section heading. */
  heading: ReactNode;
  /** Classes of the template's display font, for the card titles. */
  titleClassName?: string;
  className?: string;
}

/** The two pastel tones, alternating along a list. */
function tone(index: number): string {
  return index % 2 === 0 ? 'bg-(--secondary) text-(--secondary-foreground)' : 'bg-(--accent) text-(--accent-foreground)';
}

interface ProgramSectionProps extends SharedSectionProps {
  items: ProgramItem[];
  /** Emoji of the moments without an icon. */
  fallbackIcon: string;
}

/** The program as a timeline: each moment on a card, its emoji in a bubble of alternating tones and its time on top. */
export function ProgramSection({ items, heading, titleClassName, className, fallbackIcon }: ProgramSectionProps) {
  return (
    <Section className={className}>
      {heading}
      <Reveal>
        <ol className="relative mx-auto grid max-w-2xl gap-4 before:absolute before:top-6 before:bottom-6 before:left-6 before:w-0 before:border-l-2 before:border-dashed before:border-(--border) sm:before:left-7">
          {items.map((item, index) => (
            <li key={`${item.time}-${item.title}`} className="relative flex gap-4 sm:gap-5">
              <span
                className={cn('relative z-10 flex size-12 shrink-0 items-center justify-center rounded-full text-2xl ring-4 ring-(--background) sm:size-14', tone(index))}
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

/** Who hosts the party as cards, each group with its people as avatars of alternating tones. */
export function HostsSection({ groups, heading, titleClassName, className }: SharedSectionProps & { groups: HonorGroup[] }) {
  return (
    <Section className={className}>
      {heading}
      <Reveal className={cn('mx-auto grid max-w-3xl gap-4', groups.length > 1 && 'sm:grid-cols-2')}>
        {groups.map((group, groupIndex) => (
          <Card key={group.role} className="p-6 text-center">
            <p className="text-xs font-bold tracking-[0.2em] text-(--muted-foreground) uppercase">{group.role}</p>
            <ul className="mt-5 grid gap-3">
              {group.names.map((name, index) => (
                <li key={name} className="flex items-center gap-3 rounded-[calc(var(--radius)-6px)] bg-(--muted) px-3 py-2.5 text-left">
                  <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-full text-xs font-bold', tone(groupIndex + index))} aria-hidden="true">
                    {initials(...name.split(/\s+/).slice(0, 2))}
                  </span>
                  <span className={cn('text-lg leading-tight', titleClassName)}>{name}</span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </Reveal>
    </Section>
  );
}

/** A folded diaper with its tabs, drawn in currentColor. */
function DiaperIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 40" className={className} aria-hidden="true">
      <path d="M4 8 H44 V14 C 44 28, 34 36, 24 36 C 14 36, 4 28, 4 14 Z" fill="currentColor" opacity="0.18" />
      <path d="M4 8 H44 V14 C 44 28, 34 36, 24 36 C 14 36, 4 28, 4 14 Z" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M4 8 H12 V16 H4 M44 8 H36 V16 H44" fill="currentColor" />
      <path d="M17 20 Q 24 25 31 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

interface DiapersSectionProps extends SharedSectionProps {
  diapers: { note: string | null; sizes: DiaperSize[] };
}

/** The "lluvia de pañales": the note and a card per size, saying which guests bring it. */
export function DiapersSection({ diapers, heading, titleClassName, className }: DiapersSectionProps) {
  const { note, sizes } = diapers;

  return (
    <Section className={className}>
      {heading}
      <Reveal className="mx-auto max-w-3xl">
        {note && <p className="mx-auto mb-8 max-w-xl text-center leading-relaxed text-pretty text-(--muted-foreground)">{note}</p>}
        {sizes.length > 0 && (
          <ul className={cn('grid gap-3', sizes.length > 1 && 'sm:grid-cols-2', sizes.length > 2 && 'lg:grid-cols-3')}>
            {sizes.map((size, index) => (
              <li key={`${size.label}-${index}`}>
                <Card className="flex h-full items-center gap-4 p-5">
                  <span className={cn('flex size-14 shrink-0 items-center justify-center rounded-full', tone(index))}>
                    <DiaperIcon className="w-8" />
                  </span>
                  <div>
                    <p className={cn('text-xl leading-tight', titleClassName)}>{size.label}</p>
                    {size.note && <p className="mt-0.5 text-sm text-(--muted-foreground)">{size.note}</p>}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </Reveal>
    </Section>
  );
}

/** The attire on one card: the type, a tile per look and the reserved color. */
export function DressCodeSection({ dressCode, heading, titleClassName, className }: SharedSectionProps & { dressCode: DressCodeData }) {
  const looks = [
    { emoji: '👗', label: 'Ellas', value: dressCode.women },
    { emoji: '👔', label: 'Ellos', value: dressCode.men },
  ].filter((look): look is { emoji: string; label: string; value: string } => Boolean(look.value));

  return (
    <Section className={className}>
      {heading}
      <Reveal className="mx-auto max-w-2xl">
        <Card className="p-7 text-center sm:p-10">
          <span className="mx-auto flex size-12 items-center justify-center rounded-full bg-(--secondary) text-(--secondary-foreground)">
            <Shirt className="size-5" aria-hidden="true" />
          </span>
          <p className={cn('mt-4 text-[clamp(30px,5vw,42px)] leading-none', titleClassName)}>{dressCode.type}</p>
          {dressCode.description && <p className="mx-auto mt-4 max-w-md leading-relaxed text-(--muted-foreground)">{dressCode.description}</p>}
          {looks.length > 0 && (
            <dl className={cn('mt-8 grid gap-3 text-left', looks.length > 1 && 'sm:grid-cols-2')}>
              {looks.map((look) => (
                <div key={look.label} className="flex items-center gap-3 rounded-[calc(var(--radius)-6px)] bg-(--muted) px-4 py-3">
                  <span className="text-2xl" aria-hidden="true">
                    {look.emoji}
                  </span>
                  <div>
                    <dt className="text-xs font-semibold text-(--muted-foreground)">{look.label}</dt>
                    <dd className="font-semibold">{look.value}</dd>
                  </div>
                </div>
              ))}
            </dl>
          )}
          {dressCode.reservedColor && (
            <div role="note" className="mt-4 flex gap-3 rounded-[calc(var(--radius)-6px)] bg-(--accent) p-4 text-left text-sm text-(--accent-foreground)">
              <Info className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
              <p className="leading-relaxed">
                {dressCode.reservedColor.hex && (
                  <span className="mr-1.5 inline-block size-3 rounded-full border border-current/30 align-[-1px]" style={{ backgroundColor: dressCode.reservedColor.hex }} />
                )}
                <strong className="font-bold">{dressCode.reservedColor.name}</strong> {dressCode.reservedColor.description}
              </p>
            </div>
          )}
        </Card>
      </Reveal>
    </Section>
  );
}

const GIFT_COLORS = {
  bank: 'bg-(--secondary) text-(--secondary-foreground)',
  registry: 'bg-(--accent) text-(--accent-foreground)',
  envelope: 'bg-(--muted) text-(--primary)',
};

/** The gift options as cards, with icons in the template's pastel tones. */
export function GiftsSection(props: Omit<ComponentProps<typeof RevealGiftsSection>, 'iconColors'>) {
  return <RevealGiftsSection {...props} iconColors={GIFT_COLORS} />;
}

/** The RSVP on one card, thanking the guests for coming to the baby shower. */
export function RsvpSection(props: Omit<ComponentProps<typeof RevealRsvpSection>, 'doneMessages'>) {
  return (
    <RevealRsvpSection
      {...props}
      doneMessages={{ yes: '¡Nos vemos en el baby shower!', no: 'Te vamos a extrañar; te mandaremos fotos del bebé en cuanto llegue.' }}
    />
  );
}
