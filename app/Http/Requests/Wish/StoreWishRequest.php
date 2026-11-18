<?php

namespace App\Http\Requests\Wish;

use App\Models\Guest;
use App\Models\Invitation;
use App\Services\GuestService;
use App\Services\WishService;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

/**
 * A message a guest leaves in the wishes book from the invitation page. With the token of a personalized link it is
 * tied to that guest. The `website` field is hidden from people, so only bots fill it in.
 */
class StoreWishRequest extends FormRequest
{
    private Guest|false|null $guest = false;

    /**
     * Anyone with the invitation's link may leave a message.
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
            'token' => ['nullable', 'string', 'max:64'],
            'author_name' => ['required', 'string', 'max:60'],
            'message' => ['required', 'string', 'max:'.WishService::MAX_LENGTH],
            'website' => ['prohibited'],
        ];
    }

    /**
     * The guest whose personalized link the message comes from, or null.
     */
    public function guest(): ?Guest
    {
        if ($this->guest === false) {
            $token = $this->input('token');

            $this->guest = is_string($token) && $token !== ''
                ? app(GuestService::class)->findByToken($this->invitation(), $token)
                : null;
        }

        return $this->guest;
    }

    public function authorName(): string
    {
        return $this->string('author_name')->trim()->toString();
    }

    public function message(): string
    {
        return $this->string('message')->trim()->toString();
    }

    private function invitation(): Invitation
    {
        return $this->route('invitation');
    }
}
