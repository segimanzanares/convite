<?php

namespace App\Http\Controllers;

use App\Http\Requests\Wish\StoreWishRequest;
use App\Models\Invitation;
use App\Services\WishService;
use Illuminate\Http\JsonResponse;

/**
 * Messages left in the wishes book from the public invitation page, as JSON for its useHttp form.
 */
class WishController extends Controller
{
    public function __construct(private readonly WishService $wishes) {}

    public function store(StoreWishRequest $request, Invitation $invitation): JsonResponse
    {
        abort_unless($invitation->offersWishes(), 404);

        $wish = $this->wishes->submit($invitation, $request->guest(), $request->authorName(), $request->message());

        return response()->json([
            ...$this->wishes->publicWish($wish),
            'status' => $wish->status,
        ], 201);
    }
}
