import { Reveal } from '../shared/Reveal';
import { useWishes } from '../../hooks/useWishes';
import { WishesBook, type WishesTheme } from './WishesBook';

const LABEL = 'font-display text-[9px] tracking-[0.3em] uppercase text-(--primary-deep)';

/** The book in the classic templates' tokens: card-colored paper, primary hairlines and the theme's dark band. */
const CLASSIC_THEME: WishesTheme = {
  frame:
    'rounded-[30px] border border-(--primary)/25 bg-(--card)/70 p-3 shadow-[0_30px_80px_-40px_color-mix(in_srgb,var(--primary)_45%,transparent)]',
  intro:
    'rounded-[22px] border border-(--primary)/20 bg-[linear-gradient(160deg,var(--dark-from),var(--dark-to))] p-7 text-left text-(--primary-pale) min-h-[260px] xl:min-h-0',
  introEyebrow: 'font-display text-[9px] tracking-[0.35em] uppercase text-(--primary-light)/80',
  introTitle: 'font-body text-[clamp(30px,3.4vw,40px)] leading-[1.1] text-(--card)',
  introOrnament: 'text-(--primary)',
  introText: 'font-body text-[17px] leading-[1.7] text-(--primary-pale)/80',
  panel: 'rounded-[22px] border border-(--primary)/20 bg-[linear-gradient(170deg,var(--card),var(--surface))] p-6 sm:p-7 text-left',
  eyebrow: LABEL,
  panelTitle: 'font-body text-[clamp(30px,3.2vw,38px)] leading-tight text-(--foreground)',
  accent: 'italic text-(--primary-deep)',
  rule: 'border-(--primary)/25',
  ornament: 'text-(--primary)',
  label: LABEL,
  input:
    'w-full rounded-xl border border-(--primary)/35 bg-(--card) px-4 py-3 font-body text-[17px] text-(--foreground) outline-none transition-colors placeholder:italic placeholder:text-(--foreground)/35 focus:border-(--primary)',
  note: 'font-body text-[15px] italic text-(--foreground)/60',
  error: 'font-body text-[15px] italic text-[#b5533c]',
  button:
    'inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[linear-gradient(160deg,var(--dark-from),var(--dark-to))] px-6 py-4 font-display text-[10px] tracking-[0.35em] uppercase text-(--primary-pale) shadow-[0_14px_30px_-16px_var(--dark-from)] transition-opacity hover:opacity-90 disabled:opacity-50 cursor-pointer',
  navButton:
    'inline-flex items-center gap-2 rounded-lg border border-(--primary)/40 bg-(--card) px-3.5 py-2.5 font-display text-[9px] tracking-[0.25em] uppercase text-(--primary-deep) transition-colors hover:bg-(--primary)/10 disabled:opacity-40 disabled:pointer-events-none cursor-pointer',
  pill: 'shrink-0 rounded-full border border-(--primary)/30 bg-(--primary)/10 px-3 py-1 font-body text-[14px] text-(--primary-deep)',
  preview: 'rounded-xl border border-(--primary)/30 bg-(--card) p-5 shadow-[inset_0_0_0_4px_var(--card),inset_0_0_0_5px_color-mix(in_srgb,var(--primary)_18%,transparent)]',
  previewText: 'font-body text-[18px] leading-[1.5] italic text-(--foreground)/75',
  previewSignature: 'font-body text-[16px] italic text-(--primary-deep)',
  cover:
    'rounded-l-md rounded-r-2xl bg-[linear-gradient(160deg,var(--dark-from),var(--dark-to))] text-(--primary-pale) shadow-[inset_10px_0_0_-4px_rgb(0_0_0/0.25),0_30px_50px_-24px_rgb(0_0_0/0.55)]',
  coverFrame: 'rounded-xl border border-(--primary)/40',
  coverMonogram: 'border border-(--primary)/60 font-body text-[30px] italic text-(--primary-light)',
  coverOccasion: 'font-display text-[9px] tracking-[0.35em] uppercase text-(--primary-light)/80',
  coverTitle: 'font-display text-[clamp(20px,2.4vw,26px)] leading-tight tracking-[0.12em] uppercase text-(--card)',
  coverScript: 'font-script text-[30px] leading-none text-(--primary-light)',
  coverDate: 'rounded-full border border-(--primary)/40 px-3 py-1 font-display text-[9px] tracking-[0.25em] uppercase text-(--primary-light)',
  ribbon: 'bg-[linear-gradient(to_bottom,var(--primary-light),var(--primary-deep))]',
  page:
    'rounded-xl border border-(--primary)/30 bg-[linear-gradient(170deg,var(--card),var(--surface))] shadow-[0_20px_40px_-26px_rgb(0_0_0/0.45)]',
  pageHeader: 'font-display text-[8px] tracking-[0.3em] uppercase text-(--primary-deep)',
  pageAuthor: 'font-body text-[24px] leading-tight text-(--foreground)',
  pageMessage: 'font-body text-[18px] leading-[1.55] italic text-(--foreground)/75',
  pageDate: 'font-display text-[8px] tracking-[0.3em] uppercase text-(--foreground)/45',
  thanks: 'font-script text-[40px] leading-none text-(--primary-deep)',
};

/**
 * The wishes book of the templates that share the classic components, after the RSVP. It renders nothing unless the
 * invitation offers the book.
 */
export function WishesSection() {
  const wishes = useWishes();

  if (!wishes.book) return null;

  return (
    <section id="deseos" className="bg-(--card) px-4 py-[100px] text-center sm:px-8">
      <Reveal className="mx-auto max-w-[1180px]">
        <p className="font-display text-[10px] tracking-[0.6em] uppercase text-(--primary)">Palabras que perduran</p>
        <p className="mt-3 font-script text-[clamp(38px,5vw,54px)] leading-none text-(--primary-deep)">Escrito con cariño</p>
        <h2 className="mt-2 font-body text-[clamp(40px,6vw,64px)] leading-[1.05] text-(--foreground)">
          Libro de <span className="italic text-(--primary-deep)">buenos deseos</span>
        </h2>
        <p className="mx-auto mt-5 mb-12 max-w-[560px] font-body text-[clamp(16px,2vw,19px)] leading-[1.8] font-light italic text-(--foreground)/70">
          Una hoja para cada deseo y un recuerdo para toda la vida. {wishes.cover.plural ? 'Déjales' : 'Déjale'} unas palabras a {wishes.cover.recipient}.
        </p>
        <WishesBook wishes={wishes} theme={CLASSIC_THEME} />
      </Reveal>
    </section>
  );
}
