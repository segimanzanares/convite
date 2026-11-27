import { useState } from 'react';
import { Heart } from 'lucide-react';
import { Reveal } from '../../../components/shared/Reveal';
import type { HonorGroup } from '../../../components/xv/HonorSection';
import { Card, Section } from '../../../components/ui/primitives';
import { cn } from '../../../components/ui/styles';
import type { XvStory } from '../../../types/invitation';
import { Balloon, CloudPuffs, Rainbow } from './NubeArt';
import { Avatar, SectionTitle } from './ui';

/** The baby's letter on a card: the photo on top in a soft frame, then the opening, the paragraphs and the signature. */
export function StorySection({ story }: { story: XvStory }) {
  return (
    <Section id="historia" className="relative">
      <SectionTitle eyebrow={story.eyebrow} title={story.title} />
      <Reveal className="relative mx-auto max-w-2xl">
        <Balloon color="--sky" stripe="--card" className="absolute -top-10 -right-2 z-[1] w-12 sm:-right-12 sm:w-14" />
        <Card className="overflow-hidden">
          {story.photo && (
            <div className="relative aspect-[16/10] bg-(--secondary)">
              <img
                src={story.photo.src}
                alt={story.photo.alt}
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
                style={story.photo.position ? { objectPosition: story.photo.position } : undefined}
              />
            </div>
          )}
          <div className="p-7 sm:p-10">
            <p className="font-young-serif text-2xl text-(--primary) sm:text-3xl">{story.opening}</p>
            <div className="mt-5 grid gap-4 text-[17px] leading-relaxed text-(--muted-foreground)">
              {story.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-pretty">
                  {paragraph}
                </p>
              ))}
            </div>
            <p className="mt-8 flex items-center justify-end gap-2 font-young-serif text-xl">
              <Heart className="size-4 fill-(--blush) text-(--blush)" aria-hidden="true" />
              {story.signature}
            </p>
          </div>
        </Card>
      </Reveal>
    </Section>
  );
}

interface HonorSectionProps {
  parents: HonorGroup;
  godparents: HonorGroup[];
}

function PeopleCard({ group, offset = 0, featured = false }: { group: HonorGroup; offset?: number; featured?: boolean }) {
  return (
    <Card className={cn('text-center', featured ? 'p-8 sm:p-10' : 'p-6')}>
      <div className="flex justify-center -space-x-3">
        {group.names.map((name, index) => (
          <Avatar key={name} name={name} index={offset + index} className={featured ? 'size-14 text-base' : undefined} />
        ))}
      </div>
      <p className="mt-4 text-xs font-bold tracking-[0.18em] text-(--primary) uppercase">{group.role}</p>
      <div className="mt-2 grid gap-0.5">
        {group.names.map((name) => (
          <p key={name} className={cn('font-young-serif leading-snug', featured ? 'text-[clamp(22px,3.5vw,28px)]' : 'text-lg')}>
            {name}
          </p>
        ))}
      </div>
    </Card>
  );
}

/** The parents and the godparents as a shadcn/ui-like Tabs: one tab for each, the godparents' groups side by side. */
export function HonorSection({ parents, godparents }: HonorSectionProps) {
  const [tab, setTab] = useState<'parents' | 'godparents'>('parents');
  const tabs = [
    { value: 'parents' as const, label: parents.role },
    ...(godparents.length > 0 ? [{ value: 'godparents' as const, label: 'Mis padrinos' }] : []),
  ];

  return (
    <Section className="relative overflow-hidden bg-(--muted)">
      <SectionTitle
        eyebrow="Mi familia"
        title="Quienes me acompañan"
        description="Ellos me llevarán de la mano en este primer paso de fe, y nos encantaría que tú también estuvieras ahí."
      />
      <Reveal className="mx-auto max-w-3xl">
        {tabs.length > 1 && (
          <div role="tablist" aria-label="Papás y padrinos" className="mx-auto mb-6 grid w-full max-w-sm grid-cols-2 gap-1 rounded-full bg-(--secondary) p-1">
            {tabs.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                role="tab"
                id={`nube-tab-${value}`}
                aria-selected={tab === value}
                aria-controls={`nube-panel-${value}`}
                onClick={() => setTab(value)}
                className={cn(
                  'cursor-pointer rounded-full px-3 py-2 text-sm font-semibold transition-[background-color,color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-(--ring)/50',
                  tab === value ? 'bg-(--card) text-(--primary) shadow-sm' : 'text-(--muted-foreground) hover:text-(--foreground)',
                )}
              >
                {label}
              </button>
            ))}
          </div>
        )}
        <div role="tabpanel" id="nube-panel-parents" aria-labelledby="nube-tab-parents" hidden={tab !== 'parents'}>
          <PeopleCard group={parents} featured />
        </div>
        {godparents.length > 0 && (
          <div
            role="tabpanel"
            id="nube-panel-godparents"
            aria-labelledby="nube-tab-godparents"
            hidden={tab !== 'godparents'}
            className={cn('grid gap-4', godparents.length > 1 && 'sm:grid-cols-2')}
          >
            {godparents.map((group, index) => (
              <PeopleCard key={group.role} group={group} offset={index * 2 + 1} />
            ))}
          </div>
        )}
      </Reveal>
    </Section>
  );
}

interface ClosingSectionProps {
  message: string;
  signature: string;
  dateLabel: string;
}

/** A rainbow draws itself between two clouds over the last words. */
export function ClosingSection({ message, signature, dateLabel }: ClosingSectionProps) {
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,var(--background),var(--secondary))] px-5 py-24 text-center sm:px-8 sm:py-32">
      <CloudPuffs count={3} />
      <Reveal className="relative mx-auto max-w-2xl">
        <Rainbow className="mx-auto w-[min(260px,72vw)]" />
        <p className="mt-8 font-young-serif text-[clamp(22px,3.6vw,30px)] leading-snug text-balance">{message}</p>
        <p className="mt-8 font-young-serif text-[clamp(34px,6vw,48px)] text-(--primary)">{signature}</p>
        {dateLabel && <p className="mt-2 text-sm font-semibold tracking-[0.25em] text-(--muted-foreground) tabular-nums">{dateLabel}</p>}
      </Reveal>
    </section>
  );
}
