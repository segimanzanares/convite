<?php

namespace App\Http\Requests\Invitation;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class StoreInvitationMediaRequest extends FormRequest
{
    /** Photos are shown full width, so they may be large; anything bigger should be resized first. */
    private const int MAX_IMAGE_KILOBYTES = 10 * 1024;

    private const int MAX_AUDIO_KILOBYTES = 15 * 1024;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('invitation'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'type' => ['required', 'in:image,audio'],
            'file' => [
                'required',
                $this->input('type') === 'audio'
                    ? File::types(['mp3', 'm4a'])->max(self::MAX_AUDIO_KILOBYTES)
                    : File::types(['jpg', 'jpeg', 'png', 'webp'])->max(self::MAX_IMAGE_KILOBYTES),
            ],
        ];
    }
}
