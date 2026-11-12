import type { FormComponentRef } from '@inertiajs/core';
import { useRef } from 'react';
import { useFormValidation } from '@/hooks/use-form-validation';
import type { ValidationSchema } from '@/types';

/**
 * Wires useFormValidation into Inertia's <Form> component: validates on
 * submit, and revalidates whichever field changed via a single delegated
 * listener (native `change` events bubble, and Radix's Select/Checkbox
 * intentionally dispatch one from their hidden input for exactly this
 * reason, so individual fields don't need their own onChange for this).
 *
 * Spread the result onto <Form ref={formRef} onBefore={onBefore} onChange={onChange}>.
 */
export function useInertiaFormValidation(schema: ValidationSchema) {
    const formRef = useRef<FormComponentRef>(null);
    const { errors, validate, validateField, clearErrors } =
        useFormValidation(schema);

    function onBefore(): boolean {
        const validationErrors = validate(formRef.current?.getData() ?? {});

        if (Object.keys(validationErrors).length > 0) {
            formRef.current?.setError(validationErrors);

            return false;
        }

        return true;
    }

    function onChange(event: React.ChangeEvent<HTMLFormElement>): void {
        const field = (event.target as unknown as HTMLInputElement).name;

        if (!field || !(field in schema)) {
            return;
        }

        const values = formRef.current?.getData() ?? {};
        const message = validateField(field, values);

        if (message) {
            formRef.current?.setError(field, message);
        } else {
            formRef.current?.clearErrors(field);
        }
    }

    return { formRef, onBefore, onChange, errors, clearErrors } as const;
}
