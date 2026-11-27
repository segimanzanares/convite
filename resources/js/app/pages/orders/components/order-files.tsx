import { router, useForm } from '@inertiajs/react';
import { DownloadIcon, TrashIcon, UploadIcon } from 'lucide-react';
import { useRef } from 'react';
import {
    destroy,
    download,
    store,
} from '@/actions/App/Http/Controllers/Admin/OrderFileController';
import ConfirmDialog from '@/components/confirm-dialog';
import DataTable from '@/components/data-table';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { formatDate } from '@/lib/format';
import type { Order, OrderFile } from '@/types';

/** "2.4 MB", "830 KB" */
function formatSize(bytes: number): string {
    return bytes >= 1024 * 1024
        ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
        : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

/**
 * The files delivered with the order (the tribute video, the printables' PDFs...): upload, download and delete them.
 */
export default function OrderFiles({ order }: { order: Order }) {
    const files = order.files ?? [];
    const input = useRef<HTMLInputElement>(null);
    const form = useForm<{ file: File | null }>({ file: null });

    const upload = (file: File | undefined) => {
        if (!file) {
            return;
        }

        form.transform(() => ({ file }));
        form.post(store.url(order.id), {
            preserveScroll: true,
            forceFormData: true,
            onFinish: () => {
                if (input.current) {
                    input.current.value = '';
                }
            },
        });
    };

    const remove = (file: OrderFile) =>
        new Promise((resolve) =>
            router.delete(destroy(file.id), {
                preserveScroll: true,
                onFinish: resolve,
            }),
        );

    return (
        <section className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <Heading
                    variant="small"
                    title="Archivos de entrega"
                    description="El video, los PDF o lo que se entregue al cliente."
                />
                <input
                    ref={input}
                    type="file"
                    className="hidden"
                    onChange={(event) => upload(event.target.files?.[0])}
                />
                <Button
                    size="sm"
                    disabled={form.processing}
                    onClick={() => input.current?.click()}
                >
                    {form.processing ? <Spinner /> : <UploadIcon />}
                    {form.processing && form.progress
                        ? `Subiendo ${form.progress.percentage ?? 0}%`
                        : 'Subir archivo'}
                </Button>
            </div>
            <InputError message={form.errors.file} />

            <DataTable
                columns={[
                    'Archivo',
                    { label: 'Tamaño', desktop: true },
                    { label: 'Subido', desktop: true },
                    '',
                ]}
                empty="Aún no hay archivos."
                isEmpty={files.length === 0}
            >
                {files.map((file) => (
                    <tr key={file.id}>
                        <td className="px-2 py-3 font-medium break-all md:px-4">
                            {file.name}
                            <div className="text-muted-foreground text-xs font-normal md:hidden">
                                {formatSize(file.size)} ·{' '}
                                {formatDate(file.created_at)}
                            </div>
                        </td>
                        <td className="text-muted-foreground hidden px-4 py-3 whitespace-nowrap md:table-cell">
                            {formatSize(file.size)}
                        </td>
                        <td className="text-muted-foreground hidden px-4 py-3 whitespace-nowrap md:table-cell">
                            {formatDate(file.created_at)}
                        </td>
                        <td className="px-2 py-3 text-right md:px-4">
                            <div className="flex justify-end gap-2">
                                <Button variant="outline" size="icon" asChild>
                                    <a
                                        href={download.url(file.id)}
                                        download
                                        aria-label={`Descargar ${file.name}`}
                                    >
                                        <DownloadIcon />
                                    </a>
                                </Button>
                                <ConfirmDialog
                                    trigger={
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            aria-label={`Eliminar ${file.name}`}
                                        >
                                            <TrashIcon />
                                        </Button>
                                    }
                                    title="¿Eliminar el archivo?"
                                    description={`${file.name} se borra para siempre.`}
                                    confirmLabel="Eliminar"
                                    variant="destructive"
                                    onConfirm={() => remove(file)}
                                />
                            </div>
                        </td>
                    </tr>
                ))}
            </DataTable>
        </section>
    );
}
