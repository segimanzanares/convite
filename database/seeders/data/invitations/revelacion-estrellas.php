<?php

/*
| Content of the revelacion-estrellas demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource), which keeps the answer secret. The venue photo comes from the wedding demo and the
| music from another demo.
*/

$image = fn (string $file): string => "/invitations/revelacion-estrellas/images/{$file}";

return [
    'event_date' => '2027-06-19',
    'event_time' => '19:30',
    'rsvp_deadline' => '2027-06-05',
    'content' => [
        'names' => ['Andrea', 'Tomás'],
        'families' => 'Familia Navarro Ríos',
        'due_label' => 'Llega en noviembre de 2027',
        'baby_names' => ['girl' => 'Luna', 'boy' => 'León'],
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/xv-celestial/music.mp3',
        'message' => 'Trae un paquete muy esperado, y bajo las estrellas descubriremos si es un niño o una niña.',
        'closing_message' => 'Gracias por acompañarnos en esta noche tan especial. Niño o niña, ya es la estrella más brillante de nuestro cielo.',
        'tagline' => 'Con amor, Andrea y Tomás',
        'grandparents' => [
            ['role' => 'Abuelos maternos', 'names' => ['Isabel Ríos', 'Fernando Ríos']],
            ['role' => 'Abuelos paternos', 'names' => ['Patricia Navarro', 'Eduardo Navarro']],
        ],
        'venues' => [
            [
                'icon' => '✨',
                'tag' => 'La noche',
                'name' => 'Terraza Mirador del Cielo',
                'address_lines' => ['Paseo de la Luna 900', 'Lomas Altas, Villa del Mar'],
                'time' => '19:30 hrs',
                'latitude' => 15.862436,
                'longitude' => -97.071639,
                'image' => '/invitations/boda-clasica/images/salon.jpeg',
            ],
        ],
        'program' => [
            ['time' => '19:30 hrs', 'icon' => '✨', 'title' => 'Llegada', 'description' => 'Bajo el cielo, con luces y música suave.'],
            ['time' => '20:00 hrs', 'icon' => '🍽️', 'title' => 'Cena', 'description' => 'Para compartir entre amigos y familia.'],
            [
                'time' => '21:00 hrs',
                'icon' => '🌙',
                'title' => 'Deseos para el bebé',
                'description' => 'Escribe el tuyo en una estrella de papel.',
            ],
            [
                'time' => '21:30 hrs',
                'icon' => '🎆',
                'title' => 'La revelación',
                'description' => 'Las luces del cielo dirán si es niño o niña.',
            ],
        ],
        'gallery' => [
            ['image' => $image('01.svg'), 'alt' => 'Foto 1', 'caption' => 'La noticia'],
            ['image' => $image('02.svg'), 'alt' => 'Foto 2', 'caption' => 'Nuestro primer ultrasonido'],
            ['image' => $image('03.svg'), 'alt' => 'Foto 3', 'caption' => 'Su manta de estrellas'],
            ['image' => $image('04.svg'), 'alt' => 'Foto 4', 'caption' => 'Dieciséis semanas'],
            ['image' => $image('05.svg'), 'alt' => 'Foto 5', 'caption' => 'Su cuarto'],
            ['image' => $image('06.svg'), 'alt' => 'Foto 6', 'caption' => 'Contando los días'],
        ],
        'dress_code' => ['type' => 'Formal de noche', 'description' => 'Elige un detalle rosa o azul para tu corazonada.'],
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
