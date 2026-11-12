import { SectionHeading } from '../shared/SectionHeading';
import { Reveal } from '../shared/Reveal';
import { VenueCard } from './VenueCard';
import type { Venue } from '../../types/wedding';

const GRID_COLUMNS: Record<number, string> = {
  1: 'grid-cols-1 max-w-[520px] mx-auto',
};

interface VenuesSectionProps {
  venues: Venue[];
  eyebrow?: string;
  title?: string;
  intro?: string;
}

export function VenuesSection({
  venues,
  eyebrow = 'La ceremonia',
  title = 'Detalles del día',
  intro = 'Con todo nuestro amor, les compartimos los lugares donde celebraremos juntos este día tan especial.',
}: VenuesSectionProps) {
  return (
    <div className="max-w-full py-[100px] px-10 bg-ivory text-center">
      <Reveal className="max-w-[1060px] mx-auto">
        <SectionHeading eyebrow={eyebrow} title={title} />
        <p className="text-[clamp(16px,2vw,19px)] font-light leading-[1.9] text-[var(--text-body)] italic max-w-[520px] mx-auto">
          {intro}
        </p>
        <div className={`grid gap-8 mt-[60px] max-[680px]:grid-cols-1 ${GRID_COLUMNS[venues.length] ?? 'grid-cols-2'}`}>
          {venues.map((venue) => (
            <VenueCard key={venue.name} venue={venue} />
          ))}
        </div>
      </Reveal>
    </div>
  );
}
