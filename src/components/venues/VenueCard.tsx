import { DirectionsIcon } from '../shared/DirectionsIcon';
import type { Venue } from '../../types/wedding';

interface VenueCardProps {
  venue: Venue;
}

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <div
      className={[
        'group relative border border-gold/25 bg-[linear-gradient(160deg,var(--color-ivory),var(--color-cream))]',
        'overflow-hidden transition-[box-shadow,transform] duration-[400ms] ease',
        'hover:shadow-[0_16px_50px_rgba(201,168,76,0.13)] hover:-translate-y-[3px]',
        "before:content-[''] before:block before:h-0.5 before:bg-[linear-gradient(to_right,transparent,var(--color-gold),transparent)] before:opacity-60",
      ].join(' ')}
    >
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
      <div className="pt-7 px-8 pb-8 text-left">
        <p className="font-display text-[9px] tracking-[0.55em] text-gold uppercase flex items-center gap-2.5 mb-3 after:content-[''] after:flex-1 after:h-px after:bg-[linear-gradient(to_right,rgba(201,168,76,0.4),transparent)]">
          {venue.icon} {venue.tag}
        </p>
        <h3 className="font-script text-[34px] text-gold-deep leading-[1.1] mb-2.5">{venue.name}</h3>
        <p className="text-[14px] font-light leading-[1.75] text-[#5a4830] italic mb-[18px]">
          {venue.addressLines.map((line, index) => (
            <span key={`${index}-${line}`}>
              {line}
              {index < venue.addressLines.length - 1 && <br />}
            </span>
          ))}
        </p>
        <div className="inline-block font-display text-[10px] tracking-[0.35em] text-gold border border-gold/40 py-1.5 px-4 mb-[18px]">
          {venue.time}
        </div>
        <br />
        <a
          className="inline-flex items-center gap-2 font-display text-[9px] tracking-[0.4em] uppercase text-gold-deep no-underline border-b border-[rgba(160,120,48,0.3)] pb-0.5 transition-colors duration-200 hover:text-gold hover:border-gold [&_svg]:w-3 [&_svg]:h-3 [&_svg]:fill-current"
          href={venue.directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <DirectionsIcon />
          Cómo llegar
        </a>
      </div>
    </div>
  );
}
