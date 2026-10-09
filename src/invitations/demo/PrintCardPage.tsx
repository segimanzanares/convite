import { PrintCard } from '../../components/print-card/PrintCard';
import { COUPLE, DRESS_CODE_SWATCHES, EVENT_DETAILS } from './data';
import './theme.css';

const [ceremony, reception, dressCode] = EVENT_DETAILS;

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
        place: 'Puerto Escondido, Oaxaca',
        signature: COUPLE.families,
      }}
      back={{
        monogram: `${COUPLE.names[0].charAt(0)}${COUPLE.names[1].charAt(0)}`,
        events: [ceremony, reception],
        dressCode: { title: dressCode.title, note: dressCode.note, swatches: DRESS_CODE_SWATCHES },
        rsvpDeadlineLabel: COUPLE.rsvpDeadlineLabel,
      }}
    />
  );
}

export default PrintCardPage;
