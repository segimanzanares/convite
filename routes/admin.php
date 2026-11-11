<?php

use App\Http\Controllers\Admin\ClientController;
use App\Http\Controllers\Admin\ClientUserController;
use App\Http\Controllers\Admin\GuestController;
use App\Http\Controllers\Admin\GuestDeliveryController;
use App\Http\Controllers\Admin\GuestImportController;
use App\Http\Controllers\Admin\InvitationContentController;
use App\Http\Controllers\Admin\InvitationController;
use App\Http\Controllers\Admin\InvitationMediaController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\PlanController;
use App\Http\Controllers\Admin\RsvpController;
use Illuminate\Support\Facades\Route;

/*
| Panel sections. Admins manage everything; client users only reach their
| own invitations (see the policies and AppServiceProvider's Gate::before).
| Names are prefixed with "admin." so they do not clash with the public
| invitation routes.
*/
Route::middleware(['auth', 'verified'])->prefix('admin')->name('admin.')->group(function () {
    Route::resource('plans', PlanController::class)->except('show');

    Route::resource('clients', ClientController::class);
    Route::resource('clients.users', ClientUserController::class)->only(['create', 'store', 'destroy']);
    Route::resource('clients.orders', OrderController::class)->shallow()->except('index');
    Route::resource('orders.payments', PaymentController::class)->shallow()->only(['create', 'store', 'destroy']);

    Route::get('invitations/mine', [InvitationController::class, 'mine'])->name('invitations.mine');
    Route::resource('invitations', InvitationController::class)->except(['show', 'destroy']);
    Route::get('invitations/{invitation}/content', [InvitationContentController::class, 'edit'])->name('invitations.content.edit');
    Route::put('invitations/{invitation}/content', [InvitationContentController::class, 'update'])->name('invitations.content.update');
    Route::post('invitations/{invitation}/media', [InvitationMediaController::class, 'store'])->name('invitations.media.store');

    // Guest lists and RSVPs only exist when the invitation's plan includes them, for admins too
    Route::middleware('invitation.feature:guest_management')->scopeBindings()->group(function () {
        Route::controller(GuestImportController::class)->prefix('invitations/{invitation}/guests/import')->name('invitations.guests.import.')->group(function () {
            Route::get('/', 'create')->name('create');
            Route::post('preview', 'preview')->name('preview');
            Route::post('/', 'store')->name('store');
        });
        Route::controller(GuestDeliveryController::class)->prefix('invitations/{invitation}/guests')->name('invitations.guests.')->group(function () {
            Route::post('email', 'emailPending')->name('email-pending');
            Route::post('{guest}/email', 'email')->name('email');
            Route::post('{guest}/sent', 'markSent')->name('mark-sent');
        });
        Route::resource('invitations.guests', GuestController::class)->except('show');
    });

    Route::middleware('invitation.feature:online_rsvp')->scopeBindings()->group(function () {
        Route::controller(RsvpController::class)->prefix('invitations/{invitation}/rsvps')->name('invitations.rsvps.')->group(function () {
            Route::get('/', 'index')->name('index');
            Route::get('export', 'export')->name('export');
            Route::delete('{rsvp}', 'destroy')->name('destroy');
        });
    });
});
