<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Invitation\StoreInvitationMediaRequest;
use App\Models\Invitation;
use App\Services\InvitationContentService;
use Illuminate\Http\JsonResponse;

/**
 * Photos and music uploaded while the admin captures the content. The file is stored right away and its path goes
 * into the content form; files the saved content no longer uses are deleted (see InvitationContentService).
 */
class InvitationMediaController extends Controller
{
    public function __construct(private readonly InvitationContentService $content) {}

    public function store(StoreInvitationMediaRequest $request, Invitation $invitation): JsonResponse
    {
        $path = $this->content->storeMedia($invitation, $request->file('file'));

        return response()->json(['path' => $path, 'url' => Invitation::mediaUrl($path)], 201);
    }
}
