<?php

namespace App\Providers;

use App\Models\User;
use App\Services\InvitationFontService;
use Carbon\CarbonImmutable;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\View;
use Illuminate\Support\ServiceProvider;
use Illuminate\Validation\Rules\Password;
use Illuminate\View\View as RenderedView;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->configureDefaults();
        $this->configureAuthorization();
        $this->configureRateLimiting();
        $this->configureInvitationFonts();
    }

    /**
     * The invitations app's root view loads only the fonts of the page's template (see template.json).
     */
    protected function configureInvitationFonts(): void
    {
        View::composer('invitations', function (RenderedView $view): void {
            $component = $view->getData()['page']['component'] ?? '';

            $view->with('fontsUrl', app(InvitationFontService::class)->stylesheetUrl($component));
        });
    }

    /**
     * Answers from the public invitation pages need no account, so they are limited per visitor.
     */
    protected function configureRateLimiting(): void
    {
        RateLimiter::for('rsvp', fn (Request $request): Limit => Limit::perMinute(10)->by($request->ip()));
    }

    /**
     * Admins may do everything. Policies only describe what client users may do.
     */
    protected function configureAuthorization(): void
    {
        Gate::before(fn (User $user): ?bool => $user->isAdmin() ? true : null);
    }

    /**
     * Configure default behaviors for production-ready applications.
     */
    protected function configureDefaults(): void
    {
        Date::use(CarbonImmutable::class);

        JsonResource::withoutWrapping();

        DB::prohibitDestructiveCommands(
            app()->isProduction(),
        );

        Password::defaults(fn (): ?Password => app()->isProduction()
            ? Password::min(12)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
                ->uncompromised()
            : null,
        );
    }
}
