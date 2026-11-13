/**
 * Class helpers shared by the components of the classic templates (boda-clasica, boda-floral, cumpleanos-floral,
 * xv-jardin), so cards, buttons, chips and fields keep one shape: 1px gold borders, rounded-2xl cards, rounded-xl
 * fields and pill-shaped buttons and chips. They read the theme's gold, ivory and cream colors.
 */

/** A card on a light section: rounded, a thin gold border and a soft gold shadow. */
export const CARD_CLASS =
  'rounded-2xl border border-gold/30 bg-[linear-gradient(160deg,var(--color-ivory),var(--color-cream))] shadow-[0_12px_40px_color-mix(in_srgb,var(--color-gold)_12%,transparent)]';

/** The square tile that frames an icon (gift kinds, attire). */
export const ICON_TILE_CLASS =
  'w-[88px] h-[88px] rounded-2xl border border-gold/60 flex items-center justify-center text-gold-deep bg-[linear-gradient(160deg,var(--color-ivory),var(--color-cream))]';

/** A small pill with a thin gold border, for short labels such as a time. */
export const CHIP_CLASS =
  'inline-flex items-center justify-center rounded-full border border-gold/40 font-display text-[10px] tracking-[0.35em] uppercase text-gold py-1.5 px-4';

type ButtonVariant = 'solid' | 'outline';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  solid: 'bg-gold text-ivory border-gold hover:bg-gold-deep hover:border-gold-deep',
  outline: 'bg-transparent text-gold border-gold hover:bg-gold hover:text-ivory',
};

/** A pill-shaped button, for buttons and links alike: `solid` for the main action, `outline` for the secondary ones. */
export function buttonClass(variant: ButtonVariant = 'solid', className?: string) {
  return [
    'inline-flex items-center justify-center gap-2 rounded-full border font-display text-[10px] tracking-[0.35em] uppercase no-underline',
    'py-3.5 px-8 cursor-pointer transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold/60',
    '[&_svg]:w-3 [&_svg]:h-3 [&_svg]:fill-current',
    BUTTON_VARIANTS[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');
}
