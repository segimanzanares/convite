import { SectionHeading } from '../shared/SectionHeading';
import { Reveal } from '../shared/Reveal';
import { useRsvpForm, type AttendanceStatus } from '../../hooks/useRsvpForm';
import { seatsLabel, useOnlineRsvp } from '../../hooks/useOnlineRsvp';
import { downloadEventCalendar, type CalendarOccasion } from '../../utils/calendar';
import type { Venue } from '../../types/wedding';

interface RsvpSectionProps {
  whatsappNumber: string;
  deadlineLabel: string;
  /** Enables the "add to calendar" button (together with `venues`) after confirming. */
  calendar?: CalendarOccasion;
  venues?: Venue[];
}

const ATTENDANCE_OPTIONS: { value: AttendanceStatus; label: string }[] = [
  { value: 'yes', label: '✓ Asistiré' },
  { value: 'no', label: '✗ No podré asistir' },
];

const RSVP_INPUT_CLASS =
  'bg-[rgba(255,255,255,0.04)] border border-gold/30 text-gold-pale font-body text-base font-light py-3.5 px-5 outline-none transition-colors duration-300 w-full tracking-[0.05em] placeholder:text-gold-light/35 placeholder:italic focus:border-gold';

const RSVP_BUTTON_CLASS =
  'bg-transparent border border-gold text-gold font-display text-[10px] tracking-[0.6em] uppercase py-[18px] px-10 cursor-pointer transition-all duration-[400ms] hover:bg-gold hover:text-ink disabled:opacity-50 disabled:pointer-events-none';

