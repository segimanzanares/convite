<?php

namespace App\Http\Requests\Guest;

use App\Concerns\GuestValidationRules;
use App\Services\GuestImportService;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * The rows of a CSV file the user reviewed in the import preview.
 */
class ImportGuestsRequest extends FormRequest
{
    use GuestValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('manageGuests', $this->route('invitation'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'rows' => ['required', 'array', 'min:1', 'max:'.GuestImportService::MAX_ROWS],
            ...$this->guestRules('rows.*.'),
        ];
    }
}
