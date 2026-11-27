<?php

namespace Database\Seeders;

use App\Enums\PlanFeature;
use App\Enums\PlanType;
use App\Models\Plan;
use Illuminate\Database\Seeder;

class PlanSeeder extends Seeder
{
    /**
     * Seed the initial catalog of web invitations. Prices and limits are placeholders meant to be edited from the
     * panel. The services of /servicios are created by a migration (create_service_plans).
     */
    public function run(): void
    {
        $catalogFeatures = array_values(array_filter(
            PlanFeature::cases(),
            fn (PlanFeature $feature): bool => ! in_array($feature, [PlanFeature::CustomDesign, PlanFeature::CheckIn, PlanFeature::LiveGallery], true),
        ));

        $plans = [
            [
                'slug' => 'basico',
                'type' => PlanType::WebInvitation,
                'name' => 'Básico',
                'price' => 499,
                'description' => 'Elijan un diseño de nuestro catálogo y lo personalizamos con los datos de su evento.',
                'max_guests' => null,
                'max_seats_per_guest' => null,
                'features' => [],
                'sort_order' => 1,
            ],
            [
                'slug' => 'estandar',
                'type' => PlanType::WebInvitation,
                'name' => 'Estándar',
                'price' => 799,
                'description' => 'Todo lo del plan Básico, más tarjeta y pases imprimibles.',
                'max_guests' => null,
                'max_seats_per_guest' => null,
                'features' => [PlanFeature::PrintCard, PlanFeature::GuestPasses],
                'sort_order' => 2,
            ],
            [
                'slug' => 'premium',
                'type' => PlanType::WebInvitation,
                'name' => 'Premium',
                'price' => 1599,
                'description' => 'Todo lo del plan Estándar, más lista de invitados con enlaces personalizados, confirmaciones en línea y libro de buenos deseos descargable en PDF.',
                'max_guests' => 150,
                'max_seats_per_guest' => 10,
                'features' => $catalogFeatures,
                'sort_order' => 3,
            ],
            [
                'slug' => 'exclusivo',
                'type' => PlanType::WebInvitation,
                'name' => 'Exclusivo',
                'price' => 3499,
                'description' => 'Todo lo del plan Premium sin límite de invitados, con un diseño creado solo para su evento, registro de llegadas en la entrada y galería de fotos en vivo.',
                'max_guests' => null,
                'max_seats_per_guest' => null,
                'features' => PlanFeature::cases(),
                'sort_order' => 4,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::updateOrCreate(['slug' => $plan['slug']], $plan);
        }
    }
}
