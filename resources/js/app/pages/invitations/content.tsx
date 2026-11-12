import { Head, router, useHttp } from '@inertiajs/react';
import { ExternalLinkIcon, ImagePlusIcon, SaveIcon } from 'lucide-react';
import { useRef, useState } from 'react';
import {
    edit,
    update,
} from '@/actions/App/Http/Controllers/Admin/InvitationContentController';
import { store as storeMedia } from '@/actions/App/Http/Controllers/Admin/InvitationMediaController';
import AlertError from '@/components/alert-error';
import Heading from '@/components/heading';
import InputError from '@/components/input-error';
import MediaField from '@/components/media-field';
import Repeater from '@/components/repeater';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { invitationKindLabels } from '@/lib/labels';
import { invitationBreadcrumbs } from '@/lib/invitation-sections';
import { getIn, setIn } from '@/lib/object-path';
import type {
    Auth,
    Invitation,
    InvitationKind,
    InvitationSection,
} from '@/types';
import {
    ColorField,
    ContentSection,
    LinesField,
    MediaPathField,
    TextAreaField,
    TextField,
} from './components/content-fields';
import {
    ContentFormProvider,
    useContentForm,
} from './components/content-form-context';
import type { ContentFormBinding } from './components/content-form-context';

/** Free-form content; its shape depends on the kind (see app/Concerns/InvitationContentRules.php). */
type ContentValue =
    | string
    | number
    | boolean
    | null
    | undefined
    | ContentValue[]
    | { [key: string]: ContentValue };
type Content = { [key: string]: ContentValue };

type FormData = { og_image: string | null; content: Content };

type Props = {
    invitation: Invitation;
    kind: InvitationKind;
    /** The sections the template's design shows. */
    sections: InvitationSection[];
    content: Content;
    mediaUrlPrefix: string;
};

type GiftKind = 'bank' | 'registry' | 'envelope';

const giftKindLabels: Record<GiftKind, string> = {
    bank: 'Transferencia',
    registry: 'Mesa de regalos',
    envelope: 'Lluvia de sobres',
};

/** Fills the lists and names the form always edits, so new invitations start with empty inputs. */
function withDefaults(content: Content, kind: InvitationKind): Content {
    return {
        ...(kind === 'wedding' ? { names: ['', ''] } : {}),
        venues: [],
        program: [],
        gallery: [],
        swatches: [],
        gifts: [],
        ...(kind === 'xv' ? { godparents: [] } : {}),
        ...content,
    };
}

