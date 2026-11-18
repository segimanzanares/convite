import { usePage } from '@inertiajs/react';
import type { QueryParams } from '@/wayfinder';

/**
 * The given keys of the current URL's query string that have a value. A
 * listing passes them to its create and edit links, its forms and the modal's
 * close link, so the modal returns to the listing with its filters and page.
 */
export function useListQuery(keys: readonly string[]): QueryParams {
    const { url } = usePage();
    const params = new URLSearchParams(url.split('?')[1] ?? '');

    return Object.fromEntries(
        keys.flatMap((key) => {
            const value = params.get(key);

            return value ? [[key, value]] : [];
        }),
    );
}
