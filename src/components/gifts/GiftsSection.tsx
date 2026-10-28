import { SectionHeading } from '../shared/SectionHeading';
import { Reveal } from '../shared/Reveal';
import { GiftCard } from './GiftCard';
import type { GiftOption } from '../../types/wedding';

interface GiftsSectionProps {
  gifts: GiftOption[];
  eyebrow?: string;
  title?: string;
  /** Paragraphs shown above the cards. */
  intro?: string[];
}

export function GiftsSection({
  gifts,
  eyebrow = 'Regalos',
  title = 'Sugerencia de regalos',
  intro = [
    'Su presencia y compañía siempre será nuestro mejor regalo.',
    'Sin embargo, si desean obsequiarnos algo más, pueden hacerlo a través de:',
  ],
}: GiftsSectionProps) {
  return (
    <section className="max-w-[920px] mx-auto text-center py-[100px] px-10 max-[640px]:px-6">
      <Reveal>
        <SectionHeading eyebrow={eyebrow} title={title} />
        <div className="max-w-[520px] mx-auto flex flex-col gap-5">
          {intro.map((paragraph) => (
            <p key={paragraph} className="text-[clamp(16px,2vw,19px)] font-light leading-[1.9] text-[var(--text-body)] italic">
              {paragraph}
            </p>
          ))}
        </div>
        <div
          className={`grid gap-8 mt-12 max-[680px]:grid-cols-1 ${gifts.length === 1 ? 'grid-cols-1 max-w-[440px] mx-auto' : 'grid-cols-2'}`}
        >
          {gifts.map((gift) => (
            <GiftCard key={gift.title} gift={gift} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
