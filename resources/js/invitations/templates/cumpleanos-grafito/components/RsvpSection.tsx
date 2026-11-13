import type { ReactNode } from 'react';
import { CalendarClock, CalendarPlus, CircleCheck, Pencil, Users } from 'lucide-react';
import { Reveal } from '../../../components/shared/Reveal';
import { Card, Section } from '../../../components/ui/primitives';
import { buttonClass, cn, inputClass } from '../../../components/ui/styles';
import { useRsvpForm } from '../../../hooks/useRsvpForm';
import { seatsLabel, useOnlineRsvp } from '../../../hooks/useOnlineRsvp';
import { downloadEventCalendar, type CalendarOccasion } from '../../../utils/calendar';
import type { Venue } from '../../../types/wedding';
import { SectionTitle } from './ui';

interface RsvpSectionProps {
  index: string;
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

/** Yes / no as two radio cards with a check, like shadcn/ui's RadioGroup in card style. */
function AttendanceOptions({ attending, onChange }: { attending: boolean; onChange: (attending: boolean) => void }) {
  const options = [
    { value: true, label: 'Ahí estaré', hint: 'Cuenta conmigo' },
    { value: false, label: 'No podré', hint: 'Será la próxima' },
  ];

  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium" id="grafito-attendance">
        ¿Vienes?
      </span>
      <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-labelledby="grafito-attendance">
        {options.map(({ value, label, hint }) => (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={attending === value}
            onClick={() => onChange(value)}
            className={cn(
              'relative cursor-pointer rounded-(--radius) border px-4 py-3 text-left transition-[border-color,background-color]',
              'outline-none focus-visible:ring-[3px] focus-visible:ring-(--ring)/50',
              attending === value ? 'border-(--primary) bg-(--accent)' : 'border-(--input) hover:bg-(--muted)',
            )}
          >
            <span className="block text-sm font-semibold">{label}</span>
            <span className="block text-xs text-(--muted-foreground)">{hint}</span>
            <span
              className={cn(
                'absolute top-3 right-3 flex size-4 items-center justify-center rounded-full border',
                attending === value ? 'border-(--primary) bg-(--primary)' : 'border-(--input)',
              )}
              aria-hidden="true"
            >
              {attending === value && <span className="size-1.5 rounded-full bg-(--primary-foreground)" />}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function CalendarButton({ calendar, venues }: Pick<RsvpSectionProps, 'calendar' | 'venues'>) {
  return calendar.dateTime && venues.length ? (
    <button type="button" className={buttonClass('outline', 'default', 'bg-transparent')} onClick={() => downloadEventCalendar(calendar, venues)}>
      <CalendarPlus aria-hidden="true" />
      Guardar en mi calendario
    </button>
  ) : null;
}

function Done({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex h-full flex-col justify-center py-4">
      <CircleCheck className="size-8 text-(--primary)" aria-hidden="true" />
      <p className="mt-4 font-space-grotesk text-2xl font-semibold tracking-tight">{title}</p>
      {children}
    </div>
  );
}

export function RsvpSection(props: RsvpSectionProps) {
  const online = useOnlineRsvp();
  const guest = online.isOnline ? online.guest : null;

  return (
    <Section id="rsvp" className="grafito-glow border-t border-(--border)">
      <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:gap-16">
        <div>
          <SectionTitle index={props.index} eyebrow="Confirma tu lugar" title="¿Contamos contigo?" description="Saber cuántos seremos nos ayuda a tener todo listo." />
          <Reveal>
            <dl className="grid gap-3 text-sm">
              {guest && (
                <div className="flex items-center gap-3 rounded-(--radius) border border-(--border) px-4 py-3">
                  <Users className="size-4 shrink-0 text-(--primary)" aria-hidden="true" />
                  <dt className="text-(--muted-foreground)">Invitación para</dt>
                  <dd className="ml-auto text-right font-medium">
                    {guest.name} · {seatsLabel(guest.seats)}
                  </dd>
                </div>
              )}
              {props.deadlineLabel && (
                <div className="flex items-center gap-3 rounded-(--radius) border border-(--border) px-4 py-3">
                  <CalendarClock className="size-4 shrink-0 text-(--primary)" aria-hidden="true" />
                  <dt className="text-(--muted-foreground)">Responde antes del</dt>
                  <dd className="ml-auto text-right font-geist-mono font-medium">{props.deadlineLabel}</dd>
                </div>
              )}
            </dl>
          </Reveal>
        </div>
        <Reveal>
          <Card className="p-6 sm:p-8">{online.isOnline ? <OnlineRsvp {...props} online={online} /> : <WhatsappRsvp {...props} />}</Card>
        </Reveal>
      </div>
    </Section>
  );
}

/** Answers stored by the server, through the open form or a guest's personalized link. */
function OnlineRsvp({ calendar, venues, online }: RsvpSectionProps & { online: ReturnType<typeof useOnlineRsvp> }) {
  const { guest, form, setField, errors, isAnswered, isOpen, maxSeats } = online;

  if (isAnswered) {
    return (
      <Done title={form.attending ? 'Listo, estás en la lista' : 'Gracias por avisar'}>
        <p className="mt-2 text-sm text-(--muted-foreground)">
          {form.attending
            ? `Apartamos ${form.seats === 1 ? 'tu lugar' : `${form.seats} lugares`}. Nos vemos esa noche.`
            : 'Te vamos a extrañar; brindaremos por ti.'}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {form.attending && <CalendarButton calendar={calendar} venues={venues} />}
          {guest && isOpen && (
            <button type="button" className={buttonClass('ghost', 'default')} onClick={online.editAnswer}>
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
      <AttendanceOptions attending={form.attending} onChange={(attending) => setField('attending', attending)} />
      {form.attending && (
        <Field label={guest ? '¿Cuántos vienen?' : '¿Cuántos vienen, contándote a ti?'} htmlFor="rsvp-seats" error={errors.seats}>
          <select
            id="rsvp-seats"
            className={cn(inputClass, '[&>option]:bg-(--card)')}
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
          className={cn(inputClass, 'h-auto min-h-24 resize-none')}
          rows={3}
          maxLength={1000}
          placeholder="Una felicitación, una canción que no puede faltar…"
          value={form.message}
          onChange={(event) => setField('message', event.target.value)}
        />
      </Field>
      <button className={buttonClass('default', 'lg', 'w-full')} type="submit" disabled={online.processing}>
        {online.processing ? 'Enviando…' : 'Enviar respuesta'}
      </button>
    </form>
  );
}

/** Without online RSVP the form opens WhatsApp with a pre-filled message. */
function WhatsappRsvp({ whatsappNumber, calendar, venues }: RsvpSectionProps) {
  const { form, setField, isSubmitted, handleSubmit } = useRsvpForm(whatsappNumber);

  if (isSubmitted) {
    return (
      <Done title="Ya casi">
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
      <AttendanceOptions attending={form.attending === 'yes'} onChange={(attending) => setField('attending', attending ? 'yes' : 'no')} />
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
      <button className={buttonClass('default', 'lg', 'w-full')} type="submit">
        Responder por WhatsApp
      </button>
      <p className="text-center text-xs text-(--muted-foreground)">Se abrirá WhatsApp con tu respuesta lista para enviar.</p>
    </form>
  );
}
