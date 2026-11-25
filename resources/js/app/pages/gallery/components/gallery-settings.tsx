import { router, usePage } from '@inertiajs/react';
import { useId } from 'react';
import { updateSettings } from '@/actions/App/Http/Controllers/Admin/LiveGalleryController';
import InputError from '@/components/input-error';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { formatDateTime } from '@/lib/format';
import type { GallerySettings, Invitation } from '@/types';

type Settings = Pick<
    GallerySettings,
    'moderated' | 'opens_days_before' | 'closes_days_after' | 'slide_seconds'
>;

/** The days after the event the gallery may close, as offered; the invitation's own value is always added. */
const CLOSES_DAYS_AFTER = [1, 2, 3, 7, 14, 30];

const SLIDE_SECONDS = [5, 7, 10, 15, 20, 30];

/**
 * How the live gallery works: whether new photos wait for approval, when it takes photos around the event and how
 * long the wall shows each one. Every change is saved right away.
 */
export default function GallerySettingsPanel({
    invitation,
    gallery,
}: {
    invitation: Invitation;
    gallery: GallerySettings;
}) {
    const errors = usePage().props.errors as Partial<
        Record<keyof Settings, string>
    >;

    const save = (changes: Partial<Settings>) =>
        router.put(
            updateSettings(invitation.slug),
            {
                moderated: gallery.moderated,
                opens_days_before: gallery.opens_days_before,
                closes_days_after: gallery.closes_days_after,
                slide_seconds: gallery.slide_seconds,
                ...changes,
            },
            { preserveScroll: true },
        );

    const opensOptions = range(0, gallery.max_opens_days_before);
    const closesOptions = withValue(
        CLOSES_DAYS_AFTER.filter(
            (days) => days <= gallery.max_closes_days_after,
        ),
        gallery.closes_days_after,
    );
    const slideOptions = withValue(
        SLIDE_SECONDS.filter(
            (seconds) =>
                seconds >= gallery.min_slide_seconds &&
                seconds <= gallery.max_slide_seconds,
        ),
        gallery.slide_seconds,
    );

    return (
        <section className="border-sidebar-border/70 dark:border-sidebar-border space-y-5 rounded-xl border p-4">
            <div>
                <h2 className="font-medium">Configuración</h2>
                <p className="text-muted-foreground text-sm">
                    {gallery.opens_at && gallery.closes_at
                        ? `Con estos ajustes, del ${formatDateTime(gallery.opens_at)} al ${formatDateTime(gallery.closes_at)} recibe fotos.`
                        : 'Las fechas se calculan a partir del día del evento, cuando la invitación tenga fecha.'}
                </p>
            </div>

            <div className="grid gap-2">
                <Label>Publicación de las fotos</Label>
                <ToggleGroup
                    type="single"
                    variant="outline"
                    className="justify-start"
                    value={gallery.moderated ? 'moderated' : 'direct'}
                    onValueChange={(value) =>
                        value && save({ moderated: value === 'moderated' })
                    }
                >
                    <ToggleGroupItem value="direct" className="px-3">
                        Publicar al momento
                    </ToggleGroupItem>
                    <ToggleGroupItem value="moderated" className="px-3">
                        Revisar antes
                    </ToggleGroupItem>
                </ToggleGroup>
                <p className="text-muted-foreground text-sm">
                    Si eliges revisarlas, las fotos nuevas no salen en el muro
                    hasta que las apruebes aquí. Las que ya se subieron no
                    cambian.
                </p>
                <InputError message={errors.moderated} />
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
                <NumberSelect
                    label="Empieza a recibir fotos"
                    value={gallery.opens_days_before}
                    options={opensOptions}
                    format={(days) =>
                        days === 0
                            ? 'El día del evento'
                            : `${days} ${days === 1 ? 'día' : 'días'} antes`
                    }
                    hint="Desde las 00:00 de ese día."
                    error={errors.opens_days_before}
                    onChange={(days) => save({ opens_days_before: days })}
                />
                <NumberSelect
                    label="Deja de recibir fotos"
                    value={gallery.closes_days_after}
                    options={closesOptions}
                    format={(days) =>
                        days === 1
                            ? 'Al día siguiente'
                            : `${days} días después`
                    }
                    hint="A las 12:00 de ese día."
                    error={errors.closes_days_after}
                    onChange={(days) => save({ closes_days_after: days })}
                />
                <NumberSelect
                    label="Tiempo de cada foto en el muro"
                    value={gallery.slide_seconds}
                    options={slideOptions}
                    format={(seconds) => `${seconds} segundos`}
                    hint="Una foto nueva entra en cuanto llega."
                    error={errors.slide_seconds}
                    onChange={(seconds) => save({ slide_seconds: seconds })}
                />
            </div>
        </section>
    );
}

function NumberSelect({
    label,
    value,
    options,
    format,
    hint,
    error,
    onChange,
}: {
    label: string;
    value: number;
    options: number[];
    format: (value: number) => string;
    hint: string;
    error?: string;
    onChange: (value: number) => void;
}) {
    const id = useId();

    return (
        <div className="grid content-start gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Select
                value={String(value)}
                onValueChange={(selected) => onChange(Number(selected))}
            >
                <SelectTrigger id={id} className="w-full">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option} value={String(option)}>
                            {format(option)}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <p className="text-muted-foreground text-xs">{hint}</p>
            <InputError message={error} />
        </div>
    );
}

function range(from: number, to: number): number[] {
    return Array.from({ length: to - from + 1 }, (_, index) => from + index);
}

/** The options with the current value among them, in order, so a value saved before is always shown. */
function withValue(options: number[], value: number): number[] {
    return [...new Set([...options, value])].sort((a, b) => a - b);
}
