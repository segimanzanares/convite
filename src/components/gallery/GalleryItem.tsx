import type { GalleryImage } from '../../types/wedding';

interface GalleryItemProps {
  image: GalleryImage;
  index: number;
  onSelect: () => void;
}

function spanClasses(index: number) {
  if (index === 0) return 'col-span-2 row-span-2 aspect-[20/13]';
  if (index === 4) return 'col-span-2 aspect-[20/9]';
  return 'aspect-[4/3]';
}

export function GalleryItem({ image, index, onSelect }: GalleryItemProps) {
  return (
    <div
      className={`group relative overflow-hidden cursor-pointer bg-off-white ${spanClasses(index)}`}
      onClick={onSelect}
    >
      <img
        src={image.src}
        alt={image.alt}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover transition-[transform,filter] duration-[700ms] [transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)] [filter:sepia(15%)_brightness(0.97)] group-hover:scale-[1.06] group-hover:[filter:sepia(5%)_brightness(1.02)]"
      />
      <div className="absolute inset-[10px] border border-gold/0 transition-[border-color,inset] duration-[400ms] ease pointer-events-none z-[2] group-hover:border-gold/50 group-hover:inset-3" />
      <div className="absolute bottom-0 left-0 right-0 z-[3] bg-[linear-gradient(to_top,rgba(44,31,10,0.7)_0%,transparent_100%)] pt-[30px] px-5 pb-4 opacity-0 translate-y-1.5 transition-[opacity,transform] duration-[400ms] ease group-hover:opacity-100 group-hover:translate-y-0">
        <span className="font-display text-[9px] tracking-[0.4em] text-gold-light uppercase">{image.caption}</span>
      </div>
    </div>
  );
}
