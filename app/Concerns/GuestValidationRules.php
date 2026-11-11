<?php

namespace App\Concerns;

use Illuminate\Contracts\Validation\ValidationRule;

trait GuestValidationRules
{
    /** The most seats a single guest (a family or group) may have. */
    protected const int MAX_GUEST_SEATS = 50;

    /**
     * Get the validation rules used to validate guests, optionally with their keys prefixed (e.g. "rows.*.").
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    protected function guestRules(string $prefix = ''): array
    {
        return [
            "{$prefix}name" => ['required', 'string', 'max:255'],
            "{$prefix}seats" => ['required', 'integer', 'min:1', 'max:'.self::MAX_GUEST_SEATS],
            "{$prefix}phone" => ['nullable', 'string', 'max:30'],
            "{$prefix}email" => ['nullable', 'string', 'email', 'max:255'],
            "{$prefix}table_label" => ['nullable', 'string', 'max:50'],
        ];
    }
}
