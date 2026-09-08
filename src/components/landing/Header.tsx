import { buildWhatsappUrl } from '../../config/contact';
import logoHorizontal from '../../assets/images/logo-horizontal.svg';

export function Header() {
  const whatsappUrl = buildWhatsappUrl('Hola 👋 Quiero cotizar una invitación digital para mi evento.');

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-ivory/90 backdrop-blur-sm border-b border-gold/15">
      <div className="max-w-[1100px] mx-auto flex items-center justify-between px-8 py-4">
        <img src={logoHorizontal} alt="Convite — Invitaciones digitales" className="h-8 md:h-10" />
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-block font-jost text-[10px] tracking-[0.3em] uppercase text-gold-deep border border-gold/50 py-2.5 px-5 transition-colors duration-200 hover:bg-gold hover:text-white"
        >
          Cotizar por WhatsApp
        </a>
      </div>
    </header>
  );
}
