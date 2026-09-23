import { Link } from 'react-router-dom';
import { buildWhatsappUrl } from '../../config/contact';
import convitePetal from '../../assets/images/convite-icon.svg';
import { ACCENT_CLASSES, type Accent } from './accents';

const TAGS: { label: string; accent: Accent }[] = [
  { label: 'Diseño a medida', accent: 'gold' },
  { label: 'RSVP por WhatsApp', accent: 'terracotta' },
  { label: 'Cuenta regresiva', accent: 'rose' },
  { label: 'Música ambiental', accent: 'teal' },
];

const STATS: { value: string; label: string }[] = [
  { value: '3–5 días', label: 'Tiempo de entrega' },
  { value: '100%', label: 'Diseño a su gusto' },
  { value: '2', label: 'Rondas de ajustes incluidas' },
];

export function Hero() {
  const whatsappUrl = buildWhatsappUrl('Hola 👋 Quiero cotizar una invitación digital para mi evento.');

  return (
    <section className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0" aria-hidden="true">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--color-cream),var(--color-ivory)_70%)]" />
        <div className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-gold/30 blur-[100px]" />
        <div className="absolute -top-16 right-[-120px] w-[380px] h-[380px] rounded-full bg-primary/15 blur-[110px]" />
        <div className="absolute top-[220px] left-[10%] w-[320px] h-[320px] rounded-full bg-rose/20 blur-[100px]" />
        <div className="absolute top-[120px] right-[15%] w-[300px] h-[300px] rounded-full bg-teal/20 blur-[100px]" />
      </div>

      <div className="relative z-10 max-w-[1180px] mx-auto px-8 pb-[100px] pt-[140px] md:pt-[160px]">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-16 items-center">
          <div className="text-center lg:text-left">
            <img
              src={convitePetal}
              alt=""
              aria-hidden="true"
              className="w-[64px] h-[64px] mx-auto lg:mx-0 mb-7 drop-shadow-[0_8px_30px_rgba(42,26,43,0.15)]"
            />
            <p className="font-jost text-[10px] tracking-[0.6em] text-gold uppercase mb-4">
              Invitaciones digitales para cualquier evento
            </p>
            <h1 className="font-script text-[clamp(46px,7vw,74px)] text-primary mb-6 leading-[1.15]">
              La invitación que su evento merece
            </h1>
            <p className="text-[clamp(16px,2vw,20px)] font-light leading-[1.9] text-[#4a3820] italic max-w-[560px] mx-auto lg:mx-0 mb-9">
              Diseñamos y publicamos su invitación digital a medida — contenido, paleta de
              colores y detalles propios para cada evento — lista para compartir por WhatsApp
              en minutos.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-11">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-jost text-[11px] tracking-[0.35em] uppercase text-white bg-primary py-4 px-9 transition-[background-color,transform] duration-200 hover:bg-primary-light hover:-translate-y-0.5"
              >
                Cotiza tu invitación
              </a>
              <Link
                to="/i/demo"
                className="font-jost text-[11px] tracking-[0.35em] uppercase text-primary border border-primary/40 py-4 px-9 transition-colors duration-200 hover:bg-primary/5"
              >
                Ver invitación de ejemplo
              </Link>
            </div>

            <p className="font-jost text-[11px] tracking-[0.2em] uppercase text-primary/80 mb-8">
              Invitaciones desde <span className="text-gold">$899 pesos</span>
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-6 gap-y-2 mb-12">
              {TAGS.map(({ label, accent }) => (
                <span
                  key={label}
                  className={`font-jost text-[10px] tracking-[0.2em] uppercase ${ACCENT_CLASSES[accent].text} flex items-center gap-2`}
                >
                  <span className={`w-1.5 h-1.5 rotate-45 ${ACCENT_CLASSES[accent].bg}`} />
                  {label}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-center lg:justify-start gap-8 sm:gap-10 border-t border-primary/10 pt-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <p className="font-display text-lg sm:text-xl text-primary mb-1">{stat.value}</p>
                  <p className="font-jost text-[9px] tracking-[0.15em] uppercase text-[#4a3820]/70 max-w-[110px]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto max-w-[340px] lg:max-w-none w-full">
            <div
              className="pointer-events-none absolute -inset-8 rounded-full bg-gold/25 blur-[70px]"
              aria-hidden="true"
            />
            <Link
              to="/i/demo"
              className="group relative block rounded-[1.75rem] border border-primary/15 bg-primary p-3 shadow-[0_30px_60px_-15px_rgba(42,26,43,0.45)] transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="rounded-[1.35rem] border border-gold/30 bg-[linear-gradient(175deg,var(--color-ivory),var(--color-cream))] px-8 py-12 text-center">
                <img src={convitePetal} alt="" aria-hidden="true" className="w-9 h-9 mx-auto mb-6 opacity-80" />
                <p className="font-jost text-[9px] tracking-[0.5em] text-gold uppercase mb-3">
                  Nos casamos
                </p>
                <p className="font-script text-[clamp(32px,4vw,42px)] text-primary leading-tight mb-3">
                  Mariana &amp; Alejandro
                </p>
                <div className="w-10 h-px mx-auto bg-gold/50 mb-3" />
                <p className="font-jost text-[10px] tracking-[0.25em] text-[#4a3820] uppercase">
                  14 · Noviembre · 2026
                </p>
                <div className="mt-9 inline-flex items-center gap-2 font-jost text-[9px] tracking-[0.2em] text-primary/70 uppercase">
                  <span className="w-1 h-1 rotate-45 bg-terracotta" />
                  Confirmar asistencia
                </div>
              </div>
              <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-jost text-[9px] tracking-[0.3em] uppercase text-white bg-terracotta px-4 py-2 shadow-md transition-transform duration-200 group-hover:-translate-y-0.5">
                Así de linda puede quedar la suya
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
