const price = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
});

/** Formats a plan price sent by the server, e.g. "1500.00" → "$1,500". */
export function formatPrice(amount: string | number): string {
  return price.format(Number(amount));
}
