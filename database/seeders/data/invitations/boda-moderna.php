<?php

/*
| Content of the modern wedding demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource). The photos and music are shared with the classic wedding demo.
*/

$image = fn (string $file): string => "/invitations/boda-clasica/images/{$file}";

return [
    'event_date' => '2027-09-18',
    'event_time' => '17:00',
    'rsvp_deadline' => '2027-08-28',
    'content' => [
        'names' => ['Valeria', 'Andrés'],
        'families' => 'Familia Castillo & Familia Navarro',
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/boda-clasica/music.mp3',
        'cover' => $image('05.jpeg'),
        'message' => 'Después de tantos momentos compartidos, decidimos dar el siguiente paso. Nos encantaría que nos acompañes a celebrar el día en que diremos «sí, acepto».',
        'tagline' => 'Gracias por ser parte de nuestra historia.',
        'venues' => [
            [
                'icon' => '💍',
                'tag' => 'Ceremonia',
                'name' => 'Capilla de Santa Lucía',
                'address_lines' => ['Av. de los Fresnos 85', 'Centro Histórico, Villa del Mar'],
                'time' => '17:00 hrs',
                'latitude' => 15.861208,
                'longitude' => -97.065710,
                'image' => $image('catedral.jpg'),
            ],
            [
                'icon' => '🥂',
                'tag' => 'Recepción',
                'name' => 'Terraza Mirador',
                'address_lines' => ['Paseo del Faro 1200', 'Col. Las Palmas, Villa del Mar'],
                'time' => '19:00 hrs',
                'latitude' => 15.862436,
                'longitude' => -97.071639,
                'image' => $image('salon.jpeg'),
            ],
        ],
        'program' => [
            ['time' => '17:00 hrs', 'icon' => '💍', 'title' => 'Ceremonia', 'description' => 'Nos daremos el «sí» en la Capilla de Santa Lucía.'],
            ['time' => '19:00 hrs', 'icon' => '🥂', 'title' => 'Cóctel de bienvenida', 'description' => 'Un brindis al atardecer en la Terraza Mirador.'],
            ['time' => '20:00 hrs', 'icon' => '🍽️', 'title' => 'Cena', 'description' => 'Menú de tres tiempos para celebrar juntos.'],
            ['time' => '21:30 hrs', 'icon' => '💃', 'title' => 'Primer baile', 'description' => 'Abriremos la pista como esposos.'],
            ['time' => '22:00 hrs', 'icon' => '🪩', 'title' => 'Fiesta', 'description' => 'Música y baile hasta el final de la noche.'],
        ],
        'gallery' => [
            ['image' => $image('01.jpeg'), 'alt' => 'Foto 1', 'caption' => 'El comienzo'],
            ['image' => $image('02.jpeg'), 'alt' => 'Foto 2', 'caption' => 'La sesión'],
            ['image' => $image('03.jpeg'), 'alt' => 'Foto 3', 'caption' => 'La complicidad'],
            ['image' => $image('04.jpeg'), 'alt' => 'Foto 4', 'caption' => 'La emoción'],
            ['image' => $image('06.jpeg'), 'alt' => 'Foto 5', 'caption' => 'Las miradas'],
            ['image' => $image('07.jpeg'), 'alt' => 'Foto 6', 'caption' => 'La promesa'],
        ],
        'dress_code' => [
            'type' => 'Formal',
            'description' => 'Queremos verte elegante y cómodo para bailar toda la noche.',
            'men' => 'Traje oscuro',
            'women' => 'Vestido largo o cóctel',
            'reserved_color' => [
                'name' => 'Blanco',
                'hex' => '#FFFFFF',
                'description' => 'está reservado para la novia.',
            ],
        ],
        'swatches' => [
            ['hex' => '#18181B', 'label' => 'Carbón'],
            ['hex' => '#52525B', 'label' => 'Grafito'],
            ['hex' => '#A1A1AA', 'label' => 'Plata'],
            ['hex' => '#D4D4D8', 'label' => 'Niebla'],
            ['hex' => '#E7E5E4', 'label' => 'Piedra'],
            ['hex' => '#1E3A5F', 'label' => 'Marino'],
        ],
        'gifts' => [
            [
                'kind' => 'bank',
                'title' => 'Transferencia',
                'description' => 'Si prefieres, puedes hacernos una transferencia.',
                'details' => [
                    ['label' => 'Banco', 'value' => 'Banco Ejemplo'],
                    ['label' => 'Titular', 'value' => 'Valeria Castillo'],
                    ['label' => 'CLABE', 'value' => '012 345 678901234567'],
                ],
                'copy_value' => '012345678901234567',
            ],
            [
                'kind' => 'registry',
                'title' => 'Mesa de regalos',
                'description' => 'También puedes elegir un detalle de nuestra mesa de regalos.',
                'details' => [['label' => 'Número de evento', 'value' => '51234569']],
                'link_url' => 'https://mesaderegalos.liverpool.com.mx/',
                'link_label' => 'Ver mesa de regalos',
            ],
        ],
    ],
];
