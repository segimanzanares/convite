import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  useEffect(() => {
    document.title = 'Página no encontrada';
  }, []);

  return (
    <section style={{ paddingTop: 160 }}>
      <p className="section-label">Error 404</p>
      <p className="body-text">
        No encontramos esta invitación. <Link to="/">Volver al inicio</Link>
      </p>
    </section>
  );
}

export default NotFoundPage;
