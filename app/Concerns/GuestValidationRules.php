<?php

namespace App\Concerns;

use App\Models\Guest;
use Illuminate\Contracts\Validation\ValidationRule;

trait GuestValidationRules
{
    /**
     * Get the validation rules used to validate guests, optionally with their keys prefixed (e.g. "rows.*."). The
     * seats of each guest are capped by the invitation's plan (see Invitation::seatLimit()).
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    protected function guestRules(int $seatLimit = Guest::MAX_SEATS, string $prefix = ''): array
    {
        return [
            "{$prefix}name" => ['required', 'string', 'max:255'],
            "{$prefix}seats" => ['required', 'integer', 'min:1', 'max:'.$seatLimit],
            "{$prefix}phone" => ['nullable', 'string', 'max:30'],
            "{$prefix}email" => ['nullable', 'string', 'email', 'max:255'],
            "{$prefix}table_label" => ['nullable', 'string', 'max:50'],
        ];
    }
}
