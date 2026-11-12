import { createContext, useContext } from 'react';
import type { RouteDefinition } from '@/wayfinder';

/** Reads and writes the content form by dotted paths, e.g. "content.venues.0.name". */
export type ContentFormBinding = {
    value: (path: string) => unknown;
    set: (path: string, value: unknown) => void;
    error: (path: string) => string | undefined;
    uploadUrl: RouteDefinition<'post'>;
    mediaUrlPrefix: string;
};

const ContentFormContext = createContext<ContentFormBinding | null>(null);

export const ContentFormProvider = ContentFormContext.Provider;

export function useContentForm(): ContentFormBinding {
    const binding = useContext(ContentFormContext);

    if (!binding) {
        throw new Error(
            'useContentForm must be used inside ContentFormProvider',
        );
    }

    return binding;
}
