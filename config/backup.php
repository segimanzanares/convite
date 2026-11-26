<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Backups
    |--------------------------------------------------------------------------
    |
    | `backup:database` stores a gzipped dump of the database (.sql.gz) and
    | `backup:uploads` a gzipped tarball of the public disk's uploads (.tar.gz)
    | in this folder of every disk, and then deletes the ones of the same kind
    | older than `keep_days`. See App\Services\BackupService.
    |
    */

    'folder' => env('BACKUP_FOLDER', 'convite'),

    'disks' => array_values(array_filter([
        'local',
        env('GOOGLE_DRIVE_REFRESH_TOKEN') ? 'google' : null,
    ])),

    'keep_days' => (int) env('BACKUP_KEEP_DAYS', 7),

    /*
     * The uploads: invitation photos and music, and the live gallery's photos.
     */
    'uploads_path' => storage_path('app/public'),

    /*
     * Where a failed backup's output is emailed (see routes/console.php).
     */
    'notification_email' => env('BACKUP_NOTIFICATION_EMAIL', env('MAIL_FROM_ADDRESS')),

];
