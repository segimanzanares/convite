<?php

namespace App\Policies;

use App\Models\Invitation;
use App\Models\User;

/**
 * Admins are allowed through Gate::before (see AppServiceProvider). Clients only see their own invitations and never
 * edit them.
 */
class InvitationPolicy
{
    public function viewAny(User $user): bool
    {
        return false;
    }

    public function view(User $user, Invitation $invitation): bool
    {
        return $user->client_id !== null && $user->client_id === $invitation->client_id;
    }

    public function create(User $user): bool
    {
        return false;
    }

    public function update(User $user, Invitation $invitation): bool
    {
        return false;
    }
}
