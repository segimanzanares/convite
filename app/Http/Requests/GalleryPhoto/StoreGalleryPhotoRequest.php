<?php

namespace App\Http\Requests\GalleryPhoto;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;

/**
 * A photo a guest shares in the live gallery. The page scales photos down before sending them, so the size limit only
 * matters when the browser could not (the original is sent then).
 */
class StoreGalleryPhotoRequest extends FormRequest
{
    private const int MAX_KILOBYTES = 20 * 1024;

    /** Longest side the server decodes, to keep its memory in check. */
    private const int MAX_DIMENSION = 8000;

    /**
     * The EnsureGalleryAccess middleware already checked the gallery link's token.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'photo' => [
                'required',
                File::types(['jpg', 'jpeg', 'png', 'webp'])->max(self::MAX_KILOBYTES),
                Rule::dimensions()->maxWidth(self::MAX_DIMENSION)->maxHeight(self::MAX_DIMENSION),
            ],
            'uploader_name' => ['nullable', 'string', 'max:60'],
            'message' => ['nullable', 'string', 'max:140'],
        ];
    }
}
