<?php

namespace Database\Seeders;

use App\Enums\PlanFeature;
use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Seed the initial plan catalog. Prices and limits are placeholders meant to be edited from the panel, so
     * existing plans (matched by slug) are left untouched when this runs again.
     */
    public function run(): void
    {
        $catalogFeatures = array_values(array_filter(
            PlanFeature::cases(),
            fn (PlanFeature $feature): bool => ! in_array($feature, [PlanFeature::CustomDesign, PlanFeature::CheckIn], true),
        ));

        $plans = [
            [
                'slug' => 'basico',
                'name' => 'Básico',
                'price' => 499,
                'description' => 'Elijan un diseño de nuestro catálogo y lo personalizamos con los datos de su evento.',
                'max_guests' => null,
                'features' => [],
                'sort_order' => 1,
            ],
            [
                'slug' => 'estandar',
                'name' => 'Estándar',
                'price' => 899,
                'description' => 'Todo lo del plan Básico, más tarjeta y pases imprimibles.',
                'max_guests' => null,
                'features' => [PlanFeature::PrintCard, PlanFeature::GuestPasses],
                'sort_order' => 2,
            ],
            [
                'slug' => 'premium',
                'name' => 'Premium',
                'price' => 1599,
                'description' => 'Todo lo del plan Estándar, más lista de invitados con enlaces personalizados y confirmaciones en línea.',
                'max_guests' => 100,
                'features' => $catalogFeatures,
                'sort_order' => 3,
            ],
            [
                'slug' => 'exclusivo',
                'name' => 'Exclusivo',
                'price' => 2099,
                'description' => 'Todo lo del plan Premium sin límite de invitados, con un diseño creado solo para su evento y registro de llegadas en la entrada.',
                'max_guests' => null,
                'features' => PlanFeature::cases(),
                'sort_order' => 4,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(['slug' => $plan['slug']], $plan);
        }
    }
}
