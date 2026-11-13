import { GuestPasses } from '../../components/print-card/GuestPasses';
import { toCouple } from '../../lib/eventContent';
import type { WeddingContent } from '../../types/invitation';
import './theme.css';

const SAMPLE_GUESTS = `Familia Hernández Ruiz, 4, 3
Sofía Martínez y acompañante, 2, 5
Carlos Gutiérrez, 1, 5
Familia Ramírez Ortega, 5, 2
Lucía y Fernando Castillo, 2, 7
Abuela Carmen, 1, 1`;

export function GuestPassesPage({ invitation }: { invitation: WeddingContent }) {
  const couple = toCouple(invitation);

  return (
    <GuestPasses
      themeClassName="theme-boda-floral"
      documentTitle={`Pases — ${couple.names[0]} & ${couple.names[1]}`}
      names={couple.names}
      dateLabel={couple.footerDateLabel}
      // One list per invitation: several invitations may share this template
      storageKey={`convite:guest-passes:${window.location.pathname}`}
      sampleGuests={SAMPLE_GUESTS}
    />
  );
}

export default GuestPassesPage;
