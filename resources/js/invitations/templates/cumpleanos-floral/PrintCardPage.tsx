import { EventPrintCard } from '../../components/print-card/EventPrintPages';
import type { BirthdayContent } from '../../types/invitation';
import './theme.css';

export function PrintCardPage({ invitation }: { invitation: BirthdayContent }) {
  return <EventPrintCard invitation={invitation} themeClassName="theme-cumpleanos-floral" />;
}

export default PrintCardPage;
