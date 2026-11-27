<?php

namespace App\Console\Commands;

use App\Models\Invitation;
use App\Services\InvitationVideoService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

/**
 * Renders an invitation's video right away, without the queue (the panel queues it instead). Demos, which have no
 * order, may be rendered too.
 */
#[Signature('invitations:render-video {invitation : El slug de la invitación} {--theme= : El tema del video (por omisión, el último que usó o clasico)}')]
#[Description('Genera el video de una invitación sin pasar por la cola')]
class RenderInvitationVideo extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(InvitationVideoService $videos): int
    {
        $invitation = Invitation::query()->where('slug', $this->argument('invitation'))->first();

        if ($invitation === null) {
            $this->components->error('No existe una invitación con ese slug.');

            return self::FAILURE;
        }

        if ($invitation->order_id !== null && ! $invitation->isVideoInvitation()) {
            $this->components->error('La contratación de esta invitación no es una invitación en video.');

            return self::FAILURE;
        }

        $theme = $this->option('theme') ?? $invitation->video_template ?? 'clasico';

        if (! array_key_exists($theme, $videos->themes())) {
            $this->components->error('Ese tema no existe. Temas: '.implode(', ', array_keys($videos->themes())).'.');

            return self::FAILURE;
        }

        $invitation->update(['video_template' => $theme]);
        $this->components->task('Generando el video', fn () => $videos->render($invitation));
        $this->components->info('Listo: storage/app/public/'.$invitation->videoPath());

        return self::SUCCESS;
    }
}
