import { SectionHeading } from '../shared/SectionHeading';
import { Reveal } from '../shared/Reveal';
import { useRsvpForm, type AttendanceStatus } from '../../hooks/useRsvpForm';
import type { CoupleInfo } from '../../types/wedding';
import '../../styles/rsvp.css';

interface RsvpSectionProps {
  couple: CoupleInfo;
}

const ATTENDANCE_OPTIONS: { value: AttendanceStatus; label: string }[] = [
  { value: 'yes', label: '✓ Asistiré' },
  { value: 'no', label: '✗ No podré asistir' },
];

export function RsvpSection({ couple }: RsvpSectionProps) {
  const { form, setField, isSubmitted, handleSubmit } = useRsvpForm(couple.rsvpWhatsappNumber);

  return (
    <div className="rsvp-section">
      <Reveal className="rsvp-inner">
        <SectionHeading eyebrow="Confirmación" title="RSVP" />
        <p className="body-text rsvp-deadline">
          Por favor confirme su asistencia antes del{' '}
          <strong className="rsvp-deadline-date">{couple.rsvpDeadlineLabel}</strong>
        </p>

        {!isSubmitted ? (
          <form className="rsvp-form" onSubmit={handleSubmit}>
            <input
              className="rsvp-input"
              type="text"
              placeholder="Su nombre completo"
              value={form.name}
              onChange={(event) => setField('name', event.target.value)}
            />
            <div className="rsvp-radio-group">
              {ATTENDANCE_OPTIONS.map((option) => (
                <div
                  key={option.value}
                  className={`rsvp-radio${form.attending === option.value ? ' active' : ''}`}
                  onClick={() => setField('attending', option.value)}
                >
                  {option.label}
                </div>
              ))}
            </div>
            <input
              className="rsvp-input"
              type="number"
              min={0}
              max={4}
              placeholder="Número de acompañantes (0–4)"
              value={form.guests}
              onChange={(event) => setField('guests', event.target.value)}
            />
            <button className="btn-confirm" type="submit">
              Confirmar Asistencia
            </button>
          </form>
        ) : (
          <p className="success-msg">¡Gracias! Nos alegra contar contigo 🤍</p>
        )}
      </Reveal>
    </div>
  );
}
