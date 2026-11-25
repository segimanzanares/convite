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
                'template' => 'baby-shower-lluvia',
                'title' => 'Daniela — Baby shower de Emilia',
                'description' => 'Se viene una lluvia de amor para Emilia: acompaña a Daniela en su baby shower.',
                'og_image' => '/invitations/baby-shower-lluvia/og-image.jpg',
            ],
            [
                'template' => 'baby-shower-patito',
                'title' => 'Karla & Iván — Baby shower',
                'description' => 'Un patito viene en camino: celebra con Karla e Iván la llegada de su bebé.',
                'og_image' => '/invitations/baby-shower-patito/og-image.jpg',
            ],
            [
                'template' => 'baby-shower-safari',
                'title' => 'Valeria & Andrés — Baby shower',
                'description' => 'Una pequeña gran aventura está por comenzar: celebra con Valeria y Andrés la llegada de Santiago.',
                'og_image' => '/invitations/baby-shower-safari/og-image.jpg',
            ],
            [
                'template' => 'baby-shower-tendedero',
                'title' => 'Regina & Pablo — Baby shower',
                'description' => 'Ya tendieron su ropita: ayuda a Regina y Pablo a preparar el nido para su bebé.',
                'og_image' => '/invitations/baby-shower-tendedero/og-image.jpg',
            ],
            [
                'template' => 'bautizo-celeste',
                'title' => 'Emiliano José — Mi Bautizo',
                'description' => 'Emiliano será bautizado y quiere que estés ahí para celebrarlo.',
                'og_image' => '/invitations/bautizo-celeste/og-image.jpg',
            ],
            [
                'template' => 'bautizo-luz',
                'title' => 'Julieta María — Mi Bautizo',
                'description' => 'Acompáñanos a encender la luz de Julieta en su bautizo.',
                'og_image' => '/invitations/bautizo-luz/og-image.jpg',
            ],
            [
                'template' => 'bautizo-nube',
                'title' => 'Leonardo Daniel — Mi Bautizo',
                'description' => 'Un regalito del cielo llegó a la familia: celebra el bautizo de Leo con nosotros.',
                'og_image' => '/invitations/bautizo-nube/og-image.jpg',
            ],
            [
                'template' => 'bautizo-olivo',
                'title' => 'Ana Lucía — Mi Bautizo',
                'description' => 'Con amor y fe, te invitamos al bautizo de Ana Lucía.',
                'og_image' => '/invitations/bautizo-olivo/og-image.jpg',
            ],
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
                'template' => 'boda-serena',
                'title' => 'Lucía & Mateo — Nos casamos',
                'description' => 'Lucía y Mateo se casan y quieren celebrarlo contigo.',
                'og_image' => '/invitations/boda-serena/og-image.jpg',
            ],
            [
                'template' => 'cumpleanos-floral',
                'title' => 'Carmen Ruiz — 70 años',
                'description' => 'Acompáñanos a celebrar el cumpleaños número 70 de Carmen Ruiz.',
                'og_image' => '/invitations/cumpleanos-floral/og-image.jpg',
            ],
            [
                'template' => 'cumpleanos-reserva',
                'title' => 'Roberto Méndez — 50 años',
                'description' => 'Acompáñanos a brindar por los 50 años de Roberto Méndez.',
                'og_image' => '/invitations/cumpleanos-reserva/og-image.jpg',
            ],
            [
                'template' => 'cumpleanos-confeti',
                'title' => 'Valentina Ortega — 30 años',
                'description' => 'Valentina cumple 30 y quiere celebrarlo contigo.',
                'og_image' => '/invitations/cumpleanos-confeti/og-image.jpg',
            ],
            [
                'template' => 'cumpleanos-grafito',
                'title' => 'Diego Herrera — 40 años',
                'description' => 'Diego cumple 40 y estás en la lista.',
                'og_image' => '/invitations/cumpleanos-grafito/og-image.jpg',
            ],
            [
                'template' => 'infantil-dino',
                'title' => 'Santiago cumple 5 — Fiesta jurásica',
                'description' => '¡Rawr! Santiago cumple 5 y te invita a su fiesta jurásica.',
                'og_image' => '/invitations/infantil-dino/og-image.jpg',
            ],
            [
                'template' => 'infantil-dulce',
                'title' => 'Regina cumple 4 — Una fiesta dulcecita',
                'description' => 'Regina cumple 4 y quiere compartir el pastel contigo.',
                'og_image' => '/invitations/infantil-dulce/og-image.jpg',
            ],
            [
                'template' => 'infantil-espacial',
                'title' => 'Mateo cumple 7 — Misión espacial',
                'description' => '¡Despegamos! Acompaña a Mateo a celebrar sus 7 años.',
                'og_image' => '/invitations/infantil-espacial/og-image.jpg',
            ],
            [
                'template' => 'infantil-unicornio',
                'title' => 'Isabella cumple 6 — Una fiesta mágica',
                'description' => 'Isabella cumple 6 y quiere celebrarlo contigo.',
                'og_image' => '/invitations/infantil-unicornio/og-image.jpg',
            ],
            [
                'template' => 'revelacion-dulce',
                'title' => 'Mariel & Javier — ¿Niño o niña?',
                'description' => 'La respuesta está dentro del pastel: acompaña a Mariel y Javier a descubrir si su bebé es niño o niña.',
                'og_image' => '/invitations/revelacion-dulce/og-image.jpg',
            ],
            [
                'template' => 'revelacion-estrellas',
                'title' => 'Andrea & Tomás — ¿Niño o niña?',
                'description' => 'Una cigüeña viene en camino: descubre con Andrea y Tomás si su bebé es niño o niña.',
                'og_image' => '/invitations/revelacion-estrellas/og-image.jpg',
            ],
            [
                'template' => 'revelacion-globos',
                'title' => 'Fernanda & Diego — ¿Niño o niña?',
                'description' => 'Revienta el globo con Fernanda y Diego y descubre si su bebé es niño o niña.',
                'og_image' => '/invitations/revelacion-globos/og-image.jpg',
            ],
            [
                'template' => 'revelacion-osito',
                'title' => 'Paulina & Rodrigo — ¿Osito u osita?',
                'description' => 'Paulina y Rodrigo te invitan a descubrir si su bebé es niño o niña.',
                'og_image' => '/invitations/revelacion-osito/og-image.jpg',
            ],
            [
                'template' => 'xv-aurora',
                'title' => 'Renata Isabel — Mis XV Años',
                'description' => 'Renata cumple quince y quiere celebrarlo contigo.',
                'og_image' => '/invitations/xv-aurora/og-image.jpg',
            ],
            [
                'template' => 'xv-celestial',
                'title' => 'Camila Fernanda — Mis XV Años',
                'description' => 'Una noche bajo las estrellas: acompáñame a celebrar mis XV años.',
                'og_image' => '/invitations/xv-celestial/og-image.jpg',
            ],
            [
                'template' => 'xv-disco',
                'title' => 'Ximena Alejandra — Mis XV Años',
                'description' => 'Ximena cumple quince y la pista es tuya: ven a bailar a su noche disco.',
                'og_image' => '/invitations/xv-disco/og-image.jpg',
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
