import { useState, type FormEvent } from 'react';

export type AttendanceStatus = 'yes' | 'no';

interface RsvpFormState {
  name: string;
  email: string;
  attending: AttendanceStatus;
  guests: string;
}

const INITIAL_STATE: RsvpFormState = {
  name: '',
  email: '',
  attending: 'yes',
  guests: '',
};

function buildWhatsappMessage(form: RsvpFormState) {
  const attendingLabel = form.attending === 'yes' ? 'Asistiré' : 'No podré asistir';
  const lines = [
    'Confirmación de asistencia',
    `Nombre: ${form.name.trim()}`,
    `Correo: ${form.email.trim()}`,
    `Asistencia: ${attendingLabel}`,
  ];
  if (form.guests.trim()) {
    lines.push(`Acompañantes: ${form.guests.trim()}`);
  }
  return lines.join('\n');
}

export function useRsvpForm(whatsappNumber: string, requestEmail: boolean = false) {
  const [form, setForm] = useState<RsvpFormState>(INITIAL_STATE);
  const [isSubmitted, setIsSubmitted] = useState(false);

  function setField<K extends keyof RsvpFormState>(field: K, value: RsvpFormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!form.name.trim()) {
      window.alert('Por favor ingrese su nombre.');
      return;
    }
    if (requestEmail && !form.email.trim()) {
      window.alert('Por favor ingrese su correo electrónico.');
      return;
    }
    if (!form.guests.trim()) {
      window.alert('Por favor ingrese el número de acompañantes.');
      return;
    }
    const message = buildWhatsappMessage(form);
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setIsSubmitted(true);
  }

  return { form, setField, isSubmitted, handleSubmit };
}
