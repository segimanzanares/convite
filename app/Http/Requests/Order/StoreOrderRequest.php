<?php

namespace App\Http\Requests\Order;

use App\Concerns\OrderValidationRules;
use App\Enums\InvitationKind;
use App\Enums\OrderStatus;
use App\Enums\PlanType;
use App\Models\Order;
use App\Models\Plan;
use App\Services\InvitationService;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreOrderRequest extends FormRequest
{
    use OrderValidationRules;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('create', Order::class);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'plan_id' => ['required', 'integer', Rule::exists(Plan::class, 'id')->where('is_active', true)],
            'price' => ['required', 'numeric', 'min:0', 'max:99999999.99'],
            'status' => ['nullable', Rule::enum(OrderStatus::class)],
            'notes' => ['nullable', 'string', 'max:2000'],
            ...$this->orderSourceRules($this->route('client')),
            // A video invitation's order creates its invitation, for this event
            'event_kind' => [
                Rule::requiredIf(fn () => $this->sellsVideoInvitation()),
                'nullable',
                Rule::in(array_map(fn (InvitationKind $kind) => $kind->value, app(InvitationService::class)->videoKinds())),
            ],
            'event_date' => ['nullable', 'date_format:Y-m-d'],
            'event_time' => ['nullable', 'date_format:H:i'],
        ];
    }

    private function sellsVideoInvitation(): bool
    {
        return is_numeric($this->input('plan_id'))
            && Plan::find($this->input('plan_id'))?->type === PlanType::VideoInvitation;
    }
}
