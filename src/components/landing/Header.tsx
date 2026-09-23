import { buildWhatsappUrl } from '../../config/contact';
import logoNegativo from '../../assets/images/logo-negativo.svg';

export function Header() {
  const whatsappUrl = buildWhatsappUrl('Hola 👋 Quiero cotizar una invitación digital para mi evento.');

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="absolute inset-0 bg-primary/95 backdrop-blur-sm border-b border-gold/25" />
      <div className="relative max-w-[1100px] mx-auto flex items-center justify-between gap-3 px-4 sm:px-8 py-4">
        <img src={logoNegativo} alt="Convite — Invitaciones digitales" className="h-7 sm:h-8 md:h-10 shrink-0" />
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 whitespace-nowrap font-jost text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.3em] uppercase text-primary bg-gold py-2 px-3 sm:py-2.5 sm:px-5 transition-colors duration-200 hover:bg-gold-light"
        >
          <span className="sm:hidden">WhatsApp</span>
          <span className="hidden sm:inline">Cotizar por WhatsApp</span>
        </a>
      </div>
    </header>
  );
}
