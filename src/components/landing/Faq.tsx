import { SectionHeading } from '../shared/SectionHeading';
import { Reveal } from '../shared/Reveal';

const FAQS: { question: string; answer: string }[] = [
  {
    question: '¿Cuánto cuesta una invitación digital?',
    answer:
      'Cada invitación se cotiza según lo que necesite su evento. Escríbanos por WhatsApp y les compartimos una propuesta clara antes de empezar, sin compromiso.',
  },
  {
    question: '¿Cuánto tiempo tarda en estar lista?',
    answer:
      'Entre 3 y 5 días hábiles una vez que recibimos su información y fotos. Si su fecha está cerca, cuéntenos y buscamos la manera de ayudarles.',
  },
  {
    question: '¿Puedo pedir cambios después de verla?',
    answer:
      'Sí. Su cotización incluye dos rondas de ajustes para que la invitación quede exactamente como la imaginaron antes de compartirla.',
  },
  {
    question: '¿Cómo la comparto con mis invitados?',
    answer:
      'Reciben un enlace propio, listo para enviar por WhatsApp, redes sociales o correo. Al pegarlo se muestra una vista previa con su propia imagen y descripción.',
  },
  {
    question: '¿Es solo para bodas?',
    answer:
      'No. Diseñamos invitaciones digitales para XV años, bautizos, cumpleaños y cualquier evento que merezca una invitación tan especial como la ocasión.',
  },
];

export function Faq() {
  return (
    <section className="max-w-[820px] mx-auto px-8 pb-[120px]">
      <Reveal className="text-center mb-14">
        <SectionHeading eyebrow="Preguntas frecuentes" title="Antes de escribirnos" />
      </Reveal>
      <div className="flex flex-col gap-4">
        {FAQS.map((faq) => (
          <Reveal key={faq.question}>
            <details className="group border border-primary/15 bg-[linear-gradient(160deg,var(--color-ivory),var(--color-cream))] px-6 py-5 open:shadow-[0_12px_40px_rgba(42,26,43,0.08)]">
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-jost text-[13px] sm:text-sm tracking-[0.03em] text-primary">
                {faq.question}
                <span className="shrink-0 font-display text-lg text-gold transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-4 text-[15px] font-light leading-[1.8] text-[#4a3820]">{faq.answer}</p>
            </details>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
