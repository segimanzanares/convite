export interface XvPhoto {
  src: string;
  alt: string;
  /** CSS object-position for the crop, e.g. "50% 20%" to keep a face in frame. Defaults to center. */
  position?: string;
}

interface ArchPhotoProps {
  photo: XvPhoto;
  className?: string;
  /** Load eagerly for above-the-fold photos such as the hero. */
  eager?: boolean;
}

/** A photo cropped to a garden-gate arch, with a double gold frame. */
export function ArchPhoto({ photo, className = '', eager = false }: ArchPhotoProps) {
  return (
    <div className={`relative aspect-[4/5] rounded-t-full p-[7px] border border-gold/60 bg-ivory shadow-[0_24px_50px_-28px_color-mix(in_srgb,var(--dark-from)_60%,transparent)] ${className}`}>
      <div className="relative w-full h-full rounded-t-full overflow-hidden bg-off-white">
        <img
          src={photo.src}
          alt={photo.alt}
          loading={eager ? 'eager' : 'lazy'}
          className="absolute inset-0 w-full h-full object-cover"
          style={photo.position ? { objectPosition: photo.position } : undefined}
        />
        <div className="absolute inset-[6px] rounded-t-full border border-ivory/50 pointer-events-none" aria-hidden="true" />
      </div>
    </div>
  );
}
