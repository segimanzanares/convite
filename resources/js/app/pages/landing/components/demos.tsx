import { ArrowUpRight, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { invitationKindLabels } from '@/lib/labels';
import { cn } from '@/lib/utils';
import type { DemoInvitation, InvitationKind } from '@/types/invitation';
import { Reveal } from './reveal';
import { Highlight, SectionHeading } from './section-heading';

/** The filter's categories, in the order they are offered. */
const KIND_FILTERS: { kind: InvitationKind; label: string }[] = [
    { kind: 'wedding', label: 'Bodas' },
    { kind: 'xv', label: 'XV años' },
    { kind: 'birthday', label: 'Cumpleaños' },
    { kind: 'baptism', label: 'Bautizos' },
];

const KIND_BADGES: Record<InvitationKind, string> = {
    wedding: 'bg-rose text-white',
    xv: 'bg-gold text-ink',
    birthday: 'bg-terracotta text-white',
    baptism: 'bg-teal text-white',
};

/** How many designs show before "Ver todos". */
const INITIAL_COUNT = 8;

export function Demos({ demos }: { demos: DemoInvitation[] }) {
    const [selectedKind, setSelectedKind] = useState<InvitationKind | null>(null);
    const [showAll, setShowAll] = useState(false);

    if (demos.length === 0) {
        return null;
    }

    // Only the categories some demo has; the filter is pointless with a single one
    const filters = KIND_FILTERS.filter(({ kind }) => demos.some((demo) => demo.kind === kind));
    const filteredDemos = selectedKind ? demos.filter((demo) => demo.kind === selectedKind) : demos;
    const visibleDemos = showAll ? filteredDemos : filteredDemos.slice(0, INITIAL_COUNT);

    return (
        <section id="disenos" className="relative mx-auto max-w-6xl scroll-mt-28 px-4 py-24 sm:px-6 md:py-32">
            <Reveal>
                <SectionHeading
                    eyebrow="Nuestros diseños"
                    title={
                        <>
                            Ábranla como lo harán <Highlight>sus invitados</Highlight>
                        </>
                    }
                    description="Cada diseño de ejemplo es una invitación real que pueden abrir ahora mismo. La suya se llena con la historia, las fotos y la música de su evento."
                />
            </Reveal>

            {filters.length > 1 && (
                <div
                    role="group"
                    aria-label="Filtrar diseños por evento"
                    className="mx-auto mt-10 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border bg-muted/60 p-1 [scrollbar-width:none]"
                >
                    {[{ kind: null, label: 'Todos' }, ...filters].map(({ kind, label }) => {
                        const isSelected = selectedKind === kind;
                        return (
                            <button
                                key={kind ?? 'all'}
                                type="button"
                                aria-pressed={isSelected}
                                onClick={() => {
                                    setSelectedKind(kind);
                                    setShowAll(false);
                                }}
                                className={cn(
                                    'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-all',
                                    isSelected
                                        ? 'bg-primary text-primary-foreground shadow-sm'
                                        : 'text-muted-foreground hover:bg-background hover:text-foreground',
                                )}
                            >
                                {label}
                            </button>
                        );
                    })}
                </div>
            )}

            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {visibleDemos.map((demo, index) => (
                    <Reveal key={demo.slug} delay={(index % 4) * 80}>
                        {/* A plain link: the invitations are another Inertia app, so the page reloads anyway */}
                        <a
                            href={demo.url}
                            className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/20 hover:shadow-[0_24px_50px_-20px_rgba(42,26,43,0.35)]"
                        >
                            <div className="relative aspect-[1200/630] overflow-hidden bg-[linear-gradient(135deg,var(--color-gold-pale),var(--color-rose-light))]">
                                {demo.image && (
                                    <img
                                        src={demo.image}
                                        alt=""
                                        loading="lazy"
                                        className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                )}
                                <div className="absolute inset-0 flex items-end justify-end bg-[linear-gradient(to_top,rgba(42,26,43,0.55),transparent_60%)] p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                    <span className="flex size-9 items-center justify-center rounded-full bg-white text-primary shadow-md">
                                        <ArrowUpRight className="size-4" />
                                    </span>
                                </div>
                                {demo.kind && (
                                    <span
                                        className={cn(
                                            'absolute top-3 left-3 rounded-full px-2.5 py-0.5 text-[11px] font-medium shadow-sm',
                                            KIND_BADGES[demo.kind],
                                        )}
                                    >
                                        {invitationKindLabels[demo.kind]}
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-1 flex-col p-5">
                                <h3 className="text-lg font-semibold tracking-tight">{demo.template_label}</h3>
                                <p className="mt-1 text-sm text-muted-foreground">{demo.title}</p>
                                <span className="mt-auto flex items-center gap-1 pt-4 text-sm font-medium text-primary">
                                    Ver invitación
                                    <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                                </span>
                            </div>
                        </a>
                    </Reveal>
                ))}
            </div>

            {!showAll && filteredDemos.length > INITIAL_COUNT && (
                <div className="mt-10 text-center">
                    <Button variant="outline" size="lg" className="rounded-full" onClick={() => setShowAll(true)}>
                        Ver los {filteredDemos.length} diseños
                        <ChevronDown />
                    </Button>
                </div>
            )}
        </section>
    );
}
