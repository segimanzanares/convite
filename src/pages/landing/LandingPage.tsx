import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SectionHeading } from '../../components/shared/SectionHeading';
import { Reveal } from '../../components/shared/Reveal';
import { FullDivider } from '../../components/divider/FullDivider';
import { buildWhatsappUrl } from '../../config/contact';
import logoHorizontal from '../../assets/images/logo-horizontal.svg';
import convitePetal from '../../assets/images/convite-icon.svg';

const FEATURES = [
  {
    accent: 'gold',
    icon: '✎',
    title: 'Diseño 100% a medida',
    body: 'Tipografía, colores y contenido propios de cada pareja — nada de plantillas genéricas reutilizadas.',
  },
  {
    accent: 'terracotta',
    icon: '✆',
    title: 'RSVP por WhatsApp',
    body: 'Tus invitados confirman con un solo toque, directo a tu WhatsApp. Sin apps ni registros.',
  },
  {
    accent: 'rose',
    icon: '♡',
    title: 'Cuenta regresiva en vivo',
    body: 'Un contador que mantiene la emoción viva desde el día que se comparte hasta la boda.',
  },
  {
    accent: 'teal',
    icon: '♫',
    title: 'Galería y música ambiental',
    body: 'Fotos, un sobre animado al abrir y una canción de fondo que le dan una bienvenida memorable.',
  },
  {
    accent: 'gold',
    icon: '⇪',
    title: 'Lista para compartir',
    body: 'Vista previa con imagen y descripción propias al pegar el enlace en WhatsApp o redes.',
  },
  {
    accent: 'terracotta',
    icon: '⏱',
    title: 'Lista en días',
    body: 'De la primera plática al enlace terminado, sin meses de espera ni procesos complicados.',
  },
] as const;

const STEPS = [
  {
    accent: 'gold',
    title: 'Cuéntanos su historia',
    body: 'Fecha, lugar, fotos y la paleta de colores que quieren para su invitación.',
  },
  {
    accent: 'terracotta',
    title: 'Diseñamos a medida',
    body: 'Creamos su invitación con su contenido, su estilo y los detalles que la hacen única.',
  },
  {
    accent: 'rose',
    title: 'Revisan y ajustan',
    body: 'Ven la invitación terminada y piden los cambios que necesiten antes de publicarla.',
  },
  {
    accent: 'teal',
    title: 'Comparten el enlace',
    body: 'Reciben un enlace propio, listo para enviar a sus invitados por WhatsApp.',
  },
] as const;

const ACCENT_CLASSES: Record<string, { text: string; border: string; bg: string }> = {
  gold: { text: 'text-gold-deep', border: 'border-gold/40', bg: 'bg-gold' },
  terracotta: { text: 'text-terracotta', border: 'border-terracotta/40', bg: 'bg-terracotta' },
  rose: { text: 'text-rose', border: 'border-rose/40', bg: 'bg-rose' },
  teal: { text: 'text-teal', border: 'border-teal/40', bg: 'bg-teal' },
};

