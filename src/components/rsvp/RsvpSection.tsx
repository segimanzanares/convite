import { SectionHeading } from '../shared/SectionHeading';
import { Reveal } from '../shared/Reveal';
import { useRsvpForm, type AttendanceStatus } from '../../hooks/useRsvpForm';
import type { CoupleInfo } from '../../types/wedding';

interface RsvpSectionProps {
  couple: CoupleInfo;
  requestEmail?: boolean;
}

const ATTENDANCE_OPTIONS: { value: AttendanceStatus; label: string }[] = [
  { value: 'yes', label: '✓ Asistiré' },
  { value: 'no', label: '✗ No podré asistir' },
];

const RSVP_INPUT_CLASS =
  'bg-[rgba(255,255,255,0.04)] border border-gold/30 text-gold-pale font-body text-base font-light py-3.5 px-5 outline-none transition-colors duration-300 w-full tracking-[0.05em] placeholder:text-[rgba(232,208,138,0.35)] placeholder:italic focus:border-gold';

export function RsvpSection({ couple, requestEmail }: RsvpSectionProps) {
  const { form, setField, isSubmitted, handleSubmit } = useRsvpForm(couple.rsvpWhatsappNumber, requestEmail);

  return (
    <div className="bg-[linear-gradient(160deg,#1c1308,#2c1f0a)] text-gold-pale py-[100px] px-10 text-center">
      <Reveal className="max-w-[680px] mx-auto">
        <SectionHeading eyebrow="Confirmación" title="RSVP" tone="dark" />
        <p className="text-[clamp(16px,2vw,19px)] font-light leading-[1.9] italic text-gold-pale opacity-80 mt-5">
          Por favor confirme su asistencia antes del{' '}
          <strong className="text-gold-light">{couple.rsvpDeadlineLabel}</strong>
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
            {requestEmail ? <input
              className={RSVP_INPUT_CLASS}
              type="email"
              required
              placeholder="Correo electrónico"
              value={form.email}
              onChange={(event) => setField('email', event.target.value)}
            /> : null}
            <div className="flex gap-3 justify-center">
              {ATTENDANCE_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  className={[
                    'flex-1 border p-3 cursor-pointer font-display text-[9px] tracking-[0.4em] uppercase text-center transition-all duration-300',
                    form.attending === option.value
                      ? 'bg-gold text-ink border-gold'
                      : 'bg-transparent text-gold-pale border-gold/30 hover:bg-gold hover:text-ink hover:border-gold',
                  ].join(' ')}
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
          <p className="font-script text-[38px] text-gold-light mt-5">¡Gracias! Nos alegra contar contigo 🤍</p>
        )}
      </Reveal>
    </div>
  );
}
