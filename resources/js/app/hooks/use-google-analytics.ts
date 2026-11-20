import { getInitialPageFromDOM } from '@inertiajs/core';
import type { Page } from '@inertiajs/core';
import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { setAnalyticsEnabled, trackPageView } from '@/lib/analytics';

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

let isCurrentPageTracked = false;

function handlePage(page: Page) {
    isCurrentPageTracked = isTrackedComponent(page.component);
    setAnalyticsEnabled(isCurrentPageTracked);

    if (isCurrentPageTracked) {
        trackPageView(page.url);
    }
}

/**
 * Tracks page views in Google Analytics, only on the public pages. The panel
 * and the landing page are one SPA, so the tag cannot just be embedded in the
 * root Blade view: navigating client-side between them never reloads it. This
 * loads gtag.js on demand and checks the page on every Inertia navigation.
 *
 * Once loaded, gtag.js would also measure the pages reached afterwards (its
 * enhanced measurement sends a page view on every history change), so it is
 * turned off before the URL changes (when a visit starts, or on back and
 * forward) and back on only if the new page is a tracked one.
 */
export function useGoogleAnalytics(): void {
    useEffect(() => {
        const initialPage = getInitialPageFromDOM<Page>('app');

        if (initialPage) {
            handlePage(initialPage);
        }

        const disable = () => setAnalyticsEnabled(false);

        // Registered before gtag.js loads, so it runs before its own listener
        window.addEventListener('popstate', disable);

        const listeners = [
            router.on('start', disable),
            // Visits that replace the page (or fail) fire no navigate event
            router.on('success', (event) => {
                isCurrentPageTracked = isTrackedComponent(
                    event.detail.page.component,
                );
            }),
            router.on('finish', () => setAnalyticsEnabled(isCurrentPageTracked)),
            // The initial page is handled above: its navigate event may fire
            // before this effect subscribes, or after
            router.on('navigate', (event) => {
                if (event.detail.type !== 'initial') {
                    handlePage(event.detail.page);
                }
            }),
        ];

        return () => {
            window.removeEventListener('popstate', disable);
            listeners.forEach((removeListener) => removeListener());
        };
    }, []);
}
