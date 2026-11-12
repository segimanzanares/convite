import { useState } from 'react';
import type {
    ValidationErrors,
    ValidationSchema,
    ValidationValues,
} from '@/types';

/**
 * Runs a validation schema against a plain values object. Framework-agnostic:
 * the caller decides where `values` comes from and what to do with the result.
 */
export function useFormValidation(schema: ValidationSchema) {
    const [errors, setErrors] = useState<ValidationErrors>({});

    function runValidators(
        field: string,
        values: ValidationValues,
    ): string | null {
        for (const validator of schema[field] ?? []) {
            const message = validator(values[field], values);

            if (message) {
                return message;
            }
        }

        return null;
    }

    /** Validates every field in the schema and returns the resulting errors. */
    function validate(values: ValidationValues): ValidationErrors {
        const nextErrors: ValidationErrors = {};

        for (const field of Object.keys(schema)) {
            const message = runValidators(field, values);

            if (message) {
                nextErrors[field] = message;
            }
        }

        setErrors(nextErrors);

        return nextErrors;
    }

    /** Revalidates a single field, e.g. in response to it changing, and updates its error. */
    function validateField(
        field: string,
        values: ValidationValues,
    ): string | null {
        const message = runValidators(field, values);

        setErrors((previous) => {
            if (!message) {
                if (!(field in previous)) {
                    return previous;
                }

                const next = { ...previous };
                delete next[field];

                return next;
            }

            return { ...previous, [field]: message };
        });

        return message;
    }

    function clearErrors(): void {
        setErrors({});
    }

    return { errors, validate, validateField, clearErrors } as const;
}
