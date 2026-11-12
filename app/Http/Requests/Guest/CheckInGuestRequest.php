<?php

namespace App\Http\Requests\Guest;

use App\Models\Guest;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * How many people of a guest's group arrived, sent from the door (scanning their pass) or from the panel.
 */
class CheckInGuestRequest extends FormRequest
{
    /**
     * Panel users must manage the invitation's guests. At the door, the EnsureDoorAccess middleware already checked the
     * door link's cookie.
     */
    public function authorize(): bool
    {
        if (! $this->routeIs('admin.*')) {
            return true;
        }

        return (bool) $this->user()?->can('manageGuests', $this->route('invitation'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        /** @var Guest $guest */
        $guest = $this->route('guest');

        return [
            'seats' => ['required', 'integer', 'min:1', "max:{$guest->seats}"],
        ];
    }
}
