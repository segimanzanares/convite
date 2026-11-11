<?php

use App\Http\Middleware\EnsureInvitationHasFeature;
use App\Http\Middleware\EnsureInvitationIsVisible;
use App\Http\Middleware\HandleAppearance;
use App\Http\Middleware\HandleInertiaRequests;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->encryptCookies(except: ['appearance', 'sidebar_state']);

        $middleware->alias([
            'invitation.feature' => EnsureInvitationHasFeature::class,
            'invitation.visible' => EnsureInvitationIsVisible::class,
        ]);

        $middleware->web(append: [
            HandleAppearance::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn (Request $request) => $request->is('api/*') || $request->expectsJson(),
        );

        // Unknown pages and invitations render the public site's React 404
        // page, and archived invitations its 410 page, keeping the status,
        // instead of Laravel's default error view. The admin panel keeps the
        // default one, since its Inertia app does not bundle the public
        // site's pages.
        $exceptions->respond(function (Response $response, Throwable $e, Request $request) {
            $status = $response->getStatusCode();

            if (! in_array($status, [404, 410], true) || $request->expectsJson() || $request->is('admin', 'admin/*')) {
                return $response;
            }

            [$component, $title] = $status === 410
                ? ['pages/unavailable/UnavailablePage', 'Invitación no disponible']
                : ['pages/not-found/NotFoundPage', 'Página no encontrada'];

            return Inertia::render($component, [
                'meta' => [
                    'title' => $title,
                    'robots' => 'noindex, nofollow',
                ],
            ])->toResponse($request)->setStatusCode($status);
        });
    })->create();
