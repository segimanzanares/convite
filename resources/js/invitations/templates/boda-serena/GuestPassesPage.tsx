import { GuestPasses } from '../../components/print-card/GuestPasses';
import { toCouple } from '../../lib/eventContent';
import type { WeddingContent } from '../../types/invitation';
import './theme.css';
import './print.css';

const SAMPLE_GUESTS = `Familia Domínguez Vela, 4, 2
Andrea Salinas y acompañante, 2, 6
Rodrigo Peña, 1, 6
Familia Cervantes Ruiz, 3, 4
Paola y Diego Montes, 2, 1
Tía Rosario, 1, 1`;

export function GuestPassesPage({ invitation }: { invitation: WeddingContent }) {
  const couple = toCouple(invitation);

  return (
    <GuestPasses
      themeClassName="theme-boda-serena"
      documentTitle={`Pases — ${couple.names[0]} & ${couple.names[1]}`}
      names={couple.names}
      eyebrow="Tu lugar en nuestra boda"
      dateLabel={couple.footerDateLabel}
      // One list per invitation: several invitations may share this template
      storageKey={`convite:guest-passes:${window.location.pathname}`}
      sampleGuests={SAMPLE_GUESTS}
    />
  );
}

export default GuestPassesPage;
