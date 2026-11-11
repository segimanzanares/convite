import { useState, type FormEvent } from 'react';
import { Reveal } from '../shared/Reveal';
import { GardenVine } from './GardenVine';
import { downloadEventCalendar, type CalendarOccasion } from '../../utils/calendar';
import { seatsLabel, useOnlineRsvp } from '../../hooks/useOnlineRsvp';
import type { Venue } from '../../types/wedding';

interface StoryRsvpProps {
  whatsappNumber: string;
  /** Full name used in the WhatsApp message, e.g. "Sofía Valentina". */
  celebrantName: string;
  /** Short date between the sparkles, e.g. "Sábado · 09 enero 2027". */
  dateLabel: string;
  deadlineLabel: string;
  signature: string;
  maxGuests?: number;
  /** Enables the "add to calendar" button (together with `venues`) after confirming. */
  calendar?: CalendarOccasion;
  venues?: Venue[];
}

/** "521234567890" → "123 456 7890" (last ten digits, Mexican grouping). */
function formatPhone(number: string) {
  const digits = number.replace(/\D/g, '').slice(-10);
  return digits.length === 10 ? `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}` : number;
}

function buildMessage(celebrantName: string, name: string, guests: number) {
  const companions = guests === 0 ? 'ninguno' : String(guests);
  return [
    `¡Hola! Quiero confirmar mi asistencia a los XV años de ${celebrantName}.`,
    '',
    `Nombre: ${name}`,
    `Acompañantes: ${companions}`,
    '',
    '¡Muchas gracias!',
  ].join('\n');
}

function Sparkle() {
  return (
    <svg viewBox="0 0 24 24" className="w-3 h-3 text-gold shrink-0" fill="currentColor" aria-hidden="true">
      <path d="M12 2c.6 4.6 2.4 7.4 10 10-7.6 2.6-9.4 5.4-10 10-.6-4.6-2.4-7.4-10-10 7.6-2.6 9.4-5.4 10-10Z" />
    </svg>
  );
}

function ChatIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3.5 20.5 5 16a8.5 8.5 0 1 1 3.2 3.2Z" />
      <path d="M9 8.5c0 3.2 2.3 5.8 5.5 6.5l1.2-1.4-1.8-1-1 .8c-1.1-.5-2-1.4-2.5-2.5l.8-1-1-1.8L9 8.5Z" />
    </svg>
  );
}

const CORNERS = [
  'top-[26px] left-[26px] border-r-0 border-b-0 rounded-tl-[40px]',
  'top-[26px] right-[26px] border-l-0 border-b-0 rounded-tr-[40px]',
  'bottom-[26px] left-[26px] border-r-0 border-t-0 rounded-bl-[40px]',
  'bottom-[26px] right-[26px] border-l-0 border-t-0 rounded-br-[40px]',
];

const FIELD_LABEL = 'block font-display text-[9px] tracking-[0.32em] uppercase text-[var(--text-muted)] mb-2';

const STEP_BUTTON =
  'w-10 h-10 rounded-full border border-gold/60 text-gold-deep text-xl leading-none flex items-center justify-center transition-colors duration-200 hover:bg-gold-deep hover:text-ivory disabled:opacity-30 disabled:pointer-events-none';

const SUBMIT_BUTTON =
  'group mt-8 w-full min-h-[64px] inline-flex items-center justify-center gap-2.5 sm:gap-3.5 px-4 sm:px-6 py-4 rounded-[3px] border border-gold-deep/60 bg-[linear-gradient(125deg,var(--dark-to),var(--dark-from))] text-[#fff7dc] font-display text-[10px] sm:text-[11px] tracking-[0.08em] sm:tracking-[0.16em] uppercase whitespace-nowrap shadow-[0_11px_25px_color-mix(in_srgb,var(--dark-from)_25%,transparent),inset_0_1px_0_rgba(255,255,255,0.18)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-gold-light hover:shadow-[0_17px_35px_color-mix(in_srgb,var(--dark-from)_35%,transparent),inset_0_1px_0_rgba(255,255,255,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4 disabled:opacity-60 disabled:pointer-events-none';