export default function InvitationContent({
    invitation,
    kind,
    sections,
    content,
    mediaUrlPrefix,
}: Props) {
    // Plain state instead of useForm: the content is a deep, free-form tree that useForm's types cannot follow
    const [data, setData] = useState<FormData>(() => ({
        og_image: invitation.og_image,
        content: withDefaults(content, kind),
    }));
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);
    const has = (section: InvitationSection) => sections.includes(section);

    const binding: ContentFormBinding = {
        value: (path) => getIn(data, path),
        set: (path, value) => setData((current) => setIn(current, path, value)),
        error: (path) => errors[path],
        uploadUrl: storeMedia(invitation.slug),
        mediaUrlPrefix,
    };

    const save = (event: React.FormEvent) => {
        event.preventDefault();
        router.put(update.url(invitation.slug), data, {
            preserveScroll: true,
            onStart: () => setProcessing(true),
            onFinish: () => setProcessing(false),
            onSuccess: () => setErrors({}),
            onError: (validationErrors) => setErrors(validationErrors),
        });
    };

    return (
        <>
            <Head title={`Contenido · ${invitation.title}`} />

            <ContentFormProvider value={binding}>
                <form onSubmit={save} className="space-y-6 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <Heading
                            title="Contenido"
                            description={`${invitation.title} · ${invitationKindLabels[kind]}`}
                        />
                        <div className="flex flex-wrap gap-2">
                            <Button variant="outline" asChild>
                                <a
                                    href={invitation.url}
                                    target="_blank"
                                    rel="noreferrer"
                                >
                                    <ExternalLinkIcon />
                                    Ver invitación
                                </a>
                            </Button>
                            <SaveButton processing={processing} />
                        </div>
                    </div>

                    {Object.keys(errors).length > 0 && (
                        <AlertError
                            errors={['Revisa los campos marcados en rojo.']}
                        />
                    )}

                    <ContentSection title="Datos principales">
                        {kind === 'wedding' ? (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <TextField
                                    path="content.names.0"
                                    label="Primer nombre"
                                    placeholder="Mariana"
                                />
                                <TextField
                                    path="content.names.1"
                                    label="Segundo nombre"
                                    placeholder="Alejandro"
                                />
                                <div className="sm:col-span-2">
                                    <TextField
                                        path="content.families"
                                        label="Familias"
                                        placeholder="La Familia López & La Familia Pérez"
                                    />
                                </div>
                                <InputError
                                    message={binding.error('content.names')}
                                />
                            </div>
                        ) : (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <TextField
                                    path="content.name"
                                    label="Nombre completo"
                                    placeholder="Sofía Valentina"
                                />
                                <TextField
                                    path="content.first_name"
                                    label="Nombre corto"
                                    placeholder="Sofía"
                                />
                                <TextField
                                    path="content.age"
                                    label="Edad"
                                    type="number"
                                />
                                <TextField
                                    path="content.hosts"
                                    label="Firma"
                                    placeholder="Con cariño, sus hijos y nietos"
                                />
                                {kind === 'xv' && (
                                    <TextField
                                        path="content.monogram"
                                        label="Monograma"
                                        placeholder="SV"
                                        hint="Si lo dejas vacío se usan las iniciales."
                                    />
                                )}
                            </div>
                        )}
                        <TextField
                            path="content.rsvp_whatsapp"
                            label="WhatsApp para confirmar"
                            type="tel"
                            placeholder="954 123 4567"
                            hint="A los números de 10 dígitos se les agrega la clave de México (52)."
                        />
                    </ContentSection>

                    <ContentSection
                        title="Música e imágenes"
                        description="Fotos JPG, PNG o WebP de hasta 10 MB; música MP3 o M4A de hasta 15 MB."
                    >
                        <div className="grid gap-6 sm:grid-cols-2">
                            <MediaPathField
                                path="content.music"
                                label="Música"
                                type="audio"
                            />
                            {kind === 'xv' ? (
                                <div className="space-y-3">
                                    <MediaPathField
                                        path="content.hero_photo"
                                        label="Foto de portada"
                                        type="image"
                                    />
                                    <TextField
                                        path="content.hero_photo_position"
                                        label="Encuadre de la portada"
                                        placeholder="50% 20%"
                                        hint="Horizontal y vertical, para no cortar la cara."
                                    />
                                </div>
                            ) : (
                                <MediaPathField
                                    path="content.cover"
                                    label="Fondo de la portada"
                                    type="image"
                                    hint="Si no subes una, se usa la imagen de la plantilla."
                                />
                            )}
                            <MediaField
                                label="Imagen al compartir el enlace"
                                type="image"
                                value={data.og_image}
                                onChange={(path) =>
                                    setData((current) => ({
                                        ...current,
                                        og_image: path,
                                    }))
                                }
                                uploadUrl={binding.uploadUrl}
                                urlPrefix={mediaUrlPrefix}
                                error={errors.og_image}
                                hint="Se ve en WhatsApp y redes. Idealmente de 1200 × 630."
                            />
                        </div>
                    </ContentSection>

                    <ContentSection
                        title="Textos"
                        description="Si los dejas vacíos, la plantilla usa los suyos."
                    >
                        {kind === 'xv' ? (
                            <TextAreaField
                                path="content.closing_message"
                                label="Mensaje de cierre"
                            />
                        ) : (
                            <TextAreaField
                                path="content.message"
                                label="Mensaje de la invitación"
                                rows={4}
                            />
                        )}
                        <TextField
                            path="content.tagline"
                            label="Frase del pie de página"
                        />
                    </ContentSection>

                    {kind === 'xv' && <XvSections />}
                    {has('venues') && <VenuesSection />}
                    {has('program') && <ProgramSection />}
                    {has('gallery') && <GallerySection />}
                    {(has('dress_code') || has('swatches')) && (
                        <DressCodeSection
                            withCode={has('dress_code')}
                            withSwatches={has('swatches')}
                        />
                    )}
                    {has('gifts') && <GiftsSection />}

                    <div className="flex justify-end">
                        <SaveButton processing={processing} />
                    </div>
                </form>
            </ContentFormProvider>
        </>
    );
}

function SaveButton({ processing }: { processing: boolean }) {
    return (
        <Button type="submit" disabled={processing}>
            {processing ? <Spinner /> : <SaveIcon />}
            Guardar
        </Button>
    );
}

