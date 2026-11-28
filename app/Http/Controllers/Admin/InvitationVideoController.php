<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Video\RenderVideoRequest;
use App\Http\Resources\InvitationResource;
use App\Models\Invitation;
use App\Services\InvitationVideoService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * The video invitation in the panel: its theme, its render, its download and the data it is drawn from. Only the admin uses it; the clients
 * of the video plan have no panel access and get the video from the admin.
 */
class InvitationVideoController extends Controller
{
    public function __construct(private readonly InvitationVideoService $videos) {}

    /**
     * Display the video's status, its preview and the themes it may be rendered with.
     */
    public function index(Invitation $invitation): Response
    {
        Gate::authorize('renderVideo', $invitation);
        $this->ensureVideoInvitation($invitation);

        $exists = $this->videos->exists($invitation);

        return Inertia::render('invitations/video', [
            'invitation' => InvitationResource::make($invitation->loadMissing('order')),
            'themes' => collect($this->videos->themes())->map(fn (string $label, string $name) => ['name' => $name, 'label' => $label])->values(),
            'video' => [
                'theme' => $invitation->video_template,
                'status' => $invitation->video_status,
                'rendered_at' => $invitation->video_rendered_at,
                // The rendered_at query busts the browser's cache after a new render
                'url' => $exists ? Storage::disk('public')->url($invitation->videoPath()).'?v='.$invitation->video_rendered_at?->timestamp : null,
            ],
        ]);
    }

    /**
     * Queue a new render with the chosen theme.
     */
    public function store(RenderVideoRequest $request, Invitation $invitation): RedirectResponse
    {
        $this->ensureVideoInvitation($invitation);

        $queued = $this->videos->queue($invitation, $request->validated('theme'));

        Inertia::flash('toast', $queued
            ? ['type' => 'success', 'message' => __('The video is being rendered. It takes a few minutes.')]
            : ['type' => 'error', 'message' => __('The video is already being rendered.')]);

        return to_route('admin.invitations.video.index', $invitation);
    }

    public function download(Invitation $invitation): StreamedResponse
    {
        Gate::authorize('renderVideo', $invitation);
        $this->ensureVideoInvitation($invitation);

        abort_unless($this->videos->exists($invitation), 404);

        return Storage::disk('public')->download($invitation->videoPath(), "invitacion-{$invitation->slug}.mp4");
    }

    /**
     * The JSON the renderer draws, to render the video by hand with videos/invitation/render.py. Its photos and song
     * are absolute paths of this server.
     */
    public function data(Invitation $invitation): JsonResponse
    {
        Gate::authorize('renderVideo', $invitation);
        $this->ensureVideoInvitation($invitation);

        return response()
            ->json($this->videos->data($invitation), options: JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES)
            ->header('Content-Disposition', "attachment; filename=\"invitacion-{$invitation->slug}.json\"");
    }

    /**
     * The page only exists for invitations whose order sold the video, for admins too.
     */
    private function ensureVideoInvitation(Invitation $invitation): void
    {
        abort_unless($invitation->isVideoInvitation(), 404);
    }
}
