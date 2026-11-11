<?php

namespace App\Policies;

use App\Models\Plan;
use App\Models\User;

/**
 * Only admins manage plans. They are allowed through Gate::before (see AppServiceProvider), so every ability here
 * refuses everyone else.
 */
class PlanPolicy
{
    public function viewAny(User $user): bool
    {
        return false;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, Plan $plan): bool
    {
        return false;
    }

    public function delete(User $user, Plan $plan): bool
    {
        return false;
    }
}
