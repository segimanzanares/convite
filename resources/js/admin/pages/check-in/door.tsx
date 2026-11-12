import { useMemo, useState } from 'react';
import { usePage, usePoll } from '@inertiajs/react';
import { CheckInCard } from './components/check-in-card';
import { DoorLayout } from './components/door-layout';
import { formatDoorTime, peopleLabel } from '@/lib/check-in';
import type { CheckInGuest, DoorPageProps } from '@/types/check-in';

/** How often the counter and the list refresh, since several phones may be checking guests in at once. */
const REFRESH_MS = 15_000;

/**
  * The door link lands here: how to scan passes, the arrivals so far, and a search by name for guests without their
  * pass. Outside the check-in window it says when the door opens.
  */
export function DoorPage() {
    const { door, guests } = usePage<DoorPageProps>().props;

    if (!door.is_open || guests === null) {
        return (
            <DoorLayout door={door}>
                <p className="bg-ivory border border-primary/15 p-5 leading-relaxed">
                    {door.opens_at && door.closes_at
                        ? `El registro de llegadas funciona del ${formatDoorTime(door.opens_at)} al ${formatDoorTime(door.closes_at)}. Abran este mismo enlace en ese horario.`
                        : 'El registro de llegadas se abre cuando el evento tenga fecha.'}
                </p>
            </DoorLayout>
        );
    }

    return (
        <DoorLayout door={door}>
            <OpenDoor guests={guests} />
        </DoorLayout>
    );
}

function OpenDoor({ guests }: { guests: CheckInGuest[] }) {
    const [search, setSearch] = useState('');
    const [selectedId, setSelectedId] = useState<number | null>(null);

    usePoll(REFRESH_MS, { only: ['door', 'guests'] }, { mode: 'rest', background: 'pause' });

    const term = search.trim().toLocaleLowerCase('es');
    const matches = useMemo(
        () => (term.length < 2 ? [] : guests.filter((guest) => guest.name.toLocaleLowerCase('es').includes(term)).slice(0, 20)),
        [guests, term],
    );
    const selected = guests.find((guest) => guest.id === selectedId) ?? null;

    return (
        <>
            <p className="text-sm leading-relaxed text-ink/80">
                Escaneen el código QR de cada pase con la cámara del celular: se abre la pantalla para registrar su llegada. Si
                alguien olvidó su pase, búsquenlo aquí.
            </p>

            <label className="mt-5 block">
                <span className="sr-only">Buscar invitado por nombre</span>
                <input
                    type="search"
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value);
                        setSelectedId(null);
                    }}
                    placeholder="Buscar por nombre"
                    className="w-full border border-primary/30 bg-ivory px-4 py-3 text-base"
                />
            </label>

            {selected ? (
                <div className="mt-5">
                    <CheckInCard key={selected.id} guest={selected} />
                    <button type="button" onClick={() => setSelectedId(null)} className="mt-3 w-full py-2 text-sm text-primary underline">
                        Volver a los resultados
                    </button>
                </div>
            ) : (
                term.length >= 2 && (
                    <ul className="mt-4 divide-y divide-primary/10 bg-ivory border border-primary/15">
                        {matches.length === 0 && <li className="px-4 py-3 text-sm text-ink/60">Nadie coincide con la búsqueda.</li>}
                        {matches.map((guest) => (
                            <li key={guest.id}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedId(guest.id)}
                                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                                >
                                    <span>
                                        {guest.name}
                                        <span className="block text-xs text-ink/60">
                                            {peopleLabel(guest.seats)} · Mesa {guest.table_label ?? '—'}
                                        </span>
                                    </span>
                                    {guest.checked_in_at && (
                                        <span className="shrink-0 text-xs text-primary">
                                            Llegó {guest.checked_in_seats}/{guest.seats}
                                        </span>
                                    )}
                                </button>
                            </li>
                        ))}
                    </ul>
                )
            )}
        </>
    );
}

export default DoorPage;
