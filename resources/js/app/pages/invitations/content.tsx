import { Head, router, useHttp } from "@inertiajs/react";
import { ExternalLinkIcon, ImagePlusIcon, SaveIcon } from "lucide-react";
import { useRef, useState } from "react";
import {
    edit,
    update,
} from "@/actions/App/Http/Controllers/Admin/InvitationContentController";
import { store as storeMedia } from "@/actions/App/Http/Controllers/Admin/InvitationMediaController";
import AlertError from "@/components/alert-error";
import Heading from "@/components/heading";
import InputError from "@/components/input-error";
import Repeater from "@/components/repeater";
import RevealToggle from "@/components/reveal-toggle";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { invitationKindLabels } from "@/lib/labels";
import { invitationBreadcrumbs } from "@/lib/invitation-sections";
import { getIn, setIn } from "@/lib/object-path";
import type {
    Auth,
    Invitation,
    InvitationKind,
    InvitationSection,
} from "@/types";
import {
    ColorField,
    ContentSection,
    LinesField,
    MediaPathField,
    TextAreaField,
    TextField,
} from "./components/content-fields";
import {
    ContentFormProvider,
    useContentForm,
} from "./components/content-form-context";
import type { ContentFormBinding } from "./components/content-form-context";
import { ContentTabs } from "./components/content-tabs";
import type { ContentTab } from "./components/content-tabs";

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

type GiftKind = "bank" | "registry" | "envelope";

const giftKindLabels: Record<GiftKind, string> = {
    bank: "Transferencia",
    registry: "Mesa de regalos",
    envelope: "Lluvia de sobres",
};

/** XV and baptism templates share the chapters: monogram, portrait, story, parents and godparents. */
function hasChapters(kind: InvitationKind): boolean {
    return kind === "xv" || kind === "baptism";
}

/** Wedding, gender reveal and baby shower templates name a couple (the parents-to-be, in the last two) instead of a celebrant. */
function namesCouple(kind: InvitationKind): boolean {
    return kind === "wedding" || kind === "gender_reveal" || kind === "baby_shower";
}

/** Fills the lists and names the form always edits, so new invitations start with empty inputs. */
function withDefaults(content: Content, kind: InvitationKind): Content {
    return {
        ...(namesCouple(kind) ? { names: ["", ""] } : {}),
        venues: [],
        program: [],
        gallery: [],
        swatches: [],
        gifts: [],
        ...(kind === "wedding" ? { parents: [] } : {}),
        ...(kind === "gender_reveal"
            ? { grandparents: [] }
            : kind === "baby_shower"
              ? { hosts: [], diapers: { note: "", sizes: [] } }
              : kind !== "birthday"
                ? { godparents: [] }
                : {}),
        ...content,
    };
}

type Tab = ContentTab & {
    /** The content paths edited in the tab; the general tab takes every other one. */
    paths: string[];
};

/** The sections of the form, one tab each, keeping only those the template's design shows. */
function contentTabs(
    invitation: Invitation,
    kind: InvitationKind,
    has: (section: InvitationSection) => boolean,
): Tab[] {
    const tabs: (Tab | false)[] = [
        {
            value: "general",
            label: "General",
            paths: [],
            content: <GeneralSections kind={kind} />,
        },
        kind === "gender_reveal" && {
            value: "reveal",
            label: "La revelación",
            paths: ["content.reveal", "content.baby_names", "content.due_label"],
            content: <RevealSection invitation={invitation} />,
        },
        kind === "baby_shower" && {
            value: "baby",
            label: "El bebé",
            paths: ["content.baby_name", "content.due_label", "content.diapers"],
            content: <BabyShowerSection />,
        },
        hasChapters(kind) && {
            value: "story",
            label: "Mi historia",
            paths: ["content.story"],
            content: <ChapterSections />,
        },
        has("family") && {
            value: "family",
            label: familyTitles[kind],
            paths: [
                "content.parents",
                "content.godparents",
                "content.grandparents",
                "content.hosts",
            ],
            content: <FamilySection kind={kind} />,
        },
        has("venues") && {
            value: "venues",
            label: "Lugares",
            paths: ["content.venues"],
            content: <VenuesSection />,
        },
        has("program") && {
            value: "program",
            label: "Programa",
            paths: ["content.program"],
            content: <ProgramSection />,
        },
        has("gallery") && {
            value: "gallery",
            label: "Galería",
            paths: ["content.gallery"],
            content: <GallerySection />,
        },
        (has("dress_code") || has("swatches")) && {
            value: "dress",
            label: "Vestimenta",
            paths: ["content.dress_code", "content.swatches"],
            content: (
                <DressCodeSection
                    withCode={has("dress_code")}
                    withSwatches={has("swatches")}
                />
            ),
        },
        has("gifts") && {
            value: "gifts",
            label: "Regalos",
            paths: ["content.gifts"],
            content: <GiftsSection />,
        },
    ];

    return tabs.filter((tab): tab is Tab => tab !== false);
}

