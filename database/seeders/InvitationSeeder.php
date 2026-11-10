<?php

namespace Database\Seeders;

use App\Models\Invitation;
use Illuminate\Database\Seeder;

class InvitationSeeder extends Seeder
{
    /**
     * Seed the invitations that already have a template under
     * resources/js/invitations/. Safe to re-run: rows are matched by slug.
     */
    public function run(): void
    {
        $invitations = [
            [
                'slug' => 'demo',
                'template' => 'demo',
                'title' => 'Mariana & Alejandro — Nuestra Boda',
                'description' => 'Acompáñanos a celebrar la boda de Mariana & Alejandro.',
                'og_image' => '/invitations/demo/og-image.jpg',
            ],
            [
                'slug' => 'demo-xv',
                'template' => 'demo-xv',
                'title' => 'Sofía Valentina — Mis XV Años',
                'description' => 'Una noche en el jardín encantado: acompáñame a celebrar mis XV años.',
                'og_image' => '/invitations/demo-xv/og-image.jpg',
            ],
            [
                'slug' => 'mati-nayith',
                'template' => 'matilde-nayith',
                'title' => 'Matilde & Nayith — Nuestra Boda',
                'description' => 'Acompáñanos a celebrar la boda de Matilde & Nayith.',
                'og_image' => '/invitations/matilde-nayith/og-image.jpg',
            ],
            [
                'slug' => 'flora',
                'template' => 'flora',
                'title' => 'Lucila Santos — 76 años',
                'description' => 'Acompáñanos a celebrar el cumpleaños número 76 de la Sra. Lucila Santos.',
                'og_image' => '/invitations/flora/og-image.jpg',
            ],
        ];

        foreach ($invitations as $invitation) {
            Invitation::updateOrCreate(['slug' => $invitation['slug']], $invitation);
        }
    }
}
