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
    return value
        ? date.format(new Date(`${value.slice(0, 10)}T00:00:00Z`))
        : '—';
}

const day = new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
});

/** Formats a timestamp sent by the server in the browser's time zone, e.g. "2026-12-05T20:15:00Z" → "5 dic". */
export function formatDay(value: string): string {
    return day.format(new Date(value));
}