export function LandingPage() {
  useEffect(() => {
    document.title = 'Convite — Invitaciones digitales de boda a medida';
  }, []);

  const heroWhatsappUrl = buildWhatsappUrl('Hola 👋 Quiero cotizar una invitación digital para mi boda.');
  const ctaWhatsappUrl = buildWhatsappUrl(
    'Hola 👋 Me interesa el servicio de invitaciones digitales de Convite. ¿Podemos platicar sobre mi evento?',
  );

  return (
    <div>
      <header className="max-w-[1100px] mx-auto flex items-center justify-between px-8 pt-8">
        <img src={logoHorizontal} alt="Convite — Invitaciones digitales" className="h-9 md:h-11" />
        <a
          href={heroWhatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-block font-display text-[10px] tracking-[0.3em] uppercase text-gold-deep border border-gold/50 py-2.5 px-5 transition-colors duration-200 hover:bg-gold hover:text-white"
        >
          Cotizar por WhatsApp
        </a>
      </header>

      <section className="max-w-[920px] mx-auto text-center px-8 pb-[90px] pt-[90px] md:pt-[120px]">
        <img src={convitePetal} alt="" aria-hidden="true" className="w-[72px] h-[72px] mx-auto mb-8" />
        <p className="font-display text-[10px] tracking-[0.6em] text-gold uppercase mb-4">
          Invitaciones digitales de boda
        </p>
        <h1 className="font-script text-[clamp(46px,8vw,80px)] text-gold-deep mb-6 leading-[1.15]">
          La invitación que su historia merece
        </h1>
        <p className="text-[clamp(16px,2vw,20px)] font-light leading-[1.9] text-[#4a3820] italic max-w-[600px] mx-auto mb-10">
          Diseñamos y publicamos su invitación de boda a medida — contenido, paleta de
          colores y detalles propios para cada pareja — lista para compartir por WhatsApp
          en minutos.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <a
            href={heroWhatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-[11px] tracking-[0.35em] uppercase text-white bg-gold-deep py-4 px-9 transition-[background-color,transform] duration-200 hover:bg-gold hover:-translate-y-0.5"
          >
            Cotiza tu invitación
          </a>
          <Link
            to="/i/mati-nayith"
            className="font-display text-[11px] tracking-[0.35em] uppercase text-gold-deep border border-gold/50 py-4 px-9 transition-colors duration-200 hover:bg-gold-pale"
          >
            Ver invitación de ejemplo
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {['Diseño a medida', 'RSVP por WhatsApp', 'Cuenta regresiva', 'Música ambiental'].map((tag, index) => {
            const accents = ['gold', 'terracotta', 'rose', 'teal'];
            const accent = ACCENT_CLASSES[accents[index % accents.length]];
            return (
              <span
                key={tag}
                className={`font-display text-[10px] tracking-[0.2em] uppercase ${accent.text} flex items-center gap-2`}
              >
                <span className={`w-1.5 h-1.5 rotate-45 ${accent.bg}`} />
                {tag}
              </span>
            );
          })}
        </div>
      </section>

      <section className="max-w-[1100px] mx-auto px-8 pb-[120px]">
        <Reveal className="text-center mb-16">
          <SectionHeading eyebrow="Por qué Convite" title="Todo lo que necesita su invitación" />
        </Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-8">
          {FEATURES.map((feature) => {
            const accent = ACCENT_CLASSES[feature.accent];
            return (
              <Reveal key={feature.title}>
                <div
                  className={`h-full border ${accent.border} py-9 px-7 bg-[linear-gradient(160deg,var(--color-ivory),var(--color-cream))] transition-[transform,box-shadow] duration-[400ms] ease hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(42,26,43,0.1)]`}
                >
                  <span className={`text-2xl mb-4 block ${accent.text}`}>{feature.icon}</span>
                  <h3 className="font-display text-sm tracking-[0.06em] text-[#2a1a2b] uppercase mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-[15px] font-light leading-[1.8] text-[#4a3820]">{feature.body}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <FullDivider text="Su boda, su invitación" />

      <section className="max-w-[1000px] mx-auto px-8 py-[120px]">
        <Reveal className="text-center mb-16">
          <SectionHeading eyebrow="Cómo funciona" title="De la idea al enlace en 4 pasos" />
        </Reveal>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-10">
          {STEPS.map((step, index) => {
            const accent = ACCENT_CLASSES[step.accent];
            return (
              <Reveal key={step.title} className="text-center">
                <div
                  className={`w-11 h-11 mx-auto mb-5 flex items-center justify-center border ${accent.border} font-display text-sm ${accent.text}`}
                >
                  {index + 1}
                </div>
                <h3 className="font-display text-sm tracking-[0.06em] text-[#2a1a2b] uppercase mb-3">
                  {step.title}
                </h3>
                <p className="text-[15px] font-light leading-[1.8] text-[#4a3820]">{step.body}</p>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="relative overflow-hidden bg-[linear-gradient(135deg,var(--color-terracotta),var(--color-rose))] text-center py-[110px] px-8">
        <p className="font-display text-[10px] tracking-[0.6em] text-white/80 uppercase mb-5">Empecemos hoy</p>
        <h2 className="font-script text-[clamp(38px,6vw,60px)] text-white mb-6 leading-[1.2]">
          Cuéntenos su fecha y hagamos su invitación
        </h2>
        <p className="text-[clamp(15px,2vw,18px)] font-light leading-[1.9] text-white/90 italic max-w-[560px] mx-auto mb-10">
          Escríbanos por WhatsApp y les compartimos una propuesta a medida para su boda,
          sin compromiso.
        </p>
        <a
          href={ctaWhatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-display text-[11px] tracking-[0.35em] uppercase text-[#2a1a2b] bg-white py-4 px-10 transition-transform duration-200 hover:-translate-y-0.5"
        >
          Escríbenos por WhatsApp
        </a>
      </section>

      <footer className="text-center py-[60px] px-8 bg-ivory">
        <img src={logoHorizontal} alt="Convite — Invitaciones digitales" className="h-9 mx-auto mb-5" />
        <p className="font-display text-[9px] tracking-[0.5em] text-gold uppercase">
          Invitaciones digitales a medida
        </p>
        <div className="w-[120px] h-px mx-auto bg-[linear-gradient(to_right,transparent,var(--color-gold),transparent)] mt-[30px]" />
      </footer>
    </div>
  );
}

export default LandingPage;
