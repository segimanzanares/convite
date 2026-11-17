<?php

namespace App\Http\Requests\GalleryPhoto;

use App\Enums\GalleryPhotoStatus;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Approve a photo of the live gallery, so the wall shows it, or hide it.
 */
class UpdateGalleryPhotoRequest extends FormRequest
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
            'status' => ['required', Rule::enum(GalleryPhotoStatus::class)->only([GalleryPhotoStatus::Approved, GalleryPhotoStatus::Hidden])],
        ];
    }
}
