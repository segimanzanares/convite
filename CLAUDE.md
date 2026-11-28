# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project state

Convite: a site for custom digital invitations (weddings, XV años, birthdays). It is a Laravel 13 app that serves a React 19 + TypeScript frontend through Inertia v3. Templates are hand-built React designs under `resources/js/invitations/templates/<template>/`; each invitation's content (names, date, venues, photos, music...) is captured by the admin in the panel and stored in the database, so one template serves many invitations. An admin panel, built from the Laravel React starter kit with Fortify authentication, lives under `/admin`.

## Commands

- `composer dev`: run the Laravel server, queue, logs and Vite dev server together (`php artisan dev`)
- `npm run build`: generate Wayfinder's route helpers (`php artisan wayfinder:generate`, so it needs `composer install` first), type-check via `tsc -b`, then production-build with Vite into `public/build`
- `npm run lint`: ESLint over the frontend
- `php artisan test`: Pest test suite (runs against the `convite_testing` PostgreSQL database, see `phpunit.xml`)
- `./vendor/bin/pint`: format PHP code
- `php artisan migrate --seed`: create tables and seed the demo invitations (`InvitationSeeder` is idempotent and seeds one demo per template, at the template's own slug, e.g. `/i/boda-clasica`; their content lives in `database/seeders/data/invitations/<template>.php`. Client invitations are not: `php artisan db:seed --class=ClientInvitationSeeder`, run by hand once, brings the ones that predate the backend in from `database/seeders/data/clients/<slug>.php`, with their client and order, and skips a slug that already exists)
- `php artisan storage:link`: needed once, so uploaded photos and music (public disk) are served
- `php artisan admin:create`: create an admin panel account. Public registration is disabled.

PHP ^8.3 and Node (pinned via `.nvmrc`, v24.7.0). The database is PostgreSQL (`convite` locally).

## Architecture

### Backend (Laravel)

- `routes/web.php`: `/` renders the landing page (`LandingController`, main app component `landing/index`, which gets the active plans for the pricing section); `/servicios` renders the services besides the invitations (`ServicesController`, `landing/services`; videos and custom printables, whose options are the active plans of each service type, sent as `servicePlans`; `resources/js/app/lib/services.ts` only holds each service's copy, and a service without active plans is left out; the `create_service_plans` migration created them); `/terminos` and `/privacidad` render the terms and the privacy notice (`LegalController`, `landing/terms` and `landing/privacy`, linked from the footer and the cookie banner; the responsible party comes from `convite.legal`, `CONVITE_LEGAL_*`, and the retention periods they state from the purges' own config); `/i/{invitation}` (`show`), `/i/{invitation}/tarjeta` (`printCard`) and `/i/{invitation}/pases` (`guestPasses`) go to `InvitationController`. `{invitation}` binds by `slug`.
- `App\Models\Invitation`: `slug` (URL) is separate from `template` (folder under `resources/js/invitations/templates/`). For example slug `mati-nayith` uses template `boda-clasica`, and the folder names follow the templates' labels (`boda-clasica`, `boda-floral`, `cumpleanos-floral`, `xv-jardin`). Each template declares in its `template.json` its `kind` (`App\Enums\InvitationKind`: `wedding`, `birthday`, `xv`, `baptism`, `gender_reveal`, `baby_shower`; XV and baptism templates share the chapters: story, parents and godparents) and the optional `sections` its design shows (`Invitation::SECTIONS`; `family` is the parents and godparents: a wedding names the parents of each one of the couple, a list of up to two groups, plus its godparents; XV and baptism name the celebrant's parents and godparents; a birthday only the parents, and only the kids' templates show them; a gender reveal names the grandparents and a baby shower its hosts); `Invitation::templates()` reads these manifests. A design made for one client (a custom invitation) is still a template, marked `"exclusive": true`: `Invitation::assignableTemplates()` only offers it to the invitation that already uses it. It also needs an order whose plan includes `custom_design` (`InvitationValidationRules`); an invitation without an order may use one. `component($page)` builds the Inertia component name; `hasPage($page)` checks that the template ships that `.tsx` file. The printable pages are optional per template and 404 when the file is missing.
- Meta tags (title, description, og:image, robots) are rendered server-side by `resources/views/partials/meta.blade.php` (included by the `app` root view, and by `admin` on a first visit to the pages outside the panel) from an optional `meta` prop. Its defaults are the landing page's own. Invitation pages are `noindex, nofollow`. This replaces the old `scripts/prerender.ts`.
- 404s (unknown routes, unknown slugs) render the React `pages/not-found/NotFoundPage` with a 404 status (see `bootstrap/app.php`). URLs under `/admin` keep Laravel's default 404 page.
- `invitations.status` (`App\Enums\InvitationStatus`): only `published` invitations are public. The `invitation.visible` middleware (every `/i/{slug}` route, RSVP included) answers 404 for a `draft` and 410 for an `archived` one (`pages/unavailable/UnavailablePage`), but lets panel users who may `view` the invitation open it as a preview: the page gets a `preview` prop with the status, shown by `invitations/components/preview/PreviewBanner`. Unpublished invitations take no RSVPs (`acceptsRsvps`) and cannot be sent to guests (`GuestDeliveryService::ensureSendable`). New rows default to `published`.
- Gender reveal (`gender_reveal`, templates `revelacion-*`): the content names one or two parents-to-be (`names`, only the first is required), the name picked for each answer (`baby_names.girl` / `baby_names.boy`), the due date as text (`due_label`), the grandparents (`grandparents`, honor groups) and the answer (`reveal`, `girl` or `boy`). The answer may be captured in advance: `InvitationContentResource` sends it only once someone in the panel shows it at the moment of the reveal (`invitations.reveal_shown_at`, `Admin\GenderRevealController`, ability `showReveal`, so the client can do it from "Mis invitaciones"; the `app/components/reveal-toggle` control sits there and in the content form). The panel's `InvitationResource` only says whether an answer was captured, never which, since the parents-to-be may not know it. The templates share the shadcn sections in `invitations/components/gender-reveal` (venues, program, grandparents, gallery, dress code, gifts, RSVP and the "¿niño o niña?" picks, kept in the visitor's browser by `hooks/useTeamGuess`), which read the teams' tokens `--girl`, `--boy` and their `-soft` / `-foreground` variants from each theme.css.
- Baby shower (`baby_shower`, templates `baby-shower-*`): like a gender reveal, the content names one or two parents-to-be (`names`, only the first is required) and the due date as text (`due_label`), plus the baby's name if they picked one (`baby_name`), who hosts the party (`hosts`, honor groups) and the "lluvia de pañales" (`diapers`: a `note` and the `sizes` asked of each group of guests, sent as null without either). The panel's content form edits them in the "El bebé" and "Anfitriones" tabs. The templates share the sections in `invitations/components/baby-shower`, built on shadcn's tokens only (`--secondary` and `--accent` are the two pastel tones that alternate); the venues, gallery, gifts and RSVP are the gender reveal's.
- Invitation content (`invitations.content`, jsonb, plus `event_time`): edited only by admins in `Admin\InvitationContentController`, validated per kind by `App\Concerns\InvitationContentRules`. `InvitationContentResource` resolves media URLs, builds the maps from each venue's coordinates and, for invitations without an order (the demos), moves the date to 60 days from today keeping the time and the deadline offset. Publishing requires the date, the time and the names (`InvitationValidationRules`).
- Demos showing a plan (`DemoShowcaseService`): `/i/{slug}?plan=<slug>` on an invitation without an order, naming an active plan, turns on that plan's online RSVP and wishes book (with sample messages per kind) through `rsvp.demo` / `wishes.demo`. `useOnlineRsvp` and `useWishes` then only pretend to send; the store routes keep answering 404 to demos. Client invitations ignore the parameter. The page also gets a `showcase` prop, shown by `invitations/components/preview/ShowcaseBar`, which names the plan and, when it includes them, links to the printable card and passes (if the template ships them) and to the demo door and live gallery: `DemoShowcaseController` (`invitations.demo.*`, demos only) renders the real `check-in/door`, `live-gallery/upload` and `live-gallery/wall` pages with `door.demo` / `gallery.demo`, sample guests and the invitation's own gallery photos; check-ins and uploads only change the screen.

