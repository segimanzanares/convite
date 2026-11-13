import { SectionHeading } from '../shared/SectionHeading';
import { Reveal } from '../shared/Reveal';
import { Lightbox } from './Lightbox';
import { useCoverflow } from '../../hooks/useCoverflow';
import type { GalleryImage } from '../../types/wedding';

interface StoryGalleryProps {
  images: GalleryImage[];
  eyebrow?: string;
  title?: string;
  intro?: string;
  /** Milliseconds between automatic slide changes while the gallery is on screen; 0 turns autoplay off. */
  autoplayMs?: number;
}

const pad = (n: number) => String(n).padStart(2, '0');

function ArrowIcon({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      {direction === 'left' ? <path d="M19 12H5m6-6-6 6 6 6" /> : <path d="M5 12h14m-6-6 6 6-6 6" />}
    </svg>
  );
}

/**
 * Coverflow-style carousel: one large framed portrait in the middle, its
 * neighbours smaller, lower and softly blurred on each side. Navigates with
 * the arrow buttons, the dots, swipes and the keyboard, and advances on its
 * own while visible.
 */
export function StoryGallery({
  images,
  eyebrow = 'Fragmentos de mi historia',
  title = 'Mis momentos favoritos',
  intro,
  autoplayMs = 4500,
}: StoryGalleryProps) {
  const count = images.length;
  const { active, setActive, go, stageProps, slide, lightbox } = useCoverflow(count, autoplayMs);

  return (
    <section className="relative overflow-hidden max-w-full pt-[100px] pb-20 sm:pb-[110px] px-0 text-center bg-[radial-gradient(ellipse_at_50%_60%,var(--color-ivory),var(--color-gold-pale))] border-y border-gold/15">
      <Reveal className="px-6">
        <SectionHeading eyebrow={eyebrow} title={title} />
        {intro && (
          <p className="text-[clamp(16px,2vw,19px)] font-light leading-[1.9] text-[var(--text-body)] italic max-w-[560px] mx-auto">
            {intro}
          </p>
        )}
      </Reveal>

      <Reveal className="relative max-w-[1150px] mx-auto mt-6">
        <div
          {...stageProps}
          className="relative h-[520px] sm:h-[635px] overflow-hidden outline-none sm:[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] touch-pan-y select-none [--step:min(228px,58vw)] [--step-far:min(400px,100vw)] sm:[--step:345px] sm:[--step-far:605px] focus-visible:outline focus-visible:outline-1 focus-visible:outline-gold/50"
        >
          {images.map((image, index) => {
            const { style, isActive, isNear, onClick } = slide(index);
            return (
              <figure
                key={image.src}
                onClick={onClick}
                aria-hidden={!isActive}
                className={[
                  'absolute left-1/2 top-5 sm:top-8 m-0 w-[min(265px,69vw)] h-[445px] sm:w-[365px] sm:h-[540px]',
                  'border-[6px] sm:border-[9px] border-ivory outline outline-1 outline-gold/50',
                  'bg-off-white shadow-[0_23px_50px_color-mix(in_srgb,var(--dark-from)_18%,transparent)]',
                  'transition-[transform,opacity,filter] duration-[850ms] [transition-timing-function:cubic-bezier(0.19,1,0.22,1)]',
                  isNear ? 'cursor-pointer' : 'pointer-events-none',
                  isActive ? 'cursor-zoom-in' : '',
                ].join(' ')}
                style={style}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  draggable={false}
                  className="w-full h-full object-cover"
                />
                <figcaption className="absolute inset-x-0 bottom-0 pt-7 pb-3.5 px-2.5 bg-[linear-gradient(transparent,color-mix(in_srgb,var(--dark-from)_70%,transparent))] text-ivory font-body italic text-[20px] sm:text-[23px] tracking-[0.02em]">
                  {image.caption}
                </figcaption>
              </figure>
            );
          })}
        </div>

        <div className="max-w-[325px] sm:max-w-[510px] mx-auto px-4 flex items-center justify-between gap-3 sm:gap-8">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Fotografía anterior"
            className="w-[43px] h-[43px] sm:w-[52px] sm:h-[52px] shrink-0 rounded-full border border-gold text-gold-deep flex items-center justify-center transition-[background-color,color,transform] duration-300 hover:bg-gold-deep hover:text-ivory hover:scale-[1.07]"
          >
            <ArrowIcon direction="left" />
          </button>

          <div className="min-w-[120px] sm:min-w-[190px] text-center" aria-live="polite">
            <span className="font-body font-medium text-[20px] sm:text-[23px] text-gold-deep">
              {pad(active + 1)}
              <span className="text-gold px-2.5" aria-hidden="true">/</span>
              <span className="sr-only"> de </span>
              {pad(count)}
            </span>
            <div className="w-[105px] sm:w-[145px] h-[2px] mx-auto my-2.5 bg-off-white" aria-hidden="true">
              <span
                className="block h-full bg-gold-deep transition-[width] duration-500"
                style={{ width: `${((active + 1) / count) * 100}%` }}
              />
            </div>
            <p className="font-display text-[7px] sm:text-[8px] tracking-[0.21em] text-[var(--text-muted)] uppercase">
              Desliza para ver más
            </p>
          </div>

          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Fotografía siguiente"
            className="w-[43px] h-[43px] sm:w-[52px] sm:h-[52px] shrink-0 rounded-full border border-gold text-gold-deep flex items-center justify-center transition-[background-color,color,transform] duration-300 hover:bg-gold-deep hover:text-ivory hover:scale-[1.07]"
          >
            <ArrowIcon direction="right" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-6" role="group" aria-label="Seleccionar fotografía">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              onClick={() => setActive(index)}
              aria-label={`Ver foto ${index + 1}`}
              aria-current={index === active}
              className={[
                'w-[7px] h-[7px] rounded-full border border-gold/70 p-0 transition-[background-color,transform] duration-200',
                index === active ? 'bg-gold scale-[1.35]' : 'bg-transparent',
              ].join(' ')}
            />
          ))}
        </div>
      </Reveal>

      <Lightbox
        images={images}
        currentIndex={lightbox.currentIndex}
        isOpen={lightbox.isOpen}
        onClose={lightbox.close}
        onNavigate={lightbox.navigate}
      />
    </section>
  );
}
