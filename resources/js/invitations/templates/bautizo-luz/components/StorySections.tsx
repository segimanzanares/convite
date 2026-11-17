import { Reveal } from '../../../components/shared/Reveal';
import type { HonorGroup } from '../../../components/xv/HonorSection';
import { Card, Section } from '../../../components/ui/primitives';
import { cn } from '../../../components/ui/styles';
import type { XvStory } from '../../../types/invitation';
import { BaptismalWater, FlameDivider } from './LuzArt';
import { SectionTitle } from './ui';

/** The baby's letter as an editorial spread: the photo in an arch beside the opening, the paragraphs and the signature. */
export function StorySection({ story }: { story: XvStory }) {
  return (
    <Section id="historia">
      <SectionTitle eyebrow={story.eyebrow} title={story.title} />
      <Reveal className={cn('grid items-start gap-10', story.photo && 'md:grid-cols-[0.75fr_1.25fr] md:gap-14')}>
        {story.photo && (
          <div className="mx-auto aspect-[3/4] w-[min(300px,80%)] overflow-hidden rounded-t-full border border-(--border) bg-(--secondary) p-1.5 md:w-full">
            <img
              src={story.photo.src}
              alt={story.photo.alt}
              loading="lazy"
              className="size-full rounded-t-full object-cover"
              style={story.photo.position ? { objectPosition: story.photo.position } : undefined}
            />
          </div>
        )}
        <div>
          <p className="font-newsreader text-[clamp(28px,4vw,38px)] leading-tight font-light italic text-(--primary)">{story.opening}</p>
          <div className="mt-6 grid gap-5 text-[17px] leading-[1.8] text-(--muted-foreground)">
            {story.paragraphs.map((paragraph, index) => (
              <p
                key={paragraph}
                className={cn(
                  'text-pretty',
                  index === 0 &&
                    'first-letter:float-left first-letter:mt-1 first-letter:mr-2 first-letter:font-newsreader first-letter:text-[3.6em] first-letter:leading-[0.8] first-letter:text-(--foreground) first-letter:italic',
                )}
              >
                {paragraph}
              </p>
            ))}
          </div>
          <p className="mt-8 flex items-center gap-4 font-newsreader text-2xl italic">
            <span className="h-px w-12 bg-(--primary)" aria-hidden="true" />
            {story.signature}
          </p>
        </div>
      </Reveal>
    </Section>
  );
}

interface HonorSectionProps {
  parents: HonorGroup;
  godparents: HonorGroup[];
}

/** The parents and the godparents as the rows of a table: the role in small caps, the names in Newsreader. */
export function HonorSection({ parents, godparents }: HonorSectionProps) {
  const rows = [parents, ...godparents];

  return (
    <Section className="bg-(--muted)">
      <SectionTitle
        eyebrow="Mi familia"
        title="Quienes me presentan ante Dios"
        description="Mis papás y mis padrinos prometerán guiarme en la fe; acompáñalos con tu presencia y tus oraciones."
      />
      <Reveal>
        <Card className="divide-y divide-(--border)">
          {rows.map((group, index) => (
            <div key={group.role} className={cn('grid gap-2 px-6 py-6 sm:grid-cols-[220px_1fr] sm:items-baseline sm:gap-8 sm:px-10', index === 0 && 'bg-(--accent)/50')}>
              <p className="text-xs font-semibold tracking-[0.28em] text-(--primary) uppercase">{group.role}</p>
              <div className="flex flex-wrap gap-x-6 gap-y-1">
                {group.names.map((name) => (
                  <p key={name} className={cn('font-newsreader leading-snug italic', index === 0 ? 'text-[clamp(26px,3.6vw,34px)] font-light' : 'text-xl')}>
                    {name}
                  </p>
                ))}
              </div>
            </div>
          ))}
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

/** The last words at night, over the water of the font where the drops keep falling. */
export function ClosingSection({ message, signature, dateLabel }: ClosingSectionProps) {
  return (
    <section className="ui-dark relative overflow-hidden px-5 py-24 text-center sm:px-8 sm:py-32">
      <div className="luz-halo pointer-events-none absolute inset-0" aria-hidden="true" />
      <Reveal className="relative mx-auto max-w-2xl">
        <FlameDivider />
        <p className="mt-8 font-newsreader text-[clamp(24px,4vw,34px)] leading-snug font-light italic text-balance">{message}</p>
        <p className="mt-8 font-newsreader text-[clamp(38px,6vw,56px)] italic text-(--primary)">{signature}</p>
        {dateLabel && <p className="mt-2 text-sm font-semibold tracking-[0.3em] text-(--muted-foreground) tabular-nums">{dateLabel}</p>}
        <BaptismalWater className="mx-auto mt-10 w-[min(340px,86vw)]" />
      </Reveal>
    </section>
  );
}
