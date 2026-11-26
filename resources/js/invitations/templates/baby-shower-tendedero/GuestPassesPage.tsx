import { EventGuestPasses } from '../../components/print-card/EventPrintPages';
import type { BabyShowerContent } from '../../types/invitation';
import './theme.css';
import './print.css';

export function GuestPassesPage({ invitation }: { invitation: BabyShowerContent }) {
  return <EventGuestPasses invitation={invitation} themeClassName="theme-baby-shower-tendedero" />;
}

export default GuestPassesPage;
