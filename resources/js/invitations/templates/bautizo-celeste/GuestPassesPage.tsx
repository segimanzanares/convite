import { EventGuestPasses } from '../../components/print-card/EventPrintPages';
import type { BaptismContent } from '../../types/invitation';
import './theme.css';

export function GuestPassesPage({ invitation }: { invitation: BaptismContent }) {
  return <EventGuestPasses invitation={invitation} themeClassName="theme-bautizo-celeste" />;
}

export default GuestPassesPage;
