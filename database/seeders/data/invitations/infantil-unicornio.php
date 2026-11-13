<?php

/*
| Content of the unicorn kids' party demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource). It borrows cumpleanos-floral's music.
*/

$image = fn (string $file): string => "/invitations/infantil-unicornio/images/{$file}";

return [
    'event_date' => '2027-03-13',
    'event_time' => '15:00',
    'rsvp_deadline' => '2027-03-03',
    'content' => [
        'name' => 'Isabella Torres',
        'first_name' => 'Isabella',
        'age' => 6,
        'hosts' => 'Con cariño, sus papás Mariana y Jorge',
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/cumpleanos-floral/music.mp3',
        'message' => 'Isabella cumple 6 años y queremos celebrarlo con una tarde llena de magia: arcoíris, brillantina, juegos y un pastel de unicornio. Trae tu sonrisa más brillante, ¡la fiesta no está completa sin ti!',
        'tagline' => '6 años de magia · ¡Gracias por venir!',
        'venues' => [
            [
                'icon' => '🦄',
                'tag' => 'Fiesta',
                'name' => 'Jardín Arcoíris',
                'address_lines' => ['Calle de las Hadas 58', 'Fracc. Valle Encantado, Querétaro'],
                'time' => '15:00 hrs',
                'latitude' => 20.611236,
                'longitude' => -100.402713,
            ],
        ],
        'program' => [
            ['time' => '15:00 hrs', 'icon' => '🎈', 'title' => 'Bienvenida mágica', 'description' => 'Cada invitada recibe su diadema de unicornio.'],
            ['time' => '15:30 hrs', 'icon' => '✨', 'title' => 'Taller de brillantina', 'description' => 'Pintacaritas, pulseras y mucha brillantina.'],
            ['time' => '16:30 hrs', 'icon' => '🎠', 'title' => 'Juegos y show', 'description' => 'Un show de magia y juegos en el jardín.'],
            ['time' => '17:30 hrs', 'icon' => '🎂', 'title' => 'Pastel y piñata', 'description' => 'Las mañanitas y la piñata de arcoíris.'],
        ],
        'gallery' => [
            ['image' => $image('01.svg'), 'alt' => 'Foto 1', 'caption' => 'Su primera sonrisa'],
            ['image' => $image('02.svg'), 'alt' => 'Foto 2', 'caption' => 'Primer cumpleaños'],
            ['image' => $image('03.svg'), 'alt' => 'Foto 3', 'caption' => 'Disfrazada de hada'],
            ['image' => $image('04.svg'), 'alt' => 'Foto 4', 'caption' => 'En el kínder'],
            ['image' => $image('05.svg'), 'alt' => 'Foto 5', 'caption' => 'Con sus abuelos'],
            ['image' => $image('06.svg'), 'alt' => 'Foto 6', 'caption' => '¡Ya casi 6!'],
        ],
        'gifts' => [
            [
                'kind' => 'envelope',
                'title' => 'Lluvia de sobres',
                'description' => 'Habrá un cofre mágico a la entrada para tu sobre.',
            ],
            [
                'kind' => 'registry',
                'title' => 'Mesa de regalos',
                'description' => 'Sus juguetes y libros favoritos.',
                'details' => [['label' => 'Número de evento', 'value' => '51234702']],
                'link_url' => 'https://mesaderegalos.liverpool.com.mx/',
                'link_label' => 'Ver mesa de regalos',
            ],
        ],
    ],
];
