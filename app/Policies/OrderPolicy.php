<?php

namespace App\Policies;

use App\Models\Order;
use App\Models\User;

/**
 * Only admins manage orders. They are allowed through Gate::before (see AppServiceProvider), so every ability here
 * refuses everyone else.
 */
class OrderPolicy
{
    public function view(User $user, Order $order): bool
    {
        return false;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, Order $order): bool
    {
        return false;
    }

    public function delete(User $user, Order $order): bool
    {
        return false;
    }
}
