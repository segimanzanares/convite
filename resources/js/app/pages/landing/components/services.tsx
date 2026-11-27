import { Link } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatPrice } from '@/lib/format';
import { getServices, lowestPrice } from '@/lib/services';
import { services } from '@/routes';
import type { OfferedPlan } from '@/types';
import { ServiceIllustration } from './illustrations/service-illustrations';
import { Reveal } from './reveal';
import { Highlight, SectionHeading } from './section-heading';

/** The tint behind each service's illustration. */
const TINTS = [
    'bg-linear-to-br from-rose-light/45 to-gold-pale',
    'bg-linear-to-br from-teal-light/40 to-cream',
    'bg-linear-to-br from-gold-pale to-terracotta-light/40',
];

/** The landing page's summary of the services besides the invitations, each linking to its section of the services page. */
export function Services({ servicePlans }: { servicePlans: OfferedPlan[] }) {
    const offered = getServices(servicePlans);

    if (offered.length === 0) {
        return null;
    }

    return (
        <section id="servicios" className="relative scroll-mt-28 bg-cream/70 py-24 md:py-32">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
                <Reveal>
                    <SectionHeading
                        eyebrow="Más servicios"
                        title={
                            <>
                                Más para su <Highlight>evento</Highlight>
                            </>
                        }
                        description="Además de su invitación digital, creamos videos para emocionar a sus invitados y diseños personalizados para imprimir."
                    />
                </Reveal>
                <div className="mt-14 grid gap-5 md:grid-cols-3">
                    {offered.map((service, index) => {
                        return (
                            <Reveal key={service.id} delay={index * 90} className="h-full min-w-0">
                                <Link
                                    href={`${services.url()}#${service.id}`}
                                    className="group flex h-full flex-col overflow-hidden rounded-3xl border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_-24px_rgba(42,26,43,0.35)]"
                                >
                                    <div className={`relative h-52 overflow-hidden ${TINTS[index % TINTS.length]}`} aria-hidden="true">
                                        <ServiceIllustration id={service.id} />
                                    </div>
                                    <div className="flex flex-1 flex-col p-6">
                                        <h3 className="text-xl font-semibold tracking-tight">{service.title}</h3>
                                        <p className="mt-2 leading-relaxed text-muted-foreground">{service.summary}</p>
                                        <p className="mt-auto flex items-center justify-between gap-3 pt-5">
                                            <span className="text-sm text-muted-foreground">
                                                {service.options.length > 1 && 'Desde '}
                                                <span className="text-lg font-semibold text-foreground">{formatPrice(lowestPrice(service))}</span>{' '}
                                                MXN
                                            </span>
                                            <span className="flex items-center gap-1 text-sm font-medium text-primary">
                                                Ver más <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                            </span>
                                        </p>
                                    </div>
                                </Link>
                            </Reveal>
                        );
                    })}
                </div>
                <Reveal className="mt-10 text-center">
                    <Button asChild variant="outline" size="lg" className="rounded-full bg-card">
                        <Link href={services()}>
                            Ver todos los servicios <ArrowRight />
                        </Link>
                    </Button>
                </Reveal>
            </div>
        </section>
    );
}
