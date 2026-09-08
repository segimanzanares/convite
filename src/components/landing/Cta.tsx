import { buildWhatsappUrl } from '../../config/contact';

export function Cta() {
  const whatsappUrl = buildWhatsappUrl(
    'Hola 👋 Me interesa el servicio de invitaciones digitales de Convite. ¿Podemos platicar sobre mi evento?',
  );

  return (
    <section className="relative overflow-hidden bg-[linear-gradient(135deg,var(--color-terracotta),var(--color-rose))] text-center py-[110px] px-8">
      <p className="font-jost text-[10px] tracking-[0.6em] text-white/80 uppercase mb-5">Empecemos hoy</p>
      <h2 className="font-script text-[clamp(38px,6vw,60px)] text-white mb-6 leading-[1.2]">
        Cuéntenos su fecha y hagamos su invitación
      </h2>
      <p className="text-[clamp(15px,2vw,18px)] font-light leading-[1.9] text-white/90 italic max-w-[560px] mx-auto mb-10">
        Escríbanos por WhatsApp y les compartimos una propuesta a medida para su evento,
        sin compromiso.
      </p>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block font-jost text-[11px] tracking-[0.35em] uppercase text-[#2a1a2b] bg-white py-4 px-10 transition-transform duration-200 hover:-translate-y-0.5"
      >
        Escríbenos por WhatsApp
      </a>
    </section>
  );
}
