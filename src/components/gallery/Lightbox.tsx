import type { GalleryImage } from '../../types/wedding';

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (direction: 1 | -1) => void;
}

export function Lightbox({ images, currentIndex, isOpen, onClose, onNavigate }: LightboxProps) {
  const current = images[currentIndex];

  return (
    <div
      className={[
        'fixed inset-0 bg-[rgba(20,12,4,0.96)] z-[9000] flex items-center justify-center',
        'transition-opacity duration-[400ms] ease',
        isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
      ].join(' ')}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="fixed top-7 right-9 font-display text-[11px] tracking-[0.4em] text-gold cursor-pointer opacity-70 transition-opacity duration-200 uppercase z-[9001] hover:opacity-100" onClick={onClose}>
        ✕ &nbsp;Cerrar
      </div>
      <span
        className="fixed top-1/2 -translate-y-1/2 left-5 text-[20px] text-gold cursor-pointer opacity-50 transition-opacity duration-200 z-[9001] select-none p-5 hover:opacity-100"
        onClick={() => onNavigate(-1)}
      >
        &#8592;
      </span>
      <span
        className="fixed top-1/2 -translate-y-1/2 right-5 text-[20px] text-gold cursor-pointer opacity-50 transition-opacity duration-200 z-[9001] select-none p-5 hover:opacity-100"
        onClick={() => onNavigate(1)}
      >
        &#8594;
      </span>
      <div className="relative max-w-[88vw] max-h-[88vh] flex items-center justify-center">
        <div className="absolute w-6 h-6 border-gold opacity-50 -top-2 -left-2 border-t border-l" />
        <div className="absolute w-6 h-6 border-gold opacity-50 -top-2 -right-2 border-t border-r" />
        <div className="absolute w-6 h-6 border-gold opacity-50 -bottom-2 -left-2 border-b border-l" />
        <div className="absolute w-6 h-6 border-gold opacity-50 -bottom-2 -right-2 border-b border-r" />
        {current && (
          <img
            src={current.src}
            alt={current.alt}
            className={[
              'max-w-[88vw] max-h-[80vh] object-contain border border-gold/25',
              'shadow-[0_0_80px_rgba(0,0,0,0.6)]',
              'transition-transform duration-[400ms] [transition-timing-function:cubic-bezier(0.25,0.46,0.45,0.94)]',
              isOpen ? 'scale-100' : 'scale-[0.92]',
            ].join(' ')}
          />
        )}
      </div>
      <div className="fixed bottom-[30px] left-1/2 -translate-x-1/2 font-display text-[9px] tracking-[0.5em] text-gold opacity-50">
        {currentIndex + 1} · {images.length}
      </div>
    </div>
  );
}
