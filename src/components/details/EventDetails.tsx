import { SectionHeading } from '../shared/SectionHeading';
import { Reveal } from '../shared/Reveal';
import { DetailCard } from './DetailCard';
import type { DetailCardData } from '../../types/wedding';

interface EventDetailsProps {
  details: DetailCardData[];
  eyebrow?: string;
  title?: string;
}

export function EventDetails({ details, eyebrow = 'La ceremonia', title = 'Detalles del día' }: EventDetailsProps) {
  return (
    <section className="max-w-[920px] mx-auto text-center py-[100px] px-10">
      <Reveal>
        <SectionHeading eyebrow={eyebrow} title={title} />
        <div className="grid grid-cols-3 gap-10 mt-[60px] max-[640px]:grid-cols-1">
          {details.map((detail) => (
            <DetailCard key={detail.title} detail={detail} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
