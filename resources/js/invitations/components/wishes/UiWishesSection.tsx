import type { ReactNode } from 'react';
import { Reveal } from '../shared/Reveal';
import { buttonClass, cn, inputClass } from '../ui/styles';
import { useWishes } from '../../hooks/useWishes';
import { WishesBook, type WishesTheme } from './WishesBook';

const LABEL = 'text-[10px] font-semibold tracking-[0.22em] uppercase text-(--muted-foreground)';

/** The book in shadcn/ui's tokens: cards with hairline borders, and the cover in the primary color. */
function uiTheme(titleClassName: string): WishesTheme {
  return {
    frame: 'rounded-[calc(var(--radius)+18px)] border border-(--border) bg-(--muted)/60 p-3 shadow-xl',
    intro: 'rounded-[calc(var(--radius)+10px)] bg-(--primary) p-7 text-left text-(--primary-foreground) min-h-[240px] xl:min-h-0',
    introEyebrow: 'text-[10px] font-semibold tracking-[0.25em] uppercase opacity-75',
    introTitle: cn('text-[clamp(28px,3.2vw,36px)] leading-[1.1]', titleClassName),
      introOrnament: 'opacity-80',
    introText: 'text-base leading-relaxed opacity-85',
    panel: 'rounded-[calc(var(--radius)+10px)] border border-(--border) bg-(--card) p-6 text-left text-(--card-foreground) sm:p-7',
    eyebrow: LABEL,
    panelTitle: cn('text-[clamp(26px,3vw,34px)] leading-tight', titleClassName),
    accent: 'italic text-(--primary)',
    rule: 'border-(--border)',
    ornament: 'text-(--primary)',
    label: LABEL,
    input: cn(inputClass, 'h-11'),
    note: 'text-sm text-(--muted-foreground)',
    error: 'text-sm text-(--destructive)',
    button: buttonClass('default', 'lg', 'h-12 w-full gap-3 rounded-full text-xs font-semibold tracking-[0.2em] uppercase'),
    navButton: buttonClass('outline', 'sm', 'rounded-full text-xs'),
    pill: 'shrink-0 rounded-full bg-(--secondary) px-3 py-1 text-xs font-semibold text-(--secondary-foreground)',
    preview: 'rounded-[calc(var(--radius)-2px)] border border-dashed border-(--border) bg-(--muted)/50 p-5',
    previewText: cn('text-lg leading-snug italic text-(--foreground)/80', titleClassName),
    previewSignature: 'text-sm font-medium text-(--primary)',
    cover:
      'rounded-l-md rounded-r-2xl bg-(--primary) text-(--primary-foreground) shadow-[inset_10px_0_0_-4px_rgb(0_0_0/0.18),0_30px_50px_-24px_rgb(0_0_0/0.5)]',
    coverFrame: 'rounded-xl border border-current/30',
    coverMonogram: cn('border border-current/50 text-[28px]', titleClassName),
    coverOccasion: 'text-[10px] font-semibold tracking-[0.3em] uppercase opacity-80',
    coverTitle: cn('text-[clamp(22px,2.6vw,28px)] leading-tight', titleClassName),
    coverScript: cn('text-lg italic opacity-90', titleClassName),
    coverDate: 'rounded-full border border-current/40 px-3 py-1 text-[10px] font-semibold tracking-[0.2em] uppercase',
    ribbon: 'bg-(--accent)',
    page: 'rounded-[calc(var(--radius)+4px)] border border-(--border) bg-(--card) shadow-[0_20px_40px_-26px_rgb(0_0_0/0.4)]',
    pageHeader: 'text-[9px] font-semibold tracking-[0.25em] uppercase text-(--muted-foreground)',
    pageAuthor: cn('text-2xl leading-tight', titleClassName),
    pageMessage: 'text-base leading-relaxed text-(--foreground)/80',
    pageDate: 'text-[10px] font-semibold tracking-[0.2em] uppercase text-(--muted-foreground)',
    thanks: cn('text-3xl leading-tight', titleClassName),
  };
}

interface UiWishesSectionProps {
  /** The template's own section heading; without it the section shows the default one. */
  header?: ReactNode;
  /** Classes for the template's display font, used by the headings, the cover and the pages. */
  titleClassName?: string;
  /** Classes of the default heading's eyebrow. */
  eyebrowClassName?: string;
  sectionClassName?: string;
  /** Classes that replace some of the theme's, e.g. a template's thicker borders. */
  theme?: Partial<WishesTheme>;
}

/**
 * The wishes book of the templates built on shadcn/ui's tokens (see components/ui). Each template passes its display
 * font and, if it has one, its own heading. It renders nothing unless the invitation offers the book.
 */
export function UiWishesSection({
  header,
  titleClassName = 'font-semibold tracking-tight',
  eyebrowClassName = 'text-xs font-semibold tracking-[0.3em] text-(--primary) uppercase',
  sectionClassName,
  theme,
}: UiWishesSectionProps) {
  const wishes = useWishes();

  if (!wishes.book) return null;

  const { cover } = wishes;

  return (
    <section id="deseos" className={cn('scroll-mt-16 px-4 py-20 sm:px-8 sm:py-28', sectionClassName)}>
      <div className="mx-auto max-w-6xl">
        {header ?? (
          <Reveal className="mx-auto mb-12 max-w-2xl text-center">
            <p className={eyebrowClassName}>Palabras que perduran</p>
            <h2 className={cn('mt-3 text-[clamp(34px,5.5vw,56px)] leading-[1.05]', titleClassName)}>
              Libro de <span className="text-(--primary) italic">buenos deseos</span>
            </h2>
            <p className="mt-4 text-base text-pretty text-(--muted-foreground) sm:text-lg">
              Una hoja para cada deseo y un recuerdo para toda la vida. {cover.plural ? 'Déjales' : 'Déjale'} unas
              palabras a {cover.recipient}.
            </p>
          </Reveal>
        )}
        <Reveal>
          <WishesBook wishes={wishes} theme={{ ...uiTheme(titleClassName), ...theme }} />
        </Reveal>
      </div>
    </section>
  );
}
