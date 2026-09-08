import { SectionHeading } from '../shared/SectionHeading';
import { Reveal } from '../shared/Reveal';
import { DetailCard } from './DetailCard';
import type { DetailCardData } from '../../types/wedding';

interface EventDetailsProps {
  details: DetailCardData[];
}

export function EventDetails({ details }: EventDetailsProps) {
  return (
    <section className="max-w-[920px] mx-auto text-center py-[100px] px-10">
      <Reveal>
        <SectionHeading eyebrow="La ceremonia" title="Detalles del día" />
        <div className="grid grid-cols-3 gap-10 mt-[60px] max-[640px]:grid-cols-1">
          {details.map((detail) => (
            <DetailCard key={detail.title} detail={detail} />
          ))}
        </div>
      </Reveal>
    </section>
  );
}
