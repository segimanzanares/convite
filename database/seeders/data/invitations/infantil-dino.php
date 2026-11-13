<?php

/*
| Content of the jurassic kids' party demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource). It borrows cumpleanos-confeti's music.
*/

$image = fn (string $file): string => "/invitations/infantil-dino/images/{$file}";

return [
    'event_date' => '2027-05-08',
    'event_time' => '13:00',
    'rsvp_deadline' => '2027-04-28',
    'content' => [
        'name' => 'Santiago Pérez',
        'first_name' => 'Santiago',
        'age' => 5,
        'hosts' => 'Sus papás, Daniela y Roberto',
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/cumpleanos-confeti/music.mp3',
        'message' => '¡Rawr! Santiago cumple 5 años y lo vamos a celebrar con una aventura jurásica: excavación de fósiles, piñata de dinosaurio y un pastel volcán. Prepara tus botas de explorador y ven con tu mejor rugido.',
        'tagline' => '5 años · ¡Gracias por venir a la fiesta jurásica!',
        'venues' => [
            [
                'icon' => '🦕',
                'tag' => 'Fiesta',
                'name' => 'Parque Jurásico Kids',
                'address_lines' => ['Calle de los Fresnos 77', 'Col. Bosques del Valle, Puebla'],
                'time' => '13:00 hrs',
                'latitude' => 19.033472,
                'longitude' => -98.231781,
            ],
        ],
        'program' => [
            ['time' => '13:00 hrs', 'icon' => '🦖', 'title' => 'Llegan los exploradores', 'description' => 'Cada niño recibe su sombrero de expedición.'],
            ['time' => '13:30 hrs', 'icon' => '🦴', 'title' => 'Excavación de fósiles', 'description' => 'Buscamos huesos de dinosaurio en el arenero.'],
            ['time' => '14:30 hrs', 'icon' => '🍕', 'title' => 'Comida', 'description' => 'Pizza y agua fresca para recargar energía.'],
            ['time' => '15:30 hrs', 'icon' => '🌋', 'title' => 'Pastel volcán y piñata', 'description' => '¡Cantamos las mañanitas y rompemos el huevo de dinosaurio!'],
        ],
        'gallery' => [
            ['image' => $image('01.svg'), 'alt' => 'Foto 1', 'caption' => 'Recién nacido'],
            ['image' => $image('02.svg'), 'alt' => 'Foto 2', 'caption' => 'Su primer dino'],
            ['image' => $image('03.svg'), 'alt' => 'Foto 3', 'caption' => 'En el museo'],
            ['image' => $image('04.svg'), 'alt' => 'Foto 4', 'caption' => 'Primer día de kínder'],
            ['image' => $image('05.svg'), 'alt' => 'Foto 5', 'caption' => 'De campamento'],
            ['image' => $image('06.svg'), 'alt' => 'Foto 6', 'caption' => '¡Listo para los 5!'],
        ],
        'gifts' => [
            [
                'kind' => 'envelope',
                'title' => 'Lluvia de sobres',
                'description' => 'Habrá un huevo gigante a la entrada para tu sobre.',
            ],
            [
                'kind' => 'registry',
                'title' => 'Mesa de regalos',
                'description' => 'Sus juguetes y libros de dinosaurios favoritos.',
                'details' => [['label' => 'Número de evento', 'value' => '51234703']],
                'link_url' => 'https://mesaderegalos.liverpool.com.mx/',
                'link_label' => 'Ver mesa de regalos',
            ],
        ],
    ],
];
