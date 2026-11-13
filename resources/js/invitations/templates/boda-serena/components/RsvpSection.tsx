import type { ReactNode } from 'react';
import { CalendarPlus, Heart, PartyPopper, Pencil, Users } from 'lucide-react';
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

function Field({ label, htmlFor, error, children }: { label: string; htmlFor: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error && <p className="text-sm text-(--destructive)">{error}</p>}
    </div>
  );
}

/** Yes / no as a segmented control, like shadcn/ui's ToggleGroup. */
function AttendanceToggle({ attending, onChange }: { attending: boolean; onChange: (attending: boolean) => void }) {
  const options = [
    { value: true, label: '¡Ahí estaré!' },
    { value: false, label: 'No podré ir' },
  ];

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium" id="boda-serena-attendance">
        ¿Vienes a la boda?
      </span>
      <div
        className="grid grid-cols-2 gap-1 rounded-full bg-(--muted) p-1"
        role="radiogroup"
        aria-labelledby="boda-serena-attendance"
      >
        {options.map(({ value, label }) => (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={attending === value}
            onClick={() => onChange(value)}
            className={cn(
              'cursor-pointer rounded-full px-3 py-2 text-sm font-medium transition-[background-color,color,box-shadow]',
              'outline-none focus-visible:ring-[3px] focus-visible:ring-(--ring)/50',
              attending === value
                ? 'bg-(--primary) text-(--primary-foreground) shadow-sm'
                : 'text-(--muted-foreground) hover:text-(--foreground)',
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function CalendarButton({ calendar, venues }: Pick<RsvpSectionProps, 'calendar' | 'venues'>) {
  return calendar.dateTime && venues.length ? (
    <button
      type="button"
      className={buttonClass('outline', 'default', 'rounded-full')}
      onClick={() => downloadEventCalendar(calendar, venues)}
    >
      <CalendarPlus aria-hidden="true" />
      Guardar en mi calendario
    </button>
  ) : null;
}

function Done({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex h-full flex-col items-center justify-center py-6 text-center">
      <span className="flex size-14 items-center justify-center rounded-full bg-(--accent) text-(--accent-foreground)">
        <PartyPopper className="size-6" aria-hidden="true" />
      </span>
      <p className="mt-5 font-fraunces text-2xl font-medium">{title}</p>
      {children}
    </div>
  );
}

/** The dark side of the card: the deadline and, on a personal link, who it is for. */
function InfoPanel({ deadlineLabel, guest }: { deadlineLabel: string; guest?: { name: string; seats: number } | null }) {
  return (
    <div className="ui-dark flex flex-col justify-between gap-10 p-6 sm:p-8">
      <div>
        <Heart className="size-6 text-(--primary)" aria-hidden="true" />
        <h2 className="mt-6 font-fraunces text-3xl leading-tight font-medium sm:text-4xl">¿Nos acompañas?</h2>
        <p className="mt-3 text-sm leading-relaxed text-(--muted-foreground)">
          Saber si vienes nos ayuda a preparar cada detalle para ti.
        </p>
      </div>
      <dl className="grid gap-4 text-sm">
        {guest && (
          <div className="flex items-start gap-3">
            <Users className="mt-0.5 size-4 shrink-0 text-(--primary)" aria-hidden="true" />
            <div>
              <dt className="text-(--muted-foreground)">Invitación para</dt>
              <dd className="font-medium">
                {guest.name} · {seatsLabel(guest.seats)}
              </dd>
            </div>
          </div>
        )}
        {deadlineLabel && (
          <div className="flex items-start gap-3">
            <CalendarPlus className="mt-0.5 size-4 shrink-0 text-(--primary)" aria-hidden="true" />
            <div>
              <dt className="text-(--muted-foreground)">Responde a más tardar el</dt>
              <dd className="font-medium">{deadlineLabel}</dd>
            </div>
          </div>
        )}
      </dl>
    </div>
  );
}

export function RsvpSection(props: RsvpSectionProps) {
  const online = useOnlineRsvp();

  return (
    <Section id="rsvp" className="serena-glow border-t border-(--border)">
      <Reveal>
        <Card className="mx-auto grid max-w-4xl overflow-hidden md:grid-cols-[1fr_1.25fr]">
          <InfoPanel deadlineLabel={props.deadlineLabel} guest={online.isOnline ? online.guest : null} />
          <div className="p-6 sm:p-8">
            {online.isOnline ? <OnlineRsvp {...props} online={online} /> : <WhatsappRsvp {...props} />}
          </div>
        </Card>
      </Reveal>
    </Section>
  );
}

/** Answers stored by the server, through the open form or a guest's personalized link. */
function OnlineRsvp({
  calendar,
  venues,
  online,
}: RsvpSectionProps & { online: ReturnType<typeof useOnlineRsvp> }) {
  const { guest, form, setField, errors, isAnswered, isOpen, maxSeats } = online;

  if (isAnswered) {
    return (
      <Done title={form.attending ? '¡Qué alegría! Te esperamos' : 'Gracias por avisarnos'}>
        <p className="mt-2 text-sm text-(--muted-foreground)">
          {form.attending
            ? `Apartamos ${form.seats === 1 ? 'tu lugar' : `${form.seats} lugares`} con mucho cariño.`
            : 'Te vamos a extrañar; brindaremos por ti.'}
        </p>
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          {form.attending && <CalendarButton calendar={calendar} venues={venues} />}
          {guest && isOpen && (
            <button type="button" className={buttonClass('ghost', 'default', 'rounded-full')} onClick={online.editAnswer}>
              <Pencil aria-hidden="true" />
              Modificar mi respuesta
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
            className={inputClass}
            type="text"
            required
            autoComplete="name"
            placeholder="Nombre y apellido"
            value={form.name}
            onChange={(event) => setField('name', event.target.value)}
          />
        </Field>
      )}
      <AttendanceToggle attending={form.attending} onChange={(attending) => setField('attending', attending)} />
      {form.attending && (
        <Field label={guest ? '¿Cuántos vienen?' : '¿Cuántos vienen, contándote a ti?'} htmlFor="rsvp-seats" error={errors.seats}>
          <select
            id="rsvp-seats"
            className={cn(inputClass, '[&>option]:text-black')}
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
      <Field label="Unas palabras para nosotros (opcional)" htmlFor="rsvp-message" error={errors.message ?? errors.rsvp}>
        <textarea
          id="rsvp-message"
          className={cn(inputClass, 'h-auto min-h-24 resize-none')}
          rows={3}
          maxLength={1000}
          placeholder="Un deseo, una canción que no puede faltar…"
          value={form.message}
          onChange={(event) => setField('message', event.target.value)}
        />
      </Field>
      <button className={buttonClass('default', 'lg', 'w-full rounded-full')} type="submit" disabled={online.processing}>
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
          className={inputClass}
          type="text"
          required
          autoComplete="name"
          placeholder="Nombre y apellido"
          value={form.name}
          onChange={(event) => setField('name', event.target.value)}
        />
      </Field>
      <AttendanceToggle
        attending={form.attending === 'yes'}
        onChange={(attending) => setField('attending', attending ? 'yes' : 'no')}
      />
      <Field label="¿Con cuántos acompañantes? (0 a 4)" htmlFor="rsvp-guests">
        <input
          id="rsvp-guests"
          className={inputClass}
          type="number"
          min={0}
          max={4}
          placeholder="0"
          value={form.guests}
          onChange={(event) => setField('guests', event.target.value)}
        />
      </Field>
      <button className={buttonClass('default', 'lg', 'w-full rounded-full')} type="submit">
        Responder por WhatsApp
      </button>
      <p className="text-center text-xs text-(--muted-foreground)">Se abrirá WhatsApp con tu respuesta lista para enviar.</p>
    </form>
  );
}
