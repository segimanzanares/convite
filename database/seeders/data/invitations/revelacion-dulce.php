<?php

/*
| Content of the revelacion-dulce demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource), which keeps the answer secret. The venue photo comes from the wedding demo and the
| music from another demo.
*/

$image = fn (string $file): string => "/invitations/revelacion-dulce/images/{$file}";

return [
    'event_date' => '2027-03-13',
    'event_time' => '17:00',
    'rsvp_deadline' => '2027-02-27',
    'content' => [
        'names' => ['Mariel', 'Javier'],
        'families' => 'Familia Robles Vega',
        'due_label' => 'Llega en agosto de 2027',
        'baby_names' => ['girl' => 'Regina', 'boy' => 'Emiliano'],
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/cumpleanos-confeti/music.mp3',
        'message' => 'La respuesta está horneada dentro del pastel. Cuando lo partamos, lo sabremos todos juntos.',
        'closing_message' => 'Gracias por endulzar esta espera con nosotros. Fresa o mora azul, lo mejor es que ya viene en camino.',
        'tagline' => 'Con mucho amor, Mariel y Javier',
        'grandparents' => [
            ['role' => 'Abuelos maternos', 'names' => ['Carmen Vega', 'Alfonso Vega']],
            ['role' => 'Abuelos paternos', 'names' => ['Gloria Robles', 'Héctor Robles']],
        ],
        'venues' => [
            [
                'icon' => '🎂',
                'tag' => 'La merienda',
                'name' => 'Terraza La Pastelería',
                'address_lines' => ['Calle Vainilla 18', 'Centro, Villa del Mar'],
                'time' => '17:00 hrs',
                'latitude' => 15.862436,
                'longitude' => -97.071639,
                'image' => '/invitations/boda-clasica/images/salon.jpeg',
            ],
        ],
        'program' => [
            ['time' => '17:00 hrs', 'icon' => '🧁', 'title' => 'Bienvenida', 'description' => 'Cupcakes rosas y azules para elegir equipo.'],
            ['time' => '17:30 hrs', 'icon' => '☕', 'title' => 'Merienda', 'description' => 'Café, chocolate caliente y pan dulce.'],
            ['time' => '18:30 hrs', 'icon' => '🍬', 'title' => 'Mesa de dulces', 'description' => 'Y el juego de las apuestas.'],
            ['time' => '19:00 hrs', 'icon' => '🔪', 'title' => 'Partimos el pastel', 'description' => 'Por dentro, la respuesta.'],
        ],
        'gallery' => [
            ['image' => $image('01.svg'), 'alt' => 'Foto 1', 'caption' => 'Un antojo'],
            ['image' => $image('02.svg'), 'alt' => 'Foto 2', 'caption' => 'El ultrasonido'],
            ['image' => $image('03.svg'), 'alt' => 'Foto 3', 'caption' => 'Sus zapatitos'],
            ['image' => $image('04.svg'), 'alt' => 'Foto 4', 'caption' => 'Diez semanas'],
            ['image' => $image('05.svg'), 'alt' => 'Foto 5', 'caption' => 'Probando pasteles'],
            ['image' => $image('06.svg'), 'alt' => 'Foto 6', 'caption' => 'Muy pronto'],
        ],
        'dress_code' => ['type' => 'Casual', 'description' => 'Ven de rosa fresa o azul mora, según tu corazonada.'],
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
