<?php

namespace App\Console\Commands;

use App\Services\RsvpDigestService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

/**
 * Emails clients who answered their invitations the day before. Scheduled every morning in routes/console.php.
 */
#[Signature('rsvps:digest')]
#[Description('Envía a los clientes el resumen de las confirmaciones que recibieron ayer')]
class SendRsvpDigests extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(RsvpDigestService $digests): int
    {
        $sent = $digests->send(today()->subDay()->toImmutable());

        $this->components->info("Resúmenes enviados: {$sent}");

        return self::SUCCESS;
    }
}
