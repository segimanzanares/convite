<?php

namespace App\Http\Middleware;

use App\Enums\InvitationStatus;
use App\Models\Invitation;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Hides the route's invitation from the public until it is published. A draft responds 404 and an archived
 * invitation 410 (its guests had the link, so they get a page saying it is no longer available). Panel users who may
 * view the invitation still open it, as a preview.
 *
 * Usage: ->middleware('invitation.visible')
 */
class EnsureInvitationIsVisible
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $invitation = $request->route('invitation');

        abort_unless($invitation instanceof Invitation, 404);

        if ($invitation->isPublished() || $request->user()?->can('view', $invitation)) {
            return $next($request);
        }

        abort($invitation->status === InvitationStatus::Archived ? 410 : 404);
    }
}
