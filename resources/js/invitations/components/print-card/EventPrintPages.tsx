import { GuestPasses } from './GuestPasses';
import { PrintCard, type PrintCardProps } from './PrintCard';
import { initials, toCelebrant, toParentsToBe } from '../../lib/eventContent';
import type {
  BabyShowerContent,
  BaptismContent,
  BirthdayContent,
  GenderRevealContent,
  InvitationContent,
  XvContent,
} from '../../types/invitation';

/**
 * The printable card and guest passes of every kind of event but weddings, filled from the invitation's content. A
 * template's PrintCardPage / GuestPassesPage renders them with its theme class, and its print.css restyles the shared
 * layouts (see PrintCard.css). Weddings build their own, with the couple's wording.
 */

type CelebrantContent = BirthdayContent | XvContent | BaptismContent;
type ParentsToBeContent = GenderRevealContent | BabyShowerContent;
export type EventContent = CelebrantContent | ParentsToBeContent;

const SAMPLE_GUESTS = `Familia Hernández Ruiz, 4, 3
Sofía Martínez y acompañante, 2, 5
Carlos Gutiérrez, 1, 5
Familia Ramírez Ortega, 5, 2
Lucía y Fernando Castillo, 2, 7
Abuela Carmen, 1, 1`;

/** What the card and the passes say, by kind of event. */
interface Wording {
  /** "XV años de Ximena Alejandra", for the page title. */
  occasion: string;
  eyebrow: string;
  names: string[];
  subtitle?: string;
  message: string;
  signature?: string;
  monogram: string;
  /** The names on each pass: short, as they print on one line. */
  passNames: string[];
  passEyebrow: string;
}

function isCelebrant(invitation: EventContent): invitation is CelebrantContent {
  return invitation.kind === 'birthday' || invitation.kind === 'xv' || invitation.kind === 'baptism';
}

function celebrantWording(invitation: CelebrantContent): Wording {
  const celebrant = toCelebrant(invitation);
  const monogram =
    ('monogram' in invitation && invitation.monogram) || initials(...celebrant.name.split(/\s+/).slice(0, 2));
  const base = { names: [celebrant.name], signature: celebrant.hosts, monogram, passNames: [celebrant.firstName] };

  switch (invitation.kind) {
    case 'xv':
      return {
        ...base,
        occasion: `XV años de ${celebrant.name}`,
        eyebrow: 'Te invito a celebrar',
        subtitle: 'Mis XV años',
        message:
          invitation.message ||
          'Con la bendición de Dios y el cariño de mis papás, te invito a acompañarme en una noche que guardaré para siempre.',
        passEyebrow: 'Pase · Mis XV años',
      };
    case 'baptism':
      return {
        ...base,
        occasion: `Bautizo de ${celebrant.name}`,
        eyebrow: 'Con alegría te invitamos al bautizo de',
        subtitle: 'Mi bautizo',
        message:
          invitation.message ||
          'Con mucha ilusión queremos compartir contigo el día en que recibiré el sacramento del bautismo.',
        passEyebrow: 'Pase · Mi bautizo',
      };
    default: {
      const age = invitation.age ? `Mis ${invitation.age} años` : 'Mi cumpleaños';

      return {
        ...base,
        occasion: `Cumpleaños de ${celebrant.name}`,
        eyebrow: 'Te invito a celebrar',
        subtitle: age,
        message: invitation.message || 'Quiero celebrar contigo un año más de vida. ¡No faltes, la fiesta no es igual sin ti!',
        passEyebrow: `Pase · ${age}`,
      };
    }
  }
}

function parentsToBeWording(invitation: ParentsToBeContent): Wording {
  const parents = toParentsToBe(invitation);
  const base = { names: parents.names, signature: parents.families || undefined, monogram: parents.monogram, passNames: parents.names };

  // A gender reveal never prints the answer: the card is handed out before the party
  if (invitation.kind === 'gender_reveal') {
    return {
      ...base,
      occasion: `Revelación de género de ${parents.namesLabel}`,
      eyebrow: 'Revelación de género',
      subtitle: '¿Niño o niña?',
      message:
        invitation.message || 'Acompáñanos a descubrir si nuestro bebé será niño o niña. ¡Ven con tu mejor apuesta!',
      passEyebrow: 'Pase · ¿Niño o niña?',
    };
  }

  return {
    ...base,
    occasion: `Baby shower de ${parents.namesLabel}`,
    eyebrow: 'Te invitamos a nuestro baby shower',
    subtitle: invitation.babyName ? `Esperando a ${invitation.babyName}` : (invitation.dueLabel ?? 'Esperamos a nuestro bebé'),
    message: invitation.message || 'Nuestra familia está por crecer y queremos celebrarlo contigo antes de que llegue el bebé.',
    passEyebrow: 'Pase · Baby shower',
  };
}

function wordingOf(invitation: EventContent): Wording {
  return isCelebrant(invitation) ? celebrantWording(invitation) : parentsToBeWording(invitation);
}

/** The labels every kind shares (the date and the RSVP deadline). */
function labelsOf(invitation: EventContent) {
  return isCelebrant(invitation) ? toCelebrant(invitation) : toParentsToBe(invitation);
}

function backOf(invitation: InvitationContent, monogram: string, rsvpDeadlineLabel: string): PrintCardProps['back'] {
  const { dressCode } = invitation;

  return {
    monogram,
    events: invitation.venues.map((venue) => ({
      label: venue.tag,
      title: venue.name,
      lines: venue.addressLines,
      time: venue.time,
    })),
    dressCode: dressCode
      ? {
          title: `Vestimenta ${dressCode.type}`,
          note: dressCode.reservedColor
            ? `El color ${dressCode.reservedColor.name} ${dressCode.reservedColor.description}`
            : dressCode.description,
          swatches: invitation.swatches,
        }
      : undefined,
    rsvpDeadlineLabel,
  };
}

export function EventPrintCard({ invitation, themeClassName }: { invitation: EventContent; themeClassName: string }) {
  const wording = wordingOf(invitation);
  const labels = labelsOf(invitation);

  return (
    <PrintCard
      themeClassName={themeClassName}
      documentTitle={`Tarjeta — ${wording.occasion}`}
      front={{
        eyebrow: wording.eyebrow,
        names: wording.names,
        subtitle: wording.subtitle,
        message: wording.message,
        dateLabel: labels.dateLabel,
        place: invitation.venues.at(-1)?.name,
        signature: wording.signature,
      }}
      back={backOf(invitation, wording.monogram, labels.rsvpDeadlineLabel)}
    />
  );
}

export function EventGuestPasses({ invitation, themeClassName }: { invitation: EventContent; themeClassName: string }) {
  const wording = wordingOf(invitation);

  return (
    <GuestPasses
      themeClassName={themeClassName}
      documentTitle={`Pases — ${wording.occasion}`}
      names={wording.passNames}
      eyebrow={wording.passEyebrow}
      dateLabel={labelsOf(invitation).footerDateLabel}
      // One list per invitation: several invitations may share a template
      storageKey={`convite:guest-passes:${window.location.pathname}`}
      sampleGuests={SAMPLE_GUESTS}
    />
  );
}
