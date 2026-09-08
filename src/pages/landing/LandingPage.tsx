import { useEffect } from 'react';

export function LandingPage() {
  useEffect(() => {
    document.title = 'Invitaciones digitales a medida';
  }, []);

  return (
    <div>
      <section className="max-w-[920px] mx-auto text-center px-10 pb-[100px] pt-[140px]">
        <p className="font-display text-[10px] tracking-[0.6em] text-gold uppercase mb-4">Invitaciones digitales</p>
        <h1 className="font-script text-[clamp(42px,7vw,72px)] text-gold-deep mb-6 leading-[1.2]">
          Cada historia, su propia invitación
        </h1>
        <p className="text-[clamp(16px,2vw,19px)] font-light leading-[1.9] text-[#4a3820] italic max-w-[560px] mx-auto">
          Diseñamos y publicamos invitaciones de boda a medida: contenido, paleta
          de colores y detalles propios para cada pareja, listas para compartir
          por WhatsApp.
        </p>
      </section>

      <section className="max-w-[920px] mx-auto text-center grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-10 pt-10 pb-[140px]">
        <div>
          <h2 className="font-display text-base tracking-[0.08em] text-gold-deep uppercase mb-3">Diseño a medida</h2>
          <p className="text-[clamp(16px,2vw,19px)] font-light leading-[1.9] text-[#4a3820] italic">
            Cada invitación tiene su propio contenido, tipografía y paleta de
            colores — nada de plantillas genéricas.
          </p>
        </div>
        <div>
          <h2 className="font-display text-base tracking-[0.08em] text-gold-deep uppercase mb-3">RSVP integrado</h2>
          <p className="text-[clamp(16px,2vw,19px)] font-light leading-[1.9] text-[#4a3820] italic">
            Confirmación de asistencia directa por WhatsApp, sin apps ni
            registros adicionales.
          </p>
        </div>
        <div>
          <h2 className="font-display text-base tracking-[0.08em] text-gold-deep uppercase mb-3">Lista en minutos</h2>
          <p className="text-[clamp(16px,2vw,19px)] font-light leading-[1.9] text-[#4a3820] italic">
            Comparte un enlace propio con tus invitados, accesible desde
            cualquier dispositivo.
          </p>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
