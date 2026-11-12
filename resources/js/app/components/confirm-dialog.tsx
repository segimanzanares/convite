import { useState } from 'react';
import type { ComponentProps, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

type Props = {
    /** Omit it to control the dialog with `open` and `onOpenChange`. */
    trigger?: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    title: ReactNode;
    description?: ReactNode;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: ComponentProps<typeof Button>['variant'];
    /**
     * Runs when the user confirms. If it returns a promise, the dialog stays
     * open with the confirm button disabled until it settles.
     */
    onConfirm: () => void | Promise<unknown>;
};

export default function ConfirmDialog({
    trigger,
    title,
    description,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    variant = 'default',
    onConfirm,
    open: controlledOpen,
    onOpenChange,
}: Props) {
    const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
    const open = controlledOpen ?? uncontrolledOpen;
    const setOpen = onOpenChange ?? setUncontrolledOpen;
    const [processing, setProcessing] = useState(false);

    const handleConfirm = async () => {
        setProcessing(true);

        try {
            await onConfirm();
            setOpen(false);
        } finally {
            setProcessing(false);
        }
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => !processing && setOpen(next)}
        >
            {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
            <DialogContent>
                <DialogTitle>{title}</DialogTitle>
                {description && (
                    <DialogDescription>{description}</DialogDescription>
                )}

                <DialogFooter className="gap-2">
                    <DialogClose asChild>
                        <Button variant="secondary" disabled={processing}>
                            {cancelLabel}
                        </Button>
                    </DialogClose>

                    <Button
                        variant={variant}
                        disabled={processing}
                        onClick={handleConfirm}
                    >
                        {confirmLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
