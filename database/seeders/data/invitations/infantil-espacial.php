<?php

/*
| Content of the outer space kids' party demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource). It borrows cumpleanos-floral's music.
*/

$image = fn (string $file): string => "/invitations/infantil-espacial/images/{$file}";

return [
    'event_date' => '2027-04-17',
    'event_time' => '16:00',
    'rsvp_deadline' => '2027-04-07',
    'content' => [
        'name' => 'Mateo Ríos',
        'first_name' => 'Mateo',
        'age' => 7,
        'hosts' => 'Sus papás, Ana y Luis',
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/cumpleanos-floral/music.mp3',
        'message' => '¡Atención, tripulación! Mateo cumple 7 años y prepara una misión fuera de este mundo: juegos de astronautas, piñata de planetas y un pastel que aterrizó directo de la Luna. Ponte tu casco y acompáñanos en esta aventura espacial.',
        'tagline' => '7 años · ¡Gracias por sumarte a la misión!',
        'venues' => [
            [
                'icon' => '🚀',
                'tag' => 'Fiesta',
                'name' => 'Salón Galaxia Kids',
                'address_lines' => ['Av. de los Planetas 320', 'Col. Jardines del Sol, Zapopan'],
                'time' => '16:00 hrs',
                'latitude' => 20.708654,
                'longitude' => -103.411214,
            ],
        ],
        'program' => [
            ['time' => '16:00 hrs', 'icon' => '🧑‍🚀', 'title' => 'Llegada de la tripulación', 'description' => 'Recibimos a cada astronauta con su pasaporte espacial.'],
            ['time' => '16:30 hrs', 'icon' => '🪐', 'title' => 'Juegos galácticos', 'description' => 'Brincolín, carrera de cohetes y búsqueda de meteoritos.'],
            ['time' => '17:45 hrs', 'icon' => '🌭', 'title' => 'Comida de astronautas', 'description' => 'Combustible para seguir jugando.'],
            ['time' => '18:30 hrs', 'icon' => '🎂', 'title' => 'Pastel y piñata', 'description' => 'Cantamos las mañanitas y rompemos la piñata de planetas.'],
        ],
        'gallery' => [
            ['image' => $image('01.svg'), 'alt' => 'Foto 1', 'caption' => 'Recién aterrizado'],
            ['image' => $image('02.svg'), 'alt' => 'Foto 2', 'caption' => 'Su primer cumpleaños'],
            ['image' => $image('03.svg'), 'alt' => 'Foto 3', 'caption' => 'En el planetario'],
            ['image' => $image('04.svg'), 'alt' => 'Foto 4', 'caption' => 'Primer día de escuela'],
            ['image' => $image('05.svg'), 'alt' => 'Foto 5', 'caption' => 'Con su hermana'],
            ['image' => $image('06.svg'), 'alt' => 'Foto 6', 'caption' => 'Listo para los 7'],
        ],
        'gifts' => [
            [
                'kind' => 'envelope',
                'title' => 'Lluvia de sobres',
                'description' => 'Habrá un cohete-alcancía a la entrada para tu sobre.',
            ],
            [
                'kind' => 'registry',
                'title' => 'Mesa de regalos',
                'description' => 'Su lista de juguetes favoritos.',
                'details' => [['label' => 'Número de evento', 'value' => '51234701']],
                'link_url' => 'https://mesaderegalos.liverpool.com.mx/',
                'link_label' => 'Ver mesa de regalos',
            ],
        ],
    ],
];
