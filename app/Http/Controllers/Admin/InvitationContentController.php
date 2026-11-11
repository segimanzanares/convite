<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Invitation\UpdateInvitationContentRequest;
use App\Http\Resources\InvitationResource;
use App\Models\Invitation;
use App\Services\InvitationContentService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;

/**
 * The content of an invitation (names, venues, program, photos, music...), which only the admin captures.
 */
class InvitationContentController extends Controller
{
    public function __construct(private readonly InvitationContentService $content) {}

    public function edit(Invitation $invitation): Response
    {
        Gate::authorize('update', $invitation);

        $kind = $invitation->kind();
        abort_if($kind === null, 404);

        return Inertia::render('invitations/content', [
            'invitation' => InvitationResource::make($invitation->loadMissing('order')),
            'kind' => $kind,
            'sections' => Invitation::templates()[$invitation->template]['sections'],
            'content' => (object) ($invitation->content ?? []),
            // Uploaded paths are relative to the public disk; the form builds their preview URL from this prefix
            'mediaUrlPrefix' => rtrim(Storage::disk('public')->url(''), '/').'/',
        ]);
    }

    public function update(UpdateInvitationContentRequest $request, Invitation $invitation): RedirectResponse
    {
        $validated = $request->validated();

        $this->content->update($invitation, $validated['content'] ?? [], $validated['og_image'] ?? null);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Content saved.')]);

        return to_route('admin.invitations.content.edit', $invitation);
    }
}
