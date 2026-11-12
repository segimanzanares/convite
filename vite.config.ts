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
      // Public site and admin panel are separate Inertia apps (see
      // app/Http/Middleware/HandleInertiaRequests.php).
      input: ['resources/js/site/app.tsx', 'resources/js/admin/app.tsx'],
      refresh: true,
      // Admin app fonts, loaded by @fonts in resources/views/admin.blade.php:
      // the panel's, also the text of the landing page and the door, and the
      // landing's script titles
      fonts: [
        bunny('Instrument Sans', {
          weights: [400, 500, 600],
        }),
        bunny('Great Vibes', {
          weights: [400],
        }),
      ],
    }),
    react(),
    tailwindcss(),
    // Typed route helpers for the admin panel, generated into
    // resources/js/admin/{actions,routes,wayfinder}
    wayfinder({
      path: 'resources/js/admin',
      formVariants: true,
    }),
  ],
  resolve: {
    alias: {
      // The admin panel (Laravel React starter kit) imports through "@/".
      // The public site uses relative imports.
      '@': fileURLToPath(new URL('./resources/js/admin', import.meta.url)),
    },
  },
  server: {
    watch: {
      ignored: ['**/storage/framework/views/**', '**/vendor/**', '**/.claude/**'],
    },
  },
});
