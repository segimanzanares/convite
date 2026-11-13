<?php

/*
| Content of the candy shop kids' party demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource). It borrows cumpleanos-floral's music.
*/

$image = fn (string $file): string => "/invitations/infantil-dulce/images/{$file}";

return [
    'event_date' => '2027-06-05',
    'event_time' => '16:00',
    'rsvp_deadline' => '2027-05-26',
    'content' => [
        'name' => 'Regina López',
        'first_name' => 'Regina',
        'age' => 4,
        'hosts' => 'Con cariño, sus papás Paola y Andrés',
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/cumpleanos-floral/music.mp3',
        'message' => 'Regina cumple 4 años y lo celebraremos con una tarde llena de dulces: mesa de postres, decoración de cupcakes, juegos y mucha diversión. ¡Te esperamos para compartir el pastel!',
        'tagline' => '4 años · ¡Gracias por endulzar su cumpleaños!',
        'venues' => [
            [
                'icon' => '🍭',
                'tag' => 'Fiesta',
                'name' => 'Casa de Fiestas Caramelo',
                'address_lines' => ['Av. de las Flores 1020', 'Col. Jardines, Mérida'],
                'time' => '16:00 hrs',
                'latitude' => 21.001631,
                'longitude' => -89.616413,
            ],
        ],
        'program' => [
            ['time' => '16:00 hrs', 'icon' => '🎈', 'title' => 'Bienvenida', 'description' => 'Globos, música y una paleta para cada invitado.'],
            ['time' => '16:30 hrs', 'icon' => '🧁', 'title' => 'Taller de cupcakes', 'description' => 'Cada quien decora el suyo con betún y chispitas.'],
            ['time' => '17:30 hrs', 'icon' => '🎠', 'title' => 'Juegos y show', 'description' => 'Burbujas gigantes y un show de títeres.'],
            ['time' => '18:30 hrs', 'icon' => '🎂', 'title' => 'Pastel y piñata', 'description' => 'Las mañanitas y una piñata llena de dulces.'],
        ],
        'gallery' => [
            ['image' => $image('01.svg'), 'alt' => 'Foto 1', 'caption' => 'Bienvenida, Regina'],
            ['image' => $image('02.svg'), 'alt' => 'Foto 2', 'caption' => 'Su primer pastel'],
            ['image' => $image('03.svg'), 'alt' => 'Foto 3', 'caption' => 'En la playa'],
            ['image' => $image('04.svg'), 'alt' => 'Foto 4', 'caption' => 'Con su perrito'],
            ['image' => $image('05.svg'), 'alt' => 'Foto 5', 'caption' => 'Primer día de escuela'],
            ['image' => $image('06.svg'), 'alt' => 'Foto 6', 'caption' => '¡Ya casi 4!'],
        ],
        'gifts' => [
            [
                'kind' => 'envelope',
                'title' => 'Lluvia de sobres',
                'description' => 'Habrá un frasco de dulces gigante a la entrada para tu sobre.',
            ],
            [
                'kind' => 'bank',
                'title' => 'Transferencia',
                'description' => 'Para su alcancía de cochinito.',
                'details' => [
                    ['label' => 'Banco', 'value' => 'Banco Ejemplo'],
                    ['label' => 'Titular', 'value' => 'Paola Méndez Ruiz'],
                    ['label' => 'CLABE', 'value' => '012 345 678901234611'],
                ],
                'copy_value' => '012345678901234611',
            ],
            [
                'kind' => 'registry',
                'title' => 'Mesa de regalos',
                'description' => 'Sus juguetes favoritos.',
                'details' => [['label' => 'Número de evento', 'value' => '51234704']],
                'link_url' => 'https://mesaderegalos.liverpool.com.mx/',
                'link_label' => 'Ver mesa de regalos',
            ],
        ],
    ],
];
