<?php

namespace App\Http\Requests\GalleryPhoto;

use App\Services\LiveGalleryService;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * How the live gallery works: whether the wall waits for a panel user's approval to show a photo, the days before and
 * after the event it takes photos, and how long the wall shows each one.
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
            'opens_days_before' => ['required', 'integer', 'min:0', 'max:'.LiveGalleryService::MAX_OPENS_DAYS_BEFORE],
            'closes_days_after' => ['required', 'integer', 'min:1', 'max:'.app(LiveGalleryService::class)->maxClosesDaysAfter()],
            'slide_seconds' => ['required', 'integer', 'min:'.LiveGalleryService::MIN_SLIDE_SECONDS, 'max:'.LiveGalleryService::MAX_SLIDE_SECONDS],
        ];
    }

    /**
     * @return array{moderated: bool, opens_days_before: int, closes_days_after: int, slide_seconds: int}
     */
    public function settings(): array
    {
        return [
            'moderated' => $this->boolean('moderated'),
            'opens_days_before' => $this->integer('opens_days_before'),
            'closes_days_after' => $this->integer('closes_days_after'),
            'slide_seconds' => $this->integer('slide_seconds'),
        ];
    }
}
