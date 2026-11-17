<?php

namespace App\Http\Requests\GalleryPhoto;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * Whether the live gallery waits for a panel user's approval before the wall shows a photo.
 */
class UpdateGallerySettingsRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->can('manageGallery', $this->route('invitation'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'moderated' => ['required', 'boolean'],
        ];
    }
}
