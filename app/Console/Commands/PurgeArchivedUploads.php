<?php

namespace App\Console\Commands;

use App\Services\UploadPurgeService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

/**
 * Frees the disk space of archived invitations once their event is past (config convite.uploads_retention_days).
 * Scheduled daily in routes/console.php.
 */
#[Signature('invitations:purge-uploads')]
#[Description('Elimina las fotos y la música de las invitaciones archivadas cuyo evento pasó hace más del periodo de retención')]
class PurgeArchivedUploads extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(UploadPurgeService $purger): int
    {
        $purged = $purger->purgeDue();

        $this->components->info("Invitaciones depuradas: {$purged}");

        return self::SUCCESS;
    }
}
