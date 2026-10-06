import { SectionHeading } from '../shared/SectionHeading';
import { Reveal } from '../shared/Reveal';
import { ProgramTimelineItem } from './ProgramTimelineItem';
import type { ProgramItem } from '../../types/wedding';

interface ProgramTimelineProps {
  items: ProgramItem[];
  eyebrow?: string;
  title?: string;
  intro?: string;
}

export function ProgramTimeline({
  items,
  eyebrow = 'Itinerario',
  title = 'Programa',
  intro,
}: ProgramTimelineProps) {
  return (
    <section className="max-w-full py-[100px] px-10 max-[640px]:px-6 bg-[linear-gradient(160deg,var(--color-cream),var(--color-ivory),var(--color-cream))] border-t border-b border-gold/15 text-center">
      <div className="max-w-[920px] mx-auto">
        <Reveal>
          <SectionHeading eyebrow={eyebrow} title={title} />
          {intro && (
            <p className="text-[clamp(16px,2vw,19px)] font-light leading-[1.9] text-[var(--text-body)] italic max-w-[560px] mx-auto">
              {intro}
            </p>
          )}
        </Reveal>
        <ol
          className={[
            'relative mt-[60px] list-none p-0 text-left',
            "before:content-[''] before:absolute before:top-0 before:bottom-0 before:w-px before:left-[22px] min-[641px]:before:left-1/2",
            'before:bg-[linear-gradient(to_bottom,transparent,var(--color-gold)_6%,var(--color-gold)_94%,transparent)] before:opacity-50',
          ].join(' ')}
        >
          {items.map((item, index) => (
            <ProgramTimelineItem
              key={`${item.time}-${item.title}`}
              item={item}
              side={index % 2 === 0 ? 'left' : 'right'}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
