import type { ComponentType } from 'react';
import { cn } from '@/lib/utils';
import {
    CheckInIllustration,
    CountdownIllustration,
    DesignIllustration,
    LiveGalleryIllustration,
    MusicIllustration,
    RsvpIllustration,
    ShareIllustration,
    SpeedIllustration,
    WishesIllustration,
} from './illustrations/feature-illustrations';
import { Reveal } from './reveal';
import { Highlight, SectionHeading } from './section-heading';

type Feature = {
    title: string;
    body: string;
    illustration: ComponentType;
    /** The tint behind the illustration. */
    tint: string;
    wide?: boolean;
    /** Spans the whole row, so the grid stays full with an odd number of cards. */
    full?: boolean;
    badge?: string;
};

const FEATURES: Feature[] = [
    {
        title: 'Diseños con personalidad',
        body: 'Elijan uno de nuestros diseños con su propio contenido y fotos, o pidan uno exclusivo creado solo para su evento.',
        illustration: DesignIllustration,
        tint: 'bg-linear-to-br from-gold-pale to-rose-light/40',
        wide: true,
    },
    {
        title: 'Cuenta regresiva en vivo',
        body: 'Mantiene la emoción desde el día que la comparten hasta el gran día.',
        illustration: CountdownIllustration,
        tint: 'bg-linear-to-br from-cream to-gold-pale',
    },
    {
        title: 'Confirmación de asistencia',
        body: 'Sus invitados confirman con un toque, directo a su WhatsApp o en línea, con las respuestas en su panel.',
        illustration: RsvpIllustration,
        tint: 'bg-linear-to-br from-[#efeae2] to-teal-light/50',
    },
    {
        title: 'Música y galería',
        body: 'Fotos, un sobre animado al abrir y su canción de fondo para una bienvenida memorable.',
        illustration: MusicIllustration,
        tint: 'bg-linear-to-br from-rose-light/45 to-gold-pale',
        wide: true,
    },
    {
        title: 'Lista para compartir',
        body: 'Al pegar el enlace en WhatsApp o redes se ve con su propia imagen y descripción.',
        illustration: ShareIllustration,
        tint: 'bg-linear-to-br from-[#efeae2] to-cream',
    },
    {
        title: 'Pases con QR y registro de llegadas',
        body: 'Cada invitado recibe su enlace personal y su pase; en la puerta, su equipo lo escanea y ve quién ya llegó.',
        illustration: CheckInIllustration,
        tint: 'bg-linear-to-br from-terracotta-light/40 to-gold-pale',
        wide: true,
        badge: 'Plan Exclusivo',
    },
    {
        title: 'Galería en vivo',
        body: 'Sus invitados escanean un QR en las mesas y suben sus fotos, que aparecen al momento en una pantalla del salón. Al final, ustedes las descargan todas.',
        illustration: LiveGalleryIllustration,
        tint: 'bg-linear-to-br from-gold-pale to-teal-light/40',
        wide: true,
        badge: 'Plan Exclusivo',
    },
    {
        title: 'Libro de buenos deseos',
        body: 'Sus invitados les escriben desde la invitación y cada mensaje queda en su propia hoja de un libro de firmas. Ustedes deciden si se muestran en la invitación y, al final, lo descargan en PDF de recuerdo.',
        illustration: WishesIllustration,
        tint: 'bg-linear-to-br from-gold-pale via-cream to-rose-light/40',
        full: true,
        badge: 'Planes Premium y Exclusivo',
    },
    {
        title: 'Lista en días',
        body: 'De la primera plática al enlace terminado, sin meses de espera.',
        illustration: SpeedIllustration,
        tint: 'bg-linear-to-br from-teal-light/40 to-cream',
    },
];

export function Features() {
    return (
        <section id="funciones" className="relative scroll-mt-28 bg-cream/70 py-24 md:py-32">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <Reveal>
                    <SectionHeading
                        eyebrow="Por qué Convite"
                        title={
                            <>
                                Todo lo que su invitación <Highlight>necesita</Highlight>
                            </>
                        }
                        description="Más que una tarjeta bonita: una invitación que se mueve, suena, les ayuda a organizar a sus invitados y reúne las fotos y los buenos deseos de su fiesta."
                    />
                </Reveal>
                <div className="mt-14 grid gap-5 md:grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3">
                    {FEATURES.map((feature, index) => {
                        const Illustration = feature.illustration;
                        return (
                            <Reveal
                                key={feature.title}
                                delay={(index % 3) * 90}
                                className={cn(feature.wide && 'md:col-span-2', feature.full && 'md:col-span-2 lg:col-span-3')}
                            >
                                <article className="group flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(42,26,43,0.35)]">
                                    <div className={cn('relative h-52 overflow-hidden', feature.tint)} aria-hidden="true">
                                        <Illustration />
                                    </div>
                                    <div className="flex flex-1 flex-col p-6">
                                        {feature.badge && (
                                            <span className="mb-2 w-fit rounded-full bg-primary/5 px-2.5 py-0.5 text-[11px] font-medium text-primary">
                                                {feature.badge}
                                            </span>
                                        )}
                                        <h3 className="text-xl font-semibold tracking-tight">{feature.title}</h3>
                                        <p className="mt-2 leading-relaxed text-muted-foreground">{feature.body}</p>
                                    </div>
                                </article>
                            </Reveal>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
