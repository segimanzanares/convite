const WHATSAPP_NUMBER = import.meta.env.VITE_CONTACT_WHATSAPP?.trim();

if (import.meta.env.DEV && !WHATSAPP_NUMBER) {
  console.warn(
    'VITE_CONTACT_WHATSAPP no está configurado. Copia .env.example a .env.local y define el número de WhatsApp del negocio.',
  );
}

export function buildWhatsappUrl(message: string) {
  if (!WHATSAPP_NUMBER) return '#';
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
