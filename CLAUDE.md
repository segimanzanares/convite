# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

Convite: a site for custom digital invitations (weddings, XV años, birthdays). It is a Laravel 13 app that serves a React 19 + TypeScript frontend through Inertia v3. Templates are hand-built React designs under `resources/js/site/templates/<template>/`; each invitation's content (names, date, venues, photos, music...) is captured by the admin in the panel and stored in the database, so one template serves many invitations. An admin panel, built from the Laravel React starter kit with Fortify authentication, lives under `/admin`.

## Commands

- `composer dev`: run the Laravel server, queue, logs and Vite dev server together (`php artisan dev`)
- `npm run build`: type-check via `tsc -b`, then production-build with Vite into `public/build`
- `npm run lint`: ESLint over the frontend
- `php artisan test`: Pest test suite (runs against the `convite_testing` PostgreSQL database, see `phpunit.xml`)
- `./vendor/bin/pint`: format PHP code
- `php artisan migrate --seed`: create tables and seed the demo invitations (`InvitationSeeder` is idempotent; their content lives in `database/seeders/data/invitations/<template>.php`)
- `php artisan storage:link`: needed once, so uploaded photos and music (public disk) are served
- `php artisan admin:create`: create an admin panel account. Public registration is disabled.

PHP ^8.3 and Node (pinned via `.nvmrc`, v24.7.0). The database is PostgreSQL (`convite` locally).

## Architecture

### Backend (Laravel)

- `routes/web.php`: `/` renders the landing page (`LandingController`, which sends the active plans for the pricing section); `/i/{invitation}` (`show`), `/i/{invitation}/tarjeta` (`printCard`) and `/i/{invitation}/pases` (`guestPasses`) go to `InvitationController`. `{invitation}` binds by `slug`.
- `App\Models\Invitation`: `slug` (URL) is separate from `template` (folder under `resources/js/site/templates/`). For example slug `mati-nayith` uses template `boda-floral`, and the folder names follow the templates' labels (`boda-clasica`, `boda-floral`, `cumpleanos-floral`, `xv-jardin`). Each template declares in its `template.json` its `kind` (`App\Enums\InvitationKind`: `wedding`, `birthday`, `xv`) and the optional `sections` its design shows; `Invitation::templates()` reads these manifests. A design made for one client (a custom invitation) is still a template, marked `"exclusive": true`: `Invitation::assignableTemplates()` only offers it to the invitation that already uses it. It also needs an order whose plan includes `custom_design` (`InvitationValidationRules`); an invitation without an order may use one. `component($page)` builds the Inertia component name; `hasPage($page)` checks that the template ships that `.tsx` file. The printable pages are optional per template and 404 when the file is missing.
- Meta tags (title, description, og:image, robots) are rendered server-side in `resources/views/app.blade.php` from an optional `meta` prop. Its defaults are the landing page's own. Invitation pages are `noindex, nofollow`. This replaces the old `scripts/prerender.ts`.
- 404s (unknown routes, unknown slugs) render the React `pages/not-found/NotFoundPage` with a 404 status (see `bootstrap/app.php`). URLs under `/admin` keep Laravel's default 404 page.
- `invitations.status` (`App\Enums\InvitationStatus`): only `published` invitations are public. The `invitation.visible` middleware (every `/i/{slug}` route, RSVP included) answers 404 for a `draft` and 410 for an `archived` one (`pages/unavailable/UnavailablePage`), but lets panel users who may `view` the invitation open it as a preview: the page gets a `preview` prop with the status, shown by `site/components/preview/PreviewBanner`. Unpublished invitations take no RSVPs (`acceptsRsvps`) and cannot be sent to guests (`GuestDeliveryService::ensureSendable`). New rows default to `published`.
- Invitation content (`invitations.content`, jsonb, plus `event_time`): edited only by admins in `Admin\InvitationContentController`, validated per kind by `App\Concerns\InvitationContentRules`. `InvitationContentResource` resolves media URLs, builds the maps from each venue's coordinates and, for invitations without an order (the demos), moves the date to 60 days from today keeping the time and the deadline offset. Publishing requires the date, the time and the names (`InvitationValidationRules`).

### Admin panel (Fortify + React starter kit)

