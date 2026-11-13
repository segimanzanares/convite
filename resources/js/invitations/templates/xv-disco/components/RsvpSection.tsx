import type { ReactNode } from 'react';
import { CalendarPlus, ListChecks, Pencil, Sparkles, Users } from 'lucide-react';
import { Reveal } from '../../../components/shared/Reveal';
import { Card, Section } from '../../../components/ui/primitives';
import { buttonClass, cn, inputClass } from '../../../components/ui/styles';
import { useRsvpForm } from '../../../hooks/useRsvpForm';
import { seatsLabel, useOnlineRsvp } from '../../../hooks/useOnlineRsvp';
import { downloadEventCalendar, type CalendarOccasion } from '../../../utils/calendar';
import type { Venue } from '../../../types/wedding';

interface RsvpSectionProps {
  whatsappNumber: string;
  deadlineLabel: string;
  calendar: CalendarOccasion;
  venues: Venue[];
}

const FIELD = cn(inputClass, 'h-11 rounded-full bg-(--background)/60 px-4');
const SUBMIT = buttonClass('default', 'lg', 'w-full rounded-full font-semibold shadow-[0_0_24px_-4px_var(--neon-pink)]');

function Field({ label, htmlFor, error, children }: { label: string; htmlFor: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-semibold">
        {label}
      </label>
      {children}
      {error && <p className="text-sm text-(--destructive)">{error}</p>}
    </div>
  );
}

