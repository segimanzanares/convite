<?php

/*
| Content of the baby-shower-patito demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource). The venue photo comes from the wedding demo and the music from another demo.
*/

$image = fn (string $file): string => "/invitations/baby-shower-patito/images/{$file}";

return [
    'event_date' => '2027-06-12',
    'event_time' => '15:00',
    'rsvp_deadline' => '2027-05-31',
    'content' => [
        'names' => ['Karla', 'Iván'],
        'families' => 'Familia Domínguez Peña',
        'baby_name' => null,
        'due_label' => 'Llega en julio de 2027',
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/infantil-dulce/music.mp3',
        'message' => 'Ya estamos chapoteando de gusto. Ven a celebrar con nosotros la llegada de nuestro bebé con juegos, burbujas y mucho cariño.',
        'closing_message' => 'Gracias por llenar de burbujas y cariño este día. ¡Nos vemos muy pronto, ya con el patito en casa!',
        'tagline' => 'Con cariño, Karla e Iván',
        'hosts' => [
            ['role' => 'Organizan con cariño', 'names' => ['Sofía Domínguez', 'Ana Peña']],
            ['role' => 'Futuros abuelos', 'names' => ['Gloria y Arturo Peña', 'Irma y Raúl Domínguez']],
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
                'icon' => '🛁',
                'tag' => 'Baby shower',
                'name' => 'Terraza Las Palmas',
                'address_lines' => ['Blvd. Costero 1450', 'Col. Playa Azul, Villa del Mar'],
                'time' => '15:00 hrs',
                'latitude' => 15.862436,
                'longitude' => -97.071639,
                'image' => '/invitations/boda-clasica/images/salon.jpeg',
            ],
        ],
        'program' => [
            ['time' => '15:00 hrs', 'icon' => '🦆', 'title' => 'Bienvenida', 'description' => 'Aguas frescas y patitos de recuerdo.'],
            ['time' => '15:45 hrs', 'icon' => '🫧', 'title' => 'Juegos', 'description' => 'Pesca de patitos y el reto del pañal.'],
            ['time' => '16:30 hrs', 'icon' => '🍕', 'title' => 'Comida', 'description' => 'Para recargar energía.'],
            ['time' => '17:30 hrs', 'icon' => '🍰', 'title' => 'Pastel', 'description' => 'Y las fotos con la tina de burbujas.'],
        ],
        'gallery' => [
            ['image' => $image('01.svg'), 'alt' => 'Foto 1', 'caption' => '¡Seremos papás!'],
            ['image' => $image('02.svg'), 'alt' => 'Foto 2', 'caption' => 'El primer ultrasonido'],
            ['image' => $image('03.svg'), 'alt' => 'Foto 3', 'caption' => 'Pancita de 18 semanas'],
            ['image' => $image('04.svg'), 'alt' => 'Foto 4', 'caption' => 'Su patito'],
            ['image' => $image('05.svg'), 'alt' => 'Foto 5', 'caption' => 'Su cuarto'],
            ['image' => $image('06.svg'), 'alt' => 'Foto 6', 'caption' => 'Esperándote'],
        ],
        'dress_code' => ['type' => 'Casual', 'description' => 'Ropa cómoda en tonos amarillo, blanco o aqua.'],
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
