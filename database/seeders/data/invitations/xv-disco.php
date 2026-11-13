<?php

/*
| Content of the xv-disco demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource). The portraits come from the xv-jardin demo and the song and the venue photos from the
| wedding demo.
*/

$image = fn (string $file): string => "/invitations/xv-disco/images/{$file}";

return [
    'event_date' => '2027-11-06',
    'event_time' => '19:00',
    'rsvp_deadline' => '2027-10-20',
    'content' => [
        'name' => 'Ximena Alejandra',
        'first_name' => 'Ximena',
        'age' => 15,
        'hosts' => 'Con cariño, Ximena',
        'monogram' => 'XA',
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/boda-clasica/music.mp3',
        'hero_photo' => '/invitations/xv-jardin/images/portada.jpg',
        'closing_message' => 'Quince años se celebran una sola vez, y quiero que suenen fuerte. Gracias por venir a bailarlos conmigo.',
        'tagline' => 'Gracias por bailar conmigo mis quince',
        'story' => [
            'eyebrow' => 'Track 01 · Mi historia',
            'title' => 'La canción de mis quince',
            'opening' => 'Dale play…',
            'paragraphs' => [
                'Si mi vida tuviera banda sonora, cada uno de ustedes estaría en ella: en las canciones que cantamos a todo volumen en el coche, en las pijamadas y en los cumpleaños que bailamos hasta cansarnos.',
                'Cumplir quince es como llegar al coro de la canción: la parte que todos se saben y que se canta en grupo. Y no hay nadie con quien quiera cantarla más que contigo.',
                'Así que prepara tus mejores pasos, porque esta noche la pista es nuestra.',
            ],
            'signature' => 'Ximena',
            'photo' => '/invitations/xv-jardin/images/historia.jpg',
        ],
        'parents' => [
            'role' => 'Mis papás',
            'names' => ['Mariana Ríos Delgado', 'Eduardo Fuentes Lara'],
        ],
        'godparents' => [
            ['role' => 'Padrinos de velación', 'names' => ['Claudia Delgado', 'Raúl Delgado']],
            ['role' => 'Padrinos de música', 'names' => ['Sandra Lara', 'Óscar Ibarra']],
        ],
        'venues' => [
            [
                'icon' => '⛪',
                'tag' => 'Misa de acción de gracias',
                'name' => 'Parroquia del Sagrado Corazón',
                'address_lines' => ['Av. Reforma 310', 'Centro, Villa del Mar'],
                'time' => '19:00 hrs',
                'latitude' => 15.861208,
                'longitude' => -97.065710,
                'image' => '/invitations/boda-clasica/images/catedral.jpg',
            ],
            [
                'icon' => '🪩',
                'tag' => 'La fiesta',
                'name' => 'Salón Studio 15',
                'address_lines' => ['Calle Neón 1515', 'Distrito Arte, Villa del Mar'],
                'time' => '20:30 hrs',
                'latitude' => 15.862436,
                'longitude' => -97.071639,
                'image' => '/invitations/boda-clasica/images/salon.jpeg',
            ],
        ],
        'program' => [
            ['time' => '20:30 hrs', 'icon' => '🥂', 'title' => 'Llegada y bienvenida', 'description' => 'Alfombra, fotos y el primer brindis.'],
            ['time' => '21:00 hrs', 'icon' => '✨', 'title' => 'Mi entrada', 'description' => 'Se apagan las luces y empieza el show.'],
            ['time' => '21:20 hrs', 'icon' => '💃', 'title' => 'Vals y coreografía sorpresa', 'description' => 'Con mi papá y mis chambelanes.'],
            ['time' => '22:00 hrs', 'icon' => '🍔', 'title' => 'Cena', 'description' => 'Recarga energía para lo que sigue.'],
            ['time' => '23:00 hrs', 'icon' => '🎂', 'title' => 'Pastel', 'description' => 'Velas, deseos y fotos con todos.'],
            ['time' => '23:15 hrs', 'icon' => '🪩', 'title' => 'Pista abierta', 'description' => 'DJ, luces y baile hasta el final.'],
        ],
        'gallery' => [
            ['image' => $image('01.svg'), 'alt' => 'Foto 1', 'caption' => 'Mi primer concierto'],
            ['image' => $image('02.svg'), 'alt' => 'Foto 2', 'caption' => 'Con mi familia'],
            ['image' => $image('03.svg'), 'alt' => 'Foto 3', 'caption' => 'Mis amigas'],
            ['image' => $image('04.svg'), 'alt' => 'Foto 4', 'caption' => 'Clases de baile'],
            ['image' => $image('05.svg'), 'alt' => 'Foto 5', 'caption' => 'Karaoke de verano'],
            ['image' => $image('06.svg'), 'alt' => 'Foto 6', 'caption' => 'Lista para la pista'],
        ],
        'dress_code' => [
            'type' => 'Glam',
            'description' => 'Brillos, lentejuelas y metálicos son bienvenidos. Trae zapatos cómodos: se va a bailar.',
            'men' => 'Traje o saco con un toque metálico',
            'women' => 'Vestido de cóctel o largo, con brillo',
            'reserved_color' => [
                'name' => 'Fucsia',
                'hex' => '#E8338B',
                'description' => 'es el color de la quinceañera; te pedimos evitarlo.',
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
                    ['label' => 'Banco', 'value' => 'BBVA'],
                    ['label' => 'Titular', 'value' => 'Mariana Ríos Delgado'],
                    ['label' => 'Cuenta', 'value' => '4152 3139 8877 6655'],
                ],
                'copy_value' => '4152313988776655',
            ],
        ],
    ],
];
