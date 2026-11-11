<?php

namespace App\Policies;

use App\Models\Client;
use App\Models\User;

/**
 * Only admins manage clients. They are allowed through Gate::before (see AppServiceProvider), so every ability here
 * refuses everyone else.
 */
class ClientPolicy
{
    public function viewAny(User $user): bool
    {
        return false;
    }

    public function view(User $user, Client $client): bool
    {
        return false;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, Client $client): bool
    {
        return false;
    }

    public function delete(User $user, Client $client): bool
    {
        return false;
    }
}
