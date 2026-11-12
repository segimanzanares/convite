import { InvitationMessage } from './InvitationMessage';
import type { CoupleInfo } from '../../types/wedding';

interface CoupleMessageProps {
  couple: CoupleInfo;
  /** Replaces the default text. */
  message?: string | null;
}

const DEFAULT_MESSAGE =
  'Junto a nuestras familias, tenemos el honor y la dicha de invitarles a compartir con nosotros el momento más especial de nuestras vidas. Su presencia hará de este día un recuerdo eterno, lleno del amor y la calidez de quienes más queremos.';

export function CoupleMessage({ couple, message }: CoupleMessageProps) {
  return (
    <InvitationMessage
      eyebrow="La invitación"
      title="Nos casamos"
      message={message || DEFAULT_MESSAGE}
      signature={couple.families}
    />
  );
}
