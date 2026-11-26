import { EventPrintCard } from '../../components/print-card/EventPrintPages';
import type { XvContent } from '../../types/invitation';
import './theme.css';
import './print.css';

export function PrintCardPage({ invitation }: { invitation: XvContent }) {
  return <EventPrintCard invitation={invitation} themeClassName="theme-xv-aurora" />;
}

export default PrintCardPage;
