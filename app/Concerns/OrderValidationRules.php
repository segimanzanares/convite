<?php

namespace App\Concerns;

use App\Enums\OrderSource;
use App\Models\Client;
use App\Models\Order;
use App\Models\Partner;
use App\Services\ReferralService;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Validator;

trait OrderValidationRules
{
    /**
     * Get the validation rules of how the client found Convite. A referral needs the referral code of another client.
     * While the referral program is off, only an order that already was a referral may stay one.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    protected function orderSourceRules(Client $client, ?Order $order = null): array
    {
        $allowsReferral = app(ReferralService::class)->isEnabled() || $order?->source === OrderSource::Referral;

        return [
            'source' => [
                'nullable',
                $allowsReferral ? Rule::enum(OrderSource::class) : Rule::enum(OrderSource::class)->except(OrderSource::Referral),
            ],
            'referral_code' => [
                'nullable',
                'string',
                'max:16',
                Rule::requiredIf(fn () => $this->input('source') === OrderSource::Referral->value),
                function (string $attribute, mixed $value, Closure $fail) use ($client): void {
                    if ($this->input('source') !== OrderSource::Referral->value) {
                        return;
                    }

                    $referrer = Client::findByReferralCode($value);

                    if ($referrer === null) {
                        $fail(__('No client has that referral code.'));
                    } elseif ($referrer->is($client)) {
                        $fail(__('A client cannot refer themselves.'));
                    }
                },
            ],
            // Optional: a vendor may recommend Convite without being a partner, and then no commission is owed
            'partner_id' => [
                'nullable',
                'integer',
                Rule::exists(Partner::class, 'id'),
                function (string $attribute, mixed $value, Closure $fail) use ($order): void {
                    if ($this->input('source') !== OrderSource::Partner->value || (int) $value === $order?->partner_id) {
                        return;
                    }

                    if (! Partner::query()->whereKey($value)->value('is_active')) {
                        $fail(__('The partner is no longer active.'));
                    }
                },
            ],
        ];
    }

    /**
     * Once the partner was paid their commission on the order, the order keeps them as its source.
     *
     * @return Closure(Validator): void
     */
    protected function keepsPaidPartner(Order $order): Closure
    {
        return function (Validator $validator) use ($order): void {
            if ($order->commission_paid_at === null || ! $this->has('source')) {
                return;
            }

            $keepsPartner = $this->input('source') === OrderSource::Partner->value
                && (int) $this->input('partner_id') === $order->partner_id;

            if (! $keepsPartner) {
                $validator->errors()->add('partner_id', __('The partner was already paid their commission on this order, so it keeps them.'));
            }
        };
    }
}
