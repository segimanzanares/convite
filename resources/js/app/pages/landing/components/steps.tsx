import { SectionHeading } from './section-heading';
import { Reveal } from './reveal';
import { ACCENT_CLASSES, type Accent } from './accents';

const STEPS: { accent: Accent; title: string; body: string }[] = [
    {
        accent: 'gold',
        title: 'Cuéntanos su historia',
        body: 'Elijan su plan y su diseño, y compártannos la fecha, el lugar y sus fotos.',
    },
    {
        accent: 'terracotta',
        title: 'Preparamos su invitación',
        body: 'La armamos con su contenido y sus fotos, o creamos un diseño exclusivo si lo eligieron.',
    },
    {
        accent: 'rose',
        title: 'Revisan y ajustan',
        body: 'Ven la invitación terminada y piden los cambios que necesiten antes de publicarla.',
    },
    {
        accent: 'teal',
        title: 'Comparten el enlace',
        body: 'Reciben un enlace propio, listo para enviar a sus invitados por WhatsApp.',
    },
];

export function Steps() {
    return (
        <section className="max-w-[1000px] mx-auto px-8 py-[120px]">
            <Reveal className="text-center mb-16">
                <SectionHeading eyebrow="Cómo funciona" title="De la idea al enlace en 4 pasos" />
            </Reveal>
            <div className="relative grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-10">
                <div
                    className="hidden md:block absolute top-[22px] left-[12%] right-[12%] h-px bg-primary/15"
                    aria-hidden="true"
                />
                {STEPS.map((step, index) => {
                    const accent = ACCENT_CLASSES[step.accent];
                    return (
                        <Reveal key={step.title} className="relative text-center">
                            <div
                                className={`relative z-10 w-11 h-11 mx-auto mb-5 flex items-center justify-center rounded-full bg-primary text-sm text-white ring-4 ring-cream`}
                            >
                                {index + 1}
                            </div>
                            <h3 className={`font-serif text-2xl font-semibold leading-tight mb-3 ${accent.text}`}>{step.title}</h3>
                            <p className="text-[15px] font-light leading-[1.8] text-[#4a3820]">{step.body}</p>
                        </Reveal>
                    );
                })}
            </div>
        </section>
    );
}
