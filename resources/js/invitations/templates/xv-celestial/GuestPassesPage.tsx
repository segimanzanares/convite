import { EventGuestPasses } from '../../components/print-card/EventPrintPages';
import type { XvContent } from '../../types/invitation';
import './theme.css';

export function GuestPassesPage({ invitation }: { invitation: XvContent }) {
  return <EventGuestPasses invitation={invitation} themeClassName="theme-xv-celestial" />;
}

export default GuestPassesPage;
