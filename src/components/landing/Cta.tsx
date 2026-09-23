import { buildWhatsappUrl } from '../../config/contact';

export function Cta() {
  const whatsappUrl = buildWhatsappUrl(
    'Hola 👋 Me interesa el servicio de invitaciones digitales de Convite. ¿Podemos platicar sobre mi evento?',
  );

  return (
    <section className="relative overflow-hidden bg-primary text-center py-[110px] px-8">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute -top-24 left-[8%] w-[320px] h-[320px] rounded-full bg-gold/15 blur-[110px]" />
        <div className="absolute -bottom-24 right-[8%] w-[320px] h-[320px] rounded-full bg-rose/15 blur-[110px]" />
      </div>
      <div className="relative z-10">
        <p className="font-jost text-[10px] tracking-[0.6em] text-gold uppercase mb-5">Empecemos hoy</p>
        <h2 className="font-script text-[clamp(38px,6vw,60px)] text-white mb-6 leading-[1.2]">
          Cuéntenos su fecha y hagamos su invitación
        </h2>
        <p className="text-[clamp(15px,2vw,18px)] font-light leading-[1.9] text-white/85 italic max-w-[560px] mx-auto mb-10">
          Escríbanos por WhatsApp y en el mismo día les compartimos una propuesta a medida
          para su evento, sin compromiso.
        </p>
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-jost text-[11px] tracking-[0.35em] uppercase text-primary bg-gold py-4 px-10 transition-[background-color,transform] duration-200 hover:bg-gold-light hover:-translate-y-0.5"
        >
          Escríbenos por WhatsApp
        </a>
        <p className="mt-6 font-jost text-[10px] tracking-[0.2em] uppercase text-white/60">
          Respuesta el mismo día · Sin compromiso
        </p>
      </div>
    </section>
  );
}
