import { EventPrintCard } from '../../components/print-card/EventPrintPages';
import type { GenderRevealContent } from '../../types/invitation';
import './theme.css';
import './print.css';

export function PrintCardPage({ invitation }: { invitation: GenderRevealContent }) {
  return <EventPrintCard invitation={invitation} themeClassName="theme-revelacion-globos" />;
}

export default PrintCardPage;
