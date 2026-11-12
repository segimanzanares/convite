import { router } from '@inertiajs/react';
import {
    CheckIcon,
    CopyIcon,
    DoorOpenIcon,
    MessageCircleIcon,
    RefreshCwIcon,
} from 'lucide-react';
import { regenerateDoorLink } from '@/actions/App/Http/Controllers/Admin/CheckInController';
import ConfirmDialog from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import { useClipboard } from '@/hooks/use-clipboard';
import { formatDateTime } from '@/lib/format';
import type { GuestCheckIn, Invitation } from '@/types';

/**
 * Check-in at the door: the link for the staff's phone and the arrivals so far. Scanning a pass with a phone that
 * opened the link registers the guest's arrival.
 */
export default function CheckInPanel({
    invitation,
    checkIn,
}: {
    invitation: Invitation;
    checkIn: GuestCheckIn;
}) {
    const [copiedUrl, copy] = useClipboard();
    const { door_url: doorUrl, summary } = checkIn;

    const makeDoorLink = () =>
        new Promise((resolve) =>
            router.post(
                regenerateDoorLink(invitation.slug),
                {},
                { preserveScroll: true, onFinish: resolve },
            ),
        );

    const shareText = doorUrl
        ? `Enlace para registrar las llegadas de ${invitation.title}. Ábrelo en tu celular y después escanea el código QR de cada pase con la cámara: ${doorUrl}`
        : '';

    return (
        <section className="border-sidebar-border/70 dark:border-sidebar-border space-y-3 rounded-xl border p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <h2 className="flex items-center gap-2 font-medium">
                        <DoorOpenIcon className="size-4" aria-hidden />
                        Registro de llegadas
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        {checkIn.opens_at && checkIn.closes_at
                            ? `Funciona del ${formatDateTime(checkIn.opens_at)} al ${formatDateTime(checkIn.closes_at)}.`
                            : 'Funciona a partir del día anterior al evento, cuando la invitación tenga fecha.'}{' '}
                        Quien abra el enlace de puerta en su celular registra
                        las llegadas escaneando el QR de cada pase.
                    </p>
                </div>
                {(checkIn.is_open || summary.arrived_guests > 0) && (
                    <p className="text-right">
                        <span className="text-2xl font-semibold tabular-nums">
                            {summary.arrived_seats}
                        </span>{' '}
                        <span className="text-muted-foreground text-sm">
                            de {summary.seats} personas han llegado
                        </span>
                    </p>
                )}
            </div>

            {doorUrl ? (
                <div className="flex flex-wrap items-center gap-2">
                    <code className="bg-muted max-w-full truncate rounded px-2 py-1 text-xs">
                        {doorUrl}
                    </code>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copy(doorUrl)}
                    >
                        {copiedUrl === doorUrl ? <CheckIcon /> : <CopyIcon />}
                        Copiar
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                        <a
                            href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <MessageCircleIcon />
                            Compartir por WhatsApp
                        </a>
                    </Button>
                    <ConfirmDialog
                        trigger={
                            <Button variant="ghost" size="sm">
                                <RefreshCwIcon />
                                Generar nuevo
                            </Button>
                        }
                        title="¿Generar un nuevo enlace de puerta?"
                        description="El enlace actual dejará de funcionar, también en los celulares que ya lo abrieron. Úsalo si el enlace llegó a alguien que no debía tenerlo."
                        confirmLabel="Generar nuevo"
                        onConfirm={makeDoorLink}
                    />
                </div>
            ) : (
                <Button variant="outline" onClick={makeDoorLink}>
                    <DoorOpenIcon />
                    Crear enlace de puerta
                </Button>
            )}
        </section>
    );
}
