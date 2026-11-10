<?php

use App\Http\Controllers\InvitationController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'pages/landing/LandingPage')->name('landing');

Route::controller(InvitationController::class)->prefix('i/{invitation}')->name('invitations.')->group(function () {
    Route::get('/', 'show')->name('show');
    Route::get('tarjeta', 'printCard')->name('print-card');
    Route::get('pases', 'guestPasses')->name('guest-passes');
});
