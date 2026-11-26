<?php

namespace App\Services;

use Carbon\CarbonImmutable;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;
use RuntimeException;
use Throwable;

/**
 * Backs up the database and the uploads as separate files on every disk of config/backup.php.
 */
class BackupService
{
    public const string DATABASE = 'database';

    public const string UPLOADS = 'uploads';

    /**
     * Seconds pg_dump or tar may take.
     */
    private const int TIMEOUT = 3600;

    /**
     * Dumps the database with pg_dump as gzipped plain SQL.
     *
     * @return string The backup's file name
     */
    public function backupDatabase(): string
    {
        $connection = DB::connection()->getConfig();

        if (($connection['driver'] ?? null) !== 'pgsql') {
            throw new RuntimeException('Solo se respaldan bases de datos PostgreSQL.');
        }

        return $this->store(self::DATABASE, 'sql.gz', function (string $path) use ($connection): void {
            Process::timeout(self::TIMEOUT)
                ->env(array_filter([
                    'PGPASSWORD' => (string) ($connection['password'] ?? ''),
                    'PGSSLMODE' => $connection['sslmode'] ?? null,
                ]))
                ->run([
                    'pg_dump',
                    '--host='.$connection['host'],
                    '--port='.$connection['port'],
                    '--username='.$connection['username'],
                    '--dbname='.$connection['database'],
                    '--no-owner',
                    '--no-privileges',
                    '--compress=9',
                    '--file='.$path,
                ])
                ->throw();
        });
    }

    /**
     * Packs the public disk's uploads into a gzipped tarball.
     *
     * @return string The backup's file name
     */
    public function backupUploads(): string
    {
        return $this->store(self::UPLOADS, 'tar.gz', function (string $path): void {
            Process::timeout(self::TIMEOUT)
                ->run([
                    'tar',
                    '--create',
                    '--gzip',
                    '--file='.$path,
                    '--directory='.config('backup.uploads_path'),
                    '--exclude=./.gitignore',
                    '.',
                ])
                ->throw();
        });
    }

    /**
     * Builds the backup in a temporary file, copies it to every disk and prunes the old ones of its kind.
     * A disk that fails does not stop the others; the failures are thrown together at the end.
     *
     * @param  callable(string): void  $build
     */
    private function store(string $kind, string $extension, callable $build): string
    {
        $name = $kind.'-'.now()->format('Y-m-d-His').'.'.$extension;
        $temporaryDirectory = storage_path('app/backup-temp');
        $temporaryPath = $temporaryDirectory.'/'.$name;

        File::ensureDirectoryExists($temporaryDirectory);

        try {
            $build($temporaryPath);

            $failures = [];

            foreach (config('backup.disks') as $disk) {
                try {
                    $this->copyToDisk($temporaryPath, $disk, $name);
                    $this->prune($disk, $kind);
                } catch (Throwable $exception) {
                    report($exception);
                    $failures[] = "{$disk}: {$exception->getMessage()}";
                }
            }
        } finally {
            File::delete($temporaryPath);
        }

        if ($failures !== []) {
            throw new RuntimeException("No se pudo guardar el respaldo {$name} en ".implode('; ', $failures));
        }

        return $name;
    }

    private function copyToDisk(string $temporaryPath, string $disk, string $name): void
    {
        $stream = fopen($temporaryPath, 'r');

        try {
            $written = Storage::disk($disk)->writeStream(config('backup.folder').'/'.$name, $stream);
        } finally {
            if (is_resource($stream)) {
                fclose($stream);
            }
        }

        if ($written === false) {
            throw new RuntimeException('No se pudo escribir el archivo.');
        }
    }

    /**
     * Deletes the backups of a kind older than config backup.keep_days. It only runs after a new one
     * was stored, so a disk is never left without one.
     */
    private function prune(string $disk, string $kind): void
    {
        $storage = Storage::disk($disk);
        $cutoff = now()->subDays(config('backup.keep_days'));

        collect($storage->files(config('backup.folder')))
            ->mapWithKeys(function (string $path) use ($kind): array {
                if (! preg_match('/^'.$kind.'-(\d{4}-\d{2}-\d{2}-\d{6})\./', basename($path), $matches)) {
                    return [];
                }

                return [$path => CarbonImmutable::createFromFormat('Y-m-d-His', $matches[1])];
            })
            ->filter(fn (CarbonImmutable $createdAt): bool => $createdAt->lt($cutoff))
            ->keys()
            ->each(fn (string $path): bool => $storage->delete($path));
    }
}
