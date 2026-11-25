<?php

/*
| Content of the baby-shower-lluvia demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource). The venue photo comes from the wedding demo.
*/

$image = fn (string $file): string => "/invitations/baby-shower-lluvia/images/{$file}";

return [
    'event_date' => '2027-04-17',
    'event_time' => '16:00',
    'rsvp_deadline' => '2027-04-05',
    'content' => [
        'names' => ['Daniela'],
        'families' => 'Familia Ríos Mendoza',
        'baby_name' => 'Emilia',
        'due_label' => 'Llega en mayo de 2027',
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/baby-shower-lluvia/music.mp3',
        'message' => 'Se viene una lluvia de amor para Emilia y no queremos que te la pierdas. Ven a consentirnos con tu compañía.',
        'closing_message' => 'Gracias por llover tanto cariño sobre nosotras. Emilia ya sabe que la esperan muchos abrazos.',
        'tagline' => 'Con amor, Daniela',
        'hosts' => [
            ['role' => 'Organizan con cariño', 'names' => ['Paola Ríos', 'Andrea Mendoza', 'Fernanda Lara']],
            ['role' => 'La futura abuela', 'names' => ['Patricia Mendoza']],
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
                'icon' => '☂️',
                'tag' => 'Baby shower',
                'name' => 'Salón Jardín Azul',
                'address_lines' => ['Calle Magnolia 58', 'Col. Las Flores, Villa del Mar'],
                'time' => '16:00 hrs',
                'latitude' => 15.862436,
                'longitude' => -97.071639,
                'image' => '/invitations/boda-clasica/images/salon.jpeg',
            ],
        ],
        'program' => [
            ['time' => '16:00 hrs', 'icon' => '☂️', 'title' => 'Llegada', 'description' => 'Un photo booth bajo el paraguas.'],
            ['time' => '16:45 hrs', 'icon' => '🍼', 'title' => 'Juegos', 'description' => 'Adivina el biberón, la lotería del bebé y más.'],
            ['time' => '17:30 hrs', 'icon' => '🧁', 'title' => 'Mesa de postres', 'description' => 'Cupcakes de nube y agua de jamaica.'],
            ['time' => '18:15 hrs', 'icon' => '🎁', 'title' => 'Abrir regalos', 'description' => 'Con muchas risas y algún que otro pañuelo.'],
        ],
        'gallery' => [
            ['image' => $image('01.svg'), 'alt' => 'Foto 1', 'caption' => 'La gran noticia'],
            ['image' => $image('02.svg'), 'alt' => 'Foto 2', 'caption' => 'Ultrasonido'],
            ['image' => $image('03.svg'), 'alt' => 'Foto 3', 'caption' => 'Pancita de 24 semanas'],
            ['image' => $image('04.svg'), 'alt' => 'Foto 4', 'caption' => 'Su ropita'],
            ['image' => $image('05.svg'), 'alt' => 'Foto 5', 'caption' => 'Sus zapatitos'],
            ['image' => $image('06.svg'), 'alt' => 'Foto 6', 'caption' => 'Esperándote'],
        ],
        'dress_code' => ['type' => 'Casual', 'description' => 'Tonos pastel: lila, azul cielo o amarillo suave.'],
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
