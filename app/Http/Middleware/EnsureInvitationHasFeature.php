<?php

namespace App\Http\Middleware;

use App\Enums\PlanFeature;
use App\Models\Invitation;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Responds 404 unless the route's invitation was sold with a plan that includes the given feature. Unlike the
 * policies, it applies to admins too: a feature the client did not buy does not exist for the invitation.
 *
 * Usage: ->middleware('invitation.feature:guest_management')
 */
class EnsureInvitationHasFeature
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string $feature): Response
    {
        $invitation = $request->route('invitation');

        abort_unless($invitation instanceof Invitation && $invitation->hasFeature(PlanFeature::from($feature)), 404);

        return $next($request);
    }
}
