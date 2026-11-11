<?php

namespace App\Http\Requests\Rsvp;

use App\Models\Guest;
use App\Models\Invitation;
use App\Services\GuestService;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

/**
 * An answer from the public invitation page. With the token of a guest it is that guest's answer, limited to their
 * seats; without one (or with an unknown token) it comes from the open form.
 */
class StoreRsvpRequest extends FormRequest
{
    private Guest|false|null $guest = false;

    /**
     * Determine if the user is authorized to make this request.
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
        $guest = $this->guest();

        return [
            'token' => ['nullable', 'string', 'max:64'],
            'name' => [Rule::requiredIf($guest === null), 'nullable', 'string', 'max:255'],
            'attending' => ['required', 'boolean'],
            'seats' => [
                Rule::requiredIf($this->boolean('attending')),
                'nullable',
                'integer',
                'min:1',
                'max:'.($guest?->seats ?? config('convite.open_rsvp_max_seats')),
            ],
            'message' => ['nullable', 'string', 'max:1000'],
        ];
    }

    /**
     * Get the "after" validation callables for the request.
     *
     * @return array<int, callable>
     */
    public function after(): array
    {
        return [
            function (Validator $validator): void {
                if (! $this->invitation()->acceptsRsvps()) {
                    $validator->errors()->add('rsvp', __('The RSVP form is closed.'));
                }
            },
        ];
    }

    /**
     * The guest the answer belongs to, or null for the open form.
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

    /**
     * The answer to store: guests answer under their own name, and people who do not attend confirm no seats.
     *
     * @return array{name: string, attending: bool, seats_confirmed: int, message: string|null}
     */
    public function answer(): array
    {
        $attending = $this->boolean('attending');

        return [
            'name' => $this->guest()?->name ?? $this->string('name')->trim()->toString(),
            'attending' => $attending,
            'seats_confirmed' => $attending ? $this->integer('seats') : 0,
            'message' => $this->filled('message') ? $this->string('message')->trim()->toString() : null,
        ];
    }

    private function invitation(): Invitation
    {
        return $this->route('invitation');
    }
}
