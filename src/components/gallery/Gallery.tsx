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

  return (
    <div className="max-w-full py-[100px] px-10 bg-[linear-gradient(160deg,var(--color-cream),var(--color-ivory),var(--color-cream))] border-t border-b border-gold/15 text-center">
      <Reveal className="max-w-[1100px] mx-auto">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <p className="text-[clamp(16px,2vw,19px)] font-light leading-[1.9] text-[var(--text-body)] italic max-w-[560px] mx-auto">
          {intro}
        </p>
        <div className="grid grid-cols-3 gap-3.5 mt-[60px] max-[700px]:grid-cols-2 max-[440px]:grid-cols-1">
          {images.map((image, index) => (
            <GalleryItem key={image.src} image={image} index={index} onSelect={() => open(index)} />
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
