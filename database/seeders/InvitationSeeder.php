<?php

namespace Database\Seeders;

use App\Models\Invitation;
use Illuminate\Database\Seeder;

class InvitationSeeder extends Seeder
{
    /**
     * Seed one demo invitation per template, at the template's own slug (/i/boda-clasica...), with the content of
     * database/seeders/data/invitations/<template>.php. Safe to re-run: rows are matched by slug.
     */
    public function run(): void
    {
        $invitations = [
            [
                'template' => 'boda-clasica',
                'title' => 'Mariana & Alejandro — Nuestra Boda',
                'description' => 'Acompáñanos a celebrar la boda de Mariana & Alejandro.',
                'og_image' => '/invitations/boda-clasica/og-image.jpg',
            ],
            [
                'template' => 'boda-floral',
                'title' => 'Daniela & Sebastián — Nuestra Boda',
                'description' => 'Acompáñanos a celebrar la boda de Daniela & Sebastián.',
                'og_image' => '/invitations/boda-floral/og-image.jpg',
            ],
            [
                'template' => 'boda-moderna',
                'title' => 'Valeria & Andrés — Nuestra Boda',
                'description' => 'Acompáñanos a celebrar la boda de Valeria & Andrés.',
                'og_image' => '/invitations/boda-moderna/og-image.jpg',
            ],
            [
                'template' => 'cumpleanos-floral',
                'title' => 'Carmen Ruiz — 70 años',
                'description' => 'Acompáñanos a celebrar el cumpleaños número 70 de Carmen Ruiz.',
                'og_image' => '/invitations/cumpleanos-floral/og-image.jpg',
            ],
            [
                'template' => 'xv-jardin',
                'title' => 'Sofía Valentina — Mis XV Años',
                'description' => 'Una noche en el jardín encantado: acompáñame a celebrar mis XV años.',
                'og_image' => '/invitations/xv-jardin/og-image.jpg',
            ],
        ];

        foreach ($invitations as $invitation) {
            $content = require __DIR__."/data/invitations/{$invitation['template']}.php";

            Invitation::updateOrCreate(['slug' => $invitation['template']], [...$invitation, ...$content]);
        }
    }
}
