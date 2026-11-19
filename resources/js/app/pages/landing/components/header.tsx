import { Link } from '@inertiajs/react';
import { MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import logoNegativo from '@/assets/images/logo-negativo.png';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { dashboard } from '@/routes';
import { useWhatsappLink } from '../use-whatsapp-link';

const LINKS = [
    { href: '#disenos', label: 'Diseños' },
    { href: '#funciones', label: 'Funciones' },
    { href: '#como-funciona', label: 'Cómo funciona' },
    { href: '#planes', label: 'Planes' },
    { href: '#preguntas', label: 'Preguntas' },
];

export function Header() {
    const whatsappLink = useWhatsappLink();
    const whatsappUrl = whatsappLink('Hola 👋 Quiero cotizar una invitación digital para mi evento.');
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4">
            <div
                className={cn(
                    'mx-auto flex max-w-6xl items-center justify-between gap-3 rounded-full border border-white/10 bg-primary/90 py-2 pr-2 pl-5 text-white backdrop-blur-md transition-[box-shadow,max-width] duration-500',
                    isScrolled && 'max-w-5xl shadow-[0_18px_40px_-18px_rgba(42,26,43,0.65)]',
                )}
            >
                <a href="#inicio" className="shrink-0">
                    <img src={logoNegativo} alt="Convite — Invitaciones digitales" className="h-7 sm:h-8" />
                </a>
                <nav aria-label="Secciones" className="hidden items-center gap-1 lg:flex">
                    {LINKS.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="rounded-full px-3 py-1.5 text-sm text-white/75 transition-colors hover:bg-white/10 hover:text-white"
                        >
                            {link.label}
                        </a>
                    ))}
                </nav>
                <div className="flex items-center gap-1.5 sm:gap-2">
                    {/* The panel's home: visitors without a session land on its login */}
                    <Button asChild variant="ghost" size="sm" className="rounded-full text-white hover:bg-white/10 hover:text-white">
                        <Link href={dashboard()}>Ingresar</Link>
                    </Button>
                    <Button asChild size="sm" className="rounded-full bg-gold text-ink hover:bg-gold-light">
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                            <MessageCircle />
                            <span className="sm:hidden">Cotizar</span>
                            <span className="hidden sm:inline">Cotizar por WhatsApp</span>
                        </a>
                    </Button>
                </div>
            </div>
        </header>
    );
}
