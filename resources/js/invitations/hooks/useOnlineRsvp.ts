import { useState, type FormEvent } from 'react';
import { useHttp, usePage } from '@inertiajs/react';
import type { InvitationPageProps, RsvpAnswer } from '../types/rsvp';

interface OnlineRsvpForm {
  token: string;
  name: string;
  attending: boolean;
  /** People attending, the person answering included. */
  seats: number;
  message: string;
}

/**
 * State of the RSVP section when the invitation's plan stores answers online.
 * It reads the `rsvp` settings and the personalized link's `guest` from the
 * page props, so templates do not need to pass them down. A guest sees their
 * current answer and may change it until the deadline; the open form starts
 * blank every time.
 */
export function useOnlineRsvp() {
  const { rsvp: settings, guest = null } = usePage<InvitationPageProps>().props;
  const answer = guest?.rsvp ?? null;

  const http = useHttp<OnlineRsvpForm, RsvpAnswer>({
    token: guest?.token ?? '',
    name: guest?.name ?? '',
    attending: answer?.attending ?? true,
    seats: answer?.seats_confirmed || guest?.seats || 1,
    message: answer?.message ?? '',
  });
  const [isAnswered, setIsAnswered] = useState(answer !== null);

  const errors = http.errors as Partial<Record<keyof OnlineRsvpForm | 'rsvp', string>>;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!settings) return;

    http.post(settings.url, { onSuccess: () => setIsAnswered(true) });
  }

  return {
    isOnline: settings?.online ?? false,
    isOpen: settings?.open ?? false,
    guest,
    /** The most people the form lets confirm: the guest's seats, or the open form's limit. */
    maxSeats: guest?.seats ?? settings?.max_seats ?? 1,
    form: http.data,
    setField: http.setData,
    errors,
    processing: http.processing,
    isAnswered,
    /** Shows the form again so a guest can change their answer. */
    editAnswer: () => setIsAnswered(false),
    submit,
  };
}

/** "1 lugar" / "4 lugares". */
export function seatsLabel(seats: number) {
  return seats === 1 ? '1 lugar' : `${seats} lugares`;
}
