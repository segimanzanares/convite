import { CheckIcon, RotateCcwIcon, TriangleAlertIcon } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ColorField, ContentSection } from "./content-fields";
import { useContentForm } from "./content-form-context";

/** The design's own colors and the primaries suggested in their place, from the template's template.json. */
export type TemplatePalette = {
    primary: string | null;
    background: string | null;
    suggestions: { label: string; primary: string }[];
};

const PATH = "content.colors.primary";

/** Below this contrast against the template's background, the primary's titles and ornaments read poorly. */
const MIN_CONTRAST = 2;

function isHexColor(value: unknown): value is string {
    return typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);
}

/** WCAG relative luminance of a #RRGGBB color. */
function luminance(hex: string): number {
    const [red, green, blue] = [1, 3, 5].map((start) => {
        const channel = parseInt(hex.slice(start, start + 2), 16) / 255;

        return channel <= 0.03928
            ? channel / 12.92
            : ((channel + 0.055) / 1.055) ** 2.4;
    });

    return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
}

function contrast(first: string, second: string): number {
    const [lighter, darker] = [luminance(first), luminance(second)].sort(
        (a, b) => b - a,
    );

    return (lighter + 0.05) / (darker + 0.05);
}

/**
 * The primary color of the invitation: the template's own, one of its suggestions or any other. The invitation
 * derives from it the shades of its titles, ornaments and buttons (resources/js/invitations/styles/custom-colors.css).
 */
export function ColorsSection({ palette }: { palette: TemplatePalette }) {
    const form = useContentForm();
    const value = form.value(PATH);
    const custom = isHexColor(value) ? value.toUpperCase() : null;
    const lowContrast =
        custom !== null &&
        palette.background !== null &&
        contrast(custom, palette.background) < MIN_CONTRAST;

    const swatches = [
        ...(palette.primary
            ? [{ label: "Original", primary: palette.primary, original: true }]
            : []),
        ...palette.suggestions.map((suggestion) => ({
            ...suggestion,
            original: false,
        })),
    ];

    return (
        <ContentSection
            title="Color principal"
            description="Tiñe los títulos, adornos, botones y tonos claros de la invitación y de sus imprimibles. Las ilustraciones y fotos de la plantilla conservan sus colores."
        >
            <div className="grid gap-2">
                <Label>Sugeridos para esta plantilla</Label>
                <div className="flex flex-wrap gap-3">
                    {swatches.map((swatch) => {
                        const selected = swatch.original
                            ? custom === null
                            : custom === swatch.primary.toUpperCase();

                        return (
                            <button
                                key={swatch.label}
                                type="button"
                                aria-pressed={selected}
                                onClick={() =>
                                    form.set(
                                        PATH,
                                        swatch.original ? null : swatch.primary,
                                    )
                                }
                                className={cn(
                                    "flex items-center gap-2 rounded-full border py-1 pr-3 pl-1 text-sm transition-colors hover:bg-accent",
                                    selected && "border-primary ring-1 ring-primary",
                                )}
                            >
                                <span
                                    className="flex size-6 items-center justify-center rounded-full border border-black/10"
                                    style={{ backgroundColor: swatch.primary }}
                                >
                                    {selected && (
                                        <CheckIcon
                                            className="size-3.5 text-white mix-blend-difference"
                                            aria-hidden="true"
                                        />
                                    )}
                                </span>
                                {swatch.label}
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="flex flex-wrap items-end gap-3">
                <div className="w-full max-w-xs">
                    <ColorField path={PATH} label="Otro color" />
                </div>
                {custom !== null && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => form.set(PATH, null)}
                        className="mb-0.5"
                    >
                        <RotateCcwIcon />
                        Usar el de la plantilla
                    </Button>
                )}
            </div>

            {lowContrast && (
                <Alert>
                    <TriangleAlertIcon />
                    <AlertDescription>
                        Este color contrasta poco con el fondo de la plantilla:
                        los títulos y adornos se leerán con dificultad. Revisa
                        la invitación después de guardar.
                    </AlertDescription>
                </Alert>
            )}
        </ContentSection>
    );
}
