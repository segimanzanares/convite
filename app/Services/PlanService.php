<?php

namespace App\Services;

use App\Enums\PlanFeature;
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
     * The plans offered to new clients, as shown on the landing page.
     *
     * @return Collection<int, Plan>
     */
    public function offered(): Collection
    {
        return Plan::query()->offered()->get();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Plan
    {
        return Plan::create($data);
    }

    /**
     * Update a plan. Orders already sold keep the conditions they were sold with.
     *
     * @param  array<string, mixed>  $data
     */
    public function update(Plan $plan, array $data): Plan
    {
        $plan->update($data);

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
