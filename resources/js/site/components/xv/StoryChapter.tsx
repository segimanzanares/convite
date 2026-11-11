import { SectionHeading } from '../shared/SectionHeading';
import { Reveal } from '../shared/Reveal';
import { ArchPhoto, type XvPhoto } from './ArchPhoto';

interface StoryChapterProps {
  id?: string;
  eyebrow: string;
  title: string;
  /** Script line that opens the letter, e.g. "Érase una vez…". */
  opening: string;
  /** The first paragraph gets a storybook drop cap. */
  paragraphs: string[];
  signature: string;
  /** Optional portrait shown at the top of the letter, inside its arch. */
  photo?: XvPhoto;
}

/** A storybook-style letter from the celebrant, with a drop cap and a script signature. */
export function StoryChapter({ id, eyebrow, title, opening, paragraphs, signature, photo }: StoryChapterProps) {
  return (
    <section id={id} className="scroll-mt-16 max-w-[860px] mx-auto text-center py-[100px] px-6 sm:px-10">
      <Reveal>
        <SectionHeading eyebrow={eyebrow} title={title} />
        <article className={`relative mt-12 bg-[linear-gradient(160deg,var(--color-ivory),var(--color-cream))] border border-gold/30 rounded-t-[999px] ${photo ? 'pt-[clamp(28px,6vw,44px)]' : 'pt-[clamp(70px,14vw,110px)]'} pb-14 px-[clamp(24px,7vw,64px)] shadow-[0_20px_50px_-30px_color-mix(in_srgb,var(--dark-from)_45%,transparent)]`}>
          <div className="absolute inset-[8px] rounded-t-[999px] border border-gold/15 pointer-events-none" aria-hidden="true" />
          {/* The photo's arch sits concentric-ish inside the card's arch, so it never touches the curve. */}
          {photo && <ArchPhoto photo={photo} className="w-[min(260px,68%)] mx-auto mb-10" />}
          <p className="font-script text-[clamp(36px,8vw,50px)] text-gold-deep leading-none mb-8">{opening}</p>
          <div className="text-left flex flex-col gap-5 max-w-[560px] mx-auto">
            {paragraphs.map((paragraph, index) => (
              <p
                key={paragraph}
                className={[
                  'text-[clamp(16px,2vw,19px)] font-light leading-[1.9] text-[var(--text-body)]',
                  index === 0
                    ? 'first-letter:font-display first-letter:text-[3.4em] first-letter:leading-[0.8] first-letter:float-left first-letter:mr-2 first-letter:mt-1.5 first-letter:text-gold'
                    : '',
                ].join(' ')}
              >
                {paragraph}
              </p>
            ))}
          </div>
          <div className="flex items-center justify-center gap-3 mt-10" aria-hidden="true">
            <span className="h-px w-12 bg-gold/40" />
            <span className="text-gold text-sm">❦</span>
            <span className="h-px w-12 bg-gold/40" />
          </div>
          <p className="font-script text-[clamp(30px,6vw,38px)] text-gold-deep mt-4">{signature}</p>
        </article>
      </Reveal>
    </section>
  );
}
