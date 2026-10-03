import { SectionHeading } from '../shared/SectionHeading';
import { Reveal } from '../shared/Reveal';
import { VenueCard } from './VenueCard';
import type { Venue } from '../../types/wedding';

interface VenuesSectionProps {
  venues: Venue[];
  eyebrow?: string;
  title?: string;
  intro?: string;
}

export function VenuesSection({
  venues,
  eyebrow = 'Cómo llegar',
  title = 'El Lugar',
  intro = 'Con todo nuestro amor, les compartimos los lugares donde celebraremos juntos este día tan especial.',
}: VenuesSectionProps) {
  return (
    <div className="max-w-full py-[100px] px-10 bg-ivory text-center">
      <Reveal className="max-w-[1060px] mx-auto">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <p className="text-[clamp(16px,2vw,19px)] font-light leading-[1.9] text-[var(--text-body)] italic max-w-[520px] mx-auto">
          {intro}
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
