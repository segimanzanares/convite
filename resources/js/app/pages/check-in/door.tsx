import { useMemo, useState } from 'react';
import { usePage, usePoll } from '@inertiajs/react';
import { ArrowLeftIcon, CalendarClockIcon, ChevronRightIcon, QrCodeIcon, SearchIcon } from 'lucide-react';
import { CheckInCard } from './components/check-in-card';
import { DoorLayout } from './components/door-layout';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
                <Alert className="bg-card">
                    <CalendarClockIcon />
                    <AlertTitle>El registro de llegadas está cerrado</AlertTitle>
                    <AlertDescription>
                        {door.opens_at && door.closes_at
                            ? `El registro de llegadas funciona del ${formatDoorTime(door.opens_at)} al ${formatDoorTime(door.closes_at)}. Abran este mismo enlace en ese horario.`
                            : 'El registro de llegadas se abre cuando el evento tenga fecha.'}
                    </AlertDescription>
                </Alert>
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
            <Alert className="bg-card">
                <QrCodeIcon />
                <AlertDescription>
                    Escaneen el código QR de cada pase con la cámara del celular: se abre la pantalla para registrar su llegada. Si
                    alguien olvidó su pase, búsquenlo aquí.
                </AlertDescription>
            </Alert>

            <label className="relative mt-5 block">
                <span className="sr-only">Buscar invitado por nombre</span>
                <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" aria-hidden />
                <Input
                    type="search"
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value);
                        setSelectedId(null);
                    }}
                    placeholder="Buscar por nombre"
                    className="h-11 bg-background pl-9 text-base md:text-base"
                />
            </label>

            {selected ? (
                <div className="mt-5">
                    <CheckInCard key={selected.id} guest={selected} />
                    <Button type="button" variant="ghost" onClick={() => setSelectedId(null)} className="mt-3 w-full">
                        <ArrowLeftIcon />
                        Volver a los resultados
                    </Button>
                </div>
            ) : (
                term.length >= 2 && (
                    <ul className="mt-4 divide-y overflow-hidden rounded-xl border bg-card shadow-sm">
                        {matches.length === 0 && <li className="px-4 py-3 text-sm text-muted-foreground">Nadie coincide con la búsqueda.</li>}
                        {matches.map((guest) => (
                            <li key={guest.id}>
                                <button
                                    type="button"
                                    onClick={() => setSelectedId(guest.id)}
                                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left transition-colors outline-none hover:bg-accent focus-visible:bg-accent"
                                >
                                    <span className="min-w-0">
                                        <span className="block font-medium">{guest.name}</span>
                                        <span className="block text-xs text-muted-foreground">
                                            {peopleLabel(guest.seats)} · Mesa {guest.table_label ?? '—'}
                                        </span>
                                    </span>
                                    <span className="flex shrink-0 items-center gap-2">
                                        {guest.checked_in_at && (
                                            <Badge variant="secondary">
                                                Llegó {guest.checked_in_seats}/{guest.seats}
                                            </Badge>
                                        )}
                                        <ChevronRightIcon className="size-4 text-muted-foreground" aria-hidden />
                                    </span>
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
