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

export function Hero() {
  const whatsappUrl = buildWhatsappUrl('Hola 👋 Quiero cotizar una invitación digital para mi boda.');

  return (
    <section className="max-w-[920px] mx-auto text-center px-8 pb-[90px] pt-[130px] md:pt-[150px]">
      <img src={convitePetal} alt="" aria-hidden="true" className="w-[72px] h-[72px] mx-auto mb-8" />
      <p className="font-jost text-[10px] tracking-[0.6em] text-gold uppercase mb-4">
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
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-jost text-[11px] tracking-[0.35em] uppercase text-white bg-gold-deep py-4 px-9 transition-[background-color,transform] duration-200 hover:bg-gold hover:-translate-y-0.5"
        >
          Cotiza tu invitación
        </a>
        <Link
          to="/i/mati-nayith"
          className="font-jost text-[11px] tracking-[0.35em] uppercase text-gold-deep border border-gold/50 py-4 px-9 transition-colors duration-200 hover:bg-gold-pale"
        >
          Ver invitación de ejemplo
        </Link>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
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
    </section>
  );
}
