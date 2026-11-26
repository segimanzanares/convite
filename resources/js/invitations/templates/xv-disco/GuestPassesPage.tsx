import { GuestPasses } from '../../components/print-card/GuestPasses';
import { toCelebrant } from '../../lib/eventContent';
import type { XvContent } from '../../types/invitation';
import './theme.css';
import './print.css';

const SAMPLE_GUESTS = `Familia Hernández Ruiz, 4, 3
Sofía Martínez y acompañante, 2, 5
Carlos Gutiérrez, 1, 5
Familia Ramírez Ortega, 5, 2
Valeria y Andrea Castillo, 2, 7
Abuela Carmen, 1, 1`;

export function GuestPassesPage({ invitation }: { invitation: XvContent }) {
  const celebrant = toCelebrant(invitation);

  return (
    <GuestPasses
      themeClassName="theme-xv-disco"
      documentTitle={`Pases — XV años de ${celebrant.name}`}
      // The first name: the full one does not fit the pass in Unbounded
      names={[celebrant.firstName]}
      eyebrow="Pase VIP · Mis XV años"
      dateLabel={celebrant.footerDateLabel}
      // One list per invitation: several invitations may share this template
      storageKey={`convite:guest-passes:${window.location.pathname}`}
      sampleGuests={SAMPLE_GUESTS}
    />
  );
}

export default GuestPassesPage;
