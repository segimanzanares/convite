import { useRef, useState } from 'react';
import { SectionHeading } from '../shared/SectionHeading';
import { Reveal } from '../shared/Reveal';
import { GalleryItem } from './GalleryItem';
import { Lightbox } from './Lightbox';
import { useLightbox } from '../../hooks/useLightbox';
import type { GalleryImage } from '../../types/wedding';

interface GalleryProps {
  images: GalleryImage[];
  eyebrow?: string;
  title?: string;
  intro?: string;
}

export function Gallery({
  images,
  eyebrow = 'Momentos juntos',
  title = 'Nuestra Historia',
  intro = 'Cada imagen guarda un instante, cada instante una promesa de eternidad.',
}: GalleryProps) {
  const { isOpen, currentIndex, open, close, navigate } = useLightbox(images.length);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  // On mobile the grid becomes a scroll-snap carousel; track the slide closest to the center.
  const handleScroll = () => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.scrollLeft + track.clientWidth / 2;
    let closest = 0;
    let closestDistance = Infinity;
    Array.from(track.children).forEach((child, index) => {
      const el = child as HTMLElement;
      const distance = Math.abs(el.offsetLeft + el.offsetWidth / 2 - center);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = index;
      }
    });
    setActiveSlide(closest);
  };

  const goToSlide = (index: number) => {
    const track = trackRef.current;
    const slide = track?.children[index] as HTMLElement | undefined;
    if (!track || !slide) return;
    track.scrollTo({
      left: slide.offsetLeft - (track.clientWidth - slide.offsetWidth) / 2,
      behavior: 'smooth',
    });
  };

  return (
    <div className="max-w-full py-[100px] px-10 bg-[linear-gradient(160deg,var(--color-cream),var(--color-ivory),var(--color-cream))] border-t border-b border-gold/15 text-center">
      <Reveal className="max-w-[1100px] mx-auto">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <p className="text-[clamp(16px,2vw,19px)] font-light leading-[1.9] text-[var(--text-body)] italic max-w-[560px] mx-auto">
          {intro}
        </p>
        <div
          ref={trackRef}
          onScroll={handleScroll}
          className="grid grid-cols-3 gap-3.5 mt-[60px] max-[700px]:relative max-[700px]:flex max-[700px]:overflow-x-auto max-[700px]:snap-x max-[700px]:snap-mandatory max-[700px]:-mx-10 max-[700px]:px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((image, index) => (
            <GalleryItem
              key={image.src}
              image={image}
              index={index}
              onSelect={() => open(index)}
              className="max-[700px]:shrink-0 max-[700px]:basis-[85%] max-[700px]:snap-center"
            />
          ))}
        </div>
        <div className="hidden max-[700px]:flex justify-center gap-2 mt-6">
          {images.map((image, index) => (
            <button
              key={image.src}
              type="button"
              aria-label={`Ver foto ${index + 1}`}
              aria-current={index === activeSlide}
              onClick={() => goToSlide(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                index === activeSlide ? 'w-5 bg-gold' : 'w-1.5 bg-gold/30'
              }`}
            />
          ))}
        </div>
      </Reveal>

      <Lightbox
        images={images}
        currentIndex={currentIndex}
        isOpen={isOpen}
        onClose={close}
        onNavigate={navigate}
      />
    </div>
  );
}
