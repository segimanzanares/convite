import type { ReactNode } from 'react';
import { CalendarPlus, Check, MailCheck, Pencil, X } from 'lucide-react';
import { Reveal } from '../../../components/shared/Reveal';
import { useRsvpForm } from '../../../hooks/useRsvpForm';
import { seatsLabel, useOnlineRsvp } from '../../../hooks/useOnlineRsvp';
import { downloadEventCalendar, type CalendarOccasion } from '../../../utils/calendar';
import type { Venue } from '../../../types/wedding';
import { buttonClass, cn, inputClass } from '../../../components/ui/styles';
import { Card, Section } from '../../../components/ui/primitives';
import { SectionHeader } from './ui';

interface RsvpSectionProps {
  whatsappNumber: string;
  deadlineLabel: string;
  calendar: CalendarOccasion;
  venues: Venue[];
}

function Field({ label, htmlFor, error, children }: { label: string; htmlFor: string; error?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-2 text-left">
      <label htmlFor={htmlFor} className="text-sm font-medium">
        {label}
      </label>
      {children}
      {error && <p className="text-sm text-(--destructive)">{error}</p>}
    </div>
  );
}

/** Two-option toggle in the style of shadcn/ui's radio cards. */
function AttendanceToggle({ attending, onChange }: { attending: boolean; onChange: (attending: boolean) => void }) {
  const options = [
    { value: true, label: 'Asistiré', Icon: Check },
    { value: false, label: 'No podré asistir', Icon: X },
  ];

  return (
    <div className="flex flex-col gap-2 text-left">
      <span className="text-sm font-medium" id="boda-moderna-attendance">
        ¿Nos acompañas?
      </span>
      <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-labelledby="boda-moderna-attendance">
        {options.map(({ value, label, Icon }) => (
          <button
            key={label}
            type="button"
            role="radio"
            aria-checked={attending === value}
            onClick={() => onChange(value)}
            className={cn(
              'flex items-center justify-center gap-2 rounded-[calc(var(--radius)-4px)] border px-3 py-3 text-sm font-medium transition-colors cursor-pointer',
              'outline-none focus-visible:ring-[3px] focus-visible:ring-(--ring)/50 [&_svg]:size-4',
              attending === value
                ? 'border-(--primary) bg-(--primary) text-(--primary-foreground)'
                : 'border-(--input) hover:bg-(--accent)',
            )}
          >
            <Icon aria-hidden="true" />
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Deadline({ label }: { label: string }) {
  return label ? (
    <>
      Por favor confirma antes del <strong className="font-medium text-(--foreground)">{label}</strong>.
    </>
  ) : null;
}

function ThankYou({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="py-4 text-center">
      <span className="mx-auto flex size-12 items-center justify-center rounded-full border border-(--border) bg-(--muted)">
        <MailCheck className="size-5" aria-hidden="true" />
      </span>
      <p className="mt-4 text-lg font-semibold tracking-tight">{title}</p>
      {children}
    </div>
  );
}

function CalendarButton({ calendar, venues }: Pick<RsvpSectionProps, 'calendar' | 'venues'>) {
  return calendar.dateTime && venues.length ? (
    <button type="button" className={buttonClass('outline')} onClick={() => downloadEventCalendar(calendar, venues)}>
      <CalendarPlus aria-hidden="true" />
      Añadir al calendario
    </button>
  ) : null;
}

export function RsvpSection(props: RsvpSectionProps) {
  const online = useOnlineRsvp();

  return (
    <Section id="rsvp" dark>
      <SectionHeader badge="RSVP" title="Confirma tu asistencia" />
      <Reveal className="mx-auto max-w-md">
        <Card className="p-6 sm:p-8">{online.isOnline ? <OnlineRsvp {...props} online={online} /> : <WhatsappRsvp {...props} />}</Card>
      </Reveal>
    </Section>
  );
}

/** Answers stored by the server, through the open form or a guest's personalized link. */
function OnlineRsvp({ deadlineLabel, calendar, venues, online }: RsvpSectionProps & { online: ReturnType<typeof useOnlineRsvp> }) {
  const { guest, form, setField, errors, isAnswered, isOpen, maxSeats } = online;

  if (isAnswered) {
    return (
      <ThankYou title={form.attending ? '¡Gracias! Nos alegra contar contigo' : 'Gracias por avisarnos, te extrañaremos'}>
        {form.attending && (
          <p className="mt-1 text-sm text-(--muted-foreground)">
            Confirmaste {form.seats === 1 ? '1 persona' : `${form.seats} personas`}.
          </p>
        )}
        <div className="mt-6 flex flex-col justify-center gap-2 sm:flex-row">
          {form.attending && <CalendarButton calendar={calendar} venues={venues} />}
          {guest && isOpen && (
            <button type="button" className={buttonClass('ghost')} onClick={online.editAnswer}>
              <Pencil aria-hidden="true" />
              Cambiar respuesta
            </button>
          )}
        </div>
      </ThankYou>
    );
  }

  if (!isOpen) {
    return <ThankYou title="El plazo para confirmar asistencia terminó." />;
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={online.submit}>
      <div className="text-sm text-(--muted-foreground)">
        {guest && (
          <p className="mb-2 text-base">
            <span className="font-semibold text-(--foreground)">{guest.name}</span>, hemos reservado {seatsLabel(guest.seats)} para
            ustedes.
          </p>
        )}
        <Deadline label={deadlineLabel} />
      </div>
      {!guest && (
        <Field label="Nombre completo" htmlFor="rsvp-name" error={errors.name}>
          <input
            id="rsvp-name"
            className={inputClass}
            type="text"
            required
            autoComplete="name"
            placeholder="Tu nombre"
            value={form.name}
            onChange={(event) => setField('name', event.target.value)}
          />
        </Field>
      )}
      <AttendanceToggle attending={form.attending} onChange={(attending) => setField('attending', attending)} />
      {form.attending && (
        <Field label={`Personas que asistirán${guest ? '' : ', incluyéndote'}`} htmlFor="rsvp-seats" error={errors.seats}>
          <select
            id="rsvp-seats"
            className={cn(inputClass, '[&>option]:text-black')}
            value={form.seats}
            onChange={(event) => setField('seats', Number(event.target.value))}
          >
            {Array.from({ length: maxSeats }, (_, index) => index + 1).map((count) => (
              <option key={count} value={count}>
                {count}
              </option>
            ))}
          </select>
        </Field>
      )}
      <Field label="Mensaje para los novios (opcional)" htmlFor="rsvp-message" error={errors.message ?? errors.rsvp}>
        <textarea
          id="rsvp-message"
          className={cn(inputClass, 'h-auto min-h-20 resize-none')}
          rows={3}
          maxLength={1000}
          placeholder="Escribe unas palabras…"
          value={form.message}
          onChange={(event) => setField('message', event.target.value)}
        />
      </Field>
      <button className={buttonClass('default', 'lg', 'w-full')} type="submit" disabled={online.processing}>
        {online.processing ? 'Enviando…' : 'Confirmar asistencia'}
      </button>
    </form>
  );
}

/** Without online RSVP the form opens WhatsApp with a pre-filled message. */
function WhatsappRsvp({ whatsappNumber, deadlineLabel, calendar, venues }: RsvpSectionProps) {
  const { form, setField, isSubmitted, handleSubmit } = useRsvpForm(whatsappNumber);

  if (isSubmitted) {
    return (
      <ThankYou title="¡Gracias! Nos alegra contar contigo">
        <p className="mt-1 text-sm text-(--muted-foreground)">Envía el mensaje en WhatsApp para completar tu confirmación.</p>
        {form.attending === 'yes' && (
          <div className="mt-6">
            <CalendarButton calendar={calendar} venues={venues} />
          </div>
        )}
      </ThankYou>
    );
  }

  return (
    <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <p className="text-sm text-(--muted-foreground)">
        Tu respuesta se enviará por WhatsApp. <Deadline label={deadlineLabel} />
      </p>
      <Field label="Nombre completo" htmlFor="rsvp-name">
        <input
          id="rsvp-name"
          className={inputClass}
          type="text"
          required
          autoComplete="name"
          placeholder="Tu nombre"
          value={form.name}
          onChange={(event) => setField('name', event.target.value)}
        />
      </Field>
      <AttendanceToggle
        attending={form.attending === 'yes'}
        onChange={(attending) => setField('attending', attending ? 'yes' : 'no')}
      />
      <Field label="Número de acompañantes (0–4)" htmlFor="rsvp-guests">
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
        Confirmar por WhatsApp
      </button>
    </form>
  );
}
