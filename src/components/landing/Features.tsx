import { SectionHeading } from '../shared/SectionHeading';
import { Reveal } from '../shared/Reveal';
import { ACCENT_CLASSES, type Accent } from './accents';

const FEATURES: { accent: Accent; icon: string; title: string; body: string }[] = [
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
];

export function Features() {
  return (
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
                <h3 className="font-jost text-sm tracking-[0.06em] text-[#2a1a2b] uppercase mb-3">
                  {feature.title}
                </h3>
                <p className="text-[15px] font-light leading-[1.8] text-[#4a3820]">{feature.body}</p>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
