<?php

namespace App\Http\Middleware;

use App\Models\Invitation;
use App\Services\LiveGalleryService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Lets through only the links that carry the invitation's current gallery token (the one in its gallery QR code).
 * Anyone else gets a 404, as if the gallery did not exist.
 *
 * Usage: ->middleware('invitation.gallery')
 */
class EnsureGalleryAccess
{
    public function __construct(private readonly LiveGalleryService $gallery) {}

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $invitation = $request->route('invitation');
        $token = $request->route('galleryToken');

        abort_unless(
            $invitation instanceof Invitation && is_string($token) && $this->gallery->isGalleryToken($invitation, $token),
            404,
        );

        return $next($request);
    }
}
