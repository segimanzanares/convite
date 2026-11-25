import { SearchX } from 'lucide-react';
import { ErrorScreen } from '../../components/error/ErrorScreen';

export function NotFoundPage() {
  return (
    <ErrorScreen
      status={404}
      pageTitle="Página no encontrada"
      badge="Error 404"
      title="No encontramos esta página"
      icon={<SearchX />}
      showBack
    >
      <p>
        Puede que el enlace esté incompleto o que la invitación haya cambiado de dirección. Revisa el enlace que te
        compartieron o pídeselo de nuevo a los anfitriones.
      </p>
    </ErrorScreen>
  );
}

export default NotFoundPage;
