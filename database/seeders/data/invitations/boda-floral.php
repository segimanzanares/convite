<?php

/*
| Content of the floral wedding demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource). The photos are shared with the classic wedding demo; the files under
| public/invitations/boda-floral/ belong to a client's invitation
| (mati-nayith, which uses boda-clasica).
*/

$image = fn (string $file): string => "/invitations/boda-clasica/images/{$file}";

return [
    'event_date' => '2027-06-12',
    'event_time' => '16:00',
    'rsvp_deadline' => '2027-05-22',
    'content' => [
        'names' => ['Daniela', 'Sebastián'],
        'families' => 'La Familia Ramírez & La Familia Torres',
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/boda-floral/music.mp3',
        'venues' => [
            [
                'icon' => '⛪',
                'tag' => 'Ceremonia religiosa',
                'name' => 'Parroquia de San Rafael Arcángel',
                'address_lines' => ['Calle de los Laureles 214', 'Barrio de San Rafael, Villa del Mar'],
                'time' => '16:00 hrs',
                'latitude' => 15.861208,
                'longitude' => -97.065710,
                'image' => $image('catedral.jpg'),
            ],
            [
                'icon' => '🥂',
                'tag' => 'Recepción & Banquete',
                'name' => 'Jardín Los Olivos',
                'address_lines' => ['Camino Real a La Ensenada km 3', 'Col. Las Palmas, Villa del Mar'],
                'time' => '18:00 hrs',
                'latitude' => 15.862436,
                'longitude' => -97.071639,
                'image' => $image('salon.jpeg'),
            ],
        ],
        'program' => [
            ['time' => '16:00 hrs', 'icon' => '⛪', 'title' => 'Ceremonia religiosa', 'description' => 'Uniremos nuestras vidas en la Parroquia de San Rafael Arcángel.'],
            ['time' => '18:00 hrs', 'icon' => '🌸', 'title' => 'Coctel entre flores', 'description' => 'Bienvenida y brindis en los jardines de Los Olivos.'],
            ['time' => '19:00 hrs', 'icon' => '🍽️', 'title' => 'Cena', 'description' => 'Una cena bajo las pérgolas para celebrar juntos.'],
            ['time' => '20:30 hrs', 'icon' => '💃', 'title' => 'Primer baile', 'description' => 'Abriremos la pista con nuestro primer baile como esposos.'],
            ['time' => '21:00 hrs', 'icon' => '🪩', 'title' => 'Fiesta', 'description' => 'Música y baile hasta que termine la noche.'],
        ],
        'gallery' => [
            ['image' => $image('02.jpeg'), 'alt' => 'Foto 1', 'caption' => 'La sesión'],
            ['image' => $image('01.jpeg'), 'alt' => 'Foto 2', 'caption' => 'La ternura'],
            ['image' => $image('05.jpeg'), 'alt' => 'Foto 3', 'caption' => 'El amor'],
            ['image' => $image('03.jpeg'), 'alt' => 'Foto 4', 'caption' => 'La complicidad'],
            ['image' => $image('04.jpeg'), 'alt' => 'Foto 5', 'caption' => 'La emoción'],
            ['image' => $image('06.jpeg'), 'alt' => 'Foto 6', 'caption' => 'Las miradas'],
            ['image' => $image('07.jpeg'), 'alt' => 'Foto 7', 'caption' => 'La promesa'],
            ['image' => $image('08.jpeg'), 'alt' => 'Foto 8', 'caption' => 'La alegría'],
        ],
        'dress_code' => [
            'type' => 'Formal',
            'description' => 'Solicitamos a nuestros invitados vestimenta formal.',
            'reserved_color' => [
                'name' => 'Blanco',
                'hex' => '#FFFFFF',
                'description' => 'está reservado para la novia; evita también el negro riguroso.',
            ],
        ],
        'swatches' => [
            ['hex' => '#E8C4C4', 'label' => 'Rosa Palo'],
            ['hex' => '#C98E95', 'label' => 'Rosa Viejo'],
            ['hex' => '#B9A3C4', 'label' => 'Lavanda'],
            ['hex' => '#9DB095', 'label' => 'Salvia'],
            ['hex' => '#E9D8C4', 'label' => 'Marfil'],
            ['hex' => '#A9BCC9', 'label' => 'Azul Niebla'],
        ],
        'gifts' => [
            [
                'kind' => 'envelope',
                'title' => 'Lluvia de sobres',
                'description' => 'El día de la boda habrá un buzón a la entrada para tu sobre.',
            ],
            [
                'kind' => 'registry',
                'title' => 'Mesa de Regalos',
                'description' => 'También pueden elegir un detalle de nuestra mesa de regalos.',
                'details' => [['label' => 'Número de evento', 'value' => '51234568']],
                'link_url' => 'https://mesaderegalos.liverpool.com.mx/',
                'link_label' => 'Ver mesa de regalos',
            ],
        ],
    ],
];
