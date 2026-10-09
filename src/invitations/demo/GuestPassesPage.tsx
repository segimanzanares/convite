import { GuestPasses } from '../../components/print-card/GuestPasses';
import { COUPLE } from './data';
import './theme.css';

const SAMPLE_GUESTS = `Familia Hernández Ruiz, 4, 3
Sofía Martínez y acompañante, 2, 5
Carlos Gutiérrez, 1, 5
Familia Ramírez Ortega, 5, 2
Lucía y Fernando Castillo, 2, 7
Abuela Carmen, 1, 1`;

export function GuestPassesPage() {
  return (
    <GuestPasses
      themeClassName="theme-demo"
      documentTitle={`Pases — ${COUPLE.names[0]} & ${COUPLE.names[1]}`}
      names={COUPLE.names}
      dateLabel={COUPLE.footerDateLabel}
      storageKey="convite:demo:guest-passes"
      sampleGuests={SAMPLE_GUESTS}
    />
  );
}

export default GuestPassesPage;
