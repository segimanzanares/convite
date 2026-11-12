import type { ReactNode } from 'react';

/** Bordered table shell used by the panel's listings. */
export default function DataTable({
    columns,
    empty,
    isEmpty,
    children,
}: {
    /** Column headers. An empty string renders a visually hidden "Acciones" header. */
    columns: string[];
    empty: string;
    isEmpty: boolean;
    children: ReactNode;
}) {
    return (
        <div className="border-sidebar-border/70 dark:border-sidebar-border overflow-x-auto rounded-xl border">
            <table className="w-full text-sm">
                <thead className="bg-muted/50 text-muted-foreground text-left">
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={index}
                                className="px-4 py-3 font-medium whitespace-nowrap"
                            >
                                {column || (
                                    <span className="sr-only">Acciones</span>
                                )}
                            </th>
                        ))}
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
