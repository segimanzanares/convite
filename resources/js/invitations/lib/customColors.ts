import type { CustomColors } from '../types/invitation';

/**
 * Applies the primary color the admin picked for an invitation (the `colors` of its `invitation` prop) to the page:
 * the root element gets a data-custom-colors attribute and the --brand and --brand-foreground variables, from which
 * styles/custom-colors.css derives every template's primary and its shades. On <html> it reaches every page of the
 * invitation (the printables too) without each template's wrapper knowing about it. Pages without an invitation
 * (404, 410) clear it.
 */
export function applyCustomColors(pageProps: Record<string, unknown>) {
  const colors = (pageProps.invitation as { colors?: CustomColors | null } | undefined)?.colors;
  const root = document.documentElement;

  if (colors) {
    root.dataset.customColors = '';
    root.style.setProperty('--brand', colors.primary);
    root.style.setProperty('--brand-foreground', colors.primaryForeground);
  } else {
    delete root.dataset.customColors;
    root.style.removeProperty('--brand');
    root.style.removeProperty('--brand-foreground');
  }
}
