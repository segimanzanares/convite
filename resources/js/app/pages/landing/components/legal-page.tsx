import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { CookieConsentBanner } from '@/components/cookie-consent-banner';
import { buildWhatsappUrl } from '@/lib/contact';
import { useLegalProps } from '../use-legal-props';
import type { LegalSection } from '../use-legal-props';
import { Footer } from './footer';
import { Header } from './header';
import { Reveal } from './reveal';

/** The contact for questions and requests: the legal email when set, plus WhatsApp. */
export function ContactChannels({ message }: { message: string }) {
    const { legal } = useLegalProps();
    const whatsappUrl = buildWhatsappUrl(message);

    return (
        <ul>
            {legal.email && (
                <li>
                    Correo electrónico: <a href={`mailto:${legal.email}`}>{legal.email}</a>
                </li>
            )}
            {whatsappUrl !== '#' && (
                <li>
                    WhatsApp:{' '}
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                        escríbanos aquí
                    </a>
                </li>
            )}
        </ul>
    );
}

/**
 * The layout of the terms and the privacy notice: the landing's header and footer, a heading, a table of contents and
 * the numbered sections.
 */
export function LegalPage({
    title,
    eyebrow,
    intro,
    updatedAt,
    sections,
}: {
    title: string;
    eyebrow: string;
    intro: ReactNode;
    /** When the text last changed, e.g. "27 de noviembre de 2026". */
    updatedAt: string;
    sections: LegalSection[];
}) {
    return (
        <div className="bg-background text-foreground">
            <Head title={title} />
            <Header />
            <main>
                <section className="relative overflow-hidden bg-linear-to-b from-cream to-background px-4 pt-36 pb-12 sm:px-6 md:pt-44 md:pb-16">
                    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                        <div className="absolute -top-24 -left-20 size-80 rounded-full bg-rose-light/40 blur-[100px]" />
                        <div className="absolute top-10 -right-24 size-80 rounded-full bg-gold-pale blur-[100px]" />
                    </div>
                    <Reveal className="relative mx-auto max-w-3xl text-center">
                        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold-pale/60 px-3 py-1 text-xs font-medium text-gold-deep">
                            <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                            {eyebrow}
                        </span>
                        <h1 className="text-[clamp(34px,5vw,56px)] leading-[1.08] font-semibold tracking-tight text-balance">{title}</h1>
                        <p className="mt-4 text-sm text-muted-foreground">Última actualización: {updatedAt}</p>
                    </Reveal>
                </section>
                <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-24 sm:px-6 lg:grid-cols-[16rem_1fr] lg:gap-16">
                    <nav aria-label="Contenido" className="lg:sticky lg:top-28 lg:self-start">
                        <p className="mb-3 text-xs font-medium tracking-wider text-muted-foreground uppercase">Contenido</p>
                        <ol className="space-y-1.5 text-sm">
                            {sections.map((section, index) => (
                                <li key={section.id}>
                                    <a
                                        href={`#${section.id}`}
                                        className="flex gap-2 rounded-lg px-2 py-1 text-foreground/75 transition-colors hover:bg-muted hover:text-primary"
                                    >
                                        <span className="text-muted-foreground tabular-nums">{index + 1}.</span>
                                        {section.title}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </nav>
                    <article className="max-w-3xl min-w-0 leading-relaxed text-foreground/85 [&_a]:font-medium [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_li]:mt-2 [&_p]:mt-4 [&_strong]:font-semibold [&_strong]:text-foreground [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:marker:text-gold-deep">
                        <div className="rounded-3xl border bg-card p-6 shadow-xs [&>p:first-child]:mt-0">{intro}</div>
                        {sections.map((section, index) => (
                            <section key={section.id} id={section.id} className="mt-12 scroll-mt-28">
                                <h2 className="text-2xl font-semibold tracking-tight text-foreground">
                                    <span className="mr-2 text-gold-deep tabular-nums">{index + 1}.</span>
                                    {section.title}
                                </h2>
                                {section.content}
                            </section>
                        ))}
                    </article>
                </div>
            </main>
            <Footer />
            {/* Google Analytics only measures the public pages (see use-google-analytics) */}
            <CookieConsentBanner />
        </div>
    );
}
