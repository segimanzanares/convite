<?php

/*
| Content of the xv-celestial demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource). The portraits come from the xv-jardin demo and the venue photos from the wedding
| demo.
*/

$image = fn (string $file): string => "/invitations/xv-celestial/images/{$file}";

return [
    'event_date' => '2027-09-18',
    'event_time' => '18:00',
    'rsvp_deadline' => '2027-09-01',
    'content' => [
        'name' => 'Camila Fernanda',
        'first_name' => 'Camila',
        'age' => 15,
        'hosts' => 'Con cariño, Camila',
        'monogram' => 'CF',
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/xv-celestial/music.mp3',
        'hero_photo' => '/invitations/xv-jardin/images/portada.jpg',
        'closing_message' => '…pediré un deseo al cielo: que esta noche brille para siempre en la memoria de todos los que la compartimos.',
        'tagline' => 'Una noche escrita en las estrellas',
        'story' => [
            'eyebrow' => 'Capítulo XV · Mi cielo',
            'title' => 'Quince vueltas al sol',
            'opening' => 'Había una vez una estrella…',
            'paragraphs' => [
                'Desde pequeña me gustaba mirar el cielo de noche y buscar figuras entre las estrellas. Mi papá me enseñó sus nombres y mi mamá me enseñó a pedirles deseos. Uno de ellos siempre fue este: celebrar mis quince rodeada de las personas que más quiero.',
                'Cada uno de ustedes es una estrella de mi constelación. Algunos me han acompañado desde el primer día y otros llegaron después, pero todos han iluminado algún momento de mi camino.',
                'Por eso quiero que estés conmigo en una noche bajo las estrellas, para brindar, bailar y guardar este recuerdo para siempre.',
            ],
            'signature' => 'Con cariño, Camila',
            'photo' => '/invitations/xv-jardin/images/historia.jpg',
        ],
        'parents' => [
            'role' => 'Mis papás',
            'names' => ['Gabriela Ortiz Luna', 'Jorge Navarro Peña'],
        ],
        'godparents' => [
            ['role' => 'Padrinos de velación', 'names' => ['Patricia Luna', 'Arturo Luna']],
            ['role' => 'Padrinos de medalla', 'names' => ['Verónica Peña', 'Héctor Salas']],
        ],
        'venues' => [
            [
                'icon' => '⛪',
                'tag' => 'Misa de acción de gracias',
                'name' => 'Templo de Nuestra Señora de la Luz',
                'address_lines' => ['Av. de las Estrellas 58', 'Col. Mirador, Villa del Mar'],
                'time' => '18:00 hrs',
                'latitude' => 15.861208,
                'longitude' => -97.065710,
                'image' => '/invitations/boda-clasica/images/catedral.jpg',
            ],
            [
                'icon' => '🌙',
                'tag' => 'Recepción',
                'name' => 'Terraza Mirador del Cielo',
                'address_lines' => ['Carretera Escénica km 7', 'Lomas del Faro, Villa del Mar'],
                'time' => '19:30 hrs',
                'latitude' => 15.862436,
                'longitude' => -97.071639,
                'image' => '/invitations/boda-clasica/images/salon.jpeg',
            ],
        ],
        'program' => [
            ['time' => '19:30 hrs', 'icon' => '🥂', 'title' => 'Bienvenida', 'description' => 'Un brindis bajo las primeras estrellas.'],
            ['time' => '20:15 hrs', 'icon' => '✨', 'title' => 'Mi entrada', 'description' => 'El momento en que la noche se ilumina.'],
            ['time' => '20:45 hrs', 'icon' => '💃', 'title' => 'Vals', 'description' => 'Con mi papá, mis padrinos y mis chambelanes.'],
            ['time' => '21:30 hrs', 'icon' => '🍽️', 'title' => 'Cena', 'description' => 'Una cena para compartir con calma.'],
            ['time' => '22:45 hrs', 'icon' => '🎂', 'title' => 'Pastel y deseos', 'description' => 'Apagaré las velas y pediré un deseo.'],
            ['time' => '23:00 hrs', 'icon' => '🌌', 'title' => 'Fiesta bajo las estrellas', 'description' => 'A bailar hasta que salga el sol.'],
        ],
        'gallery' => [
            ['image' => $image('01.svg'), 'alt' => 'Foto 1', 'caption' => 'Mi primera noche de estrellas'],
            ['image' => $image('02.svg'), 'alt' => 'Foto 2', 'caption' => 'Con mis papás'],
            ['image' => $image('03.svg'), 'alt' => 'Foto 3', 'caption' => 'Mis mejores amigas'],
            ['image' => $image('04.svg'), 'alt' => 'Foto 4', 'caption' => 'Vacaciones en la playa'],
            ['image' => $image('05.svg'), 'alt' => 'Foto 5', 'caption' => 'Pidiendo deseos'],
            ['image' => $image('06.svg'), 'alt' => 'Foto 6', 'caption' => 'Quince vueltas al sol'],
        ],
        'dress_code' => [
            'type' => 'Formal',
            'description' => 'Te sugerimos vestir de gala, en tonos de noche: azules, plata y lavanda.',
            'men' => 'Traje oscuro',
            'women' => 'Vestido largo',
            'reserved_color' => [
                'name' => 'Lila plateado',
                'hex' => '#B9B2E6',
                'description' => 'está reservado para la quinceañera; te pedimos evitarlo.',
            ],
        ],
        'gifts' => [
            [
                'kind' => 'envelope',
                'title' => 'Lluvia de sobres',
                'description' => 'A la entrada habrá un buzón para tu sobre.',
            ],
            [
                'kind' => 'bank',
                'title' => 'Transferencia',
                'details' => [
                    ['label' => 'Banco', 'value' => 'Santander'],
                    ['label' => 'Titular', 'value' => 'Gabriela Ortiz Luna'],
                    ['label' => 'Cuenta', 'value' => '5579 0901 2345 6789'],
                ],
                'copy_value' => '5579090123456789',
            ],
        ],
    ],
];
