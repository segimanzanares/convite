<?php

namespace App\Http\Requests\Wish;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Whether the invitation shows its wishes book, whether the messages show on it and whether they wait for approval.
 */
class UpdateWishSettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->can('manageWishes', $this->route('invitation'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'enabled' => ['required', 'boolean'],
            'public' => ['required', 'boolean'],
            'moderated' => ['required', 'boolean'],
        ];
    }

    /**
     * @return array{enabled: bool, public: bool, moderated: bool}
     */
    public function settings(): array
    {
        return [
            'enabled' => $this->boolean('enabled'),
            'public' => $this->boolean('public'),
            'moderated' => $this->boolean('moderated'),
        ];
    }
}
