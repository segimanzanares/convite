<?php

/*
| Content of the Matilde & Nayith wedding. Without an order its date shows 60 days ahead, like the demos.
*/

$image = fn (string $file): string => "/invitations/boda-floral/images/{$file}";

return [
    'event_date' => '2026-11-21',
    'event_time' => '15:00',
    'rsvp_deadline' => '2026-11-01',
    'content' => [
        'names' => ['Matilde', 'Nayith'],
        'families' => 'La Familia González & La Familia Gallardo',
        'rsvp_whatsapp' => '523321852205',
        'music' => '/invitations/boda-floral/music.mp3',
        'venues' => [
            [
                'icon' => '⛪',
                'tag' => 'Ceremonia religiosa',
                'name' => 'Parroquia de la Soledad',
                'address_lines' => ['Calle Fundadores S/N', 'Puerto Escondido, Oax.'],
                'time' => '15:00 hrs',
                'latitude' => 15.861208,
                'longitude' => -97.065710,
            ],
            [
                'icon' => '🥂',
                'tag' => 'Recepción & Banquete',
                'name' => 'Salón Nochetly',
                'address_lines' => ['Calle Ignacio Barrera S/N', 'Col. Aeropuerto, Puerto Escondido, Oax.'],
                'time' => '16:00 hrs',
                'latitude' => 15.881308,
                'longitude' => -97.080966,
            ],
        ],
        'gallery' => [
            ['image' => $image('01.jpeg'), 'alt' => 'Foto1', 'caption' => 'La sesión'],
            ['image' => $image('02.jpeg'), 'alt' => 'Foto2', 'caption' => 'La ternura'],
            ['image' => $image('03.jpeg'), 'alt' => 'Foto3', 'caption' => 'El amor'],
            ['image' => $image('04.jpeg'), 'alt' => 'Foto4', 'caption' => 'La complicidad'],
            ['image' => $image('05.jpeg'), 'alt' => 'Foto5', 'caption' => 'La emoción'],
            ['image' => $image('06.jpeg'), 'alt' => 'Foto6', 'caption' => 'Las miradas'],
            ['image' => $image('07.jpeg'), 'alt' => 'Foto7', 'caption' => 'La promesa'],
            ['image' => $image('08.jpeg'), 'alt' => 'Foto8', 'caption' => 'La alegría'],
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
