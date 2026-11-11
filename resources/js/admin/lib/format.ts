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

const month = new Intl.DateTimeFormat('es-MX', {
    month: 'short',
    timeZone: 'UTC',
});

/** Formats a "Y-m" month sent by the server, e.g. "2026-11" → "nov". */
export function formatMonth(value: string): string {
    return month.format(new Date(`${value}-01T00:00:00Z`));
}

const shortDate = new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
});

/** Formats a "Y-m-d" date sent by the server without the year, e.g. "2026-12-05" → "5 dic". */
export function formatShortDate(value: string): string {
    return shortDate.format(new Date(`${value}T00:00:00Z`));
}

/** Describes how far away a day is, e.g. 0 → "Hoy", 1 → "Mañana", 12 → "En 12 días", -3 → "Hace 3 días". */
export function formatDaysAway(days: number): string {
    if (days === 0) {
        return 'Hoy';
    }

    if (days === 1) {
        return 'Mañana';
    }

    return days > 0 ? `En ${days} días` : `Hace ${-days} días`;
}
