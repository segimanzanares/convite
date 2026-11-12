<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The public site's pages (resources/js/site): the invitations, and the 404 and 410 pages.
     */
    public const string SITE_PAGES = 'site';

    /**
     * The admin panel's pages, under /admin.
     */
    public const string PANEL_PAGES = 'admin';

    /**
     * The admin app's pages outside the panel: the landing page and the door of the event, with the public meta tags
     * (see resources/views/admin.blade.php) and always in light mode.
     */
    public const string PUBLIC_PAGES = 'public';

    /**
     * Routes of the admin app's pages outside the panel. The guest's personalized link may also serve one, on the phone
     * of the staff at the door (see InvitationController::guest and servePages()).
     *
     * @var list<string>
     */
    private const array PUBLIC_ROUTES = ['landing', 'invitations.door.*', 'invitations.check-in.*'];

    /**
     * Request attribute that overrides the pages picked from the URL.
     */
    private const string PAGES_ATTRIBUTE = 'inertia.pages';

    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Serve the request's page from the given pages instead of the ones its URL gets, for a response whose page does
     * not depend on the URL alone (e.g. a guest's link scanned at the door, or an error page).
     */
    public static function servePages(Request $request, string $pages): void
    {
        $request->attributes->set(self::PAGES_ATTRIBUTE, $pages);

        Inertia::setRootView(self::rootViewOf($pages));
    }

    /**
     * The public site and the admin app are separate Inertia apps, each with its own root view, entry script and
     * stylesheet.
     */
    public function rootView(Request $request): string
    {
        return self::rootViewOf($this->pages($request));
    }

    /**
     * Determines the current asset version.
     *
     * The site and the admin app each get their own version, so that an Inertia visit crossing from one to the other
     * (e.g. from the landing page to a demo invitation) is treated as a version mismatch and reloads the full page,
     * instead of asking the current app to render a page it does not bundle. The panel and the admin app's pages outside
     * it share theirs: navigating between them is a visit within the same SPA.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        $version = parent::version($request);

        return $this->pages($request) === self::SITE_PAGES ? $version : "admin-{$version}";
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        // The whole admin app gets the panel's props, since navigating from its pages outside the panel into it is a
        // visit within the same SPA
        if ($this->pages($request) === self::SITE_PAGES) {
            return parent::share($request);
        }

        return [
            ...parent::share($request),
            'name' => config('app.name'),
            'auth' => [
                'user' => $request->user(),
            ],
            'sidebarOpen' => ! $request->hasCookie('sidebar_state') || $request->cookie('sidebar_state') === 'true',
        ];
    }

    private function pages(Request $request): string
    {
        return $request->attributes->get(self::PAGES_ATTRIBUTE) ?? match (true) {
            $request->is('admin', 'admin/*') => self::PANEL_PAGES,
            $request->routeIs(self::PUBLIC_ROUTES) => self::PUBLIC_PAGES,
            default => self::SITE_PAGES,
        };
    }

    private static function rootViewOf(string $pages): string
    {
        return $pages === self::SITE_PAGES ? 'app' : 'admin';
    }
}
