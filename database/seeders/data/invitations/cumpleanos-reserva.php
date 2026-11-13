<?php

/*
| Content of the "gran reserva" birthday demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource).
*/

$image = fn (string $file): string => "/invitations/cumpleanos-reserva/images/{$file}";

return [
    'event_date' => '2027-09-18',
    'event_time' => '20:00',
    'rsvp_deadline' => '2027-09-04',
    'content' => [
        'name' => 'Roberto Méndez',
        'first_name' => 'Roberto',
        'age' => 50,
        'hosts' => 'Con cariño, su esposa y sus hijos',
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/cumpleanos-reserva/music.mp3',
        'message' => 'Cincuenta años no se cumplen todos los días. Hay cosas que mejoran con el tiempo, y Roberto es la mejor prueba: queremos invitarte a levantar la copa con nosotros para celebrar su vida, sus historias y todo lo que todavía viene.',
        'tagline' => '50 años · Gran reserva',
        'venues' => [
            [
                'icon' => '🥃',
                'tag' => 'Cena & Brindis',
                'name' => 'Casa Nogal · Terraza',
                'address_lines' => ['Av. de los Nogales 845', 'Col. Las Lomas, Ciudad del Valle'],
                'time' => '20:00 hrs',
                'latitude' => 20.674421,
                'longitude' => -103.387315,
            ],
        ],
        'program' => [
            ['time' => '20:00 hrs', 'icon' => '🥃', 'title' => 'Recepción', 'description' => 'Un coctel de bienvenida en la terraza.'],
            ['time' => '21:00 hrs', 'icon' => '🍽️', 'title' => 'Cena', 'description' => 'Una cena de tres tiempos entre amigos y familia.'],
            ['time' => '22:30 hrs', 'icon' => '🥂', 'title' => 'Brindis y pastel', 'description' => 'Levantamos la copa por sus primeros cincuenta.'],
            ['time' => '23:00 hrs', 'icon' => '🎷', 'title' => 'Música y sobremesa', 'description' => 'Jazz en vivo y buena conversación hasta tarde.'],
        ],
        'gallery' => [
            ['image' => $image('01.svg'), 'alt' => 'Foto 1', 'caption' => 'Sus primeros años'],
            ['image' => $image('02.svg'), 'alt' => 'Foto 2', 'caption' => 'Los años de la universidad'],
            ['image' => $image('03.svg'), 'alt' => 'Foto 3', 'caption' => 'El día de su boda'],
            ['image' => $image('04.svg'), 'alt' => 'Foto 4', 'caption' => 'Con sus hijos'],
            ['image' => $image('05.svg'), 'alt' => 'Foto 5', 'caption' => 'En la carretera'],
            ['image' => $image('06.svg'), 'alt' => 'Foto 6', 'caption' => 'Cincuenta y contando'],
        ],
        'dress_code' => [
            'type' => 'Formal de noche',
            'description' => 'Te sugerimos traje oscuro o tonos profundos; la corbata es opcional.',
        ],
        'swatches' => [
            ['hex' => '#1F2D4A', 'label' => 'Azul marino'],
            ['hex' => '#3A3F47', 'label' => 'Gris carbón'],
            ['hex' => '#5B6142', 'label' => 'Verde olivo'],
            ['hex' => '#6B4A2F', 'label' => 'Café tabaco'],
            ['hex' => '#5E1F2B', 'label' => 'Vino'],
            ['hex' => '#B08A5C', 'label' => 'Camel'],
        ],
        'gifts' => [
            [
                'kind' => 'envelope',
                'title' => 'Lluvia de sobres',
                'description' => 'Esa noche habrá una caja a la entrada para tu sobre.',
            ],
            [
                'kind' => 'registry',
                'title' => 'Mesa de regalos',
                'description' => 'También puedes elegir un detalle de su mesa de regalos.',
                'details' => [['label' => 'Número de evento', 'value' => '51234590']],
                'link_url' => 'https://mesaderegalos.liverpool.com.mx/',
                'link_label' => 'Ver mesa de regalos',
            ],
        ],
    ],
];
