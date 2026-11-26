<?php

namespace App\Console\Commands;

use App\Services\BackupService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Throwable;

/**
 * A gzipped tarball of the public disk's uploads (photos, music, live gallery), stored on every disk of config/backup.php.
 * Scheduled daily in routes/console.php.
 */
#[Signature('backup:uploads')]
#[Description('Respalda los archivos subidos (fotos, música) en un archivo .tar.gz')]
class BackupUploads extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(BackupService $backups): int
    {
        try {
            $name = $backups->backupUploads();
        } catch (Throwable $exception) {
            report($exception);
            $this->components->error($exception->getMessage());

            return self::FAILURE;
        }

        $this->components->info("Respaldo guardado: {$name}");

        return self::SUCCESS;
    }
}
