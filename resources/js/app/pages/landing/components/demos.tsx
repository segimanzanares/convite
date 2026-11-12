import { invitationKindLabels } from '@/lib/labels';
import type { DemoInvitation } from '@/types/invitation';
import { SectionHeading } from './section-heading';
import { Reveal } from './reveal';
import { ACCENT_CLASSES, type Accent } from './accents';

const ACCENTS: Accent[] = ['gold', 'terracotta', 'rose', 'teal'];

export function Demos({ demos }: { demos: DemoInvitation[] }) {
    if (demos.length === 0) {
        return null;
    }

    return (
        <section id="disenos" className="max-w-[1180px] mx-auto px-8 pb-[120px] scroll-mt-24">
            <Reveal className="text-center mb-16">
                <SectionHeading eyebrow="Nuestros diseños" title="Vean cómo se ve una invitación" />
                <p className="text-[15px] font-light leading-[1.8] text-[#4a3820] max-w-[560px] mx-auto">
                    Abran cualquiera de nuestros diseños de ejemplo, igual que lo harán sus invitados. Cada uno se llena
                    con el contenido y las fotos de su evento.
                </p>
            </Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {demos.map((demo, index) => {
                    const accent = ACCENT_CLASSES[ACCENTS[index % ACCENTS.length]];
                    return (
                        <Reveal key={demo.slug}>
                            {/* A plain link: the invitations are another Inertia app, so the page reloads anyway */}
                            <a
                                href={demo.url}
                                className={`group h-full flex flex-col border ${accent.border} bg-[linear-gradient(160deg,var(--color-ivory),var(--color-cream))] transition-[transform,box-shadow] duration-[400ms] ease hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_12px_40px_rgba(42,26,43,0.12)]`}
                            >
                                <div className="aspect-[1200/630] overflow-hidden bg-primary/10">
                                    {demo.image && (
                                        <img
                                            src={demo.image}
                                            alt=""
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    )}
                                </div>
                                <div className="flex flex-1 flex-col p-6">
                                    {demo.kind && (
                                        <p className={`text-[10px] tracking-[0.3em] uppercase mb-2 ${accent.text}`}>
                                            {invitationKindLabels[demo.kind]}
                                        </p>
                                    )}
                                    <h3 className="font-serif text-2xl font-semibold leading-tight text-primary mb-2">
                                        {demo.template_label}
                                    </h3>
                                    <p className="text-[14px] font-light leading-[1.7] text-[#4a3820] mb-5">{demo.title}</p>
                                    <span className="mt-auto inline-flex items-center gap-2 text-[10px] tracking-[0.3em] uppercase text-primary">
                                        Ver invitación
                                        <span className="transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true">
                                            →
                                        </span>
                                    </span>
                                </div>
                            </a>
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}
