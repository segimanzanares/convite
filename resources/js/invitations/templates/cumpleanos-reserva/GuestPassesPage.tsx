import { EventGuestPasses } from '../../components/print-card/EventPrintPages';
import type { BirthdayContent } from '../../types/invitation';
import './theme.css';
import './print.css';

export function GuestPassesPage({ invitation }: { invitation: BirthdayContent }) {
  return <EventGuestPasses invitation={invitation} themeClassName="theme-cumpleanos-reserva" />;
}

export default GuestPassesPage;
