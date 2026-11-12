<?php

/*
| Content of the floral wedding demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource). The photos are shared with the classic wedding demo; the files under
| public/invitations/boda-floral/ belong to a client's invitation.
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
        'music' => '/invitations/boda-clasica/music.mp3',
        'venues' => [
            [
                'icon' => '⛪',
                'tag' => 'Ceremonia religiosa',
                'name' => 'Parroquia de San Rafael Arcángel',
                'address_lines' => ['Calle de los Laureles 214', 'Barrio de San Rafael, Villa del Mar'],
                'time' => '16:00 hrs',
                'latitude' => 15.861208,
                'longitude' => -97.065710,
            ],
            [
                'icon' => '🥂',
                'tag' => 'Recepción & Banquete',
                'name' => 'Jardín Los Olivos',
                'address_lines' => ['Camino Real a La Ensenada km 3', 'Col. Las Palmas, Villa del Mar'],
                'time' => '18:00 hrs',
                'latitude' => 15.862436,
                'longitude' => -97.071639,
            ],
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
            ['hex' => '#D4B896', 'label' => 'Champagne'],
            ['hex' => '#C8A882', 'label' => 'Camel'],
            ['hex' => '#8B9E7A', 'label' => 'Sage'],
            ['hex' => '#A0927E', 'label' => 'Taupe'],
            ['hex' => '#B8B4A0', 'label' => 'Gris Plata'],
            ['hex' => '#C9A84C', 'label' => 'Dorado'],
            ['hex' => '#7A8FA0', 'label' => 'Azul Pálido'],
            ['hex' => '#C4A0A0', 'label' => 'Rosa Antiguo'],
        ],
    ],
];
