<?php

namespace App\Http\Controllers;

use App\Http\Requests\Rsvp\StoreRsvpRequest;
use App\Http\Resources\RsvpResource;
use App\Models\Invitation;
use App\Services\RsvpService;
use Illuminate\Http\JsonResponse;

/**
 * Answers sent from the public invitation page, as JSON for its useHttp form.
 */
class RsvpController extends Controller
{
    public function __construct(private readonly RsvpService $rsvps) {}

    public function store(StoreRsvpRequest $request, Invitation $invitation): JsonResponse
    {
        $rsvp = $this->rsvps->submit($invitation, $request->guest(), $request->answer());

        return RsvpResource::make($rsvp)->response()->setStatusCode($rsvp->wasRecentlyCreated ? 201 : 200);
    }
}
