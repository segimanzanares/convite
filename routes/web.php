<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\CheckInController;
use App\Http\Controllers\DemoShowcaseController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\LandingController;
use App\Http\Controllers\LiveGalleryController;
use App\Http\Controllers\PartnerLinkController;
use App\Http\Controllers\RsvpController;
use App\Http\Controllers\ServicesController;
use App\Http\Controllers\WishController;
use Illuminate\Support\Facades\Route;

Route::get('/', LandingController::class)->name('landing');
Route::get('servicios', ServicesController::class)->name('services');
// A partner's short link, which lands on the landing page with their code (see App\Services\PartnerService)
Route::get('a/{code}', PartnerLinkController::class)->where('code', '[A-Za-z0-9]+')->name('partners.link');

// The door of the event, for the staff checking guests in (scanning a pass opens the guest's link, see
// InvitationController::guest). Declared before the personalized links so "puerta" is not read as a token
Route::controller(CheckInController::class)->prefix('i/{invitation}')->name('invitations.')->middleware(['invitation.visible', 'invitation.feature:check_in'])->group(function () {
    Route::get('puerta/{doorToken}', 'enter')->where('doorToken', '[A-Za-z0-9]+')->name('door.enter');

    Route::middleware('invitation.door')->scopeBindings()->group(function () {
        Route::get('puerta', 'show')->name('door.show');
        Route::post('{guest:token}/llegada', 'store')->name('check-in.store');
        Route::delete('{guest:token}/llegada', 'destroy')->name('check-in.destroy');
    });
});

// The live gallery: the gallery QR code at the venue opens the page to share photos, and the wall is projected there.
// Declared before the personalized links so "fotos" is not read as a token
Route::controller(LiveGalleryController::class)->prefix('i/{invitation}/fotos/{galleryToken}')->name('invitations.gallery.')->where(['galleryToken' => '[A-Za-z0-9]+'])->middleware(['invitation.visible', 'invitation.feature:live_gallery', 'invitation.gallery'])->group(function () {
    Route::get('/', 'show')->name('show');
    Route::post('/', 'store')->middleware('throttle:gallery')->name('store');
    Route::get('muro', 'wall')->name('wall');
});

// The door and the live gallery of a demo, with sample guests and photos and storing nothing (see DemoShowcaseService)
Route::controller(DemoShowcaseController::class)->prefix('i/{invitation}/demo')->name('invitations.demo.')->middleware('invitation.visible')->group(function () {
    Route::get('puerta', 'door')->name('door');
    Route::get('fotos', 'gallery')->name('gallery');
    Route::get('fotos/muro', 'wall')->name('wall');
});

Route::controller(InvitationController::class)->prefix('i/{invitation}')->name('invitations.')->middleware('invitation.visible')->group(function () {
    Route::get('/', 'show')->name('show');
    Route::get('tarjeta', 'printCard')->name('print-card');
    Route::get('pases', 'guestPasses')->name('guest-passes');
    // Personalized links. Declared after the fixed paths above so these win
    Route::get('{token}', 'guest')->where('token', '[A-Za-z0-9]+')->name('guest');
});

Route::post('i/{invitation}/rsvp', [RsvpController::class, 'store'])
    ->middleware(['invitation.visible', 'invitation.feature:online_rsvp', 'throttle:rsvp'])
    ->name('invitations.rsvp.store');

Route::post('i/{invitation}/deseos', [WishController::class, 'store'])
    ->middleware(['invitation.visible', 'invitation.feature:wishes', 'throttle:wishes'])
    ->name('invitations.wishes.store');

/*
| Admin panel. Fortify registers its authentication routes under the same
| prefix (see config/fortify.php), and HandleInertiaRequests serves every
| /admin page with the admin root view.
*/
Route::prefix('admin')->group(function () {
    Route::middleware(['auth', 'verified'])->group(function () {
        Route::get('/', DashboardController::class)->name('dashboard');
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
