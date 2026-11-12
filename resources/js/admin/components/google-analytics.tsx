import { useGoogleAnalytics } from '@/hooks/use-google-analytics';

/** Sends the page views of the public pages to Google Analytics (see use-google-analytics). */
export function GoogleAnalytics() {
    useGoogleAnalytics();

    return null;
}
