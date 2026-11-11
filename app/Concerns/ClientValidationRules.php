<?php

namespace App\Concerns;

use Illuminate\Contracts\Validation\ValidationRule;

trait ClientValidationRules
{
    /**
     * Get the validation rules used to validate clients.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    protected function clientRules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'phone' => ['nullable', 'string', 'max:30'],
            'email' => ['nullable', 'string', 'email', 'max:255'],
            'notes' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
