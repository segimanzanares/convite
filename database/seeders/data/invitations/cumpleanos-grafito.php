<?php

/*
| Content of the "grafito" birthday demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource).
*/

$image = fn (string $file): string => "/invitations/cumpleanos-grafito/images/{$file}";

return [
    'event_date' => '2027-10-16',
    'event_time' => '20:00',
    'rsvp_deadline' => '2027-10-02',
    'content' => [
        'name' => 'Diego Herrera',
        'first_name' => 'Diego',
        'age' => 40,
        'hosts' => 'Organizan Ana y los amigos de siempre',
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/cumpleanos-grafito/music.mp3',
        'message' => 'Diego llega a los 40 y lo vamos a celebrar como se debe: buenos cortes, cerveza fría, música en vivo y los amigos de siempre. Una noche para brindar por todo lo vivido y por lo que viene. Nos encantaría que estuvieras ahí.',
        'tagline' => '40 años · Gracias por estar',
        'venues' => [
            [
                'icon' => '🔥',
                'tag' => 'Parrillada & Fiesta',
                'name' => 'Bodega 40 · Roof garden',
                'address_lines' => ['Av. Industrial 1240, piso 6', 'Col. Moderna, Monterrey'],
                'time' => '20:00 hrs',
                'latitude' => 25.686614,
                'longitude' => -100.316113,
            ],
        ],
        'program' => [
            ['time' => '20:00 hrs', 'icon' => '🍺', 'title' => 'Llegada', 'description' => 'Barra abierta de cerveza artesanal y botanas.'],
            ['time' => '21:00 hrs', 'icon' => '🔥', 'title' => 'Parrillada', 'description' => 'Cortes a la parrilla para todos.'],
            ['time' => '22:30 hrs', 'icon' => '🥃', 'title' => 'Brindis y pastel', 'description' => 'Unas palabras, un buen trago y a soplar las 40 velas.'],
            ['time' => '23:00 hrs', 'icon' => '🎸', 'title' => 'Música en vivo', 'description' => 'Rock de los 90 con la banda de sus amigos.'],
        ],
        'gallery' => [
            ['image' => $image('01.svg'), 'alt' => 'Foto 1', 'caption' => 'El primer balón'],
            ['image' => $image('02.svg'), 'alt' => 'Foto 2', 'caption' => 'La banda de la prepa'],
            ['image' => $image('03.svg'), 'alt' => 'Foto 3', 'caption' => 'Primer trabajo'],
            ['image' => $image('04.svg'), 'alt' => 'Foto 4', 'caption' => 'El viaje en moto'],
            ['image' => $image('05.svg'), 'alt' => 'Foto 5', 'caption' => 'Con Ana y los niños'],
            ['image' => $image('06.svg'), 'alt' => 'Foto 6', 'caption' => 'Rumbo a los 40'],
        ],
        'dress_code' => [
            'type' => 'Casual elegante',
            'description' => 'Cómodo pero arreglado: es en una terraza y refresca de noche.',
            'men' => 'Jeans oscuros o chinos, camisa y chamarra',
            'women' => 'Jeans o pantalón y algo con estilo; zapato cómodo',
        ],
        'swatches' => [
            ['hex' => '#18181B', 'label' => 'Negro grafito'],
            ['hex' => '#52525B', 'label' => 'Gris acero'],
            ['hex' => '#1E3A5F', 'label' => 'Azul petróleo'],
            ['hex' => '#4D5B3A', 'label' => 'Verde militar'],
            ['hex' => '#7C4A2D', 'label' => 'Cuero'],
            ['hex' => '#D9C7A7', 'label' => 'Arena'],
        ],
        'gifts' => [
            [
                'kind' => 'envelope',
                'title' => 'Lluvia de sobres',
                'description' => 'Habrá una caja a la entrada para tu sobre.',
            ],
            [
                'kind' => 'bank',
                'title' => 'Transferencia',
                'description' => 'Para su próximo viaje en moto.',
                'details' => [
                    ['label' => 'Banco', 'value' => 'Banco Ejemplo'],
                    ['label' => 'Titular', 'value' => 'Diego Herrera Salas'],
                    ['label' => 'CLABE', 'value' => '012 345 678901234598'],
                ],
                'copy_value' => '012345678901234598',
            ],
        ],
    ],
];
