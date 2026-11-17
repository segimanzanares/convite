import type { ReactNode } from 'react';
import { CalendarPlus, Minus, Pencil, Plus, Users } from 'lucide-react';
import { Reveal } from '../../../components/shared/Reveal';
import { Card, Section } from '../../../components/ui/primitives';
import { buttonClass, cn, inputClass } from '../../../components/ui/styles';
import { useRsvpForm } from '../../../hooks/useRsvpForm';
import { seatsLabel, useOnlineRsvp } from '../../../hooks/useOnlineRsvp';
import { downloadEventCalendar, type CalendarOccasion } from '../../../utils/calendar';
import type { Venue } from '../../../types/wedding';
import { Rainbow } from './NubeArt';

interface RsvpSectionProps {
  whatsappNumber: string;
  deadlineLabel: string;
  calendar: CalendarOccasion;
  venues: Venue[];
}

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

/** Yes / no as two radio cards, each with its emoji. */
function AttendanceCards({ attending, onChange }: { attending: boolean; onChange: (attending: boolean) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-semibold" id="nube-attendance">
        ¿Nos acompañas?
      </span>
      <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-labelledby="nube-attendance">
        {[
          { value: true, emoji: '🤍', label: '¡Sí, ahí estaré!' },
          { value: false, emoji: '☁️', label: 'No podré ir' },
        ].map(({ value, emoji, label }) => (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={attending === value}
            onClick={() => onChange(value)}
            className={cn(
              'flex cursor-pointer flex-col items-center gap-1.5 rounded-[calc(var(--radius)-6px)] border-2 px-3 py-4 text-sm font-semibold transition-[border-color,background-color] outline-none focus-visible:ring-[3px] focus-visible:ring-(--ring)/50',
              attending === value ? 'border-(--primary) bg-(--secondary) text-(--secondary-foreground)' : 'border-(--border) hover:border-(--input)',
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

function SeatsStepper({ seats, maxSeats, onChange, label }: { seats: number; maxSeats: number; onChange: (seats: number) => void; label: string }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[calc(var(--radius)-6px)] bg-(--muted) px-4 py-3">
      <span id="nube-seats" className="text-sm font-semibold">
        {label}
      </span>
      <div className="flex items-center gap-3" role="group" aria-labelledby="nube-seats">
        <button type="button" className={buttonClass('outline', 'icon', 'rounded-full')} onClick={() => onChange(seats - 1)} disabled={seats <= 1} aria-label="Una persona menos">
          <Minus aria-hidden="true" />
        </button>
        <output aria-live="polite" className="w-6 text-center text-lg font-bold tabular-nums">
          {seats}
        </output>
        <button type="button" className={buttonClass('outline', 'icon', 'rounded-full')} onClick={() => onChange(seats + 1)} disabled={seats >= maxSeats} aria-label="Una persona más">
          <Plus aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}

function CalendarButton({ calendar, venues }: Pick<RsvpSectionProps, 'calendar' | 'venues'>) {
  return calendar.dateTime && venues.length ? (
    <button type="button" className={buttonClass('outline', 'default', 'rounded-full')} onClick={() => downloadEventCalendar(calendar, venues)}>
      <CalendarPlus aria-hidden="true" />
      Guardar en mi calendario
    </button>
  ) : null;
}

function Done({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="py-2 text-center">
      <Rainbow className="mx-auto w-40" />
      <p className="mt-3 font-young-serif text-3xl">{title}</p>
      {children}
    </div>
  );
}

export function RsvpSection(props: RsvpSectionProps) {
  const online = useOnlineRsvp();
  const guest = online.isOnline ? online.guest : null;

  return (
    <Section className="bg-(--muted)">
      <Reveal className="mx-auto max-w-lg">
        <Card className="p-6 shadow-xl sm:p-10">
          <div className="text-center">
            <p className="mx-auto w-fit rounded-full bg-(--accent) px-3.5 py-1 text-xs font-bold tracking-[0.18em] text-(--accent-foreground) uppercase">RSVP</p>
            <h2 className="mt-3 font-young-serif text-[clamp(30px,5vw,40px)] leading-tight">Confirma tu asistencia</h2>
            {props.deadlineLabel && (
              <p className="mt-2 text-sm text-(--muted-foreground)">
                Nos ayudas mucho si nos avisas antes del <span className="font-semibold text-(--foreground)">{props.deadlineLabel}</span>.
              </p>
            )}
            {guest && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-(--secondary) px-3 py-1 text-xs font-semibold text-(--secondary-foreground)">
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
      <Done title={form.attending ? '¡Gracias por confirmar!' : 'Gracias por avisarnos'}>
        <p className="mt-2 text-sm text-(--muted-foreground)">
          {form.attending
            ? `Apartamos ${form.seats === 1 ? 'tu lugar' : `${form.seats} lugares`}. ¡Nos vemos en mi bautizo!`
            : 'Te vamos a extrañar; gracias por tenernos presentes.'}
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
      <Done title="Las confirmaciones cerraron">
        <p className="mt-2 text-sm text-(--muted-foreground)">Si tienes alguna duda, escríbele a mis papás.</p>
      </Done>
    );
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={online.submit}>
      {!guest && (
        <Field label="Tu nombre" htmlFor="rsvp-name" error={errors.name}>
          <input
            id="rsvp-name"
            className={cn(inputClass, 'h-11 rounded-full px-4')}
            type="text"
            required
            autoComplete="name"
            placeholder="Nombre y apellido"
            value={form.name}
            onChange={(event) => setField('name', event.target.value)}
          />
        </Field>
      )}
      <AttendanceCards attending={form.attending} onChange={(attending) => setField('attending', attending)} />
      {form.attending && maxSeats > 1 && (
        <div>
          <SeatsStepper
            seats={form.seats}
            maxSeats={maxSeats}
            onChange={(seats) => setField('seats', seats)}
            label={guest ? '¿Cuántos vienen?' : '¿Cuántos vienen, contándote?'}
          />
          {errors.seats && <p className="mt-2 text-sm text-(--destructive)">{errors.seats}</p>}
        </div>
      )}
      <Field label="Un mensajito para mí (opcional)" htmlFor="rsvp-message" error={errors.message ?? errors.rsvp}>
        <textarea
          id="rsvp-message"
          className={cn(inputClass, 'h-auto min-h-24 resize-none rounded-[calc(var(--radius)-6px)]')}
          rows={3}
          maxLength={1000}
          placeholder="Un deseo, una bendición, un consejo para mis papás…"
          value={form.message}
          onChange={(event) => setField('message', event.target.value)}
        />
      </Field>
      <button className={buttonClass('default', 'lg', 'w-full rounded-full')} type="submit" disabled={online.processing}>
        {online.processing ? 'Enviando…' : 'Enviar confirmación'}
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
          className={cn(inputClass, 'h-11 rounded-full px-4')}
          type="text"
          required
          autoComplete="name"
          placeholder="Nombre y apellido"
          value={form.name}
          onChange={(event) => setField('name', event.target.value)}
        />
      </Field>
      <AttendanceCards attending={form.attending === 'yes'} onChange={(attending) => setField('attending', attending ? 'yes' : 'no')} />
      <Field label="¿Con cuántos acompañantes? (0 a 4)" htmlFor="rsvp-guests">
        <input
          id="rsvp-guests"
          className={cn(inputClass, 'h-11 rounded-full px-4')}
          type="number"
          min={0}
          max={4}
          placeholder="0"
          value={form.guests}
          onChange={(event) => setField('guests', event.target.value)}
        />
      </Field>
      <button className={buttonClass('default', 'lg', 'w-full rounded-full')} type="submit">
        Confirmar por WhatsApp
      </button>
      <p className="text-center text-xs text-(--muted-foreground)">Se abrirá WhatsApp con tu respuesta lista para enviar.</p>
    </form>
  );
}
