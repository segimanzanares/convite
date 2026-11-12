import { EllipsisVerticalIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

/**
 * The actions of a table row on small screens, where the row's buttons
 * (wrapped in `hidden md:flex`) collapse into this menu of `DropdownMenuItem`s.
 * Items that confirm first open a controlled `ConfirmDialog` from `onSelect`.
 */
export default function RowActionsMenu({
    label,
    children,
}: {
    /** Accessible name of the trigger, e.g. "Acciones de Ana". */
    label: string;
    children: ReactNode;
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    aria-label={label}
                    className="md:hidden"
                >
                    <EllipsisVerticalIcon />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">{children}</DropdownMenuContent>
        </DropdownMenu>
    );
}
