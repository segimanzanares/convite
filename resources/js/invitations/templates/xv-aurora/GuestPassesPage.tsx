import { EventGuestPasses } from '../../components/print-card/EventPrintPages';
import type { XvContent } from '../../types/invitation';
import './theme.css';
import './print.css';

export function GuestPassesPage({ invitation }: { invitation: XvContent }) {
  return <EventGuestPasses invitation={invitation} themeClassName="theme-xv-aurora" />;
}

export default GuestPassesPage;
