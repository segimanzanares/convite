import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import PublicLayout from '@/layouts/public-layout';
import SettingsLayout from '@/layouts/settings/layout';
import './app.css';

const appName = import.meta.env.VITE_APP_NAME || 'Convite';

// Admin page components are named by their path under ./pages, e.g.
// "auth/login" or "settings/profile" (see app/Providers/FortifyServiceProvider).
// Besides the panel, this app serves the pages outside it: the landing page
// and the door of the event, with the same theme but always in light mode
// (see resources/views/admin.blade.php).
const pages = import.meta.glob('./pages/**/*.tsx');

void createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: async (name) => {
        const page = pages[`./pages/${name}.tsx`];

        if (!page) {
            throw new Error(`Inertia page not found: ${name}`);
        }

        return ((await page()) as { default: never }).default;
    },
    layout: (name) => {
        switch (true) {
            case name.startsWith('landing/') || name.startsWith('check-in/'):
                return PublicLayout;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {app}
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load, except on the pages outside the
// panel, which are designed in light mode only.
if (document.documentElement.dataset.appearance !== 'light') {
    initializeTheme();
}
