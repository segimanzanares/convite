import { EventPrintCard } from '../../components/print-card/EventPrintPages';
import type { BabyShowerContent } from '../../types/invitation';
import './theme.css';
import './print.css';

export function PrintCardPage({ invitation }: { invitation: BabyShowerContent }) {
  return <EventPrintCard invitation={invitation} themeClassName="theme-baby-shower-patito" />;
}

export default PrintCardPage;
