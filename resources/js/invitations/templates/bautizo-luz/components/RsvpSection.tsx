import type { ReactNode } from 'react';
import { CalendarPlus, Pencil, Users } from 'lucide-react';
import { Reveal } from '../../../components/shared/Reveal';
import { Card, Section } from '../../../components/ui/primitives';
import { buttonClass, cn, inputClass } from '../../../components/ui/styles';
import { useRsvpForm } from '../../../hooks/useRsvpForm';
import { seatsLabel, useOnlineRsvp } from '../../../hooks/useOnlineRsvp';
import { downloadEventCalendar, type CalendarOccasion } from '../../../utils/calendar';
import type { Venue } from '../../../types/wedding';
import { Candle } from './LuzArt';

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

/** Yes / no as a shadcn/ui-like RadioGroup: a row per option with its round indicator. */
function AttendanceRadios({ attending, onChange }: { attending: boolean; onChange: (attending: boolean) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium" id="luz-attendance">
        ¿Nos acompañas?
      </span>
      <div className="grid gap-2" role="radiogroup" aria-labelledby="luz-attendance">
        {[
          { value: true, label: 'Sí, ahí estaré', hint: 'Cuenten conmigo en la ceremonia y la celebración.' },
          { value: false, label: 'No podré asistir', hint: 'Los acompañaré en mis oraciones.' },
        ].map(({ value, label, hint }) => {
          const isSelected = attending === value;
          return (
            <button
              key={label}
              type="button"
              role="radio"
              aria-checked={isSelected}
              onClick={() => onChange(value)}
              className={cn(
                'flex cursor-pointer items-start gap-3 rounded-(--radius) border px-4 py-3 text-left transition-[border-color,background-color] outline-none focus-visible:ring-[3px] focus-visible:ring-(--ring)/50',
                isSelected ? 'border-(--primary) bg-(--accent)/60' : 'border-(--border) hover:bg-(--muted)',
              )}
            >
              <span
                className={cn('mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border', isSelected ? 'border-(--primary)' : 'border-(--input)')}
                aria-hidden="true"
              >
                {isSelected && <span className="size-2 rounded-full bg-(--primary)" />}
              </span>
              <span>
                <span className="block text-sm font-medium">{label}</span>
                <span className="block text-xs text-(--muted-foreground)">{hint}</span>
              </span>
            </button>
          );
        })}
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
      <Candle className="mx-auto h-28 w-auto" />
      <p className="mt-4 font-newsreader text-3xl italic">{title}</p>
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
        <Card className="p-6 shadow-[0_30px_70px_-40px_oklch(0.4_0.08_70/0.6)] sm:p-10">
          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.3em] text-(--primary) uppercase">Confirmación</p>
            <h2 className="mt-3 font-newsreader text-[clamp(34px,5vw,46px)] leading-tight font-light italic">¿Nos acompañas?</h2>
            {props.deadlineLabel && (
              <p className="mt-2 text-sm text-(--muted-foreground)">
                Por favor responde antes del <span className="font-semibold text-(--foreground)">{props.deadlineLabel}</span>.
              </p>
            )}
            {guest && (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-(--border) px-3 py-1 text-xs font-medium">
                <Users className="size-3.5 text-(--primary)" aria-hidden="true" />
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
      <Done title={form.attending ? 'Gracias por confirmar' : 'Gracias por avisarnos'}>
        <p className="mt-2 text-sm text-(--muted-foreground)">
          {form.attending
            ? `Reservamos ${form.seats === 1 ? 'tu lugar' : `${form.seats} lugares`}. Te esperamos con alegría.`
            : 'Te tendremos presente en este día tan especial.'}
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
        <p className="mt-2 text-sm text-(--muted-foreground)">Si tienes alguna duda, escríbeles a mis papás.</p>
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
      <AttendanceRadios attending={form.attending} onChange={(attending) => setField('attending', attending)} />
      {form.attending && maxSeats > 1 && (
        <Field label={guest ? '¿Cuántos vienen?' : '¿Cuántos vienen, contándote?'} htmlFor="rsvp-seats" error={errors.seats}>
          <select id="rsvp-seats" className={inputClass} value={form.seats} onChange={(event) => setField('seats', Number(event.target.value))}>
            {Array.from({ length: maxSeats }, (_, index) => index + 1).map((count) => (
              <option key={count} value={count}>
                {count === 1 ? '1 persona' : `${count} personas`}
              </option>
            ))}
          </select>
        </Field>
      )}
      <Field label="Unas palabras para mi familia (opcional)" htmlFor="rsvp-message" error={errors.message ?? errors.rsvp}>
        <textarea
          id="rsvp-message"
          className={cn(inputClass, 'h-auto min-h-24 resize-none')}
          rows={3}
          maxLength={1000}
          placeholder="Una bendición, un buen deseo…"
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
      <AttendanceRadios attending={form.attending === 'yes'} onChange={(attending) => setField('attending', attending ? 'yes' : 'no')} />
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
        Confirmar por WhatsApp
      </button>
      <p className="text-center text-xs text-(--muted-foreground)">Se abrirá WhatsApp con tu respuesta lista para enviar.</p>
    </form>
  );
}
