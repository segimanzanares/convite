<?php

namespace App\Http\Requests\Wish;

use App\Enums\WishStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Approve a message of the wishes book, so the invitation shows it, or hide it.
 */
class UpdateWishRequest extends FormRequest
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
            'status' => ['required', Rule::enum(WishStatus::class)->only([WishStatus::Approved, WishStatus::Hidden])],
        ];
    }
}