/** The list at `path` of the content form. */
function useList<T>(path: string) {
    const form = useContentForm();

    return {
        items: (form.value(path) as T[] | undefined) ?? [],
        onChange: (items: T[]) => form.set(path, items),
        error: form.error(path),
    };
}

function VenuesSection() {
    const list = useList<Content>('content.venues');

    return (
        <ContentSection
            title="Lugares"
            description="Copia las coordenadas desde Google Maps (clic derecho sobre el lugar) para mostrar el mapa y el botón «Cómo llegar»."
        >
            <Repeater
                {...list}
                max={6}
                addLabel="Agregar lugar"
                create={() => ({
                    icon: '',
                    tag: '',
                    name: '',
                    address_lines: ['', ''],
                    time: '',
                })}
                renderItem={(_, index) => {
                    const path = `content.venues.${index}`;

                    return (
                        <div className="grid gap-4 sm:grid-cols-6">
                            <div className="sm:col-span-1">
                                <TextField
                                    path={`${path}.icon`}
                                    label="Ícono"
                                    placeholder="⛪"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <TextField
                                    path={`${path}.tag`}
                                    label="Tipo"
                                    placeholder="Ceremonia religiosa"
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <TextField
                                    path={`${path}.name`}
                                    label="Nombre"
                                    placeholder="Parroquia de San Rafael"
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <LinesField
                                    path={`${path}.address_lines`}
                                    label="Dirección"
                                    addLabel="Agregar línea"
                                    max={4}
                                />
                            </div>
                            <div className="grid content-start gap-4 sm:col-span-3">
                                <TextField
                                    path={`${path}.time`}
                                    label="Hora"
                                    placeholder="15:00 hrs"
                                />
                                <div className="grid grid-cols-2 gap-2">
                                    <TextField
                                        path={`${path}.latitude`}
                                        label="Latitud"
                                        type="number"
                                        placeholder="15.861208"
                                    />
                                    <TextField
                                        path={`${path}.longitude`}
                                        label="Longitud"
                                        type="number"
                                        placeholder="-97.065710"
                                    />
                                </div>
                            </div>
                            <div className="sm:col-span-6">
                                <MediaPathField
                                    path={`${path}.image`}
                                    label="Foto del lugar"
                                    type="image"
                                />
                            </div>
                        </div>
                    );
                }}
            />
            <InputError message={list.error} />
        </ContentSection>
    );
}

function ProgramSection() {
    const list = useList<Content>('content.program');

    return (
        <ContentSection title="Programa">
            <Repeater
                {...list}
                max={20}
                addLabel="Agregar momento"
                create={() => ({
                    time: '',
                    icon: '',
                    title: '',
                    description: '',
                })}
                renderItem={(_, index) => {
                    const path = `content.program.${index}`;

                    return (
                        <div className="grid gap-4 sm:grid-cols-6">
                            <div className="sm:col-span-2">
                                <TextField
                                    path={`${path}.time`}
                                    label="Hora"
                                    placeholder="20:00 hrs"
                                />
                            </div>
                            <div className="sm:col-span-1">
                                <TextField
                                    path={`${path}.icon`}
                                    label="Ícono"
                                    placeholder="💃"
                                />
                            </div>
                            <div className="sm:col-span-3">
                                <TextField
                                    path={`${path}.title`}
                                    label="Actividad"
                                    placeholder="Vals"
                                />
                            </div>
                            <div className="sm:col-span-6">
                                <TextField
                                    path={`${path}.description`}
                                    label="Descripción"
                                />
                            </div>
                        </div>
                    );
                }}
            />
        </ContentSection>
    );
}

