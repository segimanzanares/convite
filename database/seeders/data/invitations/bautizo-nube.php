<?php

/*
| Content of the bautizo-nube demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource). The venue photos come from the wedding demo.
*/

$image = fn (string $file): string => "/invitations/bautizo-nube/images/{$file}";

return [
    'event_date' => '2027-06-12',
    'event_time' => '13:00',
    'rsvp_deadline' => '2027-05-29',
    'content' => [
        'name' => 'Leonardo Daniel',
        'first_name' => 'Leo',
        'hosts' => 'Con cariño, Sofía y Daniel',
        'monogram' => 'LD',
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/bautizo-nube/music.mp3',
        'hero_photo' => $image('portada.svg'),
        'closing_message' => 'Gracias por acompañarnos en este día tan especial y por llenar de amor el comienzo de mi camino.',
        'tagline' => 'Gracias por celebrar conmigo mi bautizo',
        'story' => [
            'eyebrow' => 'Hola, soy Leo',
            'title' => 'Un regalito del cielo',
            'opening' => '¡Hola! Te escribo desde mi cuna…',
            'paragraphs' => [
                'Bueno, en realidad me ayudaron mis papás, porque todavía no sé escribir. Lo que sí sé es reír, dormir (a veces) y llenar la casa de alegría.',
                'Pronto voy a ser bautizado y quiero que estés ahí. Habrá pastel, música y muchos abrazos, que son mis favoritos.',
            ],
            'signature' => 'Leo',
            'photo' => $image('historia.svg'),
        ],
        'parents' => [
            'role' => 'Mis papás',
            'names' => ['Sofía Martínez Gil', 'Daniel Robles Peña'],
        ],
        'godparents' => [
            ['role' => 'Mis padrinos', 'names' => ['Karla Martínez', 'Óscar Villarreal']],
            ['role' => 'Padrinos de ropón', 'names' => ['Lupita Gil', 'Arturo Gil']],
        ],
        'venues' => [
            [
                'icon' => '⛪',
                'tag' => 'Ceremonia',
                'name' => 'Parroquia del Espíritu Santo',
                'address_lines' => ['Calle Nube 12', 'Col. Las Brisas, Villa del Mar'],
                'time' => '13:00 hrs',
                'latitude' => 15.861208,
                'longitude' => -97.065710,
                'image' => '/invitations/boda-clasica/images/catedral.jpg',
            ],
            [
                'icon' => '🎈',
                'tag' => 'Fiesta',
                'name' => 'Salón Arcoíris',
                'address_lines' => ['Blvd. Costero 1200', 'Zona Dorada, Villa del Mar'],
                'time' => '15:00 hrs',
                'latitude' => 15.862436,
                'longitude' => -97.071639,
                'image' => '/invitations/boda-clasica/images/salon.jpeg',
            ],
        ],
        'program' => [
            ['time' => '13:00 hrs', 'icon' => '⛪', 'title' => 'Bautizo', 'description' => 'La ceremonia en la parroquia.'],
            ['time' => '15:00 hrs', 'icon' => '🎈', 'title' => 'Llegada a la fiesta', 'description' => 'Con mesa de dulces y área para los peques.'],
            ['time' => '15:30 hrs', 'icon' => '🍝', 'title' => 'Comida', 'description' => 'Menú para grandes y chiquitos.'],
            ['time' => '17:00 hrs', 'icon' => '🎂', 'title' => 'Pastel', 'description' => 'Y unas palabras de mis padrinos.'],
            ['time' => '17:30 hrs', 'icon' => '🫧', 'title' => 'Burbujas y juegos', 'description' => 'Para despedir la tarde.'],
        ],
        'gallery' => [
            ['image' => $image('01.svg'), 'alt' => 'Foto 1', 'caption' => 'Recién nacido'],
            ['image' => $image('02.svg'), 'alt' => 'Foto 2', 'caption' => 'Mi primer baño'],
            ['image' => $image('03.svg'), 'alt' => 'Foto 3', 'caption' => 'Con mi peluche'],
            ['image' => $image('04.svg'), 'alt' => 'Foto 4', 'caption' => 'Siesta de domingo'],
            ['image' => $image('05.svg'), 'alt' => 'Foto 5', 'caption' => 'Mis abuelitos'],
            ['image' => $image('06.svg'), 'alt' => 'Foto 6', 'caption' => '¡Tres meses!'],
        ],
        'dress_code' => [
            'type' => 'Casual de fiesta',
            'description' => 'Colores pastel: azul cielo, amarillo y verde menta.',
            'men' => 'Camisa y pantalón casual',
            'women' => 'Vestido o conjunto fresco',
        ],
        'gifts' => [
            [
                'kind' => 'registry',
                'title' => 'Mesa de regalos',
                'description' => 'Algunas cositas que me harán falta mientras crezco.',
                'link_url' => 'https://mesaderegalos.liverpool.com.mx/',
                'link_label' => 'Ver mi lista',
            ],
            [
                'kind' => 'bank',
                'title' => 'Mi alcancía',
                'description' => 'Para mis ahorros de cuando sea grande.',
                'details' => [
                    ['label' => 'Banco', 'value' => 'Santander'],
                    ['label' => 'Titular', 'value' => 'Sofía Martínez Gil'],
                    ['label' => 'CLABE', 'value' => '014 180 1234 5678 9012'],
                ],
                'copy_value' => '014180123456789012',
            ],
            [
                'kind' => 'envelope',
                'title' => 'Lluvia de sobres',
                'description' => 'Habrá una cajita a la entrada del salón.',
            ],
        ],
    ],
];