### Admin panel (Fortify + React starter kit)

- The invitations app (only the invitations, plus the 404/410 pages) and the main app are two separate Inertia apps. The main app serves the panel and, outside it, the landing page and the door of the event. `HandleInertiaRequests` sorts each request into the invitations app's pages (root view `invitations`), the panel's (under `/admin`) or the main app's pages outside the panel (routes `landing`, `invitations.door.*`, `invitations.check-in.*`). Both main app groups use the `app` root view, which gives the pages outside the panel the public meta tags, and share one asset version, so navigating between the landing page and the panel is a visit within the same SPA. The invitations app has its own version, so an Inertia visit that crosses between the two apps gets a version mismatch, which triggers a full page reload. A response whose page does not follow from its URL calls `HandleInertiaRequests::servePages()` (the guest link scanned at the door, and the 404/410 pages in `bootstrap/app.php`). Only the main app gets the shared `auth`, `name` and `sidebarOpen` props.
- Fortify routes are prefixed with `admin` and `home` is `/admin` (see `config/fortify.php`). Registration is off; the other kit features are on: password reset, email verification, two-factor authentication and passkeys. `FortifyServiceProvider` renders the auth pages.
- `routes/web.php` holds the dashboard and `routes/settings.php` holds the account settings. Both are inside the `admin` prefix group, and route names keep the starter kit's (`dashboard`, `profile.edit`, `security.edit`, ...).
- The UI is in Spanish. Server messages come from `lang/es/*.php` and `lang/es.json`, which also covers Fortify, passkey and mail notification strings.

