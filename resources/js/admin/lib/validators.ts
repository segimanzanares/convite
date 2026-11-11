import type { Validator } from '@/types';

function isEmpty(value: unknown): boolean {
    return (
        value === null ||
        value === undefined ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
    );
}

export function required(message = 'Este campo es obligatorio.'): Validator {
    return (value) => (isEmpty(value) ? message : null);
}

export function email(
    message = 'Ingresa un correo electrónico válido.',
): Validator {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return (value) => {
        if (isEmpty(value)) {
            return null;
        }

        return pattern.test(String(value)) ? null : message;
    };
}

export function numeric(message = 'Este campo debe ser un número.'): Validator {
    return (value) => {
        if (isEmpty(value)) {
            return null;
        }

        return Number.isFinite(Number(value)) ? null : message;
    };
}

/** Requires a numeric value to be greater than or equal to the given limit. */
export function min(limit: number, message?: string): Validator {
    return (value) => {
        if (isEmpty(value)) {
            return null;
        }

        return Number(value) >= limit
            ? null
            : (message ?? `Debe ser mayor o igual a ${limit}.`);
    };
}

/** Requires a numeric value to be less than or equal to the given limit. */
export function max(limit: number, message?: string): Validator {
    return (value) => {
        if (isEmpty(value)) {
            return null;
        }

        return Number(value) <= limit
            ? null
            : (message ?? `Debe ser menor o igual a ${limit}.`);
    };
}

/** Requires a string's length to be at least the given number of characters. */
export function minLength(limit: number, message?: string): Validator {
    return (value) => {
        if (isEmpty(value)) {
            return null;
        }

        return String(value).length >= limit
            ? null
            : (message ?? `Debe tener al menos ${limit} caracteres.`);
    };
}

/** Requires a string's length to be at most the given number of characters. */
export function maxLength(limit: number, message?: string): Validator {
    return (value) => {
        if (isEmpty(value)) {
            return null;
        }

        return String(value).length <= limit
            ? null
            : (message ?? `Debe tener como máximo ${limit} caracteres.`);
    };
}

/** Requires the field's value to match another field's value, e.g. a confirmation field. */
export function sameAs(field: string, message?: string): Validator {
    return (value, values) => {
        return value === values[field]
            ? null
            : (message ?? 'Los valores no coinciden.');
    };
}
