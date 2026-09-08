import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  useEffect(() => {
    document.title = 'Página no encontrada';
  }, []);

  return (
    <section className="max-w-[920px] mx-auto text-center px-10 pb-[100px] pt-40">
      <p className="font-display text-[10px] tracking-[0.6em] text-gold uppercase mb-4">Error 404</p>
      <p className="text-[clamp(16px,2vw,19px)] font-light leading-[1.9] text-[#4a3820] italic">
        No encontramos esta invitación. <Link to="/">Volver al inicio</Link>
      </p>
    </section>
  );
}

export default NotFoundPage;
