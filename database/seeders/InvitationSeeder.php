<?php

namespace Database\Seeders;

use App\Models\Invitation;
use Illuminate\Database\Seeder;

class InvitationSeeder extends Seeder
{
    /**
     * Seed the demo invitations, with the content of database/seeders/data/invitations/<template>.php. Safe to
     * re-run: rows are matched by slug.
     */
    public function run(): void
    {
        $invitations = [
            [
                'slug' => 'demo',
                'template' => 'boda-clasica',
                'title' => 'Mariana & Alejandro — Nuestra Boda',
                'description' => 'Acompáñanos a celebrar la boda de Mariana & Alejandro.',
                'og_image' => '/invitations/boda-clasica/og-image.jpg',
            ],
            [
                'slug' => 'demo-xv',
                'template' => 'xv-jardin',
                'title' => 'Sofía Valentina — Mis XV Años',
                'description' => 'Una noche en el jardín encantado: acompáñame a celebrar mis XV años.',
                'og_image' => '/invitations/xv-jardin/og-image.jpg',
            ],
            [
                'slug' => 'mati-nayith',
                'template' => 'boda-floral',
                'title' => 'Matilde & Nayith — Nuestra Boda',
                'description' => 'Acompáñanos a celebrar la boda de Matilde & Nayith.',
                'og_image' => '/invitations/boda-floral/og-image.jpg',
            ],
            [
                'slug' => 'flora',
                'template' => 'cumpleanos-floral',
                'title' => 'Lucila Santos — 76 años',
                'description' => 'Acompáñanos a celebrar el cumpleaños número 76 de la Sra. Lucila Santos.',
                'og_image' => '/invitations/cumpleanos-floral/og-image.jpg',
            ],
        ];

        foreach ($invitations as $invitation) {
            $content = require __DIR__."/data/invitations/{$invitation['template']}.php";

            Invitation::updateOrCreate(['slug' => $invitation['slug']], [...$invitation, ...$content]);
        }
    }
}
