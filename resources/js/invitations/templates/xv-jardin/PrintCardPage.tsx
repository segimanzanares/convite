import { EventPrintCard } from '../../components/print-card/EventPrintPages';
import type { XvContent } from '../../types/invitation';
import './theme.css';

export function PrintCardPage({ invitation }: { invitation: XvContent }) {
  return <EventPrintCard invitation={invitation} themeClassName="theme-xv-jardin" />;
}

export default PrintCardPage;
