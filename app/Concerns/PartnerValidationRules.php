<?php

namespace App\Concerns;

use App\Enums\PartnerKind;
use App\Models\Partner;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

trait PartnerValidationRules
{
    /**
     * Get the validation rules used to validate partners. A new partner may leave the code empty to get one made
     * from their name.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    protected function partnerRules(?Partner $partner = null): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'kind' => ['required', Rule::enum(PartnerKind::class)],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'code' => [
                $partner === null ? 'nullable' : 'required',
                'string',
                'alpha_num:ascii',
                'min:3',
                'max:'.Partner::CODE_MAX_LENGTH,
                Rule::unique(Partner::class)->ignore($partner),
            ],
            'commission_percent' => ['required', 'numeric', 'min:0', 'max:100', 'decimal:0,2'],
            'discount_percent' => ['required', 'integer', 'min:0', 'max:100'],
            'is_active' => ['boolean'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }

    /**
     * Codes are compared in upper case, and an unchecked checkbox is not sent, so an inactive partner must still get
     * the field.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'code' => filled($this->input('code')) ? Partner::normalizeCode($this->input('code')) : null,
            'is_active' => $this->boolean('is_active'),
        ]);
    }
}
