import { EventGuestPasses } from '../../components/print-card/EventPrintPages';
import type { BirthdayContent } from '../../types/invitation';
import './theme.css';
import './print.css';

export function GuestPassesPage({ invitation }: { invitation: BirthdayContent }) {
  return <EventGuestPasses invitation={invitation} themeClassName="theme-infantil-dino" />;
}

export default GuestPassesPage;
