const money = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
});

const date = new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
});

/** Formats a decimal amount sent by the server, e.g. "1500.00" → "$1,500.00". */
export function formatMoney(amount: string | number): string {
    return money.format(Number(amount));
}

/** Formats a "Y-m-d" date sent by the server, e.g. "2026-12-05" → "5 dic 2026". */
export function formatDate(value: string | null): string {
    return value ? date.format(new Date(`${value.slice(0, 10)}T00:00:00Z`)) : '—';
}
