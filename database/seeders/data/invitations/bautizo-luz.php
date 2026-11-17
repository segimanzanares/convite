<?php

/*
| Content of the bautizo-luz demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource). The venue photos come from the wedding demo.
*/

$image = fn (string $file): string => "/invitations/bautizo-luz/images/{$file}";

return [
    'event_date' => '2027-04-10',
    'event_time' => '17:00',
    'rsvp_deadline' => '2027-03-27',
    'content' => [
        'name' => 'Julieta María',
        'first_name' => 'Julieta',
        'hosts' => 'Con amor, Carolina y Eduardo',
        'monogram' => 'JM',
        'rsvp_whatsapp' => '521234567890',
        'hero_photo' => $image('portada.svg'),
        'closing_message' => 'Que la luz que hoy se enciende en mí ilumine siempre a quienes me acompañan. Gracias por estar aquí.',
        'tagline' => 'Gracias por ser parte de mi primer paso en la fe',
        'story' => [
            'eyebrow' => 'Una carta',
            'title' => 'La luz que me acompaña',
            'opening' => 'Querida familia:',
            'paragraphs' => [
                'Dicen que cuando llegué, la casa se llenó de luz. Mis papás aún no se acostumbran a los desvelos, pero dicen que cada sonrisa mía los vale.',
                'El día de mi bautizo se encenderá una vela para mí, la luz que me acompañará toda la vida. Mis padrinos la sostendrán y prometerán cuidarla conmigo.',
                'Nada me haría más feliz que verte ese día, compartiendo la mesa y la alegría con mi familia.',
            ],
            'signature' => 'Julieta',
            'photo' => $image('historia.svg'),
        ],
        'parents' => [
            'role' => 'Mis papás',
            'names' => ['Carolina Arteaga Ruiz', 'Eduardo Navarro Prieto'],
        ],
        'godparents' => [
            ['role' => 'Padrinos de bautizo', 'names' => ['Natalia Arteaga', 'Gerardo Lozano']],
            ['role' => 'Madrina de vela', 'names' => ['Rosario Prieto']],
        ],
        'venues' => [
            [
                'icon' => '⛪',
                'tag' => 'Ceremonia',
                'name' => 'Templo de Santa María de la Luz',
                'address_lines' => ['Plaza Mayor 1', 'Centro Histórico, Villa del Mar'],
                'time' => '17:00 hrs',
                'latitude' => 15.861208,
                'longitude' => -97.065710,
                'image' => '/invitations/boda-clasica/images/catedral.jpg',
            ],
            [
                'icon' => '🕯️',
                'tag' => 'Cena',
                'name' => 'Casa Candela',
                'address_lines' => ['Calle de la Luz 77', 'Centro Histórico, Villa del Mar'],
                'time' => '19:00 hrs',
                'latitude' => 15.862436,
                'longitude' => -97.071639,
                'image' => '/invitations/boda-clasica/images/salon.jpeg',
            ],
        ],
        'program' => [
            ['time' => '17:00 hrs', 'icon' => '🕯️', 'title' => 'Bautismo', 'description' => 'La ceremonia y el encendido de la vela.'],
            ['time' => '19:00 hrs', 'icon' => '🥂', 'title' => 'Recepción', 'description' => 'Un brindis de bienvenida.'],
            ['time' => '20:00 hrs', 'icon' => '🍽️', 'title' => 'Cena', 'description' => 'Tres tiempos para compartir.'],
            ['time' => '21:30 hrs', 'icon' => '🎂', 'title' => 'Pastel y palabras', 'description' => 'De mis papás y mis padrinos.'],
        ],
        'gallery' => [
            ['image' => $image('01.svg'), 'alt' => 'Foto 1', 'caption' => 'Mi primera luz'],
            ['image' => $image('02.svg'), 'alt' => 'Foto 2', 'caption' => 'En casa'],
            ['image' => $image('03.svg'), 'alt' => 'Foto 3', 'caption' => 'Con papá'],
            ['image' => $image('04.svg'), 'alt' => 'Foto 4', 'caption' => 'Dormida'],
            ['image' => $image('05.svg'), 'alt' => 'Foto 5', 'caption' => 'Mi abuela'],
            ['image' => $image('06.svg'), 'alt' => 'Foto 6', 'caption' => 'Mi ropón'],
        ],
        'dress_code' => [
            'type' => 'Formal',
            'description' => 'Una tarde de velas: tonos marfil, dorado, azul noche y neutros.',
            'men' => 'Traje',
            'women' => 'Vestido de cóctel',
            'reserved_color' => [
                'name' => 'Blanco',
                'hex' => '#FFFFFF',
                'description' => 'es el color de la bautizada; te pedimos evitarlo.',
            ],
        ],
        'gifts' => [
            [
                'kind' => 'registry',
                'title' => 'Mesa de regalos',
                'description' => 'Una lista con lo que más voy a necesitar este año.',
                'link_url' => 'https://mesaderegalos.liverpool.com.mx/',
                'link_label' => 'Ver la mesa de regalos',
            ],
            [
                'kind' => 'bank',
                'title' => 'Transferencia',
                'details' => [
                    ['label' => 'Banco', 'value' => 'Banorte'],
                    ['label' => 'Titular', 'value' => 'Carolina Arteaga Ruiz'],
                    ['label' => 'Cuenta', 'value' => '4915 6610 9876 5432'],
                ],
                'copy_value' => '4915661098765432',
            ],
            [
                'kind' => 'envelope',
                'title' => 'Lluvia de sobres',
                'description' => 'Habrá un buzón junto a la mesa de bienvenida.',
            ],
        ],
    ],
];
