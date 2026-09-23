import { buildWhatsappUrl } from '../../config/contact';
import logoNegativo from '../../assets/images/logo-negativo.svg';

export function Footer() {
  const whatsappUrl = buildWhatsappUrl('Hola 👋 Quiero cotizar una invitación digital para mi evento.');

  return (
    <footer className="text-center py-[60px] px-8 bg-primary-dark">
      <img src={logoNegativo} alt="Convite — Invitaciones digitales" className="h-9 mx-auto mb-5" />
      <p className="font-jost text-[9px] tracking-[0.5em] text-gold uppercase">Invitaciones digitales a medida</p>
      <div className="w-[120px] h-px mx-auto bg-[linear-gradient(to_right,transparent,var(--color-gold),transparent)] my-[30px]" />
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="font-jost text-[10px] tracking-[0.25em] uppercase text-white/70 hover:text-gold transition-colors duration-200"
      >
        Cotizar por WhatsApp
      </a>
    </footer>
  );
}
