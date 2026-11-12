import { useState } from 'react';
import { router, usePage } from '@inertiajs/react';
import type { CheckInGuest } from '../../types/checkIn';
import { formatArrivalTime, peopleLabel } from '../../utils/checkIn';

/**
 * One guest at the door: who they are, their table and answer, and the number of people arriving. Checking in again
 * corrects the number (e.g. the rest of the family arrives later) instead of adding to it.
 */
export function CheckInCard({ guest }: { guest: CheckInGuest }) {
  const errors = usePage().props.errors as Record<string, string | undefined>;
  const [seats, setSeats] = useState(defaultSeats(guest));
  const [processing, setProcessing] = useState(false);
  const isCheckedIn = guest.checked_in_at !== null;
  const isComplete = isCheckedIn && guest.checked_in_seats >= guest.seats;

  const options = { preserveScroll: true, onStart: () => setProcessing(true), onFinish: () => setProcessing(false) };

  function checkIn() {
    router.post(guest.check_in_url, { seats }, options);
  }

  function undo() {
    if (window.confirm(`¿Deshacer la llegada de ${guest.name}?`)) {
      router.delete(guest.check_in_url, options);
    }
  }

  return (
    <article className="bg-ivory border border-primary/15 p-5">
      <h2 className="font-display text-lg text-primary">{guest.name}</h2>
      <dl className="mt-2 grid grid-cols-2 gap-y-1 text-sm">
        <dt className="text-ink/60">Pase para</dt>
        <dd>{peopleLabel(guest.seats)}</dd>
        <dt className="text-ink/60">Mesa</dt>
        <dd>{guest.table_label ?? '—'}</dd>
        {guest.rsvp !== undefined && (
          <>
            <dt className="text-ink/60">Confirmó</dt>
            <dd>{guest.rsvp ? (guest.rsvp.attending ? peopleLabel(guest.rsvp.seats_confirmed) : 'Que no asistiría') : 'Sin respuesta'}</dd>
          </>
        )}
      </dl>

      {isCheckedIn && (
        <p
          role="status"
          className={`mt-4 px-3 py-2 text-sm ${isComplete ? 'bg-red-100 text-red-900' : 'bg-gold-pale text-ink'}`}
        >
          {isComplete ? 'Este pase ya se registró' : 'Llegada parcial'}: {guest.checked_in_seats} de {guest.seats} a las{' '}
          {formatArrivalTime(guest.checked_in_at!)}.
        </p>
      )}

      <div className="mt-5 flex items-center justify-between gap-3">
        <span className="text-sm text-ink/70">{isCheckedIn ? 'Total que ha llegado' : 'Personas que llegan'}</span>
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => setSeats((value) => Math.max(1, value - 1))}
            disabled={seats <= 1}
            className="size-11 border border-primary/30 text-xl disabled:opacity-30"
            aria-label="Una persona menos"
          >
            −
          </button>
          <span className="w-12 text-center text-xl" aria-live="polite">
            {seats}
          </span>
          <button
            type="button"
            onClick={() => setSeats((value) => Math.min(guest.seats, value + 1))}
            disabled={seats >= guest.seats}
            className="size-11 border border-primary/30 text-xl disabled:opacity-30"
            aria-label="Una persona más"
          >
            +
          </button>
        </div>
      </div>
      {errors.seats && <p className="mt-2 text-sm text-red-700">{errors.seats}</p>}

      <button
        type="button"
        onClick={checkIn}
        disabled={processing || (isCheckedIn && seats === guest.checked_in_seats)}
        className="mt-5 w-full bg-primary text-ivory py-4 text-sm tracking-[0.2em] uppercase disabled:opacity-40"
      >
        {isCheckedIn ? 'Actualizar llegada' : 'Registrar llegada'}
      </button>
      {isCheckedIn && (
        <button type="button" onClick={undo} disabled={processing} className="mt-3 w-full py-2 text-sm text-ink/60 underline">
          Deshacer llegada
        </button>
      )}
    </article>
  );
}

/**
 * The number most likely arriving: the whole pass once part of the group arrived (the rest is coming), else what they
 * confirmed, else the whole pass.
 */
function defaultSeats(guest: CheckInGuest) {
  if (guest.checked_in_at === null && guest.rsvp?.attending) {
    return Math.min(guest.seats, Math.max(1, guest.rsvp.seats_confirmed));
  }

  return guest.seats;
}
