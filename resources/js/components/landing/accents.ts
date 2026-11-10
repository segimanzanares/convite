export type Accent = 'gold' | 'terracotta' | 'rose' | 'teal';

export const ACCENT_CLASSES: Record<Accent, { text: string; border: string; bg: string }> = {
  gold: { text: 'text-gold-deep', border: 'border-gold/40', bg: 'bg-gold' },
  terracotta: { text: 'text-terracotta', border: 'border-terracotta/40', bg: 'bg-terracotta' },
  rose: { text: 'text-rose', border: 'border-rose/40', bg: 'bg-rose' },
  teal: { text: 'text-teal', border: 'border-teal/40', bg: 'bg-teal' },
};
