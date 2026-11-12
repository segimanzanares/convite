import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import { bunny } from 'laravel-vite-plugin/fonts';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { wayfinder } from '@laravel/vite-plugin-wayfinder';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    laravel({
      // Invitations app and admin panel are separate Inertia apps (see
      // app/Http/Middleware/HandleInertiaRequests.php).
      input: ['resources/js/invitations/app.tsx', 'resources/js/app/app.tsx'],
      refresh: true,
      // Main app fonts, loaded by @fonts in resources/views/app.blade.php:
      // the panel's, also the text of the landing page and the door, plus the
      // landing's subtitles (serif) and script titles
      fonts: [
        bunny('Geist', {
          weights: [300, 400, 500, 600],
        }),
        bunny('Cormorant Garamond', {
          weights: [500, 600],
        }),
        bunny('Great Vibes', {
          weights: [400],
        }),
      ],
    }),
    react(),
    tailwindcss(),
    // Typed route helpers for the admin panel, generated into
    // resources/js/app/{actions,routes,wayfinder}
    wayfinder({
      path: 'resources/js/app',
      formVariants: true,
    }),
  ],
  resolve: {
    alias: {
      // The admin panel (Laravel React starter kit) imports through "@/".
      // The invitations app uses relative imports.
      '@': fileURLToPath(new URL('./resources/js/app', import.meta.url)),
    },
  },
  server: {
    watch: {
      ignored: ['**/storage/framework/views/**', '**/vendor/**', '**/.claude/**'],
    },
  },
});
