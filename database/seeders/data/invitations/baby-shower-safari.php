<?php

/*
| Content of the baby-shower-safari demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource). The venue photo comes from the wedding demo.
*/

$image = fn (string $file): string => "/invitations/baby-shower-safari/images/{$file}";

return [
    'event_date' => '2027-03-13',
    'event_time' => '13:00',
    'rsvp_deadline' => '2027-03-01',
    'content' => [
        'names' => ['Valeria', 'Andrés'],
        'families' => 'Familia Ortiz Navarro',
        'baby_name' => 'Santiago',
        'due_label' => 'Llega en abril de 2027',
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/baby-shower-safari/music.mp3',
        'message' => 'La familia está por crecer y queremos celebrarlo contigo: una tarde de juegos, antojos y mucho cariño para recibir a Santiago.',
        'closing_message' => 'Gracias por ser parte de esta pequeña gran aventura. Con tu cariño, Santiago llega a un mundo lleno de amor.',
        'tagline' => 'Con cariño, Valeria y Andrés',
        'hosts' => [
            ['role' => 'Organizan con cariño', 'names' => ['Mariana Ortiz', 'Lucía Navarro']],
            ['role' => 'Futuros abuelos', 'names' => ['Rosa y Ernesto Ortiz', 'Carmen y Luis Navarro']],
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
                'icon' => '🌿',
                'tag' => 'Baby shower',
                'name' => 'Jardín Los Laureles',
                'address_lines' => ['Av. de los Fresnos 210', 'Col. Arboledas, Villa del Mar'],
                'time' => '13:00 hrs',
                'latitude' => 15.862436,
                'longitude' => -97.071639,
                'image' => '/invitations/boda-clasica/images/salon.jpeg',
            ],
        ],
        'program' => [
            ['time' => '13:00 hrs', 'icon' => '🌿', 'title' => 'Bienvenida', 'description' => 'Limonada de pepino y botanas para empezar.'],
            ['time' => '13:45 hrs', 'icon' => '🎲', 'title' => 'Juegos de la selva', 'description' => 'Adivina la medida de la pancita y otros retos.'],
            ['time' => '14:30 hrs', 'icon' => '🥪', 'title' => 'Comida', 'description' => 'Un picnic con todo y mantelito.'],
            ['time' => '15:30 hrs', 'icon' => '✍️', 'title' => 'Consejos para los papás', 'description' => 'Déjanos tu mejor consejo para la aventura.'],
            ['time' => '16:00 hrs', 'icon' => '🎂', 'title' => 'Pastel', 'description' => 'Y la foto de grupo con el elefantito.'],
        ],
        'gallery' => [
            ['image' => $image('01.svg'), 'alt' => 'Foto 1', 'caption' => 'Nuestra noticia'],
            ['image' => $image('02.svg'), 'alt' => 'Foto 2', 'caption' => 'El primer ultrasonido'],
            ['image' => $image('03.svg'), 'alt' => 'Foto 3', 'caption' => 'Su primer peluche'],
            ['image' => $image('04.svg'), 'alt' => 'Foto 4', 'caption' => 'Pancita de 20 semanas'],
            ['image' => $image('05.svg'), 'alt' => 'Foto 5', 'caption' => 'Su cuarto'],
            ['image' => $image('06.svg'), 'alt' => 'Foto 6', 'caption' => 'Esperándote'],
        ],
        'dress_code' => ['type' => 'Casual de día', 'description' => 'Tonos tierra, verdes y beige, como para un safari.'],
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
