import { DirectionsIcon } from '../shared/DirectionsIcon';
import { buttonClass, CARD_CLASS, CHIP_CLASS } from '../shared/styles';
import type { Venue } from '../../types/wedding';

interface VenueCardProps {
  venue: Venue;
}

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <div
      className={[
        'group relative',
        CARD_CLASS,
        'overflow-hidden transition-[box-shadow,transform] duration-[400ms] ease',
        'hover:shadow-[0_16px_50px_color-mix(in_srgb,var(--color-gold)_18%,transparent)] hover:-translate-y-[3px]',
        "before:content-[''] before:block before:h-0.5 before:bg-[linear-gradient(to_right,transparent,var(--color-gold),transparent)] before:opacity-60",
      ].join(' ')}
    >
      {venue.image && (
        <div className="relative w-full h-[260px] overflow-hidden bg-off-white after:content-[''] after:absolute after:inset-0 after:border after:border-gold/18 after:pointer-events-none">
          <img
            src={venue.image}
            alt={venue.imageAlt ?? venue.name}
            loading="lazy"
            className="w-full h-full object-cover block transition-transform duration-[600ms] ease group-hover:scale-[1.03]"
          />
        </div>
      )}
      {venue.mapEmbedUrl && (
        <div className="relative w-full h-[240px] overflow-hidden bg-off-white after:content-[''] after:absolute after:inset-0 after:border after:border-gold/18 after:pointer-events-none after:z-[1]">
          <iframe
            src={venue.mapEmbedUrl}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            title={venue.mapTitle}
            className="w-full h-full border-none block [filter:sepia(30%)_contrast(0.92)_brightness(1.04)] transition-[filter] duration-[400ms] ease group-hover:[filter:sepia(10%)_contrast(0.95)_brightness(1.06)]"
          />
        </div>
      )}
      <div className="pt-7 px-8 pb-8 text-center">
        <p className="font-display text-[9px] tracking-[0.55em] text-gold uppercase flex items-center gap-2.5 mb-3 after:content-[''] after:flex-1 after:h-px after:bg-[linear-gradient(to_right,color-mix(in_srgb,var(--color-gold)_40%,transparent),transparent)]">
          {venue.icon} {venue.tag}
        </p>
        <h3 className="font-script text-[34px] text-gold-deep leading-[1.1] mb-2.5">{venue.name}</h3>
        <p className="text-[14px] font-light leading-[1.75] text-[var(--text-muted)] italic mb-[18px]">
          {venue.addressLines.map((line, index) => (
            <span key={`${index}-${line}`}>
              {line}
              {index < venue.addressLines.length - 1 && <br />}
            </span>
          ))}
        </p>
        <div className={CHIP_CLASS}>{venue.time}</div>
        {venue.directionsUrl && (
          <div className="mt-6">
            <a className={buttonClass('outline')} href={venue.directionsUrl} target="_blank" rel="noopener noreferrer">
              <DirectionsIcon />
              Cómo llegar
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
