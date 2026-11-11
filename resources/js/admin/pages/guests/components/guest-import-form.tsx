import { router, useHttp } from '@inertiajs/react';
import { FileUpIcon } from 'lucide-react';
import { useState } from 'react';
import {
    preview,
    store,
} from '@/actions/App/Http/Controllers/Admin/GuestImportController';
import AlertError from '@/components/alert-error';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { DialogBody, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { GuestImportRow, Invitation } from '@/types';

type Preview = {
    rows: GuestImportRow[];
    /** How many more guests the plan allows, or null without a limit. */
    remaining: number | null;
};

/**
 * Two steps: the file is uploaded and parsed into a preview without saving
 * anything, then the rows without errors are imported.
 */
export default function GuestImportForm({
    invitation,
}: {
    invitation: Invitation;
}) {
    const upload = useHttp<{ file: File | null }, Preview>({ file: null });
    const [importing, setImporting] = useState(false);
    const [importErrors, setImportErrors] = useState<string[]>([]);

    const result = upload.response;
    const validRows = result?.rows.filter((row) => row.errors.length === 0) ?? [];
    const invalidRows = result?.rows.filter((row) => row.errors.length > 0) ?? [];
    const exceedsLimit =
        result?.remaining != null && validRows.length > result.remaining;

    const submitPreview = (event: React.FormEvent) => {
        event.preventDefault();
        setImportErrors([]);
        upload.submit(preview(invitation.slug));
    };

    const importRows = () =>
        router.post(
            store.url(invitation.slug),
            {
                rows: validRows.map((row) => ({
                    name: row.name,
                    seats: row.seats,
                    table_label: row.table_label,
                    phone: row.phone,
                    email: row.email,
                })),
            },
            {
                preserveScroll: true,
                onStart: () => setImporting(true),
                onFinish: () => setImporting(false),
                onError: (errors) => setImportErrors(Object.values(errors)),
            },
        );

    return (
        <div className="flex min-h-0 flex-1 flex-col gap-4">
            <DialogBody className="space-y-6">
                <form onSubmit={submitPreview} className="space-y-3">
                    <div className="grid gap-2">
                        <Label htmlFor="file">Archivo CSV</Label>
                        <div className="flex gap-2">
                            <Input
                                id="file"
                                type="file"
                                accept=".csv,text/csv,text/plain"
                                onChange={(event) =>
                                    upload.setData(
                                        'file',
                                        event.target.files?.[0] ?? null,
                                    )
                                }
                            />
                            <Button
                                variant="outline"
                                disabled={!upload.data.file || upload.processing}
                            >
                                <FileUpIcon />
                                Revisar
                            </Button>
                        </div>
                        <InputError message={upload.errors.file} />
                    </div>
                    <p className="text-muted-foreground text-sm">
                        Un invitado por renglón:{' '}
                        <code className="text-foreground">
                            nombre, lugares, mesa, teléfono, correo
                        </code>
                        . Solo el nombre es obligatorio; sin lugares se cuenta
                        uno. Puedes guardarlo desde Excel o Google Sheets como
                        CSV.
                    </p>
                </form>

                {result && (
                    <div className="space-y-4">
                        <p className="text-sm">
                            {validRows.length} invitados listos para importar
                            {invalidRows.length > 0 &&
                                `; ${invalidRows.length} renglones con errores no se importarán`}
                            .
                        </p>

                        {exceedsLimit && (
                            <AlertError
                                title="No caben en el plan"
                                errors={[
                                    `Solo puedes agregar ${result.remaining} invitados más. Quita renglones del archivo y revísalo de nuevo.`,
                                ]}
                            />
                        )}
                        {importErrors.length > 0 && (
                            <AlertError errors={importErrors} />
                        )}

                        <div className="border-sidebar-border/70 dark:border-sidebar-border max-h-80 overflow-auto rounded-xl border">
                            <table className="w-full text-sm">
                                <thead className="bg-muted/50 text-muted-foreground sticky top-0 text-left">
                                    <tr>
                                        <th className="px-3 py-2 font-medium">
                                            Renglón
                                        </th>
                                        <th className="px-3 py-2 font-medium">
                                            Nombre
                                        </th>
                                        <th className="px-3 py-2 font-medium">
                                            Lugares
                                        </th>
                                        <th className="px-3 py-2 font-medium">
                                            Mesa
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {result.rows.map((row) => (
                                        <tr
                                            key={row.line}
                                            className={
                                                row.errors.length > 0
                                                    ? 'bg-red-50 dark:bg-red-950/30'
                                                    : undefined
                                            }
                                        >
                                            <td className="text-muted-foreground px-3 py-2">
                                                {row.line}
                                            </td>
                                            <td className="px-3 py-2">
                                                {row.name || '—'}
                                                {row.errors.map((error) => (
                                                    <InputError
                                                        key={error}
                                                        message={error}
                                                        className="text-xs"
                                                    />
                                                ))}
                                            </td>
                                            <td className="px-3 py-2">
                                                {row.seats}
                                            </td>
                                            <td className="px-3 py-2">
                                                {row.table_label ?? '—'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </DialogBody>

            <DialogFooter>
                <Button
                    onClick={importRows}
                    disabled={
                        validRows.length === 0 || exceedsLimit || importing
                    }
                >
                    Importar {validRows.length > 0 ? validRows.length : ''}{' '}
                    invitados
                </Button>
            </DialogFooter>
        </div>
    );
}
