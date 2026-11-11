<?php

/*
| Content of the Matilde & Nayith wedding. Without an order its date shows 60 days ahead, like the demos.
*/

$image = fn (string $file): string => "/invitations/matilde-nayith/images/{$file}";

return [
    'event_date' => '2027-06-12',
    'event_time' => '15:00',
    'rsvp_deadline' => '2027-05-22',
    'content' => [
        'names' => ['Matilde', 'Nayith'],
        'families' => 'La Familia López & La Familia Pérez',
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/matilde-nayith/music.mp3',
        'venues' => [
            [
                'icon' => '⛪',
                'tag' => 'Ceremonia religiosa',
                'name' => 'Parroquia de la Soledad',
                'address_lines' => ['Calle Fundadores S/N', 'Puerto Escondido, Oax.'],
                'time' => '15:00 hrs',
                'latitude' => 15.8611489,
                'longitude' => -97.0657164,
            ],
            [
                'icon' => '🥂',
                'tag' => 'Recepción & Banquete',
                'name' => 'Salón De Fiestas',
                'address_lines' => ['Av. Hidalgo S/N', 'Col. Centro, Puerto Escondido, Oax.'],
                'time' => '16:00 hrs',
                'latitude' => 15.8624356,
                'longitude' => -97.0716393,
            ],
        ],
        'gallery' => [
            ['image' => $image('01.jpeg'), 'alt' => 'Foto1', 'caption' => 'El comienzo'],
            ['image' => $image('03.jpeg'), 'alt' => 'Foto3', 'caption' => 'Para siempre'],
            ['image' => $image('04.jpeg'), 'alt' => 'Foto4', 'caption' => 'Nuestra historia'],
            ['image' => $image('06.jpeg'), 'alt' => 'Foto5', 'caption' => 'Siempre juntos'],
            ['image' => $image('07.jpeg'), 'alt' => 'Foto7', 'caption' => 'Momentos'],
            ['image' => $image('08.jpeg'), 'alt' => 'Foto8', 'caption' => 'Bellos'],
            ['image' => $image('09.jpeg'), 'alt' => 'Foto9', 'caption' => 'Selfie'],
            ['image' => $image('10.jpeg'), 'alt' => 'Foto10', 'caption' => 'Sin filtros'],
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
