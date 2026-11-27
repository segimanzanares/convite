import { Link } from '@inertiajs/react';
import { MessageCircle } from 'lucide-react';
import logoNegativo from '@/assets/images/logo-negativo.png';
import { dashboard, services } from '@/routes';
import { privacy, terms } from '@/routes/legal';
import { useWhatsappLink } from '../use-whatsapp-link';
import { SectionLink } from './section-link';

const SECTIONS = [
    { href: '#disenos', label: 'Diseños' },
    { href: '#funciones', label: 'Funciones' },
    { href: '#como-funciona', label: 'Cómo funciona' },
    { href: '#planes', label: 'Planes' },
    { href: '#preguntas', label: 'Preguntas frecuentes' },
] as const;

const EVENTS = ['Bodas', 'XV años', 'Bautizos', 'Baby shower', 'Revelación de género', 'Cumpleaños', 'Fiestas infantiles'];

export function Footer() {
    const whatsappLink = useWhatsappLink();
    const whatsappUrl = whatsappLink('Hola 👋 Quiero cotizar una invitación digital para mi evento.');

    return (
        <footer className="bg-primary-dark text-white">
            <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:grid-cols-2 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
                <div>
                    <img src={logoNegativo} alt="Convite — Invitaciones digitales" className="h-9" />
                    <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
                        Invitaciones digitales para bodas, XV años, bautizos, baby showers, revelaciones de género y cumpleaños, hechas a la medida de su evento.
                    </p>
                </div>
                <nav aria-label="Secciones del sitio">
                    <p className="mb-4 text-sm font-semibold text-gold-light">Explorar</p>
                    <ul className="space-y-2.5 text-sm text-white/65">
                        {SECTIONS.map((section) => (
                            <li key={section.href}>
                                <SectionLink href={section.href} className="transition-colors hover:text-white">
                                    {section.label}
                                </SectionLink>
                            </li>
                        ))}
                        <li>
                            <Link href={services()} className="transition-colors hover:text-white">
                                Servicios
                            </Link>
                        </li>
                    </ul>
                </nav>
                <div>
                    <p className="mb-4 text-sm font-semibold text-gold-light">Eventos</p>
                    <ul className="space-y-2.5 text-sm text-white/65">
                        {EVENTS.map((event) => (
                            <li key={event}>{event}</li>
                        ))}
                    </ul>
                </div>
                <div>
                    <p className="mb-4 text-sm font-semibold text-gold-light">Contacto</p>
                    <ul className="space-y-2.5 text-sm text-white/65">
                        <li>
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 transition-colors hover:text-white"
                            >
                                <MessageCircle className="size-4" /> Cotizar por WhatsApp
                            </a>
                        </li>
                        <li>
                            <Link href={dashboard()} className="transition-colors hover:text-white">
                                Ingresar a mi panel
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-white/45 sm:flex-row sm:px-6">
                    <p>© {new Date().getFullYear()} Convite · Invitaciones digitales para cada evento</p>
                    <nav aria-label="Legal" className="flex gap-5">
                        <Link href={terms()} className="transition-colors hover:text-white">
                            Términos y condiciones
                        </Link>
                        <Link href={privacy()} className="transition-colors hover:text-white">
                            Aviso de privacidad
                        </Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
