<?php

namespace App\Http\Requests\Video;

use App\Services\InvitationVideoService;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * The theme a new render of the invitation's video uses.
 */
class RenderVideoRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->can('renderVideo', $this->route('invitation'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'theme' => ['required', 'string', Rule::in(array_keys(app(InvitationVideoService::class)->themes()))],
        ];
    }
}
