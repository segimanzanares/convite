<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::command('guests:purge')->daily();
Schedule::command('rsvps:digest')->dailyAt('08:00');

$backupFailureEmail = config('backup.notification_email');

foreach (['backup:database' => '01:00', 'backup:uploads' => '01:30'] as $backupCommand => $time) {
    $backup = Schedule::command($backupCommand)->dailyAt($time)->withoutOverlapping();

    if ($backupFailureEmail) {
        $backup->emailOutputOnFailure($backupFailureEmail);
    }
}
