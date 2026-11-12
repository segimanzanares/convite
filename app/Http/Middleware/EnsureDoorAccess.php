<?php

namespace App\Http\Middleware;

use App\Models\Invitation;
use App\Services\CheckInService;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Lets through only the phones that opened the invitation's current door link, while check-in is open. Anyone else
 * gets a 404, as if the door pages did not exist.
 *
 * Usage: ->middleware('invitation.door')
 */
class EnsureDoorAccess
{
    public function __construct(private readonly CheckInService $checkIn) {}

    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $invitation = $request->route('invitation');

        abort_unless($invitation instanceof Invitation && $this->checkIn->hasDoorAccess($request, $invitation), 404);

        return $next($request);
    }
}
