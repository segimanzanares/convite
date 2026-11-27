<?php

namespace App\Enums;

/**
 * Where the video of an invitation stands. Rendering runs in the queue (RenderInvitationVideo); a new render replaces
 * the previous video only once it succeeds.
 */
enum VideoStatus: string
{
    case Queued = 'queued';
    case Rendering = 'rendering';
    case Ready = 'ready';
    case Failed = 'failed';

    /**
     * Whether a render is waiting or running, so another one is not queued.
     */
    public function isBusy(): bool
    {
        return $this === self::Queued || $this === self::Rendering;
    }
}
