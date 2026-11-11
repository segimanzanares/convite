<?php

namespace App\Http\Requests\Invitation;

use App\Concerns\InvitationContentRules;
use App\Models\Invitation;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class UpdateInvitationContentRequest extends FormRequest
{
    use InvitationContentRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->invitation());
    }

    /**
     * Get the validation rules that apply to the request. A template without a kind has no content to capture.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $kind = $this->invitation()->kind();

        abort_if($kind === null, 404);

        return $this->invitationContentRules($this->invitation(), $kind);
    }

    public function invitation(): Invitation
    {
        return $this->route('invitation');
    }
}