### Clients, plans and orders

- `users.role` (`App\Enums\UserRole`): `admin` (the Convite team) or `client`. A client user belongs to a `Client` through `users.client_id`. `AppServiceProvider` lets admins through every ability with `Gate::before`, so the policies in `app/Policies` only describe what client users may do (read their own invitations).
- Panel sections live in `routes/admin.php` (prefix `admin`, names `admin.*` so they do not clash with the public `invitations.*` routes) and `app/Http/Controllers/Admin`. Controllers stay thin: logic lives in `app/Services`, validation in `app/Http/Requests/<Model>` (shared rules in `app/Concerns/*ValidationRules`), and props go through `app/Http/Resources` (`JsonResource::withoutWrapping()`). Forms open in modals whose state comes from the URL (`create`/`edit` routes render the listing with a `modal` prop), as in the nabamenu project. A paginated or filtered listing carries its query (filters and `page`, read with the `use-list-query` hook) on its create/edit links, its forms and the modal's close link, and the controller redirects back with it (`Admin\Concerns\KeepsListQuery`).
- `Order::$plan_snapshot` keeps a copy of the plan's `max_guests`, `max_seats_per_guest` and `features` (`App\Enums\PlanFeature`); limits and features are always read from it, never from the live plan. Each plan has a `type` (`App\Enums\PlanType`, also copied to the snapshot; `Order::type()` reads orders from before as web invitations): `web_invitation` (the landing page's pricing, the only type with features and guest limits) or one of the services of `/servicios`, `video_invitation`, `tribute_video` ("video semblanza") and `printables`, whose plans are its options there (`price_note`, `details` one per line, `is_featured`; `PlanService::offeredServices`). Only web and video orders hold an invitation (`PlanType::hasInvitation`, `InvitationService::linkableOrders`). An invitation whose order sold a video invitation (`Invitation::offersWebInvitation` is false) answers 404 on every `/i/{slug}` route, for panel users too, and its content form only asks for what the video shows (`Invitation::VIDEO_SECTIONS`, no texts, RSVP WhatsApp or share image).
- Delivered files (`OrderFile`, `OrderFileService`, `Admin\OrderFileController`): the order page lists the files the team delivers (the tribute video's MP4, the printables' PDFs...), uploaded up to `convite.order_file_max_mb` to the private `local` disk under `orders/{id}/`, downloaded and deleted by the admin only. Deleting the order deletes them; the uploads backup does not include them. Only orders whose features include `guest_management` or `online_rsvp` let the admin give the client panel access (`ClientService::grantAccess`, which emails a Fortify reset link as a welcome).
- An invitation with an order belongs to the order's client, and its printable pages only exist if the plan includes `print_card` / `guest_passes` (`Invitation::offersPage`). Invitations without an order (the demos) serve every page their template has.
- Guests and RSVPs: a `Guest` is a family or group (the plan's `max_guests` counts guests, not seats; its optional `max_seats_per_guest` caps each guest's seats, never above `Guest::MAX_SEATS`, see `Invitation::seatLimit()`) with a token for its personalized link `/i/{slug}/{token}`. An unknown token shows the open invitation. `Rsvp` holds one answer per guest (`guest_id` unique), or open-form answers with no guest. The panel pages `admin/invitations/{slug}/guests` (CRUD plus a two-step CSV import: `GuestImportService` builds the preview, then the reviewed rows are posted) and `admin/invitations/{slug}/rsvps` (headcounts, CSV export) sit behind the `invitation.feature:<feature>` middleware. That middleware returns 404 to admins too, and demo invitations without an order have neither feature. `GuestService` enforces the guest limit inside a row lock.
- The public RSVP posts JSON to `POST /i/{slug}/rsvp` (throttle `rsvp`, `online_rsvp` plans only). Invitation pages get `rsvp` (settings) and `guest` props. `RsvpSection` and `StoryRsvp` read them through `invitations/hooks/useOnlineRsvp` and fall back to the WhatsApp flow when `rsvp.online` is false. The form closes at the end of `rsvp_deadline` (or `event_date`) in the application's time zone (`config('app.timezone')`).
- Sending (`GuestDeliveryService`, `Admin\GuestDeliveryController`, `guest_management` only): WhatsApp goes through the `whatsapp_url` (`wa.me`) of each guest, opened from the panel user's own WhatsApp, after which the panel posts `mark-sent`. Ten-digit phones get `convite.default_phone_country_code`. Email is the queued `SendGuestInvitation` job (`GuestInvitationMail`, reply-to the client), which sets `sent_at` only after the mail goes out. The bulk send only covers guests with an email and no `sent_at`.
- `/i/{slug}/pases`: when the plan has `guest_management`, the passes come from the guest list (`guests` prop, with a QR of each personal link), and only panel users who may `manageGuests` can open the page. Visitors are sent to the login. Without a guest list, `guests` is null and `GuestPasses` keeps the typed `localStorage` list.
- Check-in at the door (`check_in` feature, which requires `guest_management`; `CheckInService`): the panel's guest list makes a door link `/i/{slug}/puerta/{doorToken}` (`invitations.door_token`; making a new one revokes the old). Opening it leaves an encrypted `convite_door_{id}` cookie on the staff's phone, so a scanned pass (its QR code is the guest's personal link) renders the main app's `check-in/guest` instead of the invitation and does not count as opened. `/i/{slug}/puerta` (`invitation.door` middleware) (`check-in/door`) counts arrivals and finds guests by name. `guests.checked_in_seats` holds how many of the group arrived (a new check-in corrects it). Check-in is open from the day before `event_date` until noon of the day after, in the application's time zone, and panel users may also mark arrivals by hand then. The purge clears the door link.
- Live gallery (`live_gallery` feature, Exclusivo plan only; `LiveGalleryService`): the panel's `admin/invitations/{slug}/gallery` (`gallery/index`) makes the gallery link `/i/{slug}/fotos/{galleryToken}` (`invitations.gallery_token`; making a new one revokes the old and its printed QR codes, checked by the `invitation.gallery` middleware) and shows its QR code. Guests open it at the event (main app's `live-gallery/upload`): the browser scales each photo down to 2000 px as JPEG before posting it (throttle `gallery`), and the server re-encodes it with Intervention Image (GD), stripping its metadata, plus a 480 px thumbnail, under `invitations/{id}/live/` on the public disk. `/i/{slug}/fotos/{galleryToken}/muro` (`live-gallery/wall`) is the full-screen wall projected at the venue, polling for new photos and showing each one for `invitations.gallery_slide_seconds` (7 by default). Photos take `gallery_photos.status` `approved` right away, or `pending` when the invitation sets `gallery_moderated`; panel users (client included, `manageGallery`) approve, hide or delete them and download every photo but the hidden ones as a ZIP. Uploads are open from the start of the day `gallery_opens_days_before` days before `event_date` (the event day by default) until noon of the day `gallery_closes_days_after` days after it (the next one by default, never past the purge), set per invitation in the panel's gallery page, and capped at `convite.live_gallery_max_photos` per invitation. The purge deletes the photos, their files and the gallery link.
- Wishes book (`wishes` feature, Premium and Exclusivo; `WishService`): guests leave congratulations from the invitation (`POST /i/{slug}/deseos`, throttle `wishes`, a hidden `website` field turns bots away; from a personalized link the message is tied to the guest). Each invitation chooses in the panel's `admin/invitations/{slug}/wishes` (`wishes/index`, client included, `manageWishes`) whether it shows the book (`invitations.wishes_enabled`, off by default), whether the approved messages show on it (`wishes_public`) and whether they wait for approval (`wishes_moderated`, `wishes.status` `pending`). Invitation pages get a `wishes` prop (null unless `offersWishes`), read by `invitations/hooks/useWishes`; every template renders the shared `components/wishes/WishesSection` (classic tokens) or `UiWishesSection` (shadcn tokens) after its RSVP. It takes messages until the end of `convite.wishes_days_after_event` days after the event, capped at `convite.wishes_max_messages`; previews take none. The panel downloads every message but the hidden ones as a PDF (barryvdh/laravel-dompdf, view `pdf/wishes`, fonts in `resources/fonts/pdf`, font cache in `storage/fonts`). The purge deletes the messages.
- Video invitation (plans of type `video_invitation`, whose clients get no panel access; `InvitationVideoService`): registering the order creates its invitation (`OrderService::create` → `InvitationService::createForVideoOrder`: a draft named after the client, for the kind of event, date and time the order form asks, with the catalog template of that kind that covers the most of `Invitation::VIDEO_SECTIONS`) and the panel opens its content next. `videos/invitation/render.py` (Python with pycairo and Pillow, plus ffmpeg; `drawing.py`, `scenes.py`, `music.py`, themes in `videos/invitation/themes/*.json`) draws a 1080x1920 MP4 from the JSON `InvitationVideoService::data()` builds out of the content (names, date, family groups, venues, photos, song, custom primary color; never a gender reveal's answer). Scenes without data are skipped, so the length varies (about 40 s). The admin-only page `admin/invitations/{slug}/video` (`invitations/video`, ability `renderVideo`) picks the theme and queues `RenderInvitationVideo` on the `videos` queue connection (its own `retry_after`, above `convite.video.timeout`; its worker runs apart: `php artisan queue:work videos --queue=videos`), then previews and downloads the result (and the JSON it was drawn from, `admin.invitations.video.data`), kept at `invitations/{id}/video.mp4` on the public disk (saving the content keeps it; the uploads purge deletes it). `invitations:render-video {slug}` renders without the queue.
- The panel's home (`/admin`, `Admin\DashboardController`, `DashboardService`) renders `dashboard/admin` for admins (sales and payments of the last six months, balance due of active and delivered orders, client events in the next 60 days, commissions owed to each partner; quotes are not sales and demos are left out) and `dashboard/client` for client users (per invitation: days to the event, guests sent and opened, RSVP headcounts, plus the latest answers and answers per day). Charts are plain elements (`app/components/bar-chart.tsx`), no chart library.
- Referrals and order sources (`ReferralService`): every client gets a `clients.referral_code` on creation (`Client::generateReferralCode`). The landing page with `?ref=CODE` gets a `referral` prop (code and `convite.referral_discount_percent`, never the client's name), remembers the code in the `convite_ref` cookie for `convite.referral_cookie_days`, and its WhatsApp links (`pages/landing/use-whatsapp-link`) append the code. The admin records on the order how the client found Convite (`orders.source`, `App\Enums\OrderSource`) and, for a referral, the code, stored as `orders.referrer_client_id`; the discount is applied by hand on the price. `convite.referrals_enabled` (`CONVITE_REFERRALS_ENABLED`) turns the program off: no discount, cookie or code on the landing page and the invitations, no referral section or option in the panel (an order that already is a referral keeps it), while sources, codes and past referrers stay. Every template's footer (its own, or the shared `components/footer/Footer`) must say "Hecho con cariño en" next to the Convite logo, linked to `conviteUrl` (UTM parameters plus the client's code, `invitations/hooks/useConviteUrl`); `InvitationPageTest` checks every template folder. The landing sends a GA `generate_lead` event on every WhatsApp click, and the admin dashboard shows the sales by source.
- Partners ("Aliados": wedding planners, influencers, venues...; `Partner`, `PartnerService`, `Admin\PartnerController`, `Admin\PartnerCommissionController`, pages `partners/index` and `partners/show`) bring clients for a commission. Each one has a `code`, a `commission_percent` and a `discount_percent` for their clients. Their short link `/a/{code}` (`PartnerLinkController`, also downloadable as a QR code) redirects to the landing page with `?aliado=CODE` plus UTM parameters (`utm_source` the code, `utm_medium=aliado`, `utm_campaign` the kind). The landing and `/servicios` get a `partner` prop (code and discount, never the name), remember the code in the `convite_partner` cookie for `convite.partner_cookie_days`, append it to their WhatsApp links and send it as `partner_code` on the GA `generate_lead` event. Only the latest link counts: a partner's link expires the client referral cookie and vice versa, and while a partner applies the page gets no `referral`. The admin assigns the partner on the order (source `partner`, `orders.partner_id`, optional for vendors outside the program; only active partners, unless the order already had one), which copies the partner's percent to `orders.commission_percent`. The commission (`Order::commissionStatus()`, `App\Enums\CommissionStatus`) is owed once the order is paid in full and is marked as paid by hand (`orders.commission_paid_at`); after that the order keeps its partner. Partners with orders cannot be deleted, only deactivated (their link then lands on the plain page).
- `rsvps:digest` (daily at 08:00, `RsvpDigestService`) emails client users the answers their invitations got the day before, as the queued `RsvpDigest` notification with the running totals. It goes to verified client users with `users.receives_rsvp_digest`, which they turn off in their profile (`profile.notifications.update`).
- Backups (`BackupService`, `config/backup.php`): `backup:database` (daily at 01:00) stores a gzipped `pg_dump` (`database-<date>.sql.gz`) and `backup:uploads` (01:30) a gzipped tarball of the public disk's uploads (`uploads-<date>.tar.gz`: photos, music, live gallery) in the `backup.folder` of the `local` disk and, when `GOOGLE_DRIVE_REFRESH_TOKEN` is set, of the `google` disk (Google Drive folder `GOOGLE_DRIVE_FOLDER`, driver registered in `AppServiceProvider`). Each run deletes the ones of its kind older than `BACKUP_KEEP_DAYS` (7). A failed run's output is emailed to `BACKUP_NOTIFICATION_EMAIL`.
- `guests:purge` (daily, see `routes/console.php`) purges guest data of invitations whose `event_date` is more than `config('convite.guest_retention_days')` days old.
- `invitations:purge-uploads` (daily at 03:00, after the uploads backup; `UploadPurgeService`) deletes the media folder (`invitations/{id}/` on the public disk: photos, music, live gallery and its rows) of `archived` invitations whose `event_date` was `config('convite.uploads_retention_days')` (7) days ago or more, and records it in `invitations.uploads_purged_at`. The content keeps the paths.

### Frontend (Inertia + React)

- The invitations app's frontend lives under `resources/js/invitations/`, and the main app's (the panel, the landing page and the door) under `resources/js/app/`. Neither imports from the other.
- Entry: `resources/js/invitations/app.tsx`. Inertia component names are paths relative to `resources/js/invitations` without the extension, resolved with `import.meta.glob` over `./pages/**/*Page.tsx` (only the 404 and 410 pages) and `./templates/*/*Page.tsx`. `config/inertia.php` points `pages.paths` at `resources/js/invitations` so `assertInertia` can check that these files exist.
- To add an invitation, create it in the panel as a draft, capture its content (`admin/invitations/{slug}/content`) and publish it. To add a template, create `resources/js/invitations/templates/<template>/InvitationPage.tsx` (optionally `PrintCardPage.tsx` / `GuestPassesPage.tsx`) plus its `template.json`. Every template ships both printable pages: the weddings fill the shared `components/print-card` layouts themselves, and the other kinds render `components/print-card/EventPrintPages` (wording per kind; a gender reveal never prints the answer). A template's `print.css` restyles them, naming its fonts literally (Tailwind only emits the `--font-*` theme variables some class uses). The manifest's `fonts` lists the Google Fonts families its pages use (css2 `family` syntax, e.g. `Cinzel:wght@300;400;500`) and `print_fonts` the ones only its printable pages add: the `invitations` root view loads just those (`InvitationFontService`, through a view composer), plus Jost for the shared banners. Pages that are not a template's (404/410) share `components/error/ErrorScreen`, built on shadcn's tokens in Convite's palette, and get its fonts (Geist, Cormorant Garamond). Template pages read the `invitation` prop (`InvitationContentResource`, typed in `invitations/types/invitation.ts`), build the date labels with `invitations/lib/eventContent.ts` and hide sections without data.
- Navigation uses `Link` from `@inertiajs/react`. There is no client-side router. Pages still set `document.title` themselves on mount.
- Styling: Tailwind v4 via `@tailwindcss/vite` (`resources/js/invitations/index.css`) plus plain per-theme CSS files. Every template's `theme.css` sets its colors on its `.theme-<template>` wrapper with shadcn/ui's token names (`--background`, `--foreground`, `--card`, `--primary`, `--primary-foreground`, `--muted`, `--muted-foreground`, `--accent`, `--border`...), plus the ones the classic shared components (`components/*` outside `ui`, `gender-reveal` and `baby-shower`) also read: the primary's shades `--primary-light`, `--primary-pale` and `--primary-deep`, `--surface` (the section tone between card and muted), `--foreground-soft` (body text) and `--dark-from` / `--dark-to` (the dark bands). The defaults are in `styles/variables.css`. Components read them with Tailwind's variable syntax (`text-(--primary)`, `border-(--primary)/30`), so a scope that redeclares a token (`.ui-dark`, `[data-tone='dark']`) applies to its utilities too.
- Custom colors: the admin may replace a template's primary color in the content form's "Colores" tab (`content.colors.primary`, a hex color; empty keeps the design's). The manifest's `colors` gives the design's own `primary` and `background` (for the panel's swatch and its contrast warning) and the `suggestions` offered in its place. `InvitationContentResource` sends `colors` (the primary and the text color that reads on it) or null, and `invitations/lib/customColors.ts` puts them on `<html>` (`data-custom-colors`, `--brand`, `--brand-foreground`), from which `styles/custom-colors.css` derives the primary, its shades and the dark sections' lighter version for every template and its printables. A template whose design needs another rule adds `:root[data-custom-colors] .theme-<template> { ... }` to its theme.css (e.g. a `--primary-deep` that is a color of its own, not a shade of the primary). Art drawn in fixed colors keeps them.
- Media: the admin uploads photos and music (`InvitationMediaController`) to the public disk under `invitations/{id}/`; content stores the path, and saving the content deletes the uploads it no longer uses. Paths starting with `/` are static files in `public/invitations/<template>/`, used by the seeded demos. Bundled images (e.g. each template's default hero background) live next to the template or under `resources/js/invitations/assets/`.
- `VITE_CONTACT_WHATSAPP` and `VITE_GA_ID` come from `.env` and are read by `resources/js/invitations/config/`.
- TypeScript project references: `tsconfig.app.json` covers `resources/js`, `tsconfig.node.json` covers `vite.config.ts`.
- Main app frontend (the panel, the landing page and the door): everything lives under `resources/js/app/`, laid out as in the starter kit. Its entry is `app/app.tsx` and its stylesheet is `app/app.css`: the shadcn/ui theme, whose `primary` is Convite's plum, plus the brand tokens (gold, ivory, ink, the petal accents and the serif fonts) that only `pages/landing` uses. The door (`pages/check-in`) and the live gallery (`pages/live-gallery`) are built on the shadcn/ui components and tokens like the panel, framed by `components/event-page` (the upload page and the door) or, on the projected wall, a radial gradient of the primary color with `primary-foreground` text (a nested `dark` class does not switch the tokens). Those pages use the panel's font (Geist, loaded with `@fonts` like Cormorant Garamond and Great Vibes, the landing's subtitles and script titles) and `layouts/public-layout` instead of the panel's layouts, which keeps them in light mode (`forceLightAppearance`) and restores the user's appearance on leaving. Google Analytics (`VITE_GA_ID`) only measures the landing page: `hooks/use-google-analytics` loads gtag.js on demand and sends a page view on each Inertia navigation to a tracked page, with Consent Mode and the landing's cookie banner. Each app's CSS only scans its own folder and its Blade root view, so neither app's tokens (e.g. `--primary`) leak into the other. Its page components are named by their path under `app/pages` (e.g. `auth/login`, `settings/profile`). The `@/` alias points to `resources/js/app`, and only the main app's code uses it.
- Wayfinder's Vite plugin generates typed route helpers into `resources/js/app/{actions,routes,wayfinder}`. These folders are gitignored; run `php artisan wayfinder:generate --path=resources/js/app --with-form` if they are missing outside of Vite. ESLint skips them, along with the vendored `app/components/ui`.

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