/** The tab holding the field of an error key (e.g. `content.venues.0.name`). */
function tabOfError(tabs: Tab[], path: string): string {
    const owner = tabs.find(({ paths }) =>
        paths.some((prefix) => path === prefix || path.startsWith(`${prefix}.`)),
    );

    return (owner ?? tabs[0]).value;
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
    const tabs = contentTabs(invitation, kind, has);
    const [tab, setTab] = useState(tabs[0].value);
    const invalidTabs = new Set(
        Object.keys(errors).map((path) => tabOfError(tabs, path)),
    );

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
            onError: (validationErrors) => {
                setErrors(validationErrors);

                // Leave the admin on the open tab if it has errors, otherwise show the first one that does
                const invalid = Object.keys(validationErrors).map((path) =>
                    tabOfError(tabs, path),
                );

                if (!invalid.includes(tab)) {
                    setTab(
                        tabs.find(({ value }) => invalid.includes(value))
                            ?.value ?? tab,
                    );
                }
            },
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
                            errors={["Revisa los campos marcados en rojo."]}
                        />
                    )}

                    <ContentTabs
                        tabs={tabs.map((tab) => ({
                            ...tab,
                            invalid: invalidTabs.has(tab.value),
                        }))}
                        value={tab}
                        onChange={setTab}
                    />

                    <div className="flex justify-end">
                        <SaveButton processing={processing} />
                    </div>
                </form>
            </ContentFormProvider>
        </>
    );
}

