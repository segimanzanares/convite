<?php

use App\Http\Controllers\InvitationController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\RsvpController;
use Illuminate\Support\Facades\Route;

Route::get('/', LandingController::class)->name('landing');

Route::controller(InvitationController::class)->prefix('i/{invitation}')->name('invitations.')->group(function () {
    Route::get('/', 'show')->name('show');
    Route::get('tarjeta', 'printCard')->name('print-card');
    Route::get('pases', 'guestPasses')->name('guest-passes');
    // Personalized links. Declared after the fixed paths above so these win
    Route::get('{token}', 'guest')->where('token', '[A-Za-z0-9]+')->name('guest');
});

Route::post('i/{invitation}/rsvp', [RsvpController::class, 'store'])
    ->middleware(['invitation.feature:online_rsvp', 'throttle:rsvp'])
    ->name('invitations.rsvp.store');

/*
| Admin panel. Fortify registers its authentication routes under the same
| prefix (see config/fortify.php), and HandleInertiaRequests serves every
| /admin page with the admin root view.
*/
Route::prefix('admin')->group(function () {
    Route::middleware(['auth', 'verified'])->group(function () {
        Route::inertia('/', 'dashboard')->name('dashboard');
    });

    require __DIR__.'/settings.php';
});

require __DIR__.'/admin.php';

Route::get('.well-known/passkey-endpoints', function () {
    return response()->json([
        'enroll' => route('security.edit'),
        'manage' => route('security.edit'),
    ]);
})->name('well-known.passkeys');
