import { EventPrintCard } from '../../components/print-card/EventPrintPages';
import type { BaptismContent } from '../../types/invitation';
import './theme.css';

export function PrintCardPage({ invitation }: { invitation: BaptismContent }) {
  return <EventPrintCard invitation={invitation} themeClassName="theme-bautizo-olivo" />;
}

export default PrintCardPage;
