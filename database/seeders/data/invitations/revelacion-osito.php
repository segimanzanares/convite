<?php

/*
| Content of the revelacion-osito demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource), which keeps the answer secret. The venue photo comes from the wedding demo.
*/

$image = fn (string $file): string => "/invitations/revelacion-osito/images/{$file}";

return [
    'event_date' => '2027-05-22',
    'event_time' => '13:00',
    'rsvp_deadline' => '2027-05-08',
    'content' => [
        'names' => ['Paulina', 'Rodrigo'],
        'families' => 'Familia Herrera Campos',
        'due_label' => 'Llega en octubre de 2027',
        'baby_names' => ['girl' => 'Emilia', 'boy' => 'Mateo'],
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/revelacion-osito/music.mp3',
        'message' => 'Muy pronto conoceremos a nuestro osito… ¿o será osita? Queremos que estés con nosotros cuando lo descubramos.',
        'closing_message' => 'Gracias por acompañarnos con tanto cariño. Sea osito u osita, ya tiene una familia que lo espera con los brazos abiertos.',
        'tagline' => 'Con cariño, Paulina y Rodrigo',
        'grandparents' => [
            ['role' => 'Abuelos maternos', 'names' => ['Teresa Campos', 'Jorge Campos']],
            ['role' => 'Abuelos paternos', 'names' => ['Silvia Herrera', 'Manuel Herrera']],
        ],
        'venues' => [
            [
                'icon' => '🧸',
                'tag' => 'Brunch',
                'name' => 'Casa de Campo El Encino',
                'address_lines' => ['Camino Real 45', 'San Pedro, Villa del Mar'],
                'time' => '13:00 hrs',
                'latitude' => 15.862436,
                'longitude' => -97.071639,
                'image' => '/invitations/boda-clasica/images/salon.jpeg',
            ],
        ],
        'program' => [
            ['time' => '13:00 hrs', 'icon' => '🧸', 'title' => 'Llegada', 'description' => 'Con limonada y galletas de osito.'],
            ['time' => '13:30 hrs', 'icon' => '🥞', 'title' => 'Brunch', 'description' => 'Para empezar la tarde con calma.'],
            [
                'time' => '14:30 hrs',
                'icon' => '✍️',
                'title' => 'Consejos para los papás',
                'description' => 'Déjanos tu mejor consejo en el árbol.',
            ],
            [
                'time' => '15:30 hrs',
                'icon' => '🎁',
                'title' => 'La caja sorpresa',
                'description' => 'Al abrirla, saldrán los globos del color del bebé.',
            ],
        ],
        'gallery' => [
            ['image' => $image('01.svg'), 'alt' => 'Foto 1', 'caption' => 'Nuestra noticia'],
            ['image' => $image('02.svg'), 'alt' => 'Foto 2', 'caption' => 'La primera foto'],
            ['image' => $image('03.svg'), 'alt' => 'Foto 3', 'caption' => 'Su osito'],
            ['image' => $image('04.svg'), 'alt' => 'Foto 4', 'caption' => 'Pancita de 14 semanas'],
            ['image' => $image('05.svg'), 'alt' => 'Foto 5', 'caption' => 'Su ropita'],
            ['image' => $image('06.svg'), 'alt' => 'Foto 6', 'caption' => 'Esperándote'],
        ],
        'dress_code' => ['type' => 'Casual de día', 'description' => 'Tonos suaves; si quieres, un detalle rosa o azul según tu apuesta.'],
        'gifts' => [
            [
                'kind' => 'registry',
                'title' => 'Mesa de regalos',
                'description' => 'Algunas cositas que el bebé va a necesitar.',
                'link_url' => 'https://mesaderegalos.liverpool.com.mx/',
                'link_label' => 'Ver la lista',
            ],
            [
                'kind' => 'envelope',
                'title' => 'Lluvia de pañales',
                'description' => 'Si prefieres, trae un paquete de pañales de la etapa que quieras.',
            ],
        ],
    ],
];
