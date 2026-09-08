import { SectionHeading } from '../shared/SectionHeading';
import { Reveal } from '../shared/Reveal';
import { VenueCard } from './VenueCard';
import type { Venue } from '../../types/wedding';

interface VenuesSectionProps {
  venues: Venue[];
}

export function VenuesSection({ venues }: VenuesSectionProps) {
  return (
    <div className="max-w-full py-[100px] px-10 bg-ivory text-center">
      <Reveal className="max-w-[1060px] mx-auto">
        <SectionHeading eyebrow="Cómo llegar" title="El Lugar" />
        <p className="text-[clamp(16px,2vw,19px)] font-light leading-[1.9] text-[#4a3820] italic max-w-[520px] mx-auto">
          Con todo nuestro amor, les compartimos los lugares donde celebraremos
          juntos este día tan especial.
        </p>
        <div className="grid grid-cols-2 gap-8 mt-[60px] max-[680px]:grid-cols-1">
          {venues.map((venue) => (
            <VenueCard key={venue.name} venue={venue} />
          ))}
        </div>
      </Reveal>
    </div>
  );
}
