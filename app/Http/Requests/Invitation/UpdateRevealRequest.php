<?php

namespace App\Http\Requests\Invitation;

use App\Enums\InvitationKind;
use App\Models\Invitation;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

/**
 * Whether a gender reveal shows its result. It can only be shown once the admin captured it.
 */
class UpdateRevealRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->can('showReveal', $this->invitation());
    }

    /**
     * Get the validation rules that apply to the request. Only gender reveals have a result.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        abort_unless($this->invitation()->kind() === InvitationKind::GenderReveal, 404);

        return [
            'shown' => ['required', 'boolean'],
        ];
    }

    /**
     * @return array<int, callable(Validator): void>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if ($this->boolean('shown') && blank($this->invitation()->content['reveal'] ?? null)) {
                    $validator->errors()->add('shown', __('Capture the result first.'));
                }
            },
        ];
    }

    private function invitation(): Invitation
    {
        return $this->route('invitation');
    }
}
