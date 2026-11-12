import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * A column header. Columns marked `desktop` are hidden on small screens, where
 * the rows show their data under the main column (as `md:hidden` text).
 */
export type DataTableColumn = string | { label: string; desktop?: boolean };

/**
 * Bordered table shell used by the panel's listings. Rows follow the same
 * convention: `px-2 py-3 md:px-4` cells, and `hidden px-4 py-3 md:table-cell`
 * for the cells of `desktop` columns.
 */
export default function DataTable({
    columns,
    empty,
    isEmpty,
    children,
}: {
    /** Column headers. An empty label renders a visually hidden "Acciones" header. */
    columns: DataTableColumn[];
    empty: string;
    isEmpty: boolean;
    children: ReactNode;
}) {
    return (
        <div className="border-sidebar-border/70 dark:border-sidebar-border overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground text-left">
                    <tr>
                        {columns.map((column, index) => {
                            const { label, desktop } =
                                typeof column === 'string'
                                    ? { label: column, desktop: false }
                                    : column;

                            return (
                                <th
                                    key={index}
                                    className={cn(
                                        'py-3 font-medium whitespace-nowrap',
                                        desktop
                                            ? 'hidden px-4 md:table-cell'
                                            : 'px-2 md:px-4',
                                    )}
                                >
                                    {label || (
                                        <span className="sr-only">
                                            Acciones
                                        </span>
                                    )}
                                </th>
                            );
                        })}
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {isEmpty ? (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="text-muted-foreground px-4 py-6 text-center"
                            >
                                {empty}
                            </td>
                        </tr>
                    ) : (
                        children
                    )}
                </tbody>
            </table>
        </div>
    );
}
