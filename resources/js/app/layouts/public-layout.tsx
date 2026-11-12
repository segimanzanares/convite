import { useLayoutEffect } from 'react';
import type { ReactNode } from 'react';
import { forceLightAppearance } from '@/hooks/use-appearance';

/**
 * Frame of the pages outside the panel (the landing page and the door of the event): Convite's ivory background and
 * smooth anchor scrolling, always in light mode, without the panel's chrome. Leaving them for the panel (the same SPA)
 * restores the user's appearance.
 */
export default function PublicLayout({ children }: { children: ReactNode }) {
    // Before the first paint, so a user in dark mode does not see it flash
    useLayoutEffect(() => {
        forceLightAppearance(true);
        document.documentElement.classList.add('scroll-smooth');

        return () => {
            forceLightAppearance(false);
            document.documentElement.classList.remove('scroll-smooth');
        };
    }, []);

    return <div className="min-h-screen overflow-x-clip bg-ivory text-ink">{children}</div>;
}
