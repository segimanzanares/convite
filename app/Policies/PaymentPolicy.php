<?php

namespace App\Policies;

use App\Models\Payment;
use App\Models\User;

/**
 * Only admins register payments. They are allowed through Gate::before (see AppServiceProvider), so every ability
 * here refuses everyone else.
 */
class PaymentPolicy
{
    public function create(User $user): bool
    {
        return false;
    }

    public function delete(User $user, Payment $payment): bool
    {
        return false;
    }
}
