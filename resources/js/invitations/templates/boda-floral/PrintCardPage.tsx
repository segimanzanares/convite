import { PrintCard } from '../../components/print-card/PrintCard';
import { initials, toCouple } from '../../lib/eventContent';
import type { WeddingContent } from '../../types/invitation';
import './theme.css';

export function PrintCardPage({ invitation }: { invitation: WeddingContent }) {
  const couple = toCouple(invitation);
  const { dressCode } = invitation;

  return (
    <PrintCard
      themeClassName="theme-boda-floral"
      documentTitle={`Tarjeta — ${couple.names[0]} & ${couple.names[1]}`}
      front={{
        eyebrow: 'Con gran alegría anunciamos',
        names: couple.names,
        subtitle: 'Nos casamos',
        message:
          invitation.message ||
          'Junto a nuestras familias, tenemos el honor y la dicha de invitarles a compartir con nosotros el momento más especial de nuestras vidas.',
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
              title: `Vestimenta ${dressCode.type}`,
              note: dressCode.reservedColor
                ? `El color ${dressCode.reservedColor.name} ${dressCode.reservedColor.description}`
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
