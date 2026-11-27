<?php

namespace App\Jobs;

use App\Enums\VideoStatus;
use App\Models\Invitation;
use App\Services\InvitationVideoService;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Throwable;

/**
 * Render an invitation's video. It runs on the "videos" queue connection, whose retry_after is longer than the
 * render's timeout, and is not retried: the admin queues another render from the panel.
 */
class RenderInvitationVideo implements ShouldQueue
{
    use Queueable;

    public bool $deleteWhenMissingModels = true;

    public int $tries = 1;

    public int $timeout;

    public function __construct(public Invitation $invitation)
    {
        $this->timeout = config('convite.video.timeout') + 60;
    }

    /**
     * Execute the job.
     */
    public function handle(InvitationVideoService $videos): void
    {
        $videos->render($this->invitation);
    }

    /**
     * A worker killed by the timeout never reaches the service's own error handling.
     */
    public function failed(?Throwable $exception): void
    {
        $this->invitation->update(['video_status' => VideoStatus::Failed]);
    }
}
