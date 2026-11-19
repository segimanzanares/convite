<?php

namespace App\Concerns;

use App\Enums\OrderSource;
use App\Models\Client;
use App\Models\Order;
use App\Services\ReferralService;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Validation\Rule;

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
        ];
    }
}
