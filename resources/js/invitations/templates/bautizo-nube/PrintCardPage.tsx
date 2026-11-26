import { EventPrintCard } from '../../components/print-card/EventPrintPages';
import type { BaptismContent } from '../../types/invitation';
import './theme.css';
import './print.css';

export function PrintCardPage({ invitation }: { invitation: BaptismContent }) {
  return <EventPrintCard invitation={invitation} themeClassName="theme-bautizo-nube" />;
}

export default PrintCardPage;
