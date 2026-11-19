<?php

/*
| Content of the revelacion-globos demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource), which keeps the answer secret. The venue photo comes from the wedding demo and the
| music from another demo.
*/

$image = fn (string $file): string => "/invitations/revelacion-globos/images/{$file}";

return [
    'event_date' => '2027-04-17',
    'event_time' => '16:00',
    'rsvp_deadline' => '2027-04-03',
    'content' => [
        'names' => ['Fernanda', 'Diego'],
        'families' => 'Familia Ortiz Salgado',
        'due_label' => 'Llega en septiembre de 2027',
        'baby_names' => ['girl' => 'Valentina', 'boy' => 'Santiago'],
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/infantil-dulce/music.mp3',
        'message' => 'Un globo, dos colores y una noticia que nos tiene flotando. Ven a descubrir con nosotros si nuestro bebé será niño o niña.',
        'closing_message' => 'Gracias por ser parte de esta espera tan bonita. Rosa o azul, este bebé ya llegó a una familia que lo ama.',
        'tagline' => 'Con amor, Fernanda y Diego',
        'grandparents' => [
            ['role' => 'Abuelos maternos', 'names' => ['Rosa María Salgado', 'Ernesto Salgado']],
            ['role' => 'Abuelos paternos', 'names' => ['Leticia Ortiz', 'Raúl Ortiz']],
        ],
        'venues' => [
            [
                'icon' => '🎈',
                'tag' => 'La fiesta',
                'name' => 'Jardín Los Almendros',
                'address_lines' => ['Av. de las Palmas 310', 'Col. Jardines, Villa del Mar'],
                'time' => '16:00 hrs',
                'latitude' => 15.862436,
                'longitude' => -97.071639,
                'image' => '/invitations/boda-clasica/images/salon.jpeg',
            ],
        ],
        'program' => [
            [
                'time' => '16:00 hrs',
                'icon' => '🎈',
                'title' => 'Bienvenida',
                'description' => 'Elige tu equipo y llévate tu pulsera rosa o azul.',
            ],
            ['time' => '16:30 hrs', 'icon' => '🍔', 'title' => 'Comida', 'description' => 'Mesa de antojitos para grandes y chicos.'],
            [
                'time' => '17:30 hrs',
                'icon' => '🎯',
                'title' => 'Juegos y apuestas',
                'description' => 'Adivina el peso, la fecha y el color.',
            ],
            ['time' => '18:30 hrs', 'icon' => '💥', 'title' => '¡Reventamos el globo!', 'description' => 'El momento que todos esperamos.'],
            ['time' => '19:00 hrs', 'icon' => '🎂', 'title' => 'Pastel', 'description' => 'Y un brindis por el bebé.'],
        ],
        'gallery' => [
            ['image' => $image('01.svg'), 'alt' => 'Foto 1', 'caption' => 'El primer ultrasonido'],
            ['image' => $image('02.svg'), 'alt' => 'Foto 2', 'caption' => 'La noticia'],
            ['image' => $image('03.svg'), 'alt' => 'Foto 3', 'caption' => 'Doce semanas'],
            ['image' => $image('04.svg'), 'alt' => 'Foto 4', 'caption' => 'Su primer peluche'],
            ['image' => $image('05.svg'), 'alt' => 'Foto 5', 'caption' => 'Preparando su cuarto'],
            ['image' => $image('06.svg'), 'alt' => 'Foto 6', 'caption' => '¡Ya falta poco!'],
        ],
        'dress_code' => ['type' => 'Casual', 'description' => 'Ven cómodo y del color de tu corazonada.'],
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
