<?php

/*
| Content of the "confeti" birthday demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource).
*/

$image = fn (string $file): string => "/invitations/cumpleanos-confeti/images/{$file}";

return [
    'event_date' => '2027-05-22',
    'event_time' => '19:30',
    'rsvp_deadline' => '2027-05-08',
    'content' => [
        'name' => 'Valentina Ortega',
        'first_name' => 'Valentina',
        'age' => 30,
        'hosts' => 'Sus amigas de siempre',
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/cumpleanos-confeti/music.mp3',
        'message' => 'Treinta años se celebran en grande. Valentina cumple 30 y no se nos ocurre mejor manera de festejarlo que rodeada de la gente que más quiere: habrá brindis, pastel, fotos y mucho, mucho baile. ¡No puedes faltar!',
        'tagline' => '30 años · Gracias por celebrar con ella',
        'venues' => [
            [
                'icon' => '🪩',
                'tag' => 'Cena & Fiesta',
                'name' => 'Salón Terraza Malva',
                'address_lines' => ['Calle de las Jacarandas 214', 'Col. Del Valle, Ciudad Jardín'],
                'time' => '19:30 hrs',
                'latitude' => 19.384212,
                'longitude' => -99.165781,
            ],
        ],
        'program' => [
            ['time' => '19:30 hrs', 'icon' => '🥂', 'title' => 'Bienvenida', 'description' => 'Un brindis de llegada y fotos en el muro de globos.'],
            ['time' => '20:30 hrs', 'icon' => '🍝', 'title' => 'Cena', 'description' => 'Una cena para ponernos al día entre amigas y familia.'],
            ['time' => '22:00 hrs', 'icon' => '🎂', 'title' => 'Pastel y mañanitas', 'description' => 'Apagamos las velas y pedimos tres deseos.'],
            ['time' => '22:30 hrs', 'icon' => '🪩', 'title' => 'A la pista', 'description' => 'DJ, karaoke y baile hasta que el cuerpo aguante.'],
        ],
        'gallery' => [
            ['image' => $image('01.svg'), 'alt' => 'Foto 1', 'caption' => 'Su primer pastel'],
            ['image' => $image('02.svg'), 'alt' => 'Foto 2', 'caption' => 'Los XV'],
            ['image' => $image('03.svg'), 'alt' => 'Foto 3', 'caption' => 'La graduación'],
            ['image' => $image('04.svg'), 'alt' => 'Foto 4', 'caption' => 'Viaje con las amigas'],
            ['image' => $image('05.svg'), 'alt' => 'Foto 5', 'caption' => 'Con la familia'],
            ['image' => $image('06.svg'), 'alt' => 'Foto 6', 'caption' => 'Lista para los 30'],
        ],
        'dress_code' => [
            'type' => 'Cóctel',
            'description' => 'Ven arreglado y cómodo para bailar toda la noche.',
            'women' => 'Vestido corto o conjunto de cóctel',
            'men' => 'Pantalón de vestir y camisa; sin corbata',
        ],
        'swatches' => [
            ['hex' => '#F4A6C0', 'label' => 'Rosa chicle'],
            ['hex' => '#C9A7EB', 'label' => 'Lila'],
            ['hex' => '#FFD98E', 'label' => 'Mantequilla'],
            ['hex' => '#A7D3F2', 'label' => 'Cielo'],
            ['hex' => '#F7C6A3', 'label' => 'Durazno'],
            ['hex' => '#FFFFFF', 'label' => 'Blanco'],
        ],
        'gifts' => [
            [
                'kind' => 'envelope',
                'title' => 'Lluvia de sobres',
                'description' => 'Habrá una caja decorada a la entrada para tu sobre.',
            ],
            [
                'kind' => 'bank',
                'title' => 'Transferencia',
                'description' => 'Si lo prefieres, puedes hacerle una transferencia.',
                'details' => [
                    ['label' => 'Banco', 'value' => 'Banco Ejemplo'],
                    ['label' => 'Titular', 'value' => 'Valentina Ortega Ruiz'],
                    ['label' => 'CLABE', 'value' => '012 345 678901234567'],
                ],
                'copy_value' => '012345678901234567',
            ],
            [
                'kind' => 'registry',
                'title' => 'Mesa de regalos',
                'description' => 'También puedes elegir algo de su lista de deseos.',
                'details' => [['label' => 'Número de evento', 'value' => '51234612']],
                'link_url' => 'https://mesaderegalos.liverpool.com.mx/',
                'link_label' => 'Ver mesa de regalos',
            ],
        ],
    ],
];
