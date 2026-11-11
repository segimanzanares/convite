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
        $plans = [
            [
                'slug' => 'basico',
                'name' => 'Básico',
                'price' => 1500,
                'description' => 'Invitación digital a medida con confirmación de asistencia por WhatsApp.',
                'max_guests' => null,
                'features' => [],
                'sort_order' => 1,
            ],
            [
                'slug' => 'estandar',
                'name' => 'Estándar',
                'price' => 2500,
                'description' => 'Todo lo del plan Básico, más lista de invitados con enlaces personalizados y confirmaciones en línea.',
                'max_guests' => 100,
                'features' => [PlanFeature::GuestManagement, PlanFeature::OnlineRsvp],
                'sort_order' => 2,
            ],
            [
                'slug' => 'premium',
                'name' => 'Premium',
                'price' => 3500,
                'description' => 'Todo lo del plan Estándar, más tarjeta y pases imprimibles.',
                'max_guests' => 250,
                'features' => PlanFeature::cases(),
                'sort_order' => 3,
            ],
        ];

        foreach ($plans as $plan) {
            Plan::firstOrCreate(['slug' => $plan['slug']], $plan);
        }
    }
}
