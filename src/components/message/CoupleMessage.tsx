import { InvitationMessage } from './InvitationMessage';
import type { CoupleInfo } from '../../types/wedding';

interface CoupleMessageProps {
  couple: CoupleInfo;
}

export function CoupleMessage({ couple }: CoupleMessageProps) {
  return (
    <InvitationMessage
      eyebrow="La invitación"
      title="Nos casamos"
      message="Junto a nuestras familias, tenemos el honor y la dicha de invitarles a compartir con nosotros el momento más especial de nuestras vidas. Su presencia hará de este día un recuerdo eterno, lleno del amor y la calidez de quienes más queremos."
      signature={couple.families}
    />
  );
}
