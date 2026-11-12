import { router } from '@inertiajs/react';
import type { InertiaLinkProps } from '@inertiajs/react';
import { useState } from 'react';
import type { ReactNode } from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type Props<T> = {
    /**
     * What the modal shows, or null when it is closed. Pass a stable value,
     * such as a page prop or a string, since a change shows new content.
     */
    content: T | null;
    /** Where closing the modal navigates to. */
    closeHref: NonNullable<InertiaLinkProps['href']>;
    title: (content: T) => string;
    description?: (content: T) => string;
    children: (content: T) => ReactNode;
    className?: string;
};

/**
 * A modal whose open state comes from the URL (e.g. admin/plans/create), so
 * closing it navigates back to the page underneath. It keeps the last content
 * rendered while it animates out.
 */
export default function UrlModal<T>({
    content,
    closeHref,
    title,
    description,
    children,
    className,
}: Props<T>) {
    const [shown, setShown] = useState<T | null>(content);

    if (content !== null && content !== shown) {
        setShown(content);
    }

    const close = () =>
        router.visit(closeHref, { preserveScroll: true, preserveState: true });

    return (
        <Dialog
            open={content !== null}
            onOpenChange={(open) => !open && close()}
        >
            <DialogContent className={className}>
                {shown !== null && (
                    <>
                        <DialogHeader>
                            <DialogTitle>{title(shown)}</DialogTitle>
                            {description && (
                                <DialogDescription>
                                    {description(shown)}
                                </DialogDescription>
                            )}
                        </DialogHeader>

                        {children(shown)}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
}
