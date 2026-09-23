import { SectionHeading } from '../shared/SectionHeading';
import { Reveal } from '../shared/Reveal';
import { ACCENT_CLASSES, type Accent } from './accents';

const STEPS: { accent: Accent; title: string; body: string }[] = [
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
];

export function Steps() {
  return (
    <section className="max-w-[1000px] mx-auto px-8 py-[120px]">
      <Reveal className="text-center mb-16">
        <SectionHeading eyebrow="Cómo funciona" title="De la idea al enlace en 4 pasos" />
      </Reveal>
      <div className="relative grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-10">
        <div
          className="hidden md:block absolute top-[22px] left-[12%] right-[12%] h-px bg-primary/15"
          aria-hidden="true"
        />
        {STEPS.map((step, index) => {
          const accent = ACCENT_CLASSES[step.accent];
          return (
            <Reveal key={step.title} className="relative text-center">
              <div
                className={`relative z-10 w-11 h-11 mx-auto mb-5 flex items-center justify-center rounded-full bg-primary font-jost text-sm text-white ring-4 ring-cream`}
              >
                {index + 1}
              </div>
              <h3 className={`font-jost text-sm tracking-[0.06em] uppercase mb-3 ${accent.text}`}>{step.title}</h3>
              <p className="text-[15px] font-light leading-[1.8] text-[#4a3820]">{step.body}</p>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
