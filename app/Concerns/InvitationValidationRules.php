<?php

namespace App\Concerns;

use App\Enums\InvitationStatus;
use App\Models\Invitation;
use App\Models\Order;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait InvitationValidationRules
{
    /**
     * Get the validation rules used to validate invitations. A published invitation needs its date, time and
     * content, so the admin creates it as a draft, captures its content and then publishes it.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    protected function invitationRules(?Invitation $invitation = null): array
    {
        return [
            'slug' => ['required', 'string', 'max:255', 'alpha_dash', Rule::unique(Invitation::class)->ignore($invitation?->id)],
            'template' => ['required', 'string', Rule::in(array_keys(Invitation::assignableTemplates($invitation)))],
            'order_id' => ['nullable', 'integer', Rule::exists(Order::class, 'id')],
            'event_date' => ['nullable', 'required_if:status,'.InvitationStatus::Published->value, 'date_format:Y-m-d'],
            'event_time' => ['nullable', 'required_if:status,'.InvitationStatus::Published->value, 'date_format:H:i'],
            'rsvp_deadline' => ['nullable', 'date_format:Y-m-d', 'before_or_equal:event_date'],
            'status' => [
                'required',
                Rule::enum(InvitationStatus::class),
                function (string $attribute, mixed $value, Closure $fail) use ($invitation): void {
                    if ($value !== InvitationStatus::Published->value) {
                        return;
                    }

                    // The content is checked against the template being saved, which decides its kind
                    $candidate = ($invitation ?? new Invitation)->replicate()->fill(['template' => $this->input('template')]);

                    if (! $candidate->hasContent()) {
                        $fail(__('Capture the content of the invitation before publishing it.'));
                    }
                },
            ],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:500'],
        ];
    }
}
