/**
 * Class helpers of the shadcn/ui look-alikes shared by the templates built on shadcn/ui's tokens (see primitives.tsx).
 * They read the tokens each template's theme.css declares: --background, --foreground, --card, --primary, --border,
 * --input, --ring, --radius...
 */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

type ButtonVariant = 'default' | 'outline' | 'secondary' | 'ghost';
type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

const BUTTON_VARIANTS: Record<ButtonVariant, string> = {
  default: 'bg-(--primary) text-(--primary-foreground) shadow-sm hover:opacity-90',
  outline: 'border border-(--input) bg-(--background) shadow-sm hover:bg-(--accent)',
  secondary: 'bg-(--secondary) text-(--secondary-foreground) hover:opacity-80',
  ghost: 'hover:bg-(--accent)',
};

const BUTTON_SIZES: Record<ButtonSize, string> = {
  default: 'h-10 px-4 text-sm',
  sm: 'h-9 px-3 text-sm',
  lg: 'h-11 px-6 text-sm',
  icon: 'size-10',
};

/** The classes of a shadcn/ui button, for buttons and links alike. */
export function buttonClass(variant: ButtonVariant = 'default', size: ButtonSize = 'default', className?: string) {
  return cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[calc(var(--radius)-4px)] font-medium no-underline cursor-pointer',
    'transition-[background-color,opacity,box-shadow] duration-150 outline-none',
    'focus-visible:ring-[3px] focus-visible:ring-(--ring)/50 disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:size-4 [&_svg]:shrink-0',
    BUTTON_VARIANTS[variant],
    BUTTON_SIZES[size],
    className,
  );
}

/** The classes of a shadcn/ui text input, select or textarea. */
export const inputClass = cn(
  'w-full rounded-[calc(var(--radius)-4px)] border border-(--input) bg-transparent px-3 py-2 text-base shadow-sm outline-none sm:text-sm',
  'h-10 transition-[box-shadow,border-color] placeholder:text-(--muted-foreground)',
  'focus-visible:border-(--ring) focus-visible:ring-[3px] focus-visible:ring-(--ring)/50',
);

/** "sábado · 12 de junio" → "Sábado · 12 de junio". */
export function capitalize(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
