<?php

/*
| Content of the xv-aurora demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource). The portraits come from the xv-jardin demo and the venue photos from the wedding
| demo.
*/

$image = fn (string $file): string => "/invitations/xv-aurora/images/{$file}";

return [
    'event_date' => '2027-04-24',
    'event_time' => '17:00',
    'rsvp_deadline' => '2027-04-05',
    'content' => [
        'name' => 'Renata Isabel',
        'first_name' => 'Renata',
        'age' => 15,
        'hosts' => 'Con cariño, Renata',
        'monogram' => 'RI',
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/xv-aurora/music.mp3',
        'hero_photo' => '/invitations/xv-jardin/images/portada.jpg',
        'closing_message' => 'Hoy cierro un capítulo y abro otro lleno de sueños. Gracias por estar aquí para verlo comenzar.',
        'tagline' => 'Gracias por ser parte de mis quince',
        'story' => [
            'eyebrow' => 'Mi historia',
            'title' => 'Quince años de sueños',
            'opening' => 'Querida familia, queridos amigos:',
            'paragraphs' => [
                'Parece que fue ayer cuando soñaba con este día, imaginando el vestido, la música y a todas las personas que quiero reunidas en un mismo lugar.',
                'Estos quince años han estado llenos de risas, aprendizajes y abrazos que me hicieron quien soy. Cada uno de ustedes tiene un pedacito de mi historia.',
                'Ahora quiero que me acompañen a empezar la siguiente página, con una fiesta llena de color, baile y momentos que no vamos a olvidar.',
            ],
            'signature' => 'Renata',
            'photo' => '/invitations/xv-jardin/images/historia.jpg',
        ],
        'parents' => [
            'role' => 'Mis papás',
            'names' => ['Daniela Herrera Vega', 'Rodrigo Castillo Mora'],
        ],
        'godparents' => [
            ['role' => 'Padrinos de velación', 'names' => ['Lorena Vega', 'Iván Vega']],
            ['role' => 'Madrina de ramo', 'names' => ['Alejandra Mora']],
        ],
        'venues' => [
            [
                'icon' => '⛪',
                'tag' => 'Misa',
                'name' => 'Parroquia de Santa Cecilia',
                'address_lines' => ['Calle Jacarandas 120', 'Col. Las Flores, Villa del Mar'],
                'time' => '17:00 hrs',
                'latitude' => 15.861208,
                'longitude' => -97.065710,
                'image' => '/invitations/boda-clasica/images/catedral.jpg',
            ],
            [
                'icon' => '💜',
                'tag' => 'Recepción',
                'name' => 'Salón Aurora Boreal',
                'address_lines' => ['Blvd. Costero 845', 'Zona Dorada, Villa del Mar'],
                'time' => '19:00 hrs',
                'latitude' => 15.862436,
                'longitude' => -97.071639,
                'image' => '/invitations/boda-clasica/images/salon.jpeg',
            ],
        ],
        'program' => [
            ['time' => '19:00 hrs', 'icon' => '🥂', 'title' => 'Recepción', 'description' => 'Bienvenida con bocadillos y mesa de dulces.'],
            ['time' => '20:00 hrs', 'icon' => '👑', 'title' => 'Mi entrada', 'description' => 'Comienza la noche que tanto soñé.'],
            ['time' => '20:30 hrs', 'icon' => '💃', 'title' => 'Vals y coreografía', 'description' => 'Con mi papá y mis chambelanes.'],
            ['time' => '21:15 hrs', 'icon' => '🍽️', 'title' => 'Cena', 'description' => 'Un menú especial para compartir.'],
            ['time' => '22:30 hrs', 'icon' => '🎂', 'title' => 'Brindis y pastel', 'description' => 'Unas palabras de mi familia y un momento dulce.'],
            ['time' => '23:00 hrs', 'icon' => '🎶', 'title' => '¡Fiesta!', 'description' => 'Música, pista y mucha diversión.'],
        ],
        'gallery' => [
            ['image' => $image('01.svg'), 'alt' => 'Foto 1', 'caption' => 'Mi primer cumpleaños'],
            ['image' => $image('02.svg'), 'alt' => 'Foto 2', 'caption' => 'Con mi hermano'],
            ['image' => $image('03.svg'), 'alt' => 'Foto 3', 'caption' => 'Mis amigas de siempre'],
            ['image' => $image('04.svg'), 'alt' => 'Foto 4', 'caption' => 'El viaje de fin de curso'],
            ['image' => $image('05.svg'), 'alt' => 'Foto 5', 'caption' => 'Ensayando el vals'],
            ['image' => $image('06.svg'), 'alt' => 'Foto 6', 'caption' => 'Lista para mis XV'],
        ],
        'dress_code' => [
            'type' => 'Formal',
            'description' => 'Te sugerimos tonos pastel o neutros para acompañar la paleta de la noche.',
            'men' => 'Traje',
            'women' => 'Vestido largo o de cóctel',
            'reserved_color' => [
                'name' => 'Lila',
                'hex' => '#A78BFA',
                'description' => 'es el color de la quinceañera; te pedimos evitarlo.',
            ],
        ],
        'gifts' => [
            [
                'kind' => 'registry',
                'title' => 'Mesa de regalos',
                'description' => 'Elige un detalle de mi lista en Liverpool.',
                'link_url' => 'https://mesaderegalos.liverpool.com.mx/',
                'link_label' => 'Ver mi mesa de regalos',
            ],
            [
                'kind' => 'bank',
                'title' => 'Transferencia',
                'details' => [
                    ['label' => 'Banco', 'value' => 'Banorte'],
                    ['label' => 'Titular', 'value' => 'Daniela Herrera Vega'],
                    ['label' => 'Cuenta', 'value' => '4915 6610 2233 4455'],
                ],
                'copy_value' => '4915661022334455',
            ],
            [
                'kind' => 'envelope',
                'title' => 'Lluvia de sobres',
                'description' => 'El día de la fiesta habrá un buzón a la entrada.',
            ],
        ],
    ],
];
