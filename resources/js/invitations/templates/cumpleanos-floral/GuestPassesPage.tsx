import { EventGuestPasses } from '../../components/print-card/EventPrintPages';
import type { BirthdayContent } from '../../types/invitation';
import './theme.css';

export function GuestPassesPage({ invitation }: { invitation: BirthdayContent }) {
  return <EventGuestPasses invitation={invitation} themeClassName="theme-cumpleanos-floral" />;
}

export default GuestPassesPage;
