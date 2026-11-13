import type { ReactNode } from 'react';
import { CalendarPlus, Pencil, Users } from 'lucide-react';
import { Reveal } from '../../../components/shared/Reveal';
import { buttonClass, cn, inputClass } from '../../../components/ui/styles';
import { useRsvpForm } from '../../../hooks/useRsvpForm';
import { seatsLabel, useOnlineRsvp } from '../../../hooks/useOnlineRsvp';
import { downloadEventCalendar, type CalendarOccasion } from '../../../utils/calendar';
import type { Venue } from '../../../types/wedding';
import { Egg } from './Illustrations';
import { CHUNKY, CHUNKY_SM } from './ui';

interface RsvpSectionProps {
  whatsappNumber: string;
  deadlineLabel: string;
  calendar: CalendarOccasion;
  venues: Venue[];
}

function Field({ label, htmlFor, error, children }: { label: string; htmlFor: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-base font-bold">
        {label}
      </label>
      {children}
      {error && <p className="text-sm text-(--destructive)">{error}</p>}
    </div>
  );
}

/** Yes / no as two chunky option cards with an emoji, like a shadcn/ui RadioGroup of cards. */
function AttendanceOptions({ attending, onChange }: { attending: boolean; onChange: (attending: boolean) => void }) {
  const options = [
    { value: true, emoji: '🦖', label: '¡Ahí estaré!' },
    { value: false, emoji: '🥚', label: 'Esta vez no' },
  ];

  return (
    <div className="flex flex-col gap-2">
      <span className="text-base font-bold" id="dino-attendance">
        ¿Vienes?
      </span>
      <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-labelledby="dino-attendance">
        {options.map(({ value, emoji, label }) => (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={attending === value}
            onClick={() => onChange(value)}
            className={cn(
              'flex cursor-pointer flex-col items-center gap-1.5 rounded-(--radius) px-3 py-4 text-base font-bold transition-[background-color,transform]',
              'border-2 border-(--foreground) outline-none focus-visible:ring-[3px] focus-visible:ring-(--ring)/50',
              attending === value ? 'bg-(--accent) shadow-[3px_3px_0_var(--foreground)]' : 'bg-(--card) text-(--muted-foreground) hover:-translate-y-0.5',
            )}
          >
            <span className="text-3xl" aria-hidden="true">
              {emoji}
            </span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CalendarButton({ calendar, venues }: Pick<RsvpSectionProps, 'calendar' | 'venues'>) {
  return calendar.dateTime && venues.length ? (
    <button type="button" className={buttonClass('outline', 'default', cn('rounded-full bg-(--card) font-bold', CHUNKY_SM))} onClick={() => downloadEventCalendar(calendar, venues)}>
      <CalendarPlus aria-hidden="true" />
      Guardar en mi calendario
    </button>
  ) : null;
}

function Done({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="py-4 text-center">
      <Egg hatched className="mx-auto w-24" />
      <p className="mt-4 text-3xl font-extrabold">{title}</p>
      {children}
    </div>
  );
}

export function RsvpSection(props: RsvpSectionProps) {
  const online = useOnlineRsvp();
  const guest = online.isOnline ? online.guest : null;

  return (
    <section id="rsvp" className="dino-dots scroll-mt-6 border-t-[3px] border-(--foreground) bg-(--accent) px-5 py-20 sm:px-8 sm:py-28">
      <Reveal className="mx-auto max-w-lg">
        <div className={cn('rounded-[calc(var(--radius)+8px)] bg-(--card) p-6 sm:p-10', CHUNKY)}>
          <div className="text-center">
            <h2 className="text-[clamp(34px,5vw,46px)] leading-[1.05] font-extrabold">¿Te unes a la expedición?</h2>
            {props.deadlineLabel && (
              <p className="mt-2 text-base text-(--muted-foreground)">
                Confírmanos a más tardar el <span className="font-semibold text-(--foreground)">{props.deadlineLabel}</span>.
              </p>
            )}
            {guest && (
              <p className={cn('mt-4 inline-flex items-center gap-2 rounded-full bg-(--secondary) px-3 py-1 text-sm font-bold', CHUNKY_SM)}>
                <Users className="size-3.5" aria-hidden="true" />
                {guest.name} · {seatsLabel(guest.seats)}
              </p>
            )}
          </div>
          <div className="mt-8">{online.isOnline ? <OnlineRsvp {...props} online={online} /> : <WhatsappRsvp {...props} />}</div>
        </div>
      </Reveal>
    </section>
  );
}

/** Answers stored by the server, through the open form or a guest's personalized link. */
function OnlineRsvp({ calendar, venues, online }: RsvpSectionProps & { online: ReturnType<typeof useOnlineRsvp> }) {
  const { guest, form, setField, errors, isAnswered, isOpen, maxSeats } = online;

  if (isAnswered) {
    return (
      <Done title={form.attending ? '¡Rawr! ¡Nos vemos ahí!' : 'Gracias por avisarnos'}>
        <p className="mt-2 text-sm text-(--muted-foreground)">
          {form.attending
            ? `Apartamos ${form.seats === 1 ? 'tu lugar' : `${form.seats} lugares`} en la expedición.`
            : 'Te vamos a extrañar. ¡Te guardamos un pedazo de pastel!'}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          {form.attending && <CalendarButton calendar={calendar} venues={venues} />}
          {guest && isOpen && (
            <button type="button" className={buttonClass('ghost', 'default', 'rounded-full font-bold')} onClick={online.editAnswer}>
              <Pencil aria-hidden="true" />
              Cambiar mi respuesta
            </button>
          )}
        </div>
      </Done>
    );
  }

  if (!isOpen) {
    return (
      <Done title="Las confirmaciones ya cerraron">
        <p className="mt-2 text-sm text-(--muted-foreground)">Si tienes alguna duda, escríbenos directamente.</p>
      </Done>
    );
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={online.submit}>
      {!guest && (
        <Field label="Tu nombre" htmlFor="rsvp-name" error={errors.name}>
          <input
            id="rsvp-name"
            className={cn(inputClass, 'h-11 rounded-full border-2 border-(--foreground) px-4 text-base')}
            type="text"
            required
            autoComplete="name"
            placeholder="Nombre y apellido"
            value={form.name}
            onChange={(event) => setField('name', event.target.value)}
          />
        </Field>
      )}
      <AttendanceOptions attending={form.attending} onChange={(attending) => setField('attending', attending)} />
      {form.attending && (
        <Field label={guest ? '¿Cuántos vienen?' : '¿Cuántos vienen, contándote a ti?'} htmlFor="rsvp-seats" error={errors.seats}>
          <select
            id="rsvp-seats"
            className={cn(inputClass, 'h-11 rounded-full border-2 border-(--foreground) px-4 text-base [&>option]:text-black')}
            value={form.seats}
            onChange={(event) => setField('seats', Number(event.target.value))}
          >
            {Array.from({ length: maxSeats }, (_, index) => index + 1).map((count) => (
              <option key={count} value={count}>
                {count === 1 ? '1 persona' : `${count} personas`}
              </option>
            ))}
          </select>
        </Field>
      )}
      <Field label="Un mensaje para el festejado (opcional)" htmlFor="rsvp-message" error={errors.message ?? errors.rsvp}>
        <textarea
          id="rsvp-message"
          className={cn(inputClass, 'h-auto min-h-24 resize-none border-2 border-(--foreground) text-base')}
          rows={3}
          maxLength={1000}
          placeholder="¡Feliz cumpleaños, explorador!"
          value={form.message}
          onChange={(event) => setField('message', event.target.value)}
        />
      </Field>
      <button className={buttonClass('default', 'lg', cn('w-full rounded-full text-base font-bold', CHUNKY_SM))} type="submit" disabled={online.processing}>
        {online.processing ? 'Enviando…' : 'Enviar mi respuesta'}
      </button>
    </form>
  );
}

/** Without online RSVP the form opens WhatsApp with a pre-filled message. */
function WhatsappRsvp({ whatsappNumber, calendar, venues }: RsvpSectionProps) {
  const { form, setField, isSubmitted, handleSubmit } = useRsvpForm(whatsappNumber);

  if (isSubmitted) {
    return (
      <Done title="¡Ya casi!">
        <p className="mt-2 text-sm text-(--muted-foreground)">Solo falta que envíes el mensaje que abrimos en WhatsApp.</p>
        {form.attending === 'yes' && (
          <div className="mt-6">
            <CalendarButton calendar={calendar} venues={venues} />
          </div>
        )}
      </Done>
    );
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <Field label="Tu nombre" htmlFor="rsvp-name">
        <input
          id="rsvp-name"
          className={cn(inputClass, 'h-11 rounded-full border-2 border-(--foreground) px-4 text-base')}
          type="text"
          required
          autoComplete="name"
          placeholder="Nombre y apellido"
          value={form.name}
          onChange={(event) => setField('name', event.target.value)}
        />
      </Field>
      <AttendanceOptions attending={form.attending === 'yes'} onChange={(attending) => setField('attending', attending ? 'yes' : 'no')} />
      <Field label="¿Con cuántos acompañantes? (0 a 4)" htmlFor="rsvp-guests">
        <input
          id="rsvp-guests"
          className={cn(inputClass, 'h-11 rounded-full border-2 border-(--foreground) px-4 text-base')}
          type="number"
          min={0}
          max={4}
          placeholder="0"
          value={form.guests}
          onChange={(event) => setField('guests', event.target.value)}
        />
      </Field>
      <button className={buttonClass('default', 'lg', cn('w-full rounded-full text-base font-bold', CHUNKY_SM))} type="submit">
        Responder por WhatsApp
      </button>
      <p className="text-center text-xs text-(--muted-foreground)">Se abrirá WhatsApp con tu respuesta lista para enviar.</p>
    </form>
  );
}
