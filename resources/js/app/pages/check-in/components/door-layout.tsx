import { DoorOpenIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import EventPage from '@/components/event-page';
import type { Door } from '@/types/check-in';

/** Frame of the door pages: what event this is and how many people have arrived. Made for a phone held at the door. */
export function DoorLayout({ door, children }: { door: Door; children: ReactNode }) {
    const { summary } = door;

    return (
        <EventPage
            headTitle={`Registro de llegadas — ${door.title}`}
            eyebrow="Registro de llegadas"
            title={door.title}
            icon={<DoorOpenIcon />}
            summary={
                door.is_open && (
                    <dl className="mt-5 grid grid-cols-2 gap-3">
                        <Counter label="Personas" arrived={summary.arrived_seats} total={summary.seats} />
                        <Counter label="Pases" arrived={summary.arrived_guests} total={summary.guests} />
                    </dl>
                )
            }
        >
            {children}
        </EventPage>
    );
}

function Counter({ label, arrived, total }: { label: string; arrived: number; total: number }) {
    const percent = total > 0 ? Math.min(100, Math.round((arrived / total) * 100)) : 0;

    return (
        <div className="rounded-lg border border-primary-foreground/15 bg-primary-foreground/10 px-3 py-2.5">
            <dt className="text-xs text-primary-foreground/70">{label}</dt>
            <dd className="mt-0.5">
                <span className="text-2xl font-semibold tabular-nums">{arrived}</span>
                <span className="text-sm text-primary-foreground/70"> de {total}</span>
                <span className="mt-2 block h-1 overflow-hidden rounded-full bg-primary-foreground/20" aria-hidden>
                    <span className="block h-full rounded-full bg-primary-foreground transition-[width]" style={{ width: `${percent}%` }} />
                </span>
            </dd>
        </div>
    );
}
