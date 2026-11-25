import { Head } from '@inertiajs/react';
import type { ReactNode } from 'react';

type Props = {
    /** The document title. */
    headTitle: string;
    /** What this page is for, above the event's title (e.g. "Registro de llegadas"). */
    eyebrow: string;
    title: string;
    icon: ReactNode;
    /** Shown in the header, under the title (e.g. the arrivals counter). */
    summary?: ReactNode;
    children: ReactNode;
};

/**
 * Frame of the pages used on a phone at the event (the door and the live gallery's upload page), on shadcn/ui's
 * tokens: a header in a gradient of the primary color naming the event, and a narrow column below.
 */
export default function EventPage({ headTitle, eyebrow, title, icon, summary, children }: Props) {
    return (
        <main className="min-h-svh bg-muted/40 text-foreground">
            <Head title={headTitle} />
            <header className="bg-linear-to-br from-primary to-[color-mix(in_oklch,var(--primary),white_22%)] text-primary-foreground">
                <div className="mx-auto max-w-md px-4 pt-6 pb-5">
                    <div className="flex items-center gap-3">
                        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/15 text-primary-foreground ring-1 ring-primary-foreground/20 [&_svg]:size-5">
                            {icon}
                        </span>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-primary-foreground/70">{eyebrow}</p>
                            <h1 className="text-lg leading-tight font-semibold tracking-tight">{title}</h1>
                        </div>
                    </div>
                    {summary}
                </div>
            </header>
            <div className="mx-auto max-w-md px-4 py-6">{children}</div>
        </main>
    );
}
