<?php

namespace App\Concerns;

use App\Enums\PlanFeature;
use App\Models\Plan;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait PlanValidationRules
{
    /**
     * Get the validation rules used to validate plans.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    protected function planRules(?int $planId = null): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'alpha_dash', Rule::unique(Plan::class)->ignore($planId)],
            'price' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
            'description' => ['nullable', 'string', 'max:2000'],
            'max_guests' => ['nullable', 'integer', 'min:1', 'max:100000'],
            'features' => ['array', function (string $attribute, mixed $value, Closure $fail): void {
                // Guests are checked in from the guest list
                if (is_array($value) && in_array(PlanFeature::CheckIn->value, $value, true) && ! in_array(PlanFeature::GuestManagement->value, $value, true)) {
                    $fail(__('Check-in at the door requires the guest list.'));
                }
            }],
            'features.*' => ['distinct', Rule::enum(PlanFeature::class)],
            'is_active' => ['boolean'],
            'sort_order' => ['required', 'integer', 'min:0', 'max:1000'],
        ];
    }

    /**
     * Unchecked checkboxes are not sent, so a plan without features or inactive must still get those fields.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'features' => $this->input('features', []),
            'is_active' => $this->boolean('is_active'),
        ]);
    }
}