- The public site and the admin panel are two separate Inertia apps. `HandleInertiaRequests` picks the root view (`app` or `admin`) by URL and gives `/admin` its own asset version. An Inertia visit that crosses between the two apps therefore gets a version mismatch, which triggers a full page reload. Only the admin app gets the shared `auth`, `name` and `sidebarOpen` props.
- Fortify routes are prefixed with `admin` and `home` is `/admin` (see `config/fortify.php`). Registration is off; the other kit features are on: password reset, email verification, two-factor authentication and passkeys. `FortifyServiceProvider` renders the auth pages.
- `routes/web.php` holds the dashboard and `routes/settings.php` holds the account settings. Both are inside the `admin` prefix group, and route names keep the starter kit's (`dashboard`, `profile.edit`, `security.edit`, ...).
- The UI is in Spanish. Server messages come from `lang/es/*.php` and `lang/es.json`, which also covers Fortify, passkey and mail notification strings.

### Clients, plans and orders

- `users.role` (`App\Enums\UserRole`): `admin` (the Convite team) or `client`. A client user belongs to a `Client` through `users.client_id`. `AppServiceProvider` lets admins through every ability with `Gate::before`, so the policies in `app/Policies` only describe what client users may do (read their own invitations).
- Panel sections live in `routes/admin.php` (prefix `admin`, names `admin.*` so they do not clash with the public `invitations.*` routes) and `app/Http/Controllers/Admin`. Controllers stay thin: logic lives in `app/Services`, validation in `app/Http/Requests/<Model>` (shared rules in `app/Concerns/*ValidationRules`), and props go through `app/Http/Resources` (`JsonResource::withoutWrapping()`). Forms open in modals whose state comes from the URL (`create`/`edit` routes render the listing with a `modal` prop), as in the nabamenu project.
- `Order::$plan_snapshot` keeps a copy of the plan's `max_guests` and `features` (`App\Enums\PlanFeature`); limits and features are always read from it, never from the live plan. Only orders whose features include `guest_management` or `online_rsvp` let the admin give the client panel access (`ClientService::grantAccess`, which emails a Fortify reset link as a welcome).
- An invitation with an order belongs to the order's client, and its printable pages only exist if the plan includes `print_card` / `guest_passes` (`Invitation::offersPage`). Invitations without an order (the demos) serve every page their template has.
- Guests and RSVPs: a `Guest` is a family or group (the plan's `max_guests` counts guests, not seats) with a token for its personalized link `/i/{slug}/{token}`. An unknown token shows the open invitation. `Rsvp` holds one answer per guest (`guest_id` unique), or open-form answers with no guest. The panel pages `admin/invitations/{slug}/guests` (CRUD plus a two-step CSV import: `GuestImportService` builds the preview, then the reviewed rows are posted) and `admin/invitations/{slug}/rsvps` (headcounts, CSV export) sit behind the `invitation.feature:<feature>` middleware. That middleware returns 404 to admins too, and demo invitations without an order have neither feature. `GuestService` enforces the guest limit inside a row lock.
- The public RSVP posts JSON to `POST /i/{slug}/rsvp` (throttle `rsvp`, `online_rsvp` plans only). Invitation pages get `rsvp` (settings) and `guest` props. `RsvpSection` and `StoryRsvp` read them through `site/hooks/useOnlineRsvp` and fall back to the WhatsApp flow when `rsvp.online` is false. The form closes at the end of `rsvp_deadline` (or `event_date`) in the application's time zone (`config('app.timezone')`).
- Sending (`GuestDeliveryService`, `Admin\GuestDeliveryController`, `guest_management` only): WhatsApp goes through the `whatsapp_url` (`wa.me`) of each guest, opened from the panel user's own WhatsApp, after which the panel posts `mark-sent`. Ten-digit phones get `convite.default_phone_country_code`. Email is the queued `SendGuestInvitation` job (`GuestInvitationMail`, reply-to the client), which sets `sent_at` only after the mail goes out. The bulk send only covers guests with an email and no `sent_at`.
- `/i/{slug}/pases`: when the plan has `guest_management`, the passes come from the guest list (`guests` prop, with a QR of each personal link), and only panel users who may `manageGuests` can open the page. Visitors are sent to the login. Without a guest list, `guests` is null and `GuestPasses` keeps the typed `localStorage` list.
- The panel's home (`/admin`, `Admin\DashboardController`, `DashboardService`) renders `dashboard/admin` for admins (sales and payments of the last six months, balance due of active and delivered orders, client events in the next 60 days; quotes are not sales and demos are left out) and `dashboard/client` for client users (per invitation: days to the event, guests sent and opened, RSVP headcounts, plus the latest answers and answers per day). Charts are plain elements (`admin/components/bar-chart.tsx`), no chart library.
- `rsvps:digest` (daily at 08:00, `RsvpDigestService`) emails client users the answers their invitations got the day before, as the queued `RsvpDigest` notification with the running totals. It goes to verified client users with `users.receives_rsvp_digest`, which they turn off in their profile (`profile.notifications.update`).
- `guests:purge` (daily, see `routes/console.php`) purges guest data of invitations whose `event_date` is more than `config('convite.guest_retention_days')` days old.

### Frontend (Inertia + React)

- The public site's frontend lives under `resources/js/site/`, and the admin panel's under `resources/js/admin/`. Neither imports from the other, except that the admin logo reuses `site/assets/images/convite-icon.png`.
- Entry: `resources/js/site/app.tsx`. Inertia component names are paths relative to `resources/js/site` without the extension, resolved with `import.meta.glob` over `./pages/**/*Page.tsx` and `./templates/*/*Page.tsx`. `config/inertia.php` points `pages.paths` at `resources/js/site` so `assertInertia` can check that these files exist.
- To add an invitation, create it in the panel as a draft, capture its content (`admin/invitations/{slug}/content`) and publish it. To add a template, create `resources/js/site/templates/<template>/InvitationPage.tsx` (optionally `PrintCardPage.tsx` / `GuestPassesPage.tsx`) plus its `template.json`. Template pages read the `invitation` prop (`InvitationContentResource`, typed in `site/types/invitation.ts`), build the date labels with `site/lib/eventContent.ts` and hide sections without data.
- Navigation uses `Link` from `@inertiajs/react`. There is no client-side router. Pages still set `document.title` themselves on mount.
- Styling: Tailwind v4 via `@tailwindcss/vite` (`resources/js/site/index.css`) plus plain per-theme CSS files.
- Media: the admin uploads photos and music (`InvitationMediaController`) to the public disk under `invitations/{id}/`; content stores the path, and saving the content deletes the uploads it no longer uses. Paths starting with `/` are static files in `public/invitations/<template>/`, used by the seeded demos. Bundled images (e.g. each template's default hero background) live next to the template or under `resources/js/site/assets/`.
- `VITE_CONTACT_WHATSAPP` and `VITE_GA_ID` come from `.env` and are read by `resources/js/site/config/`.
- TypeScript project references: `tsconfig.app.json` covers `resources/js`, `tsconfig.node.json` covers `vite.config.ts`.
- Admin panel frontend: everything lives under `resources/js/admin/`, laid out as in the starter kit. Its entry is `admin/app.tsx` and its stylesheet is `admin/app.css`, which holds the shadcn/ui theme. Each app's CSS only scans its own folder and its Blade root view, so neither app's tokens (e.g. `--primary`) leak into the other. Admin page components are named by their path under `admin/pages` (e.g. `auth/login`, `settings/profile`). The `@/` alias points to `resources/js/admin`, and only admin code uses it.
- Wayfinder's Vite plugin generates typed route helpers into `resources/js/admin/{actions,routes,wayfinder}`. These folders are gitignored; run `php artisan wayfinder:generate --path=resources/js/admin --with-form` if they are missing outside of Vite. ESLint skips them, along with the vendored `admin/components/ui`.

===

<laravel-boost-guidelines>
=== foundation rules ===

# Laravel Boost Guidelines

## Foundational Context

This application is a Laravel application running on PHP 8.4. Always use the APIs that match the installed major version of each package — do not assume a version.

Before relying on a package's API, confirm its installed version:
- PHP packages: run `composer show --direct` to list direct dependencies with versions, or `composer show <vendor/package>` for a single package.
- JS packages: check `package.json` for the installed versions.

## Skills Activation

This project has domain-specific skills available in `**/skills/**`. You MUST activate the relevant skill whenever you work in that domain—don't wait until you're stuck.

## Conventions

- You must follow all existing code conventions used in this application. When creating or editing a file, check sibling files for the correct structure, approach, and naming.
- Use descriptive names for variables and methods. For example, `isRegisteredForDiscounts`, not `discount()`.
- Check for existing components to reuse before writing a new one.

## Verification Scripts

- Do not create verification scripts or tinker when tests cover that functionality and prove they work. Unit and feature tests are more important.

## Application Structure & Architecture

- Stick to existing directory structure; don't create new base folders without approval.
- Do not change the application's dependencies without approval.

## Frontend Bundling

- If a frontend change doesn't show in the UI or you get a "Unable to locate file in Vite manifest" error, run `npm run build` or ask the user to run `npm run dev` or `composer run dev`.

## Documentation Files

- You must only create documentation files if explicitly requested by the user.

=== boost rules ===

# Laravel Boost

## Tools

- Laravel Boost is an MCP server with tools designed specifically for this application. Prefer Boost tools over manual alternatives like shell commands or file reads.
- Use `database-query` to run read-only queries against the database instead of writing raw SQL in tinker.
- Use `database-schema` to inspect table structure before writing migrations or models.
- Use `get-absolute-url` to resolve the correct scheme, domain, and port for project URLs. Always use this before sharing a URL with the user.
- Use `browser-logs` to read browser logs, errors, and exceptions. Only recent logs are useful, ignore old entries.

## Searching Documentation (IMPORTANT)

- Use `search-docs` before changes that depend on Laravel ecosystem APIs, behavior, configuration, or version-specific syntax. Skip it for copy-only edits and other changes where package documentation is irrelevant. Reuse sufficient results already in context instead of searching again.
- Pass a `packages` array to scope results when you know which packages are relevant.
- Use multiple broad, topic-based queries: `['rate limiting', 'routing rate limiting', 'routing']`. Expect the most relevant results first.
- Do not add package names to queries because package info is already shared. Use `test resource table`, not `filament 4 test resource table`.

### Search Syntax

1. Use words for auto-stemmed AND logic: `rate limit` matches both "rate" AND "limit".
2. Use `"quoted phrases"` for exact position matching: `"infinite scroll"` requires adjacent words in order.
3. Combine words and phrases for mixed queries: `middleware "rate limit"`.
4. Use multiple queries for OR logic: `queries=["authentication", "middleware"]`.

## Project Rules

- This project contains committed, area-grouped rules in `.ai/rules` when that directory exists, including path-scoped framework guidelines under `.ai/rules/boost`. Before you enter plan mode or create/edit any file, you MUST first: open @.ai/rules/index.md (it maps file globs to rule files), read every rule file whose globs cover the path(s) in scope, and run `grep -rin 'keyword' .ai/rules` to catch what a path match alone misses. Do not write code until you have read and are following every matching rule. If `.ai/rules` does not exist, continue without it.

## Artisan

- Run Artisan commands directly via the command line (e.g., `php artisan route:list`). Use `php artisan list` to discover available commands and `php artisan [command] --help` to check parameters.
- Inspect routes with `php artisan route:list`. Filter with: `--method=GET`, `--name=users`, `--path=api`, `--except-vendor`, `--only-vendor`.
- Read configuration values using dot notation: `php artisan config:show app.name`, `php artisan config:show database.default`. Or read config files directly from the `config/` directory.

## Tinker

- Execute PHP in app context for debugging and testing code. Do not create models without user approval, prefer tests with factories instead. Prefer existing Artisan commands over custom tinker code.
- Always use single quotes to prevent shell expansion: `php artisan tinker --execute 'Your::code();'`
  - Double quotes for PHP strings inside: `php artisan tinker --execute 'User::where("active", true)->count();'`

=== php rules ===

# PHP

- Always use curly braces for control structures, even for single-line bodies.
- Use PHP 8 constructor property promotion: `public function __construct(public GitHub $github) { }`. Do not leave empty zero-parameter `__construct()` methods unless the constructor is private.
- Use explicit return type declarations and type hints for all method parameters: `function isAccessible(User $user, ?string $path = null): bool`
- Use TitleCase for Enum keys: `FavoritePerson`, `BestLake`, `Monthly`.
- Prefer PHPDoc blocks over inline comments. Only add inline comments for exceptionally complex logic.
- Use array shape type definitions in PHPDoc blocks.

=== deployments rules ===

# Deployment

- Laravel can be deployed using [Laravel Cloud](https://cloud.laravel.com/), which is the fastest way to deploy and scale production Laravel applications.

=== tests rules ===

# Test Enforcement

- Add or update tests for behavior and logic changes when a test provides meaningful regression coverage.
- Pure copy, styling, and layout-only changes do not require new or updated tests.
- When test coverage applies, run the affected tests and ensure they pass.
- Test the changed behavior and its important failure modes, but do not add tests beyond them.
- Read the `testing-best-practices` skill before writing tests.

=== inertia-laravel/core rules ===

# Inertia

- Inertia creates fully client-side rendered SPAs without modern SPA complexity, leveraging existing server-side patterns.
- Components live in `resources/js/pages` (unless specified in `vite.config.js`). Use `Inertia::render()` for server-side routing instead of Blade views.
- ALWAYS use `search-docs` tool for version-specific Inertia documentation and updated code examples.
- IMPORTANT: Activate `inertia-react-development` when working with Inertia client-side patterns.

# Inertia v3

- Use all Inertia features from v1, v2, and v3. Check the documentation before making changes to ensure the correct approach.
- New v3 features: standalone HTTP requests (`useHttp` hook), optimistic updates with automatic rollback, layout props (`useLayoutProps` hook), instant visits, simplified SSR via `@inertiajs/vite` plugin, custom exception handling for error pages.
- Carried over from v2: deferred props, infinite scroll, merging props, polling, prefetching, once props, flash data.
- When using deferred props, add an empty state with a pulsing or animated skeleton.
- Axios has been removed. Use the built-in XHR client with interceptors, or install Axios separately if needed.
- `Inertia::lazy()` / `LazyProp` has been removed. Use `Inertia::optional()` instead.
- Prop types (`Inertia::optional()`, `Inertia::defer()`, `Inertia::merge()`) work inside nested arrays with dot-notation paths.
- SSR works automatically in Vite dev mode with `@inertiajs/vite` - no separate Node.js server needed during development.
- Event renames: `invalid` is now `httpException`, `exception` is now `networkError`.
- `router.cancel()` replaced by `router.cancelAll()`.
- The `future` configuration namespace has been removed - all v2 future options are now always enabled.

=== laravel/core rules ===

# Do Things the Laravel Way

- Use `php artisan make:` commands to create new files (i.e. migrations, controllers, models, etc.). You can list available Artisan commands using `php artisan list` and check their parameters with `php artisan [command] --help`.
- If you're creating a generic PHP class, use `php artisan make:class`.
- Pass `--no-interaction` to all Artisan commands to ensure they work without user input. You should also pass the correct `--options` to ensure correct behavior.

### Model Creation

- When creating new models, create useful factories and seeders for them too. Ask the user if they need any other things, using `php artisan make:model --help` to check the available options.

## APIs & Eloquent Resources

- For APIs, default to using Eloquent API Resources and API versioning unless existing API routes do not, then you should follow existing application convention.

## URL Generation

- When generating links to other pages, prefer named routes and the `route()` function.

## Testing

- When creating models for tests, use the factories for the models. Check if the factory has custom states that can be used before manually setting up the model.
- Faker: Use methods such as `$this->faker->word()` or `fake()->randomDigit()`. Follow existing conventions whether to use `$this->faker` or `fake()`.
- When creating tests, make use of `php artisan make:test [options] {name}` to create a feature test, and pass `--unit` to create a unit test. Most tests should be feature tests.

=== pint/core rules ===

# Laravel Pint Code Formatter

- If you have modified any PHP files, you must run `vendor/bin/pint --dirty --format agent` before finalizing changes to ensure your code matches the project's expected style.
- Do not run `vendor/bin/pint --test --format agent`, simply run `vendor/bin/pint --format agent` to fix any formatting issues.

=== pest/core rules ===

# Pest

- This project uses Pest. Create tests with `php artisan make:test --pest {name}`.
- Do not include the test suite directory in `{name}`. Use `SomeFeatureTest`, not `Feature/SomeFeatureTest`.
- Read the `testing-best-practices` skill for guidance on coverage, naming, structure, dependency isolation, and review.
- Do not delete tests or test files without approval. They are part of the application.

## Running Tests

- Run the narrowest set of tests that covers the change. Pass a file path or `--filter=testName` to `php artisan test --compact`.
- Rerun a test after each change to it.
- Run `vendor/bin/pest` to call the test runner directly. It accepts the same file path and `--filter=testName` arguments.

=== inertia-react/core rules ===

# Inertia + React

- IMPORTANT: Activate `inertia-react-development` when working with Inertia React client-side patterns.

</laravel-boost-guidelines>
