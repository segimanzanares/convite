import { useEffect } from 'react';
import { Link } from '@inertiajs/react';

/** Shown, with a 410 status, to guests who open the link of an archived invitation. */
export function UnavailablePage() {
  useEffect(() => {
    document.title = 'Invitación no disponible';
  }, []);

  return (
    <section className="max-w-[920px] mx-auto text-center px-10 pb-[100px] pt-40">
      <p className="font-display text-[10px] tracking-[0.6em] text-gold uppercase mb-4">Invitación no disponible</p>
      <p className="text-[clamp(16px,2vw,19px)] font-light leading-[1.9] text-[var(--text-body)] italic">
        Esta invitación ya no está disponible. Gracias por haber sido parte de la celebración.{' '}
        <Link href="/">Volver al inicio</Link>
      </p>
    </section>
  );
}

export default UnavailablePage;
