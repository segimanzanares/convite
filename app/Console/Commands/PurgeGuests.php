<?php

namespace App\Console\Commands;

use App\Services\GuestPurgeService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

/**
 * Guest data is personal data, so it is only kept for a while after the event (config convite.guest_retention_days).
 * Scheduled daily in routes/console.php.
 */
#[Signature('guests:purge')]
#[Description('Elimina los invitados y confirmaciones de los eventos que terminaron hace más del periodo de retención')]
class PurgeGuests extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(GuestPurgeService $purger): int
    {
        $purged = $purger->purgeDue();

        $this->components->info("Invitaciones depuradas: {$purged}");

        return self::SUCCESS;
    }
}
