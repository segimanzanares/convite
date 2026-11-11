<?php

use App\Http\Controllers\InvitationController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'pages/landing/LandingPage')->name('landing');

Route::controller(InvitationController::class)->prefix('i/{invitation}')->name('invitations.')->group(function () {
    Route::get('/', 'show')->name('show');
    Route::get('tarjeta', 'printCard')->name('print-card');
    Route::get('pases', 'guestPasses')->name('guest-passes');
});

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

Route::get('.well-known/passkey-endpoints', function () {
    return response()->json([
        'enroll' => route('security.edit'),
        'manage' => route('security.edit'),
    ]);
})->name('well-known.passkeys');
