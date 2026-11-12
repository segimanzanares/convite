import { getInitialPageFromDOM } from '@inertiajs/core';
import type { Page } from '@inertiajs/core';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { trackPageView } from '@/lib/analytics';

/**
 * Pages measured in Google Analytics. The door of the event is left out: only
 * the staff uses it, and its URLs carry the guests' tokens.
 */
const TRACKED_COMPONENT_PREFIXES = ['landing/'];

/** Whether Google Analytics measures the given page (see TRACKED_COMPONENT_PREFIXES). */
export function isTrackedComponent(component: string): boolean {
    return TRACKED_COMPONENT_PREFIXES.some((prefix) =>
        component.startsWith(prefix),
    );
}

function handlePage(page: Page) {
    if (isTrackedComponent(page.component)) {
        trackPageView(page.url);
    }
}

/**
 * Tracks page views in Google Analytics, only on the public pages. The panel
 * and the landing page are one SPA, so the tag cannot just be embedded in the
 * root Blade view: navigating client-side between them never reloads it. This
 * loads gtag.js on demand and checks the page on every Inertia navigation.
 */
export function useGoogleAnalytics(): void {
    useEffect(() => {
        const initialPage = getInitialPageFromDOM<Page>('app');

        if (initialPage) {
            handlePage(initialPage);
        }

        // The initial page is handled above: its navigate event may fire
        // before this effect subscribes, or after
        return router.on('navigate', (event) => {
            if (event.detail.type !== 'initial') {
                handlePage(event.detail.page);
            }
        });
    }, []);
}