function attendanceOptionClass(isSelected: boolean) {
  return [
    'flex-1 border p-3 cursor-pointer font-display text-[9px] tracking-[0.4em] uppercase text-center transition-all duration-300',
    isSelected
      ? 'bg-gold text-ink border-gold'
      : 'bg-transparent text-gold-pale border-gold/30 hover:bg-gold hover:text-ink hover:border-gold',
  ].join(' ');
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-[15px] italic text-[#f3b7a8] text-left -mt-2">{message}</p> : null;
}

export function RsvpSection(props: RsvpSectionProps) {
  const online = useOnlineRsvp();

  return online.isOnline ? <OnlineRsvp {...props} online={online} /> : <WhatsappRsvp {...props} />;
}

/** Answers stored by the server, through the open form or a guest's personalized link. */
function OnlineRsvp({
  deadlineLabel,
  calendar,
  venues,
  online,
}: RsvpSectionProps & { online: ReturnType<typeof useOnlineRsvp> }) {
  const { guest, form, setField, errors, isAnswered, isOpen, maxSeats } = online;

  return (
    <div data-tone="dark" className="bg-[linear-gradient(160deg,var(--dark-from),var(--dark-to))] text-gold-pale py-[100px] px-10 text-center">
      <Reveal className="max-w-[680px] mx-auto">
        <SectionHeading eyebrow="Confirmación" title="RSVP" tone="dark" />
        {guest ? (
          <p className="text-[clamp(18px,2.4vw,22px)] font-light leading-[1.7] text-gold-light mt-5">
            {guest.name}
            <span className="block text-[clamp(15px,1.8vw,17px)] italic text-gold-pale opacity-80">
              Hemos reservado {seatsLabel(guest.seats)} para ustedes
            </span>
          </p>
        ) : null}
        <p className="text-[clamp(16px,2vw,19px)] font-light leading-[1.9] italic text-gold-pale opacity-80 mt-5">
          Por favor confirme su asistencia antes del{' '}
          <strong className="text-gold-light">{deadlineLabel}</strong>
        </p>

        {isAnswered ? (
          <>
            <p className="font-script text-[38px] text-gold-light mt-5">
              {form.attending ? '¡Gracias! Nos alegra contar contigo 🤍' : '¡Gracias por avisarnos! Te extrañaremos 🤍'}
            </p>
            {form.attending ? (
              <p className="italic text-gold-pale opacity-80 mt-2">Confirmaste {form.seats === 1 ? '1 persona' : `${form.seats} personas`}.</p>
            ) : null}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
              {form.attending && calendar && venues?.length ? (
                <button className={RSVP_BUTTON_CLASS} type="button" onClick={() => downloadEventCalendar(calendar, venues)}>
                  📅 Añadir al calendario
                </button>
              ) : null}
              {guest && isOpen ? (
                <button className={RSVP_BUTTON_CLASS} type="button" onClick={online.editAnswer}>
                  Cambiar respuesta
                </button>
              ) : null}
            </div>
          </>
        ) : !isOpen ? (
          <p className="font-script text-[34px] text-gold-light mt-8">El plazo para confirmar asistencia terminó.</p>
        ) : (
          <form className="max-w-[480px] mx-auto mt-[50px] flex flex-col gap-4" onSubmit={online.submit}>
            {!guest ? (
              <>
                <input
                  className={RSVP_INPUT_CLASS}
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="Su nombre completo"
                  value={form.name}
                  onChange={(event) => setField('name', event.target.value)}
                />
                <FieldError message={errors.name} />
              </>
            ) : null}
            <div className="flex gap-3 justify-center" role="radiogroup" aria-label="Asistencia">
              {ATTENDANCE_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={form.attending === (option.value === 'yes')}
                  className={attendanceOptionClass(form.attending === (option.value === 'yes'))}
                  onClick={() => setField('attending', option.value === 'yes')}
                >
                  {option.label}
                </button>
              ))}
            </div>
            {form.attending ? (
              <label className="flex items-center justify-between gap-4 text-left">
                <span className="font-display text-[9px] tracking-[0.3em] uppercase text-gold-light">
                  Personas que asistirán{guest ? '' : ', incluyéndote'}
                </span>
                <select
                  className={`${RSVP_INPUT_CLASS} w-auto [&>option]:text-ink`}
                  value={form.seats}
                  onChange={(event) => setField('seats', Number(event.target.value))}
                >
                  {Array.from({ length: maxSeats }, (_, index) => index + 1).map((count) => (
                    <option key={count} value={count}>
                      {count}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
            <FieldError message={errors.seats} />
            <textarea
              className={`${RSVP_INPUT_CLASS} resize-none`}
              rows={3}
              maxLength={1000}
              placeholder="Un mensaje para los anfitriones (opcional)"
              value={form.message}
              onChange={(event) => setField('message', event.target.value)}
            />
            <FieldError message={errors.message ?? errors.rsvp} />
            <button className={`${RSVP_BUTTON_CLASS} mt-2.5`} type="submit" disabled={online.processing}>
              {online.processing ? 'Enviando…' : 'Confirmar Asistencia'}
            </button>
          </form>
        )}
      </Reveal>
    </div>
  );
}

/** The original flow: the form opens WhatsApp with a pre-filled message. */
function WhatsappRsvp({ whatsappNumber, deadlineLabel, calendar, venues }: RsvpSectionProps) {
  const { form, setField, isSubmitted, handleSubmit } = useRsvpForm(whatsappNumber);

  return (
    <div data-tone="dark" className="bg-[linear-gradient(160deg,var(--dark-from),var(--dark-to))] text-gold-pale py-[100px] px-10 text-center">
      <Reveal className="max-w-[680px] mx-auto">
        <SectionHeading eyebrow="Confirmación" title="RSVP" tone="dark" />
        <p className="text-[clamp(16px,2vw,19px)] font-light leading-[1.9] italic text-gold-pale opacity-80 mt-5">
          Por favor confirme su asistencia antes del{' '}
          <strong className="text-gold-light">{deadlineLabel}</strong>
        </p>

        {!isSubmitted ? (
          <form className="max-w-[480px] mx-auto mt-[50px] flex flex-col gap-4" onSubmit={handleSubmit}>
            <input
              className={RSVP_INPUT_CLASS}
              type="text"
              required
              placeholder="Su nombre completo"
              value={form.name}
              onChange={(event) => setField('name', event.target.value)}
            />
            <div className="flex gap-3 justify-center">
              {ATTENDANCE_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  className={attendanceOptionClass(form.attending === option.value)}
                  onClick={() => setField('attending', option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
            <input
              className={RSVP_INPUT_CLASS}
              type="number"
              min={0}
              max={4}
              placeholder="Número de acompañantes (0–4)"
              value={form.guests}
              onChange={(event) => setField('guests', event.target.value)}
            />
            <button
              className="bg-transparent border border-gold text-gold font-display text-[10px] tracking-[0.6em] uppercase py-[18px] px-10 cursor-pointer transition-all duration-[400ms] mt-2.5 hover:bg-gold hover:text-ink"
              type="submit"
            >
              Confirmar Asistencia
            </button>
          </form>
        ) : (
          <>
            <p className="font-script text-[38px] text-gold-light mt-5">¡Gracias! Nos alegra contar contigo 🤍</p>
            {form.attending === 'yes' && calendar && venues?.length ? (
              <button
                className="bg-transparent border border-gold text-gold font-display text-[10px] tracking-[0.6em] uppercase py-[18px] px-10 cursor-pointer transition-all duration-[400ms] mt-8 hover:bg-gold hover:text-ink"
                type="button"
                onClick={() => downloadEventCalendar(calendar, venues)}
              >
                📅 Añadir al calendario
              </button>
            ) : null}
          </>
        )}
      </Reveal>
    </div>
  );
}