/** The names, media and texts every kind has. */
function GeneralSections({ kind }: { kind: InvitationKind }) {
    const form = useContentForm();

    return (
        <>

        <ContentSection title="Datos principales">
            {namesCouple(kind) ? (
                <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                        path="content.names.0"
                        label="Primer nombre"
                        placeholder={kind === "wedding" ? "Mariana" : "Ana"}
                    />
                    <TextField
                        path="content.names.1"
                        label={
                            kind === "wedding"
                                ? "Segundo nombre"
                                : "Segundo nombre (opcional)"
                        }
                        placeholder={kind === "wedding" ? "Alejandro" : "Luis"}
                    />
                    <div className="sm:col-span-2">
                        <TextField
                            path="content.families"
                            label="Familias"
                            placeholder={
                                kind === "wedding"
                                    ? "La Familia López & La Familia Pérez"
                                    : "Familia Ramírez Soto"
                            }
                        />
                    </div>
                    <InputError
                        message={form.error("content.names")}
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
                    {hasChapters(kind) && (
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
                {hasChapters(kind) ? (
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
                <MediaPathField
                    path="og_image"
                    label="Imagen al compartir el enlace"
                    type="image"
                    hint="Se ve en WhatsApp y redes. Idealmente de 1200 × 630."
                />
            </div>
        </ContentSection>

        <ContentSection
            title="Textos"
            description="Si los dejas vacíos, la plantilla usa los suyos."
        >
            {hasChapters(kind) ? (
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
    const list = useList<Content>("content.venues");

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
                    icon: "",
                    tag: "",
                    name: "",
                    address_lines: ["", ""],
                    time: "",
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
    const list = useList<Content>("content.program");

    return (
        <ContentSection title="Programa">
            <Repeater
                {...list}
                max={20}
                addLabel="Agregar momento"
                create={() => ({
                    time: "",
                    icon: "",
                    title: "",
                    description: "",
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
    const list = useList<Content>("content.gallery");
    const inputRef = useRef<HTMLInputElement>(null);
    const upload = useHttp<
        { type: "image"; file: File | null },
        { path: string }
    >({
        type: "image",
        file: null,
    });

    // Uploads the chosen photos one by one and appends each as a new item
    const addPhotos = async (files: FileList | null) => {
        let items = list.items;

        for (const file of Array.from(files ?? [])) {
            upload.transform(() => ({ type: "image", file }));

            try {
                const { path } = await upload.post(form.uploadUrl.url);
                items = [...items, { image: path, caption: "", alt: "" }];
                list.onChange(items);
            } catch {
                break;
            }
        }

        if (inputRef.current) {
            inputRef.current.value = "";
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
                create={() => ({ image: "", caption: "", alt: "" })}
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
    const swatches = useList<Content>("content.swatches");

    return (
        <ContentSection
            title="Vestimenta"
            description={
                withCode
                    ? "Si dejas vacío el tipo, la sección no se muestra."
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
                        create={() => ({ hex: "#FFFFFF", label: "" })}
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
    const list = useList<Content>("content.gifts");

    return (
        <ContentSection title="Regalos">
            <Repeater
                {...list}
                max={6}
                addLabel="Agregar opción de regalo"
                create={() => ({
                    kind: "bank",
                    title: "",
                    description: "",
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
                                        form.value(`${path}.kind`) ?? "bank",
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
                create={() => ({ label: "", value: "" })}
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

/** The answer of a gender reveal; "none" stands for not knowing it yet. */
const revealLabels: Record<string, string> = {
    none: "Aún no se sabe",
    girl: "Es niña",
    boy: "Es niño",
};

/**
 * The names picked for each answer, the due date and the answer itself, which stays secret until someone shows it
 * at the moment of the reveal.
 */
function RevealSection({ invitation }: { invitation: Invitation }) {
    const form = useContentForm();

    return (
        <ContentSection
            title="La revelación"
            description="Si los dejas vacíos, la plantilla no los muestra."
        >
            <div className="grid gap-4 sm:grid-cols-2">
                <TextField
                    path="content.baby_names.girl"
                    label="Nombre si es niña"
                    placeholder="Valentina"
                />
                <TextField
                    path="content.baby_names.boy"
                    label="Nombre si es niño"
                    placeholder="Mateo"
                />
                <TextField
                    path="content.due_label"
                    label="Llegada estimada"
                    placeholder="Llega en abril de 2027"
                />
                <div className="grid gap-2">
                    <Label>Resultado</Label>
                    <Select
                        value={String(form.value("content.reveal") ?? "none")}
                        onValueChange={(value) =>
                            form.set(
                                "content.reveal",
                                value === "none" ? null : value,
                            )
                        }
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {Object.entries(revealLabels).map(
                                ([value, label]) => (
                                    <SelectItem key={value} value={value}>
                                        {label}
                                    </SelectItem>
                                ),
                            )}
                        </SelectContent>
                    </Select>
                    <p className="text-muted-foreground text-xs">
                        Puedes capturarlo antes: la invitación no lo muestra
                        hasta que lo actives abajo.
                    </p>
                    <InputError message={form.error("content.reveal")} />
                </div>
            </div>
            <RevealToggle invitation={invitation} />
        </ContentSection>
    );
}

/** The baby's name, the due date and the "lluvia de pañales": a note and the size asked of each group of guests. */
function BabyShowerSection() {
    const sizes = useList<Content>("content.diapers.sizes");

    return (
        <>
            <ContentSection
                title="El bebé"
                description="Si los dejas vacíos, la plantilla no los muestra."
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                        path="content.baby_name"
                        label="Nombre del bebé"
                        placeholder="Emilia"
                    />
                    <TextField
                        path="content.due_label"
                        label="Llegada estimada"
                        placeholder="Llega en marzo de 2027"
                    />
                </div>
            </ContentSection>
            <ContentSection
                title="Lluvia de pañales"
                description="La talla que le toca a cada grupo de invitados. Sin tallas ni nota, la sección no se muestra."
            >
                <TextAreaField
                    path="content.diapers.note"
                    label="Nota"
                    placeholder="Si quieres traer pañales, aquí va la etapa según la inicial de tu apellido."
                />
                <Repeater
                    {...sizes}
                    max={6}
                    addLabel="Agregar talla"
                    create={() => ({ label: "", note: "" })}
                    renderItem={(_, index) => (
                        <div className="grid gap-4 sm:grid-cols-2">
                            <TextField
                                path={`content.diapers.sizes.${index}.label`}
                                label="Talla"
                                placeholder="Etapa 2"
                            />
                            <TextField
                                path={`content.diapers.sizes.${index}.note`}
                                label="Para quién"
                                placeholder="Apellidos de la A a la M"
                            />
                        </div>
                    )}
                />
            </ContentSection>
        </>
    );
}

function ChapterSections() {
    return (
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
    );
}

/** How each kind calls its parents and its godparents, as the placeholders of the family section. */
const familyRoles: Record<
    InvitationKind,
    { parents: string; godparents: string | null }
> = {
    wedding: {
        parents: "Padres de la novia",
        godparents: "Padrinos de velación",
    },
    xv: { parents: "Mis papás", godparents: "Padrinos de velación" },
    baptism: { parents: "Mis papás", godparents: "Padrinos de bautizo" },
    birthday: { parents: "Sus papás", godparents: null },
    gender_reveal: { parents: "Abuelos maternos", godparents: null },
    baby_shower: { parents: "Organizan con cariño", godparents: null },
};

const familyTitles: Record<InvitationKind, string> = {
    wedding: "Papás y padrinos",
    xv: "Papás y padrinos",
    baptism: "Papás y padrinos",
    birthday: "Papás",
    gender_reveal: "Abuelos",
    baby_shower: "Anfitriones",
};

/** The parents (of each one of the couple, in a wedding) and the godparents; kids' birthdays only have parents. */
function FamilySection({ kind }: { kind: InvitationKind }) {
    const parents = useList<Content>("content.parents");
    const godparents = useList<Content>("content.godparents");
    const grandparents = useList<Content>("content.grandparents");
    const hosts = useList<Content>("content.hosts");
    const roles = familyRoles[kind];

    if (kind === "baby_shower") {
        return (
            <ContentSection
                title="Anfitriones"
                description="Quienes organizan e invitan: amigas, tías, abuelos. Si no capturas a nadie, la sección no se muestra."
            >
                <Repeater
                    {...hosts}
                    max={4}
                    addLabel="Agregar anfitriones"
                    create={() => ({
                        role:
                            hosts.items.length === 0
                                ? roles.parents
                                : "Futuros abuelos",
                        names: ["", ""],
                    })}
                    renderItem={(_, index) => (
                        <HonorGroupFields
                            path={`content.hosts.${index}`}
                            placeholder={roles.parents}
                        />
                    )}
                />
            </ContentSection>
        );
    }

    if (kind === "gender_reveal") {
        return (
            <ContentSection
                title="Abuelos"
                description="Los futuros abuelos del bebé. Si no capturas a nadie, la sección no se muestra."
            >
                <Repeater
                    {...grandparents}
                    max={4}
                    addLabel="Agregar abuelos"
                    create={() => ({
                        role:
                            grandparents.items.length === 0
                                ? "Abuelos maternos"
                                : "Abuelos paternos",
                        names: ["", ""],
                    })}
                    renderItem={(_, index) => (
                        <HonorGroupFields
                            path={`content.grandparents.${index}`}
                            placeholder="Abuelos maternos"
                        />
                    )}
                />
            </ContentSection>
        );
    }

    return (
        <ContentSection
            title={familyTitles[kind]}
            description={
                kind === "wedding"
                    ? "Si no capturas a nadie, la sección no se muestra."
                    : "Si no capturas a los papás, la sección no se muestra."
            }
        >
            {kind === "wedding" ? (
                <div className="grid gap-2">
                    <Label>Papás</Label>
                    <Repeater
                        {...parents}
                        max={2}
                        addLabel="Agregar papás"
                        create={() => ({
                            role:
                                parents.items.length === 0
                                    ? "Padres de la novia"
                                    : "Padres del novio",
                            names: ["", ""],
                        })}
                        renderItem={(_, index) => (
                            <HonorGroupFields
                                path={`content.parents.${index}`}
                                placeholder="Padres de la novia"
                            />
                        )}
                    />
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    <TextField
                        path="content.parents.role"
                        label="Título"
                        placeholder={roles.parents}
                    />
                    <LinesField
                        path="content.parents.names"
                        label="Nombres"
                        addLabel="Agregar nombre"
                        max={4}
                    />
                </div>
            )}
            {roles.godparents && (
                <div className="grid gap-2">
                    <Label>Padrinos</Label>
                    <Repeater
                        {...godparents}
                        max={12}
                        addLabel="Agregar padrinos"
                        create={() => ({ role: "", names: ["", ""] })}
                        renderItem={(_, index) => (
                            <HonorGroupFields
                                path={`content.godparents.${index}`}
                                placeholder={roles.godparents ?? ""}
                            />
                        )}
                    />
                </div>
            )}
        </ContentSection>
    );
}

function HonorGroupFields({
    path,
    placeholder,
}: {
    path: string;
    placeholder: string;
}) {
    return (
        <div className="grid gap-4 sm:grid-cols-2">
            <TextField
                path={`${path}.role`}
                label="De qué"
                placeholder={placeholder}
            />
            <LinesField
                path={`${path}.names`}
                label="Nombres"
                addLabel="Agregar nombre"
                max={4}
            />
        </div>
    );
}

function StoryParagraphs() {
    const form = useContentForm();
    const list = useList<string>("content.story.paragraphs");

    return (
        <div className="grid gap-2">
            <Label>Párrafos</Label>
            <Repeater
                {...list}
                max={6}
                addLabel="Agregar párrafo"
                create={() => ""}
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
        title: "Contenido",
        href: edit(props.invitation.slug),
    }),
});
