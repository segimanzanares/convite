<?php

use App\Http\Controllers\Admin\ClientController;
use App\Http\Controllers\Admin\ClientUserController;
use App\Http\Controllers\Admin\InvitationController;
use App\Http\Controllers\Admin\OrderController;
use App\Http\Controllers\Admin\PaymentController;
use App\Http\Controllers\Admin\PlanController;
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
});