function GallerySection() {
    const form = useContentForm();
    const list = useList<Content>('content.gallery');
    const inputRef = useRef<HTMLInputElement>(null);
    const upload = useHttp<
        { type: 'image'; file: File | null },
        { path: string }
    >({
        type: 'image',
        file: null,
    });

    // Uploads the chosen photos one by one and appends each as a new item
    const addPhotos = async (files: FileList | null) => {
        let items = list.items;

        for (const file of Array.from(files ?? [])) {
            upload.transform(() => ({ type: 'image', file }));

            try {
                const { path } = await upload.post(form.uploadUrl.url);
                items = [...items, { image: path, caption: '', alt: '' }];
                list.onChange(items);
            } catch {
                break;
            }
        }

        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    return (
        <ContentSection
            title="Galería"
            description="Hasta 30 fotos. Puedes elegir varias a la vez."
        >
            <Repeater
                {...list}
                max={30}
                addLabel="Agregar una foto"
                create={() => ({ image: '', caption: '', alt: '' })}
                renderItem={(_, index) => {
                    const path = `content.gallery.${index}`;

                    return (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <MediaPathField
                                path={`${path}.image`}
                                label="Foto"
                                type="image"
                            />
                            <div className="grid content-start gap-4">
                                <TextField
                                    path={`${path}.caption`}
                                    label="Pie de foto"
                                    placeholder="El comienzo"
                                />
                                <TextField
                                    path={`${path}.alt`}
                                    label="Descripción para lectores de pantalla"
                                    placeholder="Los novios en la playa"
                                />
                            </div>
                        </div>
                    );
                }}
            />
            <input
                ref={inputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(event) => addPhotos(event.target.files)}
            />
            <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={upload.processing}
                onClick={() => inputRef.current?.click()}
            >
                {upload.processing ? <Spinner /> : <ImagePlusIcon />}
                Subir varias fotos
            </Button>
            <InputError message={upload.errors.file} />
        </ContentSection>
    );
}

function DressCodeSection({
    withCode,
    withSwatches,
}: {
    withCode: boolean;
    withSwatches: boolean;
}) {
    const swatches = useList<Content>('content.swatches');

    return (
        <ContentSection
            title="Vestimenta"
            description={
                withCode
                    ? 'Si dejas vacío el tipo, la sección no se muestra.'
                    : undefined
            }
        >
            {withCode && (
                <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                        path="content.dress_code.type"
                        label="Tipo"
                        placeholder="Formal"
                    />
                    <TextField
                        path="content.dress_code.description"
                        label="Descripción"
                    />
                    <TextField
                        path="content.dress_code.men"
                        label="Ellos"
                        placeholder="Traje"
                    />
                    <TextField
                        path="content.dress_code.women"
                        label="Ellas"
                        placeholder="Vestido largo"
                    />
                    <TextField
                        path="content.dress_code.reserved_color.name"
                        label="Color reservado"
                        placeholder="Blanco"
                    />
                    <ColorField
                        path="content.dress_code.reserved_color.hex"
                        label="Muestra del color reservado"
                    />
                    <div className="sm:col-span-2">
                        <TextField
                            path="content.dress_code.reserved_color.description"
                            label="Nota del color reservado"
                            placeholder="está reservado para la novia, evita llevar ese color."
                        />
                    </div>
                </div>
            )}
            {withSwatches && (
                <div className="grid gap-2">
                    <Label>Paleta sugerida</Label>
                    <Repeater
                        {...swatches}
                        max={12}
                        addLabel="Agregar color"
                        create={() => ({ hex: '#FFFFFF', label: '' })}
                        renderItem={(_, index) => (
                            <div className="grid gap-4 sm:grid-cols-2">
                                <ColorField
                                    path={`content.swatches.${index}.hex`}
                                    label="Color"
                                />
                                <TextField
                                    path={`content.swatches.${index}.label`}
                                    label="Nombre"
                                    placeholder="Champagne"
                                />
                            </div>
                        )}
                    />
                </div>
            )}
        </ContentSection>
    );
}

function GiftsSection() {
    const form = useContentForm();
    const list = useList<Content>('content.gifts');

    return (
        <ContentSection title="Regalos">
            <Repeater
                {...list}
                max={6}
                addLabel="Agregar opción de regalo"
                create={() => ({
                    kind: 'bank',
                    title: '',
                    description: '',
                    details: [],
                })}
                renderItem={(_, index) => {
                    const path = `content.gifts.${index}`;

                    return (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="grid gap-2">
                                <Label>Tipo</Label>
                                <Select
                                    value={String(
                                        form.value(`${path}.kind`) ?? 'bank',
                                    )}
                                    onValueChange={(value) =>
                                        form.set(`${path}.kind`, value)
                                    }
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {(
                                            Object.entries(giftKindLabels) as [
                                                GiftKind,
                                                string,
                                            ][]
                                        ).map(([value, label]) => (
                                            <SelectItem
                                                key={value}
                                                value={value}
                                            >
                                                {label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <TextField
                                path={`${path}.title`}
                                label="Título"
                                placeholder="Transferencia bancaria"
                            />
                            <div className="sm:col-span-2">
                                <TextField
                                    path={`${path}.description`}
                                    label="Descripción"
                                />
                            </div>
                            <div className="sm:col-span-2">
                                <GiftDetails path={`${path}.details`} />
                            </div>
                            <TextField
                                path={`${path}.copy_value`}
                                label="Texto del botón «Copiar»"
                                placeholder="4189143180184403"
                                hint="Por ejemplo, la cuenta sin espacios. Vacío: sin botón."
                            />
                            <div className="grid content-start gap-4">
                                <TextField
                                    path={`${path}.link_url`}
                                    label="Enlace"
                                    type="url"
                                    placeholder="https://…"
                                />
                                <TextField
                                    path={`${path}.link_label`}
                                    label="Texto del enlace"
                                    placeholder="Ver mesa de regalos"
                                />
                            </div>
                        </div>
                    );
                }}
            />
        </ContentSection>
    );
}

function GiftDetails({ path }: { path: string }) {
    const list = useList<Content>(path);

    return (
        <div className="grid gap-2">
            <Label>Datos</Label>
            <Repeater
                {...list}
                max={6}
                addLabel="Agregar dato"
                create={() => ({ label: '', value: '' })}
                renderItem={(_, index) => (
                    <div className="grid gap-4 sm:grid-cols-2">
                        <TextField
                            path={`${path}.${index}.label`}
                            label="Dato"
                            placeholder="Banco"
                        />
                        <TextField
                            path={`${path}.${index}.value`}
                            label="Valor"
                            placeholder="BBVA"
                        />
                    </div>
                )}
            />
        </div>
    );
}

function XvSections() {
    const godparents = useList<Content>('content.godparents');

    return (
        <>
            <ContentSection
                title="Mi historia"
                description="Si no escribes párrafos, el capítulo no se muestra."
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                        path="content.story.eyebrow"
                        label="Encabezado"
                        placeholder="Capítulo XV · El comienzo"
                    />
                    <TextField
                        path="content.story.title"
                        label="Título"
                        placeholder="Un sueño que florece"
                    />
                    <TextField
                        path="content.story.opening"
                        label="Inicio"
                        placeholder="Érase una vez…"
                    />
                    <TextField
                        path="content.story.signature"
                        label="Firma"
                        placeholder="Con cariño, Sofía"
                    />
                </div>
                <StoryParagraphs />
                <MediaPathField
                    path="content.story.photo"
                    label="Foto de la historia"
                    type="image"
                />
            </ContentSection>

            <ContentSection
                title="Papás y padrinos"
                description="Si no capturas a los papás, la sección no se muestra."
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                        path="content.parents.role"
                        label="Título"
                        placeholder="Mis papás"
                    />
                    <LinesField
                        path="content.parents.names"
                        label="Nombres"
                        addLabel="Agregar nombre"
                        max={4}
                    />
                </div>
                <Label>Padrinos</Label>
                <Repeater
                    {...godparents}
                    max={12}
                    addLabel="Agregar padrinos"
                    create={() => ({ role: '', names: ['', ''] })}
                    renderItem={(_, index) => (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <TextField
                                path={`content.godparents.${index}.role`}
                                label="De qué"
                                placeholder="Padrinos de velación"
                            />
                            <LinesField
                                path={`content.godparents.${index}.names`}
                                label="Nombres"
                                addLabel="Agregar nombre"
                                max={4}
                            />
                        </div>
                    )}
                />
            </ContentSection>
        </>
    );
}

function StoryParagraphs() {
    const form = useContentForm();
    const list = useList<string>('content.story.paragraphs');

    return (
        <div className="grid gap-2">
            <Label>Párrafos</Label>
            <Repeater
                {...list}
                max={6}
                addLabel="Agregar párrafo"
                create={() => ''}
                renderItem={(paragraph, index) => (
                    <>
                        <textarea
                            aria-label={`Párrafo ${index + 1}`}
                            rows={3}
                            value={paragraph}
                            onChange={(event) =>
                                form.set(
                                    `content.story.paragraphs.${index}`,
                                    event.target.value,
                                )
                            }
                            className="border-input w-full rounded-md border bg-transparent px-3 py-2 text-sm"
                        />
                        <InputError
                            message={form.error(
                                `content.story.paragraphs.${index}`,
                            )}
                        />
                    </>
                )}
            />
        </div>
    );
}

InvitationContent.layout = (props: Props & { auth: Auth }) => ({
    breadcrumbs: invitationBreadcrumbs(props.auth.user.role, props.invitation, {
        title: 'Contenido',
        href: edit(props.invitation.slug),
    }),
});
