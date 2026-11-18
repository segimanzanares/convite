<?php

namespace App\Policies;

use App\Models\Invitation;
use App\Models\User;

/**
 * Admins are allowed through Gate::before (see AppServiceProvider). Clients only see their own invitations and never
 * edit them, but they manage their guests, their live gallery and their wishes book, and see their RSVPs. Whether the plan includes those features is checked
 * apart from the policy (see EnsureInvitationHasFeature), so it applies to admins too.
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

    /**
     * Add, edit, import and remove the guests of the invitation.
     */
    public function manageGuests(User $user, Invitation $invitation): bool
    {
        return $this->view($user, $invitation);
    }

    /**
     * See, export and remove the RSVPs of the invitation.
     */
    public function manageRsvps(User $user, Invitation $invitation): bool
    {
        return $this->view($user, $invitation);
    }

    /**
     * Moderate, download and share the live gallery of the invitation.
     */
    public function manageGallery(User $user, Invitation $invitation): bool
    {
        return $this->view($user, $invitation);
    }

    /**
     * Set up, moderate and download the wishes book of the invitation.
     */
    public function manageWishes(User $user, Invitation $invitation): bool
    {
        return $this->view($user, $invitation);
    }
}
