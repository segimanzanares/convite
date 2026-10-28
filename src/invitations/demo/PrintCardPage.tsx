import { PrintCard } from '../../components/print-card/PrintCard';
import { COUPLE, DRESS_CODE, DRESS_CODE_SWATCHES, VENUES } from './data';
import './theme.css';

export function PrintCardPage() {
  return (
    <PrintCard
      themeClassName="theme-demo"
      documentTitle={`Tarjeta — ${COUPLE.names[0]} & ${COUPLE.names[1]}`}
      front={{
        eyebrow: 'Con gran alegría anunciamos',
        names: COUPLE.names,
        subtitle: 'Nos casamos',
        message:
          'Junto a nuestras familias, tenemos el honor y la dicha de invitarles a compartir con nosotros el momento más especial de nuestras vidas.',
        dateLabel: COUPLE.dateLabel,
        place: 'Villa del Mar',
        signature: COUPLE.families,
      }}
      back={{
        monogram: `${COUPLE.names[0].charAt(0)}${COUPLE.names[1].charAt(0)}`,
        events: VENUES.map((venue) => ({
          label: venue.tag,
          title: venue.name,
          lines: venue.addressLines,
          time: venue.time,
        })),
        dressCode: {
          title: `Vestimenta ${DRESS_CODE.type}`,
          note: DRESS_CODE.reservedColor && `El color ${DRESS_CODE.reservedColor.name} ${DRESS_CODE.reservedColor.description}`,
          swatches: DRESS_CODE_SWATCHES,
        },
        rsvpDeadlineLabel: COUPLE.rsvpDeadlineLabel,
      }}
    />
  );
}

export default PrintCardPage;