/** Yes / no as two big option buttons with an emoji, glowing when chosen. */
function AttendanceOptions({ attending, onChange }: { attending: boolean; onChange: (attending: boolean) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold" id="disco-attendance">
        ¿Te apuntas?
      </span>
      <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-labelledby="disco-attendance">
        {[
          { value: true, emoji: '🪩', label: '¡Ahí estaré!' },
          { value: false, emoji: '💌', label: 'No podré ir' },
        ].map(({ value, emoji, label }) => (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={attending === value}
            onClick={() => onChange(value)}
            className={cn(
              'flex cursor-pointer flex-col items-center gap-1.5 rounded-(--radius) border px-3 py-4 text-sm font-semibold transition-[border-color,box-shadow,color] outline-none focus-visible:ring-[3px] focus-visible:ring-(--ring)/50',
              attending === value
                ? 'border-(--primary) text-(--foreground) shadow-[0_0_20px_-6px_var(--neon-pink)]'
                : 'border-(--border) text-(--muted-foreground) hover:border-(--input)',
            )}
          >
            <span className="text-2xl" aria-hidden="true">
              {emoji}
            </span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** How many people come, as a row of pills from 1 to the limit. */
function SeatPills({ seats, maxSeats, onChange, label }: { seats: number; maxSeats: number; onChange: (seats: number) => void; label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold" id="disco-seats">
        {label}
      </span>
      <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby="disco-seats">
        {Array.from({ length: maxSeats }, (_, index) => index + 1).map((count) => (
          <button
            key={count}
            type="button"
            role="radio"
            aria-checked={seats === count}
            aria-label={count === 1 ? '1 persona' : `${count} personas`}
            onClick={() => onChange(count)}
            className={cn(
              'size-11 cursor-pointer rounded-full border font-unbounded text-sm font-semibold tabular-nums transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-(--ring)/50',
              seats === count ? 'border-(--primary) bg-(--primary) text-(--primary-foreground)' : 'border-(--border) hover:border-(--input)',
            )}
          >
            {count}
          </button>
        ))}
      </div>
    </div>
  );
}

function CalendarButton({ calendar, venues }: Pick<RsvpSectionProps, 'calendar' | 'venues'>) {
  return calendar.dateTime && venues.length ? (
    <button type="button" className={buttonClass('outline', 'default', 'rounded-full bg-transparent')} onClick={() => downloadEventCalendar(calendar, venues)}>
      <CalendarPlus aria-hidden="true" />
      Guardar en mi calendario
    </button>
  ) : null;
}

function Done({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="py-2 text-center">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-(--accent) text-(--accent-foreground) shadow-[0_0_24px_-6px_var(--neon-cyan)]">
        <Sparkles className="size-7" aria-hidden="true" />
      </span>
      <p className="mt-5 font-unbounded text-2xl font-semibold">{title}</p>
      {children}
    </div>
  );
}

export function RsvpSection(props: RsvpSectionProps) {
  const online = useOnlineRsvp();
  const guest = online.isOnline ? online.guest : null;

  return (
    <Section className="bg-(--surface)">
      <Reveal className="mx-auto max-w-lg">
        <Card className="disco-neon-frame p-6 sm:p-10">
          <div className="text-center">
            <ListChecks className="mx-auto size-8 text-(--accent-foreground)" aria-hidden="true" />
            <h2 className="mt-4 font-unbounded text-[clamp(26px,5vw,36px)] leading-tight font-semibold">Entra a la lista</h2>
            {props.deadlineLabel && (
              <p className="mt-2 text-sm text-(--muted-foreground)">
                Confírmame antes del <span className="font-semibold text-(--foreground)">{props.deadlineLabel}</span>.
              </p>
            )}
            {guest && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-(--accent) px-3 py-1 text-xs font-semibold text-(--accent-foreground)">
                <Users className="size-3.5" aria-hidden="true" />
                {guest.name} · {seatsLabel(guest.seats)}
              </p>
            )}
          </div>
          <div className="mt-8">{online.isOnline ? <OnlineRsvp {...props} online={online} /> : <WhatsappRsvp {...props} />}</div>
        </Card>
      </Reveal>
    </Section>
  );
}

/** Answers stored by the server, through the open form or a guest's personalized link. */
function OnlineRsvp({ calendar, venues, online }: RsvpSectionProps & { online: ReturnType<typeof useOnlineRsvp> }) {
  const { guest, form, setField, errors, isAnswered, isOpen, maxSeats } = online;

  if (isAnswered) {
    return (
      <Done title={form.attending ? '¡Estás en la lista!' : 'Gracias por avisarme'}>
        <p className="mt-2 text-sm text-(--muted-foreground)">
          {form.attending
            ? `Aparté ${form.seats === 1 ? 'tu lugar' : `${form.seats} lugares`}. Ve preparando tus mejores pasos.`
            : 'Te voy a extrañar en la pista.'}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          {form.attending && <CalendarButton calendar={calendar} venues={venues} />}
          {guest && isOpen && (
            <button type="button" className={buttonClass('ghost', 'default', 'rounded-full')} onClick={online.editAnswer}>
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
      <Done title="La lista ya cerró">
        <p className="mt-2 text-sm text-(--muted-foreground)">Si tienes alguna duda, escríbele a mi familia.</p>
      </Done>
    );
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={online.submit}>
      {!guest && (
        <Field label="Tu nombre" htmlFor="rsvp-name" error={errors.name}>
          <input
            id="rsvp-name"
            className={FIELD}
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
      {form.attending && maxSeats > 1 && (
        <div>
          <SeatPills
            seats={form.seats}
            maxSeats={maxSeats}
            onChange={(seats) => setField('seats', seats)}
            label={guest ? '¿Cuántos vienen?' : '¿Cuántos vienen, contándote?'}
          />
          {errors.seats && <p className="mt-2 text-sm text-(--destructive)">{errors.seats}</p>}
        </div>
      )}
      <Field label="Pide una canción o déjame un mensaje (opcional)" htmlFor="rsvp-message" error={errors.message ?? errors.rsvp}>
        <textarea
          id="rsvp-message"
          className={cn(inputClass, 'h-auto min-h-24 resize-none bg-(--background)/60')}
          rows={3}
          maxLength={1000}
          placeholder="La canción que no puede faltar…"
          value={form.message}
          onChange={(event) => setField('message', event.target.value)}
        />
      </Field>
      <button className={SUBMIT} type="submit" disabled={online.processing}>
        {online.processing ? 'Enviando…' : 'Confirmar mi lugar'}
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
          className={FIELD}
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
          className={FIELD}
          type="number"
          min={0}
          max={4}
          placeholder="0"
          value={form.guests}
          onChange={(event) => setField('guests', event.target.value)}
        />
      </Field>
      <button className={SUBMIT} type="submit">
        Confirmar por WhatsApp
      </button>
      <p className="text-center text-xs text-(--muted-foreground)">Se abrirá WhatsApp con tu respuesta lista para enviar.</p>
    </form>
  );
}
