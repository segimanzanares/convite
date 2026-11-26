import { EventPrintCard } from '../../components/print-card/EventPrintPages';
import type { BirthdayContent } from '../../types/invitation';
import './theme.css';
import './print.css';

export function PrintCardPage({ invitation }: { invitation: BirthdayContent }) {
  return <EventPrintCard invitation={invitation} themeClassName="theme-infantil-dulce" />;
}

export default PrintCardPage;
