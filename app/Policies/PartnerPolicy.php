<?php

namespace App\Policies;

use App\Models\Partner;
use App\Models\User;

/**
 * Only admins manage partners and their commissions. They are allowed through Gate::before (see AppServiceProvider),
 * so every ability here refuses everyone else.
 */
class PartnerPolicy
{
    public function viewAny(User $user): bool
    {
        return false;
    }

    public function view(User $user, Partner $partner): bool
    {
        return false;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, Partner $partner): bool
    {
        return false;
    }

    public function delete(User $user, Partner $partner): bool
    {
        return false;
    }
}
