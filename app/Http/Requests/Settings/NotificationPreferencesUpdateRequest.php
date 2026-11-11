<?php

namespace App\Http\Requests\Settings;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The emails a client user chooses to get. Only client users get them, so admins have nothing to choose.
 */
class NotificationPreferencesUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return ! $this->user()->isAdmin();
    }

    /**
     * An unchecked checkbox is not sent, so it means "no".
     */
    protected function prepareForValidation(): void
    {
        $this->merge(['receives_rsvp_digest' => $this->boolean('receives_rsvp_digest')]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'receives_rsvp_digest' => ['required', 'boolean'],
        ];
    }
}
