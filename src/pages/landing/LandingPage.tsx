import { useEffect } from 'react';
import '../../styles/landing.css';

export function LandingPage() {
  useEffect(() => {
    document.title = 'Invitaciones digitales a medida';
  }, []);

  return (
    <div className="landing">
      <section className="landing-hero">
        <p className="section-label">Invitaciones digitales</p>
        <h1 className="landing-title">Cada historia, su propia invitación</h1>
        <p className="body-text landing-subtitle">
          Diseñamos y publicamos invitaciones de boda a medida: contenido, paleta
          de colores y detalles propios para cada pareja, listas para compartir
          por WhatsApp.
        </p>
      </section>

      <section className="landing-features">
        <div className="landing-feature">
          <h2 className="landing-feature-title">Diseño a medida</h2>
          <p className="body-text">
            Cada invitación tiene su propio contenido, tipografía y paleta de
            colores — nada de plantillas genéricas.
          </p>
        </div>
        <div className="landing-feature">
          <h2 className="landing-feature-title">RSVP integrado</h2>
          <p className="body-text">
            Confirmación de asistencia directa por WhatsApp, sin apps ni
            registros adicionales.
          </p>
        </div>
        <div className="landing-feature">
          <h2 className="landing-feature-title">Lista en minutos</h2>
          <p className="body-text">
            Comparte un enlace propio con tus invitados, accesible desde
            cualquier dispositivo.
          </p>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
