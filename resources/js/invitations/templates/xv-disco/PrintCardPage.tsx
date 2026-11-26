import { PrintCard } from '../../components/print-card/PrintCard';
import { initials, toCelebrant } from '../../lib/eventContent';
import type { XvContent } from '../../types/invitation';
import './theme.css';
import './print.css';

export function PrintCardPage({ invitation }: { invitation: XvContent }) {
  const celebrant = toCelebrant(invitation);
  const { dressCode } = invitation;

  return (
    <PrintCard
      themeClassName="theme-xv-disco"
      documentTitle={`Tarjeta — XV años de ${celebrant.name}`}
      front={{
        eyebrow: 'Estás en la lista',
        names: [celebrant.name],
        subtitle: 'Mis XV años',
        message:
          invitation.message ||
          'Quince años se celebran una sola vez y quiero que suenen fuerte. Ven a bailarlos conmigo: esta noche la pista es nuestra.',
        dateLabel: celebrant.dateLabel,
        place: invitation.venues.at(-1)?.name,
        signature: celebrant.hosts,
      }}
      back={{
        monogram: invitation.monogram || initials(...celebrant.name.split(/\s+/).slice(0, 2)),
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
                : dressCode.description,
              swatches: invitation.swatches,
            }
          : undefined,
        rsvpDeadlineLabel: celebrant.rsvpDeadlineLabel,
      }}
    />
  );
}

export default PrintCardPage;
