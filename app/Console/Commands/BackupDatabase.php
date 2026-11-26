<?php

namespace App\Console\Commands;

use App\Services\BackupService;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Throwable;

/**
 * A gzipped pg_dump, stored on every disk of config/backup.php.
 * Scheduled daily in routes/console.php.
 */
#[Signature('backup:database')]
#[Description('Respalda la base de datos en un archivo .sql.gz')]
class BackupDatabase extends Command
{
    /**
     * Execute the console command.
     */
    public function handle(BackupService $backups): int
    {
        try {
            $name = $backups->backupDatabase();
        } catch (Throwable $exception) {
            report($exception);
            $this->components->error($exception->getMessage());

            return self::FAILURE;
        }

        $this->components->info("Respaldo guardado: {$name}");

        return self::SUCCESS;
    }
}
