import { useEffect, type ReactNode } from 'react';
import type { Door } from '@/types/check-in';

/** Frame of the door pages: what event this is and how many people have arrived. Made for a phone held at the door. */
export function DoorLayout({ door, children }: { door: Door; children: ReactNode }) {
    useEffect(() => {
        document.title = `Registro de llegadas — ${door.title}`;
    }, [door.title]);

    const { summary } = door;

    return (
        <main className="min-h-screen bg-cream text-ink font-jost">
            <header className="bg-primary text-ivory px-4 pt-6 pb-5">
                <div className="max-w-md mx-auto">
                    <p className="text-[11px] tracking-[0.3em] uppercase text-ivory/70">Registro de llegadas</p>
                    <h1 className="font-display text-xl mt-1">{door.title}</h1>
                    {door.is_open && (
                        <p className="mt-3 text-sm">
                            <span className="text-2xl font-medium">{summary.arrived_seats}</span> de {summary.seats} personas ·{' '}
                            {summary.arrived_guests} de {summary.guests} pases
                        </p>
                    )}
                </div>
            </header>
            <div className="max-w-md mx-auto px-4 py-6">{children}</div>
        </main>
    );
}