const SECONDARY_BUTTON =
  'font-display text-[10px] tracking-[0.25em] uppercase border border-gold-deep/40 text-gold-deep py-3.5 px-6 transition-colors hover:bg-gold-deep/5';

const CALENDAR_BUTTON =
  'font-display text-[10px] tracking-[0.25em] uppercase bg-gold-deep text-ivory py-3.5 px-6 transition-colors hover:bg-[var(--dark-from)]';

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-[15px] italic text-[#a3412c] mt-2">{message}</p> : null;
}

/**
 * The card's content when the invitation stores answers online: the guest of
 * a personalized link answers for their reserved seats, anyone else through
 * the open form.
 */
function OnlineStoryForm({
  online,
  calendar,
  venues,
}: {
  online: ReturnType<typeof useOnlineRsvp>;
  calendar?: CalendarOccasion;
  venues?: Venue[];
}) {
  const { guest, form, setField, errors, isAnswered, isOpen, maxSeats } = online;
  const firstName = (guest?.name ?? form.name).trim().split(/\s+/)[0];

  if (isAnswered) {
    return (
      <div className="relative">
        <p className="font-script text-[clamp(36px,8vw,48px)] text-gold-deep leading-tight">
          {form.attending ? `¡Gracias, ${firstName}!` : '¡Gracias por avisarme!'}
        </p>
        <p className="text-[17px] italic text-[var(--text-body)] mt-2">
          {form.attending
            ? `Confirmaste ${form.seats === 1 ? '1 persona' : `${form.seats} personas`}. Ya cuento los días para celebrar contigo.`
            : 'Te voy a extrañar esa noche.'}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-7">
          {form.attending && calendar && venues?.length ? (
            <button type="button" onClick={() => downloadEventCalendar(calendar, venues)} className={CALENDAR_BUTTON}>
              Añadir al calendario
            </button>
          ) : null}
          {guest && isOpen ? (
            <button type="button" onClick={online.editAnswer} className={SECONDARY_BUTTON}>
              Cambiar respuesta
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  if (!isOpen) {
    return <p className="relative font-script text-[clamp(30px,7vw,40px)] text-gold-deep leading-tight">El plazo para confirmar terminó.</p>;
  }

  const companions = form.seats - 1;

  return (
    <form onSubmit={online.submit} className="relative max-w-[410px] mx-auto text-left">
      {guest ? (
        <p className="text-center text-[18px] leading-[1.6] text-[var(--text-body)] mb-7">
          <strong className="block font-semibold text-gold-deep text-[1.1em]">{guest.name}</strong>
          Reservé {seatsLabel(guest.seats)} para ti.
        </p>
      ) : (
        <>
          <label htmlFor="rsvp-name" className={FIELD_LABEL}>
            Tu nombre
          </label>
          <input
            id="rsvp-name"
            type="text"
            required
            autoComplete="name"
            placeholder="Nombre y apellido"
            value={form.name}
            onChange={(event) => setField('name', event.target.value)}
            className="w-full bg-transparent border-0 border-b border-gold/50 px-0 pb-2.5 pt-1 font-body text-[20px] text-ink placeholder:text-[var(--text-muted)]/60 placeholder:italic outline-none transition-colors focus:border-gold-deep"
          />
          <FieldError message={errors.name} />
        </>
      )}

      <div className="grid grid-cols-2 gap-3 mt-7" role="radiogroup" aria-label="Asistencia">
        {[
          { value: true, label: 'Ahí estaré' },
          { value: false, label: 'No podré ir' },
        ].map((option) => (
          <button
            key={option.label}
            type="button"
            role="radio"
            aria-checked={form.attending === option.value}
            onClick={() => setField('attending', option.value)}
            className={`font-display text-[10px] tracking-[0.2em] uppercase py-3.5 border transition-colors ${
              form.attending === option.value ? 'bg-gold-deep text-ivory border-gold-deep' : 'border-gold/50 text-gold-deep hover:bg-gold-deep/5'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>

      {form.attending && maxSeats > 1 ? (
        <>
          <div className="flex items-center justify-between gap-4 mt-7">
            <span id="rsvp-guests-label" className={`${FIELD_LABEL} mb-0`}>
              Acompañantes
            </span>
            <div className="flex items-center gap-4" role="group" aria-labelledby="rsvp-guests-label">
              <button type="button" className={STEP_BUTTON} onClick={() => setField('seats', form.seats - 1)} disabled={companions === 0} aria-label="Quitar un acompañante">
                −
              </button>
              <output aria-live="polite" className="w-8 text-center font-body text-[26px] text-gold-deep">
                {companions}
              </output>
              <button type="button" className={STEP_BUTTON} onClick={() => setField('seats', form.seats + 1)} disabled={form.seats >= maxSeats} aria-label="Agregar un acompañante">
                +
              </button>
            </div>
          </div>
          <p className="text-[14px] italic text-[var(--text-muted)] mt-2 text-right">Máximo {maxSeats - 1}, sin contarte a ti.</p>
          <FieldError message={errors.seats} />
        </>
      ) : null}

      <label htmlFor="rsvp-message" className={`${FIELD_LABEL} mt-7`}>
        Un mensaje para mí (opcional)
      </label>
      <textarea
        id="rsvp-message"
        rows={2}
        maxLength={1000}
        value={form.message}
        onChange={(event) => setField('message', event.target.value)}
        className="w-full resize-none bg-transparent border-0 border-b border-gold/50 px-0 pb-2.5 pt-1 font-body text-[18px] text-ink outline-none transition-colors focus:border-gold-deep"
      />
      <FieldError message={errors.message ?? errors.rsvp} />

      <button type="submit" className={SUBMIT_BUTTON} disabled={online.processing}>
        {online.processing ? 'Enviando…' : 'Enviar confirmación'}
      </button>
    </form>
  );
}

/**
 * RSVP as a stationery card: a light framed card with a monogram medallion,
 * a two-field form (name + companions) and a WhatsApp button that opens a
 * pre-filled confirmation message.
 */
export function StoryRsvp({
  whatsappNumber,
  celebrantName,
  dateLabel,
  deadlineLabel,
  signature,
  maxGuests = 4,
  calendar,
  venues,
}: StoryRsvpProps) {
  const online = useOnlineRsvp();
  const [name, setName] = useState('');
  const [guests, setGuests] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(buildMessage(celebrantName, trimmed, guests))}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsSubmitted(true);
  };

  const stepButton = STEP_BUTTON;

  return (
    <section className="relative isolate overflow-hidden py-[100px] sm:py-[110px] px-5 bg-[linear-gradient(180deg,var(--color-cream)_0%,var(--color-gold-pale)_46%,var(--color-cream)_100%)]">
      {/* Soft light and faint vertical pinstripes behind the card */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none bg-[radial-gradient(ellipse_at_50%_42%,rgba(255,255,255,0.7)_0%,transparent_65%),repeating-linear-gradient(90deg,transparent_0_67px,color-mix(in_srgb,var(--color-gold-deep)_5%,transparent)_68px_69px)]"
        aria-hidden="true"
      />
      <GardenVine className="absolute -z-10 -top-4 -left-10 w-[clamp(200px,26vw,360px)] -rotate-6 opacity-60" />
      <GardenVine className="absolute -z-10 -bottom-10 -right-10 w-[clamp(180px,24vw,330px)] rotate-180 opacity-50" />

      <Reveal className="max-w-[760px] mx-auto">
        <div className="relative overflow-hidden text-center px-[clamp(26px,8vw,96px)] pt-[74px] pb-[66px] border border-gold/70 outline outline-1 outline-gold/45 outline-offset-[7px] bg-[linear-gradient(151deg,var(--color-ivory)_0%,var(--color-cream)_55%,var(--color-cream)_100%)] shadow-[0_23px_65px_color-mix(in_srgb,var(--dark-from)_15%,transparent),0_6px_18px_color-mix(in_srgb,var(--dark-from)_8%,transparent)]">
          <span className="absolute inset-[18px] border border-gold/30 pointer-events-none" aria-hidden="true" />
          <span className="absolute left-1/2 -top-[260px] -translate-x-1/2 w-[360px] h-[360px] rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-gold-light)_30%,transparent),transparent_74%)] pointer-events-none" aria-hidden="true" />
          {CORNERS.map((corner) => (
            <span key={corner} className={`absolute w-[46px] h-[46px] border border-gold/50 pointer-events-none ${corner}`} aria-hidden="true" />
          ))}

          <div
            className="relative mx-auto mb-6 w-[60px] h-[60px] rounded-full grid place-items-center border border-gold/70 shadow-[0_0_0_6px_color-mix(in_srgb,var(--color-gold-light)_25%,transparent)] bg-[linear-gradient(155deg,var(--dark-to),var(--dark-from))] text-gold-light"
            aria-hidden="true"
          >
            <svg viewBox="0 0 24 24" className="w-[22px] h-[22px]" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round">
              <path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z" />
            </svg>
          </div>

          <p className="relative font-display text-[9px] leading-[1.8] tracking-[0.3em] uppercase text-gold-deep/70 max-w-[420px] mx-auto">
            El mejor regalo es compartir contigo
          </p>
          <p className="relative font-script text-[clamp(42px,9vw,64px)] leading-[1.15] text-gold mt-3">¿Me acompañas?</p>
          <h2 className="relative font-body font-medium text-[clamp(38px,8vw,64px)] leading-none tracking-[-0.02em] text-gold-deep mt-1 mb-5 text-balance">
            Confirma tu <em className="font-normal text-[color-mix(in_srgb,var(--color-gold-deep)_75%,var(--color-gold))]">asistencia</em>
          </h2>
          <p className="relative text-[clamp(16px,2vw,18px)] leading-[1.8] text-[var(--text-body)] max-w-[520px] mx-auto">
            Hay momentos que se vuelven inolvidables cuando los compartimos con las personas que queremos.
            <strong className="block font-semibold text-gold-deep text-[1.12em] mt-1">¡Me encantará contar contigo!</strong>
          </p>

          <div className="relative flex items-center justify-center gap-2 sm:gap-3 mt-8 mb-9" aria-hidden="true">
            <span className="w-6 sm:w-11 h-px bg-[linear-gradient(90deg,transparent,var(--color-gold))]" />
            <Sparkle />
            <span className="font-display text-[9px] tracking-[0.12em] sm:tracking-[0.18em] uppercase text-gold-deep/80 whitespace-nowrap">{dateLabel}</span>
            <Sparkle />
            <span className="w-6 sm:w-11 h-px bg-[linear-gradient(270deg,transparent,var(--color-gold))]" />
          </div>

          {online.isOnline ? (
            <OnlineStoryForm online={online} calendar={calendar} venues={venues} />
          ) : !isSubmitted ? (
            <form onSubmit={handleSubmit} className="relative max-w-[410px] mx-auto text-left">
              <label htmlFor="rsvp-name" className={FIELD_LABEL}>
                Tu nombre
              </label>
              <input
                id="rsvp-name"
                type="text"
                required
                autoComplete="name"
                placeholder="Nombre y apellido"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="w-full bg-transparent border-0 border-b border-gold/50 px-0 pb-2.5 pt-1 font-body text-[20px] text-ink placeholder:text-[var(--text-muted)]/60 placeholder:italic outline-none transition-colors focus:border-gold-deep"
              />

              <div className="flex items-center justify-between gap-4 mt-7">
                <span id="rsvp-guests-label" className={`${FIELD_LABEL} mb-0`}>
                  Acompañantes
                </span>
                <div className="flex items-center gap-4" role="group" aria-labelledby="rsvp-guests-label">
                  <button type="button" className={stepButton} onClick={() => setGuests((g) => Math.max(0, g - 1))} disabled={guests === 0} aria-label="Quitar un acompañante">
                    −
                  </button>
                  <output aria-live="polite" className="w-8 text-center font-body text-[26px] text-gold-deep">
                    {guests}
                  </output>
                  <button type="button" className={stepButton} onClick={() => setGuests((g) => Math.min(maxGuests, g + 1))} disabled={guests === maxGuests} aria-label="Agregar un acompañante">
                    +
                  </button>
                </div>
              </div>
              <p className="text-[14px] italic text-[var(--text-muted)] mt-2 text-right">Máximo {maxGuests}, sin contarte a ti.</p>

              <button
                type="submit"
                className="group mt-8 w-full min-h-[64px] inline-flex items-center justify-center gap-2.5 sm:gap-3.5 px-4 sm:px-6 py-4 rounded-[3px] border border-gold-deep/60 bg-[linear-gradient(125deg,var(--dark-to),var(--dark-from))] text-[#fff7dc] font-display text-[10px] sm:text-[11px] tracking-[0.08em] sm:tracking-[0.16em] uppercase whitespace-nowrap shadow-[0_11px_25px_color-mix(in_srgb,var(--dark-from)_25%,transparent),inset_0_1px_0_rgba(255,255,255,0.18)] transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-1 hover:border-gold-light hover:shadow-[0_17px_35px_color-mix(in_srgb,var(--dark-from)_35%,transparent),inset_0_1px_0_rgba(255,255,255,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4"
              >
                <ChatIcon className="w-5 h-5 text-gold-light" />
                Confirmar por WhatsApp
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </button>
              <p className="text-center text-[15px] leading-[1.7] text-[var(--text-muted)] italic mt-4">
                Se abrirá WhatsApp con tu confirmación lista para enviar.
              </p>
            </form>
          ) : (
            <div className="relative">
              <p className="font-script text-[clamp(36px,8vw,48px)] text-gold-deep leading-tight">
                ¡Gracias, {name.trim().split(/\s+/)[0]}!
              </p>
              <p className="text-[17px] italic text-[var(--text-body)] mt-2">Ya cuento los días para celebrar contigo.</p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-7">
                {calendar && venues?.length ? (
                  <button
                    type="button"
                    onClick={() => downloadEventCalendar(calendar, venues)}
                    className="font-display text-[10px] tracking-[0.25em] uppercase bg-gold-deep text-ivory py-3.5 px-6 transition-colors hover:bg-[var(--dark-from)]"
                  >
                    Añadir al calendario
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => setIsSubmitted(false)}
                  className="font-display text-[10px] tracking-[0.25em] uppercase border border-gold-deep/40 text-gold-deep py-3.5 px-6 transition-colors hover:bg-gold-deep/5"
                >
                  Editar respuesta
                </button>
              </div>
            </div>
          )}

          <p className="relative font-display text-[9px] leading-[1.9] tracking-[0.22em] uppercase text-gold-deep/70 mt-8">
            Confirma antes del <span className="whitespace-nowrap">{deadlineLabel}</span>
            {!online.isOnline ? (
              <>
                <br />
                Confirmaciones · <span className="whitespace-nowrap">{formatPhone(whatsappNumber)}</span>
              </>
            ) : null}
          </p>
          <p className="relative font-script text-[clamp(28px,6vw,34px)] text-gold mt-5">{signature}</p>
        </div>
      </Reveal>
    </section>
  );
}
