import { useState, type FormEvent } from 'react';
import { useHttp, usePage } from '@inertiajs/react';
import { eventDates, formatDate, initials } from '../lib/eventContent';
import type { InvitationContent } from '../types/invitation';
import type { InvitationPageProps, PublicWish } from '../types/rsvp';

interface WishForm {
  token: string;
  author_name: string;
  message: string;
  /** Hidden from people (see WishesBook), so only bots fill it in. */
  website: string;
}

type StoredWish = PublicWish & { status: 'approved' | 'pending' };

/** What the cover of the book shows, taken from the invitation's content. */
export interface WishesCover {
  /** "Mati & Nayith", "Brianna Michel". */
  title: string;
  /** Who the messages are for, inside a sentence: "Mati & Nayith", "Brianna". */
  recipient: string;
  /** The book is for a couple, so sentences about them take the plural. */
  plural: boolean;
  monogram: string;
  /** "Nuestra boda", "Mis XV años"... */
  occasion: string;
  /** "05 · diciembre · 2026", or empty without a date. */
  dateLabel: string;
}

const OCCASIONS: Record<Exclude<InvitationContent['kind'], 'birthday'>, string> = {
  wedding: 'Nuestra boda',
  xv: 'Mis XV años',
  baptism: 'Mi bautizo',
  gender_reveal: '¿Niño o niña?',
};

function toCover(invitation: InvitationContent): WishesCover {
  const dateLabel = formatDate(eventDates(invitation).eventDate, "dd '·' MMMM '·' yyyy");

  if (invitation.kind === 'wedding' || invitation.kind === 'gender_reveal') {
    const title = invitation.names.filter(Boolean).join(' & ');

    return {
      title,
      recipient: title,
      plural: invitation.names.length > 1,
      monogram: initials(...invitation.names),
      occasion: OCCASIONS[invitation.kind],
      dateLabel,
    };
  }

  const monogram =
    ('monogram' in invitation && invitation.monogram) || initials(...invitation.name.split(/\s+/).slice(0, 2));
  const occasion =
    invitation.kind === 'birthday'
      ? invitation.age
        ? `Mis ${invitation.age} años`
        : 'Mi cumpleaños'
      : OCCASIONS[invitation.kind];

  return { title: invitation.name, recipient: invitation.firstName, plural: false, monogram, occasion, dateLabel };
}

/**
 * State of the wishes book section. It reads the `wishes` settings, the `invitation` (for the book's cover) and the
 * personalized link's `guest` from the page props, so templates only render it. `book` is null when the invitation
 * does not offer it, and then the section renders nothing.
 *
 * The book opens on its cover (`page` -1); each message the invitation makes public is a page. A message sent while
 * the book is public and not moderated becomes the first page, and the book opens on it.
 */
export function useWishes() {
  const { wishes: book = null, guest = null, invitation } = usePage<
    InvitationPageProps & { invitation: InvitationContent }
  >().props;
  const [wishes, setWishes] = useState<PublicWish[]>(book?.wishes ?? []);
  const [sent, setSent] = useState<StoredWish | null>(null);
  const [page, setPage] = useState(-1);

  const http = useHttp<WishForm, StoredWish>({
    token: guest?.token ?? '',
    author_name: guest?.name ?? '',
    message: '',
    website: '',
  });

  const errors = http.errors as Partial<Record<keyof WishForm | 'wish', string>>;
  const isPublic = book?.public ?? false;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!book) return;

    http.post(book.url, {
      onSuccess: (wish) => {
        setSent(wish);
        if (isPublic && wish.status === 'approved') {
          setWishes((current) => [wish, ...current]);
          setPage(0);
        }
        http.setData('message', '');
      },
    });
  }

  return {
    book,
    cover: toCover(invitation),
    isOpen: book?.open ?? false,
    isPublic,
    isModerated: book?.moderated ?? false,
    maxLength: book?.max_length ?? 500,
    wishes,
    /** The open page: -1 for the cover, then one per message. */
    page,
    /** Turns to the given page, within the book. */
    turnTo: (next: number) => setPage(Math.max(-1, Math.min(next, wishes.length - 1))),
    form: http.data,
    setField: http.setData,
    /** The first error to show under the form. */
    error: errors.author_name ?? errors.message ?? errors.wish ?? errors.website,
    processing: http.processing,
    /** The message just sent, to thank its author; null while the form shows. */
    sent,
    /** Whether the message just sent waits for approval before showing. */
    sentIsPending: sent?.status === 'pending',
    /** Shows the form again to leave another message. */
    writeAnother: () => setSent(null),
    submit,
  };
}

export type WishesState = ReturnType<typeof useWishes>;
