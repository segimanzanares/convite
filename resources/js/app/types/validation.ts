export type ValidationValues = Record<string, unknown>;

/** A single validation rule: returns an error message, or null when the value is valid. */
export type Validator = (
    value: unknown,
    values: ValidationValues,
) => string | null;

/** Maps a field name to the list of validators that must all pass for it. */
export type ValidationSchema = Record<string, Validator[]>;

export type ValidationErrors = Record<string, string>;
