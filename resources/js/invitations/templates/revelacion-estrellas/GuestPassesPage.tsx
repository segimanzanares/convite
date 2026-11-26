import { EventGuestPasses } from '../../components/print-card/EventPrintPages';
import type { GenderRevealContent } from '../../types/invitation';
import './theme.css';
import './print.css';

export function GuestPassesPage({ invitation }: { invitation: GenderRevealContent }) {
  return <EventGuestPasses invitation={invitation} themeClassName="theme-revelacion-estrellas" />;
}

export default GuestPassesPage;
