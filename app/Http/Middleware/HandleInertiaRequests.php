<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * The public site and the admin panel are separate Inertia apps, each
     * with its own root view, entry script and stylesheet.
     */
    public function rootView(Request $request): string
    {
        return $this->isAdminRequest($request) ? 'admin' : 'app';
    }

    /**
     * Determines the current asset version.
     *
     * Each app gets its own version so that an Inertia visit crossing from
     * one app to the other (e.g. a link from the panel to the landing page)
     * is treated as a version mismatch and reloads the full page, instead of
     * asking the current app to render a page it does not bundle.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        $version = parent::version($request);

        return $this->isAdminRequest($request) ? "admin-{$version}" : $version;
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
        if (! $this->isAdminRequest($request)) {
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

    private function isAdminRequest(Request $request): bool
    {
        return $request->is('admin', 'admin/*');
    }
}
