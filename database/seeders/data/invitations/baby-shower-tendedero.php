<?php

/*
| Content of the baby-shower-tendedero demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource). The venue photo comes from the wedding demo.
*/

$image = fn (string $file): string => "/invitations/baby-shower-tendedero/images/{$file}";

return [
    'event_date' => '2027-05-08',
    'event_time' => '12:00',
    'rsvp_deadline' => '2027-04-26',
    'content' => [
        'names' => ['Regina', 'Pablo'],
        'families' => 'Familia Salazar Fuentes',
        'baby_name' => null,
        'due_label' => 'Llega en junio de 2027',
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/baby-shower-tendedero/music.mp3',
        'message' => 'Ya tendimos su ropita y estamos preparando el nido. Nos encantaría que nos acompañes a celebrar la llegada de nuestro bebé.',
        'closing_message' => 'Gracias por ayudarnos a preparar el nido con tanto cariño. Nos vemos pronto, ya con el bebé en brazos.',
        'tagline' => 'Con cariño, Regina y Pablo',
        'hosts' => [
            ['role' => 'Organizan con cariño', 'names' => ['Las tías Salazar']],
            ['role' => 'Futuros abuelos', 'names' => ['Elena y Jaime Fuentes', 'Martha y Óscar Salazar']],
        ],
        'diapers' => [
            'note' => 'Si quieres traer pañales, aquí va la talla según la inicial de tu apellido.',
            'sizes' => [
                ['label' => 'Etapa 1', 'note' => 'Apellidos de la A a la F'],
                ['label' => 'Etapa 2', 'note' => 'Apellidos de la G a la O'],
                ['label' => 'Etapa 3', 'note' => 'Apellidos de la P a la Z'],
            ],
        ],
        'venues' => [
            [
                'icon' => '🌾',
                'tag' => 'Brunch',
                'name' => 'Casa Olivo',
                'address_lines' => ['Privada del Roble 12', 'Col. Centro, Villa del Mar'],
                'time' => '12:00 hrs',
                'latitude' => 15.862436,
                'longitude' => -97.071639,
                'image' => '/invitations/boda-clasica/images/salon.jpeg',
            ],
        ],
        'program' => [
            ['time' => '12:00 hrs', 'icon' => '☕', 'title' => 'Brunch', 'description' => 'Café de olla, pan dulce y fruta de temporada.'],
            ['time' => '13:00 hrs', 'icon' => '🧺', 'title' => 'El tendedero de deseos', 'description' => 'Escribe un deseo en una tarjeta y cuélgala con una pinza.'],
            ['time' => '13:45 hrs', 'icon' => '🧶', 'title' => 'Juegos', 'description' => '¿Quién conoce mejor a los papás?'],
            ['time' => '14:30 hrs', 'icon' => '🎁', 'title' => 'Regalos y pastel', 'description' => 'Para cerrar con algo dulce.'],
        ],
        'gallery' => [
            ['image' => $image('01.svg'), 'alt' => 'Foto 1', 'caption' => 'Nuestra noticia'],
            ['image' => $image('02.svg'), 'alt' => 'Foto 2', 'caption' => 'Primer ultrasonido'],
            ['image' => $image('03.svg'), 'alt' => 'Foto 3', 'caption' => 'La pancita'],
            ['image' => $image('04.svg'), 'alt' => 'Foto 4', 'caption' => 'Su primera ropita'],
            ['image' => $image('05.svg'), 'alt' => 'Foto 5', 'caption' => 'El nido'],
            ['image' => $image('06.svg'), 'alt' => 'Foto 6', 'caption' => 'Te esperamos'],
        ],
        'dress_code' => ['type' => 'Casual boho', 'description' => 'Lino, algodón y tonos tierra; nada de prisas ni tacones altos.'],
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
                'title' => 'Lluvia de sobres',
                'description' => 'Si lo prefieres, el día del baby shower habrá una cajita para sobres.',
            ],
        ],
    ],
];
