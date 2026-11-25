import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import { CircleAlertIcon, ClockIcon, MinusIcon, PlusIcon, Undo2Icon } from 'lucide-react';
import ConfirmDialog from '@/components/confirm-dialog';
import InputError from '@/components/input-error';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { CheckInGuest } from '@/types/check-in';
import { formatArrivalTime, peopleLabel } from '@/lib/check-in';

/**
  * One guest at the door: who they are, their table and answer, and the number of people arriving. Checking in again
  * corrects the number (e.g. the rest of the family arrives later) instead of adding to it.
  */
export function CheckInCard({ guest }: { guest: CheckInGuest }) {
    const errors = usePage().props.errors as Record<string, string | undefined>;
    const [seats, setSeats] = useState(defaultSeats(guest));
    const [processing, setProcessing] = useState(false);
    const isCheckedIn = guest.checked_in_at !== null;
    const isComplete = isCheckedIn && guest.checked_in_seats >= guest.seats;

    const options = { preserveScroll: true, onStart: () => setProcessing(true), onFinish: () => setProcessing(false) };

    function checkIn() {
        router.post(guest.check_in_url, { seats }, options);
    }

    /** Resolves once the request finishes, so the dialog stays open meanwhile. */
    function undo() {
        return new Promise<void>((resolve) => {
            router.delete(guest.check_in_url, {
                ...options,
                onFinish: () => {
                    setProcessing(false);
                    resolve();
                },
            });
        });
    }

    return (
        <Card className="gap-5">
            <CardHeader>
                <CardTitle className="text-lg">{guest.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
                <dl className="grid grid-cols-2 gap-y-1.5 text-sm">
                    <dt className="text-muted-foreground">Pase para</dt>
                    <dd className="font-medium">{peopleLabel(guest.seats)}</dd>
                    <dt className="text-muted-foreground">Mesa</dt>
                    <dd className="font-medium">{guest.table_label ?? '—'}</dd>
                    {guest.rsvp !== undefined && (
                        <>
                            <dt className="text-muted-foreground">Confirmó</dt>
                            <dd className="font-medium">
                                {guest.rsvp ? (guest.rsvp.attending ? peopleLabel(guest.rsvp.seats_confirmed) : 'Que no asistiría') : 'Sin respuesta'}
                            </dd>
                        </>
                    )}
                </dl>

                {isCheckedIn && (
                    <Alert role="status" variant={isComplete ? 'destructive' : 'default'} className={isComplete ? 'border-destructive/30 bg-destructive/5' : 'bg-muted/50'}>
                        {isComplete ? <CircleAlertIcon /> : <ClockIcon />}
                        <AlertTitle>{isComplete ? 'Este pase ya se registró' : 'Llegada parcial'}</AlertTitle>
                        <AlertDescription>
                            {guest.checked_in_seats} de {guest.seats} a las {formatArrivalTime(guest.checked_in_at!)}.
                        </AlertDescription>
                    </Alert>
                )}

                <div>
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-sm text-muted-foreground">{isCheckedIn ? 'Total que ha llegado' : 'Personas que llegan'}</span>
                        <div className="flex items-center">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setSeats((value) => Math.max(1, value - 1))}
                                disabled={seats <= 1}
                                className="size-11"
                                aria-label="Una persona menos"
                            >
                                <MinusIcon />
                            </Button>
                            <span className="w-12 text-center text-xl font-semibold tabular-nums" aria-live="polite">
                                {seats}
                            </span>
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                onClick={() => setSeats((value) => Math.min(guest.seats, value + 1))}
                                disabled={seats >= guest.seats}
                                className="size-11"
                                aria-label="Una persona más"
                            >
                                <PlusIcon />
                            </Button>
                        </div>
                    </div>
                    <InputError message={errors.seats} className="mt-2" />
                </div>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button
                    type="button"
                    size="lg"
                    onClick={checkIn}
                    disabled={processing || (isCheckedIn && seats === guest.checked_in_seats)}
                    className="h-12 w-full text-base"
                >
                    {isCheckedIn ? 'Actualizar llegada' : 'Registrar llegada'}
                </Button>
                {isCheckedIn && (
                    <ConfirmDialog
                        trigger={
                            <Button type="button" variant="ghost" disabled={processing} className="w-full text-muted-foreground">
                                <Undo2Icon />
                                Deshacer llegada
                            </Button>
                        }
                        title={`¿Deshacer la llegada de ${guest.name}?`}
                        description="El pase vuelve a quedar sin registrar."
                        confirmLabel="Deshacer llegada"
                        variant="destructive"
                        onConfirm={undo}
                    />
                )}
            </CardFooter>
        </Card>
    );
}

/**
  * The number most likely arriving: the whole pass once part of the group arrived (the rest is coming), else what they
  * confirmed, else the whole pass.
  */
function defaultSeats(guest: CheckInGuest) {
    if (guest.checked_in_at === null && guest.rsvp?.attending) {
        return Math.min(guest.seats, Math.max(1, guest.rsvp.seats_confirmed));
    }

    return guest.seats;
}
