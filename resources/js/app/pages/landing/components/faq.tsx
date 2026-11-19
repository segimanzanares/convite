import { ChevronDown, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { formatPrice } from '@/lib/format';
import type { OfferedPlan } from '@/types/plan';
import { Reveal } from './reveal';
import { Highlight } from './section-heading';
import { useWhatsappLink } from '../use-whatsapp-link';

type Question = { question: string; answer: string };

const FAQS: Question[] = [
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
        question: '¿Mis invitados pueden compartir las fotos que tomen en el evento?',
        answer:
            'Sí, con la galería en vivo del plan Exclusivo. Ponen un código QR en las mesas; sus invitados lo escanean, suben sus fotos desde el celular sin instalar nada y aparecen al momento en una pantalla del salón. Ustedes deciden si se publican directo o si las revisan antes, y al final las descargan todas.',
    },
    {
        question: '¿Nuestros invitados pueden dejarnos un mensaje?',
        answer:
            'Sí, con el libro de buenos deseos de los planes Premium y Exclusivo. Desde la invitación les escriben sus felicitaciones y cada mensaje queda en su propia hoja. Ustedes eligen si se muestran a todos o solo ustedes los leen, pueden revisarlos antes de publicarlos y al final descargan el libro completo en PDF.',
    },
    {
        question: '¿Es solo para bodas?',
        answer:
            'No. Diseñamos invitaciones digitales para XV años, bautizos, cumpleaños y cualquier evento que merezca una invitación tan especial como la ocasión.',
    },
];

export function Faq({ plans }: { plans: OfferedPlan[] }) {
    const whatsappLink = useWhatsappLink();
    const whatsappUrl = whatsappLink('Hola 👋 Tengo una pregunta sobre las invitaciones digitales de Convite.');
    const lowestPrice = plans.length > 0 ? Math.min(...plans.map((plan) => Number(plan.price))) : null;
    const faqs: Question[] = [
        ...(lowestPrice === null
            ? []
            : [
                  {
                      question: '¿Cuánto cuesta una invitación digital?',
                      answer: `Desde ${formatPrice(lowestPrice)} pesos por invitación, con un diseño de nuestro catálogo. Los planes más completos suman lista de invitados, confirmaciones en línea, tarjeta y pases imprimibles, o un diseño exclusivo para su evento.`,
                  },
              ]),
        ...FAQS,
    ];

    return (
        <section id="preguntas" className="scroll-mt-28 bg-cream/70 py-24 md:py-32">
            <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
                <Reveal className="text-center lg:text-left">
                    <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold-pale/60 px-3 py-1 text-xs font-medium text-gold-deep">
                        <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
                        Preguntas frecuentes
                    </span>
                    <h2 className="text-[clamp(32px,4.6vw,52px)] leading-[1.08] font-semibold tracking-tight text-balance">
                        Antes de <Highlight>escribirnos</Highlight>
                    </h2>
                    <p className="mt-5 text-lg leading-relaxed text-muted-foreground">
                        ¿Tienen otra duda? Respondemos por WhatsApp el mismo día.
                    </p>
                    <Button asChild variant="outline" size="lg" className="mt-7 rounded-full bg-card">
                        <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                            <MessageCircle /> Preguntar por WhatsApp
                        </a>
                    </Button>
                </Reveal>
                <div className="flex flex-col gap-3">
                    {faqs.map((faq, index) => (
                        <Reveal key={faq.question} delay={index * 60}>
                            <Collapsible
                                defaultOpen={index === 0}
                                className="group rounded-2xl border bg-card shadow-xs transition-shadow data-[state=open]:shadow-md"
                            >
                                <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 rounded-2xl px-6 py-5 text-left text-base font-semibold outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50">
                                    {faq.question}
                                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted transition-[transform,background-color] duration-300 group-data-[state=open]:rotate-180 group-data-[state=open]:bg-primary group-data-[state=open]:text-primary-foreground">
                                        <ChevronDown className="size-4" />
                                    </span>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down">
                                    <p className="px-6 pb-5 leading-relaxed text-muted-foreground">{faq.answer}</p>
                                </CollapsibleContent>
                            </Collapsible>
                        </Reveal>
                    ))}
                </div>
            </div>
        </section>
    );
}
