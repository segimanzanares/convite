/**
 * Class helpers shared by the components of the classic templates (boda-clasica, boda-floral, cumpleanos-floral,
 * xv-jardin), so cards, buttons, chips and fields keep one shape: 1px gold borders, rounded-2xl cards, rounded-xl
 * fields and pill-shaped buttons and chips. They read the theme's primary, card and surface colors.
 */

/** A card on a light section: rounded, a thin gold border and a soft gold shadow. */
export const CARD_CLASS =
  'rounded-2xl border border-(--primary)/30 bg-[linear-gradient(160deg,var(--card),var(--surface))] shadow-[0_12px_40px_color-mix(in_srgb,var(--primary)_12%,transparent)]';

/** The square tile that frames an icon (gift kinds, attire). */
export const ICON_TILE_CLASS =
  'w-[88px] h-[88px] rounded-2xl border border-(--primary)/60 flex items-center justify-center text-(--primary-deep) bg-[linear-gradient(160deg,var(--card),var(--surface))]';

/** A small pill with a thin gold border, for short labels such as a time. */
export const CHIP_CLASS =
  'inline-flex items-center justify-center rounded-full border border-(--primary)/40 font-display text-[10px] tracking-[0.35em] uppercase text-(--primary) py-1.5 px-4';

type ButtonVariant = 'solid' | 'outline';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  solid: 'bg-(--primary) text-(--primary-foreground) border-(--primary) hover:bg-(--primary-deep) hover:border-(--primary-deep)',
  outline: 'bg-transparent text-(--primary) border-(--primary) hover:bg-(--primary) hover:text-(--primary-foreground)',
};

/** A pill-shaped button, for buttons and links alike: `solid` for the main action, `outline` for the secondary ones. */
export function buttonClass(variant: ButtonVariant = 'solid', className?: string) {
  return [
    'inline-flex items-center justify-center gap-2 rounded-full border font-display text-[10px] tracking-[0.35em] uppercase no-underline',
    'py-3.5 px-8 cursor-pointer transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary)/60',
    '[&_svg]:w-3 [&_svg]:h-3 [&_svg]:fill-current',
    BUTTON_VARIANTS[variant],
    className,
  ]
    .filter(Boolean)
    .join(' ');
}
