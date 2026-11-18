import { Reveal } from '../shared/Reveal';
import { useWishes } from '../../hooks/useWishes';
import { WishesBook, type WishesTheme } from './WishesBook';

const LABEL = 'font-display text-[9px] tracking-[0.3em] uppercase text-gold-deep';

/** The book in the classic templates' tokens: ivory paper, gold hairlines and the theme's dark band. */
const CLASSIC_THEME: WishesTheme = {
  frame:
    'rounded-[30px] border border-gold/25 bg-ivory/70 p-3 shadow-[0_30px_80px_-40px_color-mix(in_srgb,var(--color-gold)_45%,transparent)]',
  intro:
    'rounded-[22px] border border-gold/20 bg-[linear-gradient(160deg,var(--dark-from),var(--dark-to))] p-7 text-left text-gold-pale min-h-[260px] xl:min-h-0',
  introEyebrow: 'font-display text-[9px] tracking-[0.35em] uppercase text-gold-light/80',
  introTitle: 'font-body text-[clamp(30px,3.4vw,40px)] leading-[1.1] text-ivory',
  introOrnament: 'text-gold',
  introText: 'font-body text-[17px] leading-[1.7] text-gold-pale/80',
  panel: 'rounded-[22px] border border-gold/20 bg-[linear-gradient(170deg,var(--color-ivory),var(--color-cream))] p-6 sm:p-7 text-left',
  eyebrow: LABEL,
  panelTitle: 'font-body text-[clamp(30px,3.2vw,38px)] leading-tight text-ink',
  accent: 'italic text-gold-deep',
  rule: 'border-gold/25',
  ornament: 'text-gold',
  label: LABEL,
  input:
    'w-full rounded-xl border border-gold/35 bg-ivory px-4 py-3 font-body text-[17px] text-ink outline-none transition-colors placeholder:italic placeholder:text-ink/35 focus:border-gold',
  note: 'font-body text-[15px] italic text-ink/60',
  error: 'font-body text-[15px] italic text-[#b5533c]',
  button:
    'inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[linear-gradient(160deg,var(--dark-from),var(--dark-to))] px-6 py-4 font-display text-[10px] tracking-[0.35em] uppercase text-gold-pale shadow-[0_14px_30px_-16px_var(--dark-from)] transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer',
  navButton:
    'inline-flex items-center gap-2 rounded-lg border border-gold/40 bg-ivory px-3.5 py-2.5 font-display text-[9px] tracking-[0.25em] uppercase text-gold-deep transition-colors hover:bg-gold/10 disabled:opacity-40 disabled:pointer-events-none cursor-pointer',
  pill: 'shrink-0 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 font-body text-[14px] text-gold-deep',
  preview: 'rounded-xl border border-gold/30 bg-ivory p-5 shadow-[inset_0_0_0_4px_var(--color-ivory),inset_0_0_0_5px_color-mix(in_srgb,var(--color-gold)_18%,transparent)]',
  previewText: 'font-body text-[18px] leading-[1.5] italic text-ink/75',
  previewSignature: 'font-body text-[16px] italic text-gold-deep',
  cover:
    'rounded-l-md rounded-r-2xl bg-[linear-gradient(160deg,var(--dark-from),var(--dark-to))] text-gold-pale shadow-[inset_10px_0_0_-4px_rgb(0_0_0/0.25),0_30px_50px_-24px_rgb(0_0_0/0.55)]',
  coverFrame: 'rounded-xl border border-gold/40',
  coverMonogram: 'border border-gold/60 font-body text-[30px] italic text-gold-light',
  coverOccasion: 'font-display text-[9px] tracking-[0.35em] uppercase text-gold-light/80',
  coverTitle: 'font-display text-[clamp(20px,2.4vw,26px)] leading-tight tracking-[0.12em] uppercase text-ivory',
  coverScript: 'font-script text-[30px] leading-none text-gold-light',
  coverDate: 'rounded-full border border-gold/40 px-3 py-1 font-display text-[9px] tracking-[0.25em] uppercase text-gold-light',
  ribbon: 'bg-[linear-gradient(to_bottom,var(--color-gold-light),var(--color-gold-deep))]',
  page:
    'rounded-xl border border-gold/30 bg-[linear-gradient(170deg,var(--color-ivory),var(--color-cream))] shadow-[0_20px_40px_-26px_rgb(0_0_0/0.45)]',
  pageHeader: 'font-display text-[8px] tracking-[0.3em] uppercase text-gold-deep',
  pageAuthor: 'font-body text-[24px] leading-tight text-ink',
  pageMessage: 'font-body text-[18px] leading-[1.55] italic text-ink/75',
  pageDate: 'font-display text-[8px] tracking-[0.3em] uppercase text-ink/45',
  thanks: 'font-script text-[40px] leading-none text-gold-deep',
};

/**
 * The wishes book of the templates that share the classic components, after the RSVP. It renders nothing unless the
 * invitation offers the book.
 */
export function WishesSection() {
  const wishes = useWishes();

  if (!wishes.book) return null;

  return (
    <section id="deseos" className="bg-ivory px-4 py-[100px] text-center sm:px-8">
      <Reveal className="mx-auto max-w-[1180px]">
        <p className="font-display text-[10px] tracking-[0.6em] uppercase text-gold">Palabras que perduran</p>
        <p className="mt-3 font-script text-[clamp(38px,5vw,54px)] leading-none text-gold-deep">Escrito con cariño</p>
        <h2 className="mt-2 font-body text-[clamp(40px,6vw,64px)] leading-[1.05] text-ink">
          Libro de <span className="italic text-gold-deep">buenos deseos</span>
        </h2>
        <p className="mx-auto mt-5 mb-12 max-w-[560px] font-body text-[clamp(16px,2vw,19px)] leading-[1.8] font-light italic text-ink/70">
          Una hoja para cada deseo y un recuerdo para toda la vida. {wishes.cover.plural ? 'Déjales' : 'Déjale'} unas palabras a {wishes.cover.recipient}.
        </p>
        <WishesBook wishes={wishes} theme={CLASSIC_THEME} />
      </Reveal>
    </section>
  );
}
