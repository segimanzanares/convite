<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * The wishes book is part of the Premium and Exclusivo plans, including the orders already sold with them, so their
 * plan snapshots get the feature too.
 */
return new class extends Migration
{
    private const array PLAN_SLUGS = ['premium', 'exclusivo'];

    private const string FEATURE = 'wishes';

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $this->update(fn (array $features): array => in_array(self::FEATURE, $features, true)
            ? $features
            : [...$features, self::FEATURE]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $this->update(fn (array $features): array => array_values(array_diff($features, [self::FEATURE])));
    }

    /**
     * Apply the change to the features of the plans and of their orders' snapshots.
     *
     * @param  callable(list<string>): list<string>  $change
     */
    private function update(callable $change): void
    {
        $planIds = DB::table('plans')->whereIn('slug', self::PLAN_SLUGS)->pluck('id');

        foreach (DB::table('plans')->whereIn('id', $planIds)->get(['id', 'features']) as $plan) {
            DB::table('plans')->where('id', $plan->id)->update([
                'features' => json_encode($change(json_decode($plan->features, true) ?? [])),
            ]);
        }

        foreach (DB::table('orders')->whereIn('plan_id', $planIds)->get(['id', 'plan_snapshot']) as $order) {
            $snapshot = json_decode($order->plan_snapshot, true) ?? [];
            $snapshot['features'] = $change($snapshot['features'] ?? []);

            DB::table('orders')->where('id', $order->id)->update(['plan_snapshot' => json_encode($snapshot)]);
        }
    }
};
