import { EventGuestPasses } from '../../components/print-card/EventPrintPages';
import type { BaptismContent } from '../../types/invitation';
import './theme.css';
import './print.css';

export function GuestPassesPage({ invitation }: { invitation: BaptismContent }) {
  return <EventGuestPasses invitation={invitation} themeClassName="theme-bautizo-luz" />;
}

export default GuestPassesPage;
