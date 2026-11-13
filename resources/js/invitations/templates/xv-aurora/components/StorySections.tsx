import { Quote } from 'lucide-react';
import { FlyingButterfly } from '../../../components/floral/pieces';
import { Reveal } from '../../../components/shared/Reveal';
import type { HonorGroup } from '../../../components/xv/HonorSection';
import { Card, Section } from '../../../components/ui/primitives';
import { cn } from '../../../components/ui/styles';
import type { XvStory } from '../../../types/invitation';
import { BloomingRose, RibbonDivider, Tiara } from './AuroraArt';
import { AuroraSky, Avatar, SectionTitle } from './ui';

/** The celebrant's letter on a card: the photo on one side, and on the other the opening, the paragraphs and the signature. */
export function StorySection({ story }: { story: XvStory }) {
  return (
    <Section id="historia" className="relative">
      <SectionTitle eyebrow={story.eyebrow} title={story.title} />
      <Reveal className="relative">
        <FlyingButterfly className="absolute -top-12 right-[6%] z-[1] w-14" />
        <Card className={cn('mx-auto grid max-w-4xl overflow-hidden', story.photo && 'md:grid-cols-[0.85fr_1.15fr]')}>
          {story.photo && (
            <div className="relative min-h-[320px] bg-(--secondary)">
              <img
                src={story.photo.src}
                alt={story.photo.alt}
                loading="lazy"
                className="absolute inset-0 size-full object-cover"
                style={story.photo.position ? { objectPosition: story.photo.position } : undefined}
              />
              <div className="absolute inset-0 bg-[linear-gradient(to_top,oklch(0.3_0.12_293/0.35),transparent_50%)]" aria-hidden="true" />
            </div>
          )}
          <div className="p-7 sm:p-10">
            <p className="font-bodoni text-3xl italic text-(--primary) sm:text-4xl">{story.opening}</p>
            <div className="mt-6 grid gap-4 text-[17px] leading-relaxed text-(--muted-foreground)">
              {story.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-pretty">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-8 flex items-center gap-3">
              <span className="h-px flex-1 bg-[linear-gradient(to_right,var(--aurora-pink),transparent)]" aria-hidden="true" />
              <p className="font-bodoni text-2xl italic">{story.signature}</p>
            </div>
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

/** The parents on a featured card with their avatars, and each group of godparents on a card of its own. */
export function HonorSection({ parents, godparents }: HonorSectionProps) {
  return (
    <Section className="relative overflow-hidden bg-(--muted)">
      <BloomingRose className="absolute top-10 -left-6 hidden w-28 opacity-80 sm:block lg:left-[6%]" />
      <BloomingRose flip delay={0.4} className="absolute top-24 -right-6 hidden w-24 opacity-70 sm:block lg:right-[6%]" />
      <SectionTitle
        eyebrow="Con todo mi amor"
        title="Las personas que me acompañan"
        description="Con la bendición de Dios y el cariño de mi familia, te invito a celebrar esta nueva etapa a mi lado."
      />
      <Reveal className="relative mx-auto max-w-3xl">
        <Card className="p-8 text-center sm:p-10">
          <p className="text-xs font-semibold tracking-[0.25em] text-(--primary) uppercase">{parents.role}</p>
          <div className="mt-5 flex justify-center -space-x-3">
            {parents.names.map((name) => (
              <Avatar key={name} name={name} className="size-14 text-base" />
            ))}
          </div>
          <div className="mt-5 grid gap-1">
            {parents.names.map((name) => (
              <p key={name} className="font-bodoni text-[clamp(26px,4vw,34px)] leading-tight italic">
                {name}
              </p>
            ))}
          </div>
        </Card>
        {godparents.length > 0 && (
          <div className={cn('mt-4 grid gap-4', godparents.length > 1 && 'sm:grid-cols-2')}>
            {godparents.map((group) => (
              <Card key={group.role} className="flex items-center gap-4 p-5">
                <div className="flex shrink-0 -space-x-3">
                  {group.names.slice(0, 2).map((name) => (
                    <Avatar key={name} name={name} className="size-10 text-xs" />
                  ))}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-(--accent-foreground)">{group.role}</p>
                  <p className="mt-0.5 text-sm leading-snug font-semibold">{group.names.join(' y ')}</p>
                </div>
              </Card>
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

/** A last quote over the auroras, between the tiara and the ribbon. */
export function ClosingSection({ message, signature, dateLabel }: ClosingSectionProps) {
  return (
    <section className="relative overflow-hidden px-5 py-24 text-center sm:px-8 sm:py-32">
      <AuroraSky count={3} />
      <Reveal className="relative mx-auto max-w-2xl">
        <Tiara className="mx-auto w-24" />
        <Quote className="mx-auto mt-6 size-8 text-(--aurora-pink)" aria-hidden="true" />
        <p className="mt-4 font-bodoni text-[clamp(24px,4vw,34px)] leading-snug italic text-balance">{message}</p>
        <p className="mt-8 font-bodoni text-[clamp(36px,6vw,52px)] italic aurora-text">{signature}</p>
        {dateLabel && <p className="mt-2 text-sm font-semibold tracking-[0.3em] text-(--muted-foreground) tabular-nums">{dateLabel}</p>}
        <RibbonDivider className="mt-10" />
      </Reveal>
    </section>
  );
}
