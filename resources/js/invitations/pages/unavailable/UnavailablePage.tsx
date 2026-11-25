import { Heart } from 'lucide-react';
import { ErrorScreen } from '../../components/error/ErrorScreen';

/** Shown, with a 410 status, to guests who open the link of an archived invitation. */
export function UnavailablePage() {
  return (
    <ErrorScreen
      status={410}
      pageTitle="Invitación no disponible"
      badge="Invitación no disponible"
      title="Esta invitación ya cerró"
      icon={<Heart />}
    >
      <p>Los anfitriones ya archivaron esta invitación. Gracias por haber sido parte de la celebración.</p>
    </ErrorScreen>
  );
}

export default UnavailablePage;
