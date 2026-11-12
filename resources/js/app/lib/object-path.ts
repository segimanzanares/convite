/** Reads a value by a dotted path, e.g. "content.venues.0.name". */
export function getIn(source: unknown, path: string): unknown {
    return path
        .split('.')
        .reduce<unknown>(
            (value, key) =>
                value !== null && typeof value === 'object'
                    ? (value as Record<string, unknown>)[key]
                    : undefined,
            source,
        );
}

/**
 * Returns a copy of `source` with the value at a dotted path replaced, copying
 * every object or array along the way. Numeric keys create arrays.
 */
export function setIn<T>(source: T, path: string, value: unknown): T {
    const [key, ...rest] = path.split('.');
    const isIndex = /^\d+$/.test(key);
    const current =
        source !== null && typeof source === 'object'
            ? (source as Record<string, unknown>)
            : undefined;
    const copy: Record<string, unknown> | unknown[] = Array.isArray(current)
        ? [...current]
        : current
          ? { ...current }
          : isIndex
            ? []
            : {};
    const next =
        rest.length === 0
            ? value
            : setIn(
                  (copy as Record<string, unknown>)[key],
                  rest.join('.'),
                  value,
              );

    (copy as Record<string, unknown>)[key] = next;

    return copy as T;
}
