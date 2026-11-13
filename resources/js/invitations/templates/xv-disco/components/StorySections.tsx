import { Disc3 } from 'lucide-react';
import { Reveal } from '../../../components/shared/Reveal';
import type { HonorGroup } from '../../../components/xv/HonorSection';
import type { XvPhoto } from '../../../components/xv/ArchPhoto';
import { Badge, Card, Section } from '../../../components/ui/primitives';
import { cn } from '../../../components/ui/styles';
import { useScrollReveal } from '../../../hooks/useScrollReveal';
import type { XvStory } from '../../../types/invitation';
import { Equalizer, FloatingNotes } from './DiscoArt';
import { SectionTitle } from './ui';

/** The photo as an album sleeve, with the record sliding out of it and spinning once it comes into view. */
function AlbumSleeve({ photo, monogram }: { photo: XvPhoto | null; monogram: string }) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>(0.3);

  return (
    <div className="mx-auto w-[min(86vw,420px)]">
      <div ref={ref} className="relative aspect-square w-[70%]">
        <div className={cn('disco-vinyl absolute inset-[5%]', isVisible ? 'translate-x-[40%]' : 'translate-x-0')} aria-hidden="true">
          <div className="disco-vinyl-disc relative size-full rounded-full bg-[repeating-radial-gradient(circle,oklch(0.17_0.01_300)_0_2px,oklch(0.27_0.015_300)_2px_3.5px)] shadow-[0_10px_40px_-10px_black,0_0_28px_-8px_var(--neon-cyan)] ring-1 ring-white/20">
            <span className="absolute inset-0 rounded-full bg-[conic-gradient(from_30deg,transparent_0_15%,oklch(1_0_0/0.12)_20%,transparent_25%_65%,oklch(1_0_0/0.1)_70%,transparent_75%)]" />
            <span className="absolute inset-[33%] flex items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--neon-pink),var(--neon-violet))] font-unbounded text-[clamp(12px,3vw,18px)] font-extrabold text-(--primary-foreground)">
              {monogram}
            </span>
            <span className="absolute top-1/2 left-1/2 size-2.5 -translate-1/2 rounded-full bg-(--background)" />
          </div>
        </div>
        <div className="disco-neon-frame relative z-[1] size-full overflow-hidden rounded-[calc(var(--radius)-2px)] p-1">
          {photo ? (
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              className="size-full rounded-[calc(var(--radius)-6px)] object-cover"
              style={photo.position ? { objectPosition: photo.position } : undefined}
            />
          ) : (
            <span className="flex size-full items-center justify-center rounded-[calc(var(--radius)-6px)] bg-(--secondary) font-unbounded text-7xl font-extrabold disco-gradient-text">
              XV
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/** The celebrant's letter as the liner notes of a record: the sleeve with the vinyl, and "side A" with the text. */
export function StorySection({ story, monogram }: { story: XvStory; monogram: string }) {
  return (
    <Section>
      <SectionTitle eyebrow={story.eyebrow} title={story.title} />
      <Reveal className="grid items-center gap-12 md:grid-cols-2">
        <AlbumSleeve photo={story.photo} monogram={monogram} />
        <div>
          <Badge className="border-transparent bg-(--accent) font-semibold text-(--accent-foreground)">
            <Disc3 aria-hidden="true" />
            Lado A
          </Badge>
          <p className="mt-5 font-unbounded text-2xl font-semibold disco-gradient-text sm:text-3xl">{story.opening}</p>
          <div className="mt-6 grid gap-4 text-[17px] leading-relaxed text-(--muted-foreground)">
            {story.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-pretty">
                {paragraph}
              </p>
            ))}
          </div>
          <p className="mt-8 font-unbounded text-lg font-semibold">{story.signature}</p>
        </div>
      </Reveal>
    </Section>
  );
}

interface HonorSectionProps {
  parents: HonorGroup;
  godparents: HonorGroup[];
}

/** The parents and godparents as the line-up of a festival poster: the parents headline, the godparents follow. */
export function HonorSection({ parents, godparents }: HonorSectionProps) {
  return (
    <Section className="bg-(--surface)">
      <SectionTitle
        eyebrow="El line-up"
        title="Quienes hacen posible mi noche"
        description="Con la bendición de Dios y el amor de mi familia, te invito a celebrar conmigo."
      />
      <Reveal className="mx-auto max-w-3xl">
        <Card className="disco-neon-frame px-6 py-10 text-center sm:px-12">
          <p className="text-xs font-semibold tracking-[0.4em] text-(--accent-foreground) uppercase">{parents.role}</p>
          <div className="mt-5 grid gap-2">
            {parents.names.map((name, index) => (
              <p key={name} className="font-unbounded text-[clamp(20px,4.2vw,34px)] leading-tight font-semibold uppercase">
                {index > 0 && (
                  <span className="mb-2 block text-base text-(--primary) disco-glow" aria-hidden="true">
                    ★
                  </span>
                )}
                {name}
              </p>
            ))}
          </div>
          {godparents.length > 0 && (
            <>
              <Equalizer bars={18} className="my-8 h-6 opacity-70" />
              <dl className={cn('grid gap-6', godparents.length > 1 && 'sm:grid-cols-2')}>
                {godparents.map((group) => (
                  <div key={group.role}>
                    <dt className="text-xs font-semibold tracking-[0.3em] text-(--primary) uppercase">{group.role}</dt>
                    {group.names.map((name) => (
                      <dd key={name} className="mt-1.5 font-unbounded text-sm font-semibold uppercase sm:text-base">
                        {name}
                      </dd>
                    ))}
                  </div>
                ))}
              </dl>
            </>
          )}
        </Card>
      </Reveal>
    </Section>
  );
}

interface ClosingSectionProps {
  message: string;
  signature: string;
  dateLabel: string;
}

/** A humming neon sign, the last words and the signature, with music notes rising. */
export function ClosingSection({ message, signature, dateLabel }: ClosingSectionProps) {
  return (
    <section className="relative overflow-hidden px-5 py-24 text-center sm:px-8 sm:py-32">
      <FloatingNotes />
      <Reveal className="relative mx-auto max-w-2xl">
        <p className="disco-neon-sign inline-block rounded-[calc(var(--radius)+6px)] border-2 border-(--neon-pink) px-6 py-4 font-unbounded text-[clamp(22px,5vw,38px)] leading-tight font-semibold text-(--neon-pink) uppercase shadow-[0_0_18px_var(--neon-pink),inset_0_0_18px_color-mix(in_oklch,var(--neon-pink)_50%,transparent)] disco-glow">
          Nos vemos
          <span className="block text-(--neon-cyan) disco-glow-cyan">en la pista</span>
        </p>
        <p className="mt-10 text-[clamp(18px,3vw,22px)] leading-relaxed text-pretty text-(--muted-foreground)">{message}</p>
        <p className="mt-8 font-unbounded text-[clamp(28px,5vw,40px)] font-semibold disco-gradient-text">{signature}</p>
        {dateLabel && <p className="mt-2 text-sm tracking-[0.3em] text-(--muted-foreground) tabular-nums">{dateLabel}</p>}
      </Reveal>
    </section>
  );
}
