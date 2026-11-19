import { router } from "@inertiajs/react";
import { EyeIcon, EyeOffIcon, PartyPopperIcon } from "lucide-react";
import { useState } from "react";
import { update } from "@/actions/App/Http/Controllers/Admin/GenderRevealController";
import ConfirmDialog from "@/components/confirm-dialog";
import InputError from "@/components/input-error";
import { Button } from "@/components/ui/button";
import { formatDateTime } from "@/lib/format";
import type { Invitation } from "@/types";

/**
 * Shows the result of a gender reveal on the invitation, at the moment of the reveal, or hides it again. It never
 * says the result: the parents-to-be may not know it yet.
 */
export default function RevealToggle({
    invitation,
}: {
    invitation: Invitation;
}) {
    const [error, setError] = useState<string>();
    const reveal = invitation.reveal;

    if (!reveal) {
        return null;
    }

    const setShown = (shown: boolean) =>
        new Promise((resolve) =>
            router.put(
                update(invitation.slug),
                { shown },
                {
                    preserveScroll: true,
                    onSuccess: () => setError(undefined),
                    onError: (errors) => setError(errors.shown),
                    onFinish: resolve,
                },
            ),
        );

    return (
        <div className="space-y-3 rounded-lg border p-4">
            <div className="flex items-start gap-3">
                <PartyPopperIcon className="text-primary mt-0.5 size-5 shrink-0" />
                <div className="space-y-1 text-sm">
                    <p className="font-medium">
                        {reveal.shown_at
                            ? "El resultado ya se ve en la invitación"
                            : "El resultado está en secreto"}
                    </p>
                    <p className="text-muted-foreground">
                        {reveal.shown_at
                            ? `Se mostró el ${formatDateTime(reveal.shown_at)}.`
                            : reveal.captured
                              ? "Muéstralo justo en el momento de la revelación; antes nadie puede verlo."
                              : "Todavía no se captura el resultado."}
                    </p>
                </div>
            </div>

            {reveal.shown_at ? (
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShown(false)}
                >
                    <EyeOffIcon />
                    Ocultar el resultado
                </Button>
            ) : (
                <ConfirmDialog
                    trigger={
                        <Button
                            type="button"
                            size="sm"
                            disabled={!reveal.captured}
                        >
                            <EyeIcon />
                            Mostrar el resultado
                        </Button>
                    }
                    title="¿Mostrar el resultado?"
                    description="Todos los que abran la invitación verán si es niño o niña. Hazlo en el momento de la revelación."
                    confirmLabel="Mostrar el resultado"
                    onConfirm={() => setShown(true)}
                />
            )}
            <InputError message={error} />
        </div>
    );
}
