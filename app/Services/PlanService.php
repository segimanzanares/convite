<?php

namespace App\Services;

use App\Enums\PlanFeature;
use App\Enums\PlanType;
use App\Models\Plan;
use Illuminate\Database\Eloquent\Collection;

class PlanService
{
    /**
     * Every plan in the order they are shown, with the number of orders that use each one.
     *
     * @return Collection<int, Plan>
     */
    public function all(): Collection
    {
        return Plan::query()->withCount('orders')->orderBy('sort_order')->orderBy('price')->get();
    }

    /**
     * The plans of web invitations offered to new clients, as shown on the landing page's pricing.
     *
     * @return Collection<int, Plan>
     */
    public function offered(): Collection
    {
        return Plan::query()->offered()->where('type', PlanType::WebInvitation)->get();
    }

    /**
     * The services offered to new clients (every type but the web invitation), as the options of each one on the
     * services page and its summary on the landing page.
     *
     * @return Collection<int, Plan>
     */
    public function offeredServices(): Collection
    {
        return Plan::query()->offered()->where('type', '!=', PlanType::WebInvitation)->get();
    }

    /**
     * Keep only what the plan's type uses: the services have no features nor guest limits, and their details drop
     * blank lines.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function normalize(array $data): array
    {
        $data['details'] = array_values(array_filter($data['details'] ?? [], 'filled')) ?: null;

        if (($data['type'] ?? null) !== PlanType::WebInvitation->value) {
            $data = [...$data, 'features' => [], 'max_guests' => null, 'max_seats_per_guest' => null];
        }

        return $data;
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Plan
    {
        return Plan::create($this->normalize($data));
    }

    /**
     * Update a plan. Orders already sold keep the conditions they were sold with.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(Plan $plan, array $data): Plan
    {
        $plan->update($this->normalize($data));

        return $plan;
    }

    /**
     * Delete a plan that was never sold. A plan with orders can only be deactivated, so this returns false for it.
     */
    public function delete(Plan $plan): bool
    {
        if ($plan->orders()->exists()) {
            return false;
        }

        return (bool) $plan->delete();
    }

    /**
     * The features a plan can include.
     *
     * @return list<string>
     */
    public function features(): array
    {
        return array_column(PlanFeature::cases(), 'value');
    }
}
