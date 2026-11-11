import { useId } from 'react';
import type { ReactNode } from 'react';
import InputError from '@/components/input-error';
import MediaField from '@/components/media-field';
import type { MediaType } from '@/components/media-field';
import Repeater from '@/components/repeater';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useContentForm } from './content-form-context';

const asText = (value: unknown) =>
    value === null || value === undefined ? '' : String(value);

type FieldProps = {
    path: string;
    label: string;
    placeholder?: string;
    hint?: string;
};

export function TextField({
    path,
    label,
    placeholder,
    hint,
    type = 'text',
}: FieldProps & { type?: 'text' | 'number' | 'url' | 'tel' }) {
    const id = useId();
    const form = useContentForm();

    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Input
                id={id}
                type={type}
                placeholder={placeholder}
                value={asText(form.value(path))}
                onChange={(event) =>
                    form.set(
                        path,
                        type === 'number' && event.target.value !== ''
                            ? Number(event.target.value)
                            : event.target.value,
                    )
                }
            />
            {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
            <InputError message={form.error(path)} />
        </div>
    );
}

export function TextAreaField({
    path,
    label,
    placeholder,
    hint,
    rows = 3,
}: FieldProps & { rows?: number }) {
    const id = useId();
    const form = useContentForm();

    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <Textarea
                id={id}
                rows={rows}
                placeholder={placeholder}
                value={asText(form.value(path))}
                onChange={(event) => form.set(path, event.target.value)}
            />
            {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
            <InputError message={form.error(path)} />
        </div>
    );
}

/** A "#RRGGBB" color with its picker. */
export function ColorField({ path, label }: FieldProps) {
    const id = useId();
    const form = useContentForm();
    const color = asText(form.value(path));

    return (
        <div className="grid gap-2">
            <Label htmlFor={id}>{label}</Label>
            <div className="flex gap-2">
                <input
                    type="color"
                    aria-label={`${label}: selector`}
                    value={/^#[0-9a-f]{6}$/i.test(color) ? color : '#ffffff'}
                    onChange={(event) =>
                        form.set(path, event.target.value.toUpperCase())
                    }
                    className="h-9 w-12 cursor-pointer rounded-md border"
                />
                <Input
                    id={id}
                    placeholder="#FFFFFF"
                    value={color}
                    onChange={(event) => form.set(path, event.target.value)}
                />
            </div>
            <InputError message={form.error(path)} />
        </div>
    );
}

export function MediaPathField({
    path,
    label,
    type,
    hint,
}: FieldProps & { type: MediaType }) {
    const form = useContentForm();

    return (
        <MediaField
            label={label}
            type={type}
            value={form.value(path) as string | null}
            onChange={(value) => form.set(path, value)}
            uploadUrl={form.uploadUrl}
            urlPrefix={form.mediaUrlPrefix}
            error={form.error(path)}
            hint={hint}
        />
    );
}

/** A list of short texts, e.g. address lines or names. */
export function LinesField({
    path,
    label,
    addLabel,
    placeholder,
    max,
}: FieldProps & { addLabel: string; max?: number }) {
    const form = useContentForm();
    const lines = (form.value(path) as string[] | undefined) ?? [];

    return (
        <div className="grid gap-2">
            <Label>{label}</Label>
            <Repeater
                items={lines}
                onChange={(items) => form.set(path, items)}
                create={() => ''}
                addLabel={addLabel}
                max={max}
                renderItem={(line, index) => (
                    <>
                        <Input
                            aria-label={`${label} ${index + 1}`}
                            placeholder={placeholder}
                            value={line}
                            onChange={(event) =>
                                form.set(`${path}.${index}`, event.target.value)
                            }
                        />
                        <InputError message={form.error(`${path}.${index}`)} />
                    </>
                )}
            />
            <InputError message={form.error(path)} />
        </div>
    );
}

/** A titled block of the content form. */
export function ContentSection({
    title,
    description,
    children,
}: {
    title: string;
    description?: string;
    children: ReactNode;
}) {
    return (
        <section className="space-y-4 rounded-xl border p-4 sm:p-6">
            <header className="space-y-1">
                <h3 className="font-medium">{title}</h3>
                {description && (
                    <p className="text-muted-foreground text-sm">
                        {description}
                    </p>
                )}
            </header>
            {children}
        </section>
    );
}
