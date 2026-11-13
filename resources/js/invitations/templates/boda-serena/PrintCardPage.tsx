import { PrintCard } from '../../components/print-card/PrintCard';
import { initials, toCouple } from '../../lib/eventContent';
import type { WeddingContent } from '../../types/invitation';
import './theme.css';
import './print.css';

export function PrintCardPage({ invitation }: { invitation: WeddingContent }) {
  const couple = toCouple(invitation);
  const { dressCode } = invitation;

  return (
    <PrintCard
      themeClassName="theme-boda-serena"
      documentTitle={`Tarjeta — ${couple.names[0]} & ${couple.names[1]}`}
      front={{
        eyebrow: 'Nos casamos',
        names: couple.names,
        subtitle: 'y queremos celebrarlo contigo',
        message:
          invitation.message ||
          'Nos conocimos sin buscarnos y, desde entonces, elegimos caminar juntos cada día. Sería un honor que nos acompañaras a celebrar nuestro «sí».',
        dateLabel: couple.dateLabel,
        place: invitation.venues[0]?.addressLines.at(-1),
        signature: couple.families,
      }}
      back={{
        monogram: initials(...couple.names),
        events: invitation.venues.map((venue) => ({
          label: venue.tag,
          title: venue.name,
          lines: venue.addressLines,
          time: venue.time,
        })),
        dressCode: dressCode
          ? {
              title: dressCode.type,
              note: dressCode.reservedColor
                ? `Un favor: el color ${dressCode.reservedColor.name} ${dressCode.reservedColor.description}`
                : undefined,
              swatches: invitation.swatches,
            }
          : undefined,
        rsvpDeadlineLabel: couple.rsvpDeadlineLabel,
      }}
    />
  );
}

export default PrintCardPage;
