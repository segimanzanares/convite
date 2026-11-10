# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

Convite: a site for custom digital invitations (weddings, XV años, birthdays). It is a Laravel 13 app that serves a React 19 + TypeScript frontend through Inertia v3. Each invitation is hand-built React code under `resources/js/invitations/<template>/`; the database only holds per-invitation routing and meta data.

## Commands

- `composer dev`: run the Laravel server, queue, logs and Vite dev server together (`php artisan dev`)
- `npm run build`: type-check via `tsc -b`, then production-build with Vite into `public/build`
- `npm run lint`: ESLint over the frontend
- `php artisan test`: Pest test suite (runs against the `convite_testing` PostgreSQL database, see `phpunit.xml`)
- `./vendor/bin/pint`: format PHP code
- `php artisan migrate --seed`: create tables and seed the existing invitations (`InvitationSeeder` is idempotent)

PHP ^8.3 and Node (pinned via `.nvmrc`, v24.7.0). The database is PostgreSQL (`convite` locally).

## Architecture

### Backend (Laravel)

- `routes/web.php`: `/` renders the landing page; `/i/{invitation}` (`show`), `/i/{invitation}/tarjeta` (`printCard`) and `/i/{invitation}/pases` (`guestPasses`) go to `InvitationController`. `{invitation}` binds by `slug`.
- `App\Models\Invitation`: `slug` (URL) is separate from `template` (folder under `resources/js/invitations/`). For example slug `mati-nayith` uses template `matilde-nayith`. `component($page)` builds the Inertia component name; `hasPage($page)` checks that the template ships that `.tsx` file. The printable pages are optional per template and 404 when the file is missing.
- Meta tags (title, description, og:image, robots) are rendered server-side in `resources/views/app.blade.php` from an optional `meta` prop. Its defaults are the landing page's own. Invitation pages are `noindex, nofollow`. This replaces the old `scripts/prerender.ts`.
- 404s (unknown routes, unknown slugs) render the React `pages/not-found/NotFoundPage` with a 404 status (see `bootstrap/app.php`).

### Frontend (Inertia + React)

- Entry: `resources/js/app.tsx`. Inertia component names are paths relative to `resources/js` without the extension, resolved with `import.meta.glob` over `./pages/**/*Page.tsx` and `./invitations/*/*Page.tsx`. `config/inertia.php` points `pages.paths` at `resources/js` so `assertInertia` can check that these files exist.
- To add an invitation, create `resources/js/invitations/<template>/InvitationPage.tsx` (optionally `PrintCardPage.tsx` / `GuestPassesPage.tsx`) and add a row to `invitations`, usually through `InvitationSeeder`.
- Navigation uses `Link` from `@inertiajs/react`. There is no client-side router. Pages still set `document.title` themselves on mount.
- Styling: Tailwind v4 via `@tailwindcss/vite` (`resources/js/index.css`) plus plain per-theme CSS files.
- Static assets: per-invitation images and audio live in `public/invitations/<template>/` and are referenced by absolute path. Bundled images live under `resources/js/assets/`.
- `VITE_CONTACT_WHATSAPP` and `VITE_GA_ID` come from `.env` and are read by `resources/js/config/`.
- TypeScript project references: `tsconfig.app.json` covers `resources/js`, `tsconfig.node.json` covers `vite.config.ts`.
