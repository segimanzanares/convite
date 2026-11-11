<?php

namespace App\Concerns;

use App\Enums\InvitationStatus;
use App\Models\Invitation;
use App\Models\Order;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait InvitationValidationRules
{
    /**
     * Get the validation rules used to validate invitations.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    protected function invitationRules(?int $invitationId = null): array
    {
        return [
            'slug' => ['required', 'string', 'max:255', 'alpha_dash', Rule::unique(Invitation::class)->ignore($invitationId)],
            'template' => ['required', 'string', Rule::in(Invitation::templates())],
            'order_id' => ['nullable', 'integer', Rule::exists(Order::class, 'id')],
            'event_date' => ['nullable', 'date_format:Y-m-d'],
            'rsvp_deadline' => ['nullable', 'date_format:Y-m-d', 'before_or_equal:event_date'],
            'status' => ['required', Rule::enum(InvitationStatus::class)],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:500'],
            'og_image' => ['nullable', 'string', 'max:255'],
        ];
    }
}
