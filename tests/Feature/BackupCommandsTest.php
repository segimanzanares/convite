<?php

use Illuminate\Process\PendingProcess;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;

/**
 * Fakes pg_dump and tar by writing the given contents to the file each one is asked to create.
 */
function fakeBackupProcesses(string $contents = 'backup'): void
{
    Process::fake(function (PendingProcess $process) use ($contents) {
        $file = collect($process->command)->first(fn (string $argument): bool => str_starts_with($argument, '--file='));
        file_put_contents(substr($file, strlen('--file=')), $contents);

        return Process::result();
    });
}

beforeEach(function () {
    config(['backup.folder' => 'convite', 'backup.disks' => ['local', 'google'], 'backup.keep_days' => 7]);
});

it('stores a gzipped dump of the database on every backup disk', function () {
    Storage::fake('local');
    Storage::fake('google');
    $this->travelTo('2026-11-26 01:00:00');
    fakeBackupProcesses('dump');

    $this->artisan('backup:database')
        ->expectsOutputToContain('database-2026-11-26-010000.sql.gz')
        ->assertSuccessful();

    Storage::disk('local')->assertExists('convite/database-2026-11-26-010000.sql.gz');
    expect(Storage::disk('google')->get('convite/database-2026-11-26-010000.sql.gz'))->toBe('dump');
    Process::assertRan(fn (PendingProcess $process): bool => $process->command[0] === 'pg_dump'
        && in_array('--dbname='.config('database.connections.pgsql.database'), $process->command)
        && in_array('--compress=9', $process->command));
    expect(glob(storage_path('app/backup-temp/*')))->toBe([]);
});

it('stores a gzipped tarball of the uploads on every backup disk', function () {
    Storage::fake('local');
    Storage::fake('google');
    $this->travelTo('2026-11-26 01:30:00');
    fakeBackupProcesses('tarball');

    $this->artisan('backup:uploads')->assertSuccessful();

    Storage::disk('local')->assertExists('convite/uploads-2026-11-26-013000.tar.gz');
    expect(Storage::disk('google')->get('convite/uploads-2026-11-26-013000.tar.gz'))->toBe('tarball');
    Process::assertRan(fn (PendingProcess $process): bool => $process->command[0] === 'tar'
        && in_array('--gzip', $process->command)
        && in_array('--directory='.storage_path('app/public'), $process->command));
});

it('deletes the backups of its kind older than the retention period', function () {
    Storage::fake('local');
    Storage::fake('google');
    $this->travelTo('2026-11-26 01:00:00');
    fakeBackupProcesses();
    $disk = Storage::disk('local');
    $disk->put('convite/database-2026-11-18-010000.sql.gz', 'old');
    $disk->put('convite/database-2026-11-20-010000.sql.gz', 'recent');
    $disk->put('convite/uploads-2026-11-01-013000.tar.gz', 'other kind');

    $this->artisan('backup:database')->assertSuccessful();

    $disk->assertMissing('convite/database-2026-11-18-010000.sql.gz');
    $disk->assertExists([
        'convite/database-2026-11-20-010000.sql.gz',
        'convite/database-2026-11-26-010000.sql.gz',
        'convite/uploads-2026-11-01-013000.tar.gz',
    ]);
});

it('fails and stores nothing when the dump fails', function () {
    Storage::fake('local');
    Storage::fake('google');
    Process::fake(['*' => Process::result(errorOutput: 'connection refused', exitCode: 1)]);

    $this->artisan('backup:database')->assertFailed();

    expect(Storage::disk('local')->allFiles())->toBe([])
        ->and(Storage::disk('google')->allFiles())->toBe([]);
});
