<?php

/*
| Content of the wedding demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource); the dates below only set the time and how long before the event the RSVP closes.
*/

$image = fn (string $file): string => "/invitations/boda-clasica/images/{$file}";

return [
    'event_date' => '2027-06-12',
    'event_time' => '17:00',
    'rsvp_deadline' => '2027-05-22',
    'content' => [
        'names' => ['Mariana', 'Alejandro'],
        'families' => 'La Familia López & La Familia Pérez',
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/boda-clasica/music.mp3',
        'venues' => [
            [
                'icon' => '⛪',
                'tag' => 'Ceremonia religiosa',
                'name' => 'Parroquia de San Rafael Arcángel',
                'address_lines' => ['Calle de los Laureles 214', 'Barrio de San Rafael, Villa del Mar'],
                'time' => '15:00 hrs',
                'latitude' => 15.861208,
                'longitude' => -97.065710,
                'image' => $image('catedral.jpg'),
            ],
            [
                'icon' => '🥂',
                'tag' => 'Recepción & Banquete',
                'name' => 'Hacienda Los Almendros',
                'address_lines' => ['Camino Real a La Ensenada km 3', 'Col. Las Palmas, Villa del Mar'],
                'time' => '16:00 hrs',
                'latitude' => 15.862436,
                'longitude' => -97.071639,
                'image' => $image('salon.jpeg'),
            ],
        ],
        'program' => [
            ['time' => '13:00 hrs', 'icon' => '⛪', 'title' => 'Ceremonia religiosa', 'description' => 'Acompañanos a unir nuestras vidas en la Parroquia de San Rafael Arcángel.'],
            ['time' => '14:30 hrs', 'icon' => '🥂', 'title' => 'Coctel de bienvenida', 'description' => 'Recepción y brindis de honor en la Hacienda Los Almendros.'],
            ['time' => '15:30 hrs', 'icon' => '🍽️', 'title' => 'Banquete de bodas', 'description' => 'Disfrutaremos de una comida especial para celebrar nuestro amor.'],
            ['time' => '17:00 hrs', 'icon' => '💃', 'title' => 'Primer baile', 'description' => 'Apertura de pista con el tradicional baile de los novios.'],
            ['time' => '17:30 hrs', 'icon' => '🎂', 'title' => 'Corte de pastel', 'description' => 'El momento dulce de la tarde y brindis con la familia.'],
            ['time' => '18:00 hrs', 'icon' => '🪩', 'title' => 'Fiesta y baile', 'description' => 'Música, fiesta y mucha diversión hasta que el cuerpo aguante.'],
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
            'men' => 'Traje',
            'women' => 'Vestido largo',
            'reserved_color' => [
                'name' => 'Blanco',
                'hex' => '#FFFFFF',
                'description' => 'está reservado para la novia, evita llevar ese color.',
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
        'gifts' => [
            [
                'kind' => 'bank',
                'title' => 'Transferencia Bancaria',
                'details' => [
                    ['label' => 'Banco', 'value' => 'BBVA'],
                    ['label' => 'Titular', 'value' => 'Mariana López Pérez'],
                    ['label' => 'Cuenta', 'value' => '4189 1431 8018 4403'],
                ],
                'copy_value' => '4189143180184403',
            ],
            [
                'kind' => 'registry',
                'title' => 'Mesa de Regalos',
                'description' => 'También pueden elegir un detalle de nuestra mesa de regalos.',
                'details' => [['label' => 'Número de evento', 'value' => '51234567']],
                'link_url' => 'https://mesaderegalos.liverpool.com.mx/',
                'link_label' => 'Ver mesa de regalos',
            ],
        ],
    ],
];
