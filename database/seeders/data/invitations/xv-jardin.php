<?php

/*
| Content of the XV demo. It has no order, so its date always shows 60 days ahead (see InvitationContentResource).
| The venue photos are shared with the wedding demo.
*/

$image = fn (string $file): string => "/invitations/xv-jardin/images/{$file}";

return [
    'event_date' => '2027-06-12',
    'event_time' => '17:30',
    'rsvp_deadline' => '2027-05-28',
    'content' => [
        'name' => 'Sofía Valentina',
        'first_name' => 'Sofía',
        'age' => 15,
        'hosts' => 'Con cariño, Sofía',
        'monogram' => 'SV',
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/xv-jardin/music.mp3',
        'hero_photo' => $image('portada.jpg'),
        'closing_message' => '…este cuento apenas comienza, y no hay mejor forma de escribir su siguiente página que a tu lado.',
        'tagline' => 'Una noche para recordar',
        'story' => [
            'eyebrow' => 'Capítulo XV · El comienzo',
            'title' => 'Un sueño que florece',
            'opening' => 'Érase una vez…',
            'paragraphs' => [
                'Una niña que soñaba con jardines llenos de luz, con música bajo las estrellas y con una noche en la que todas las personas que quiere estuvieran juntas. Hoy ese sueño está a punto de hacerse realidad.',
                'Cumplir quince años es cerrar el primer capítulo de mi historia y abrir uno nuevo, lleno de ilusiones. Cada uno de ustedes ha escrito una parte de este cuento, y no imagino esta página sin ustedes.',
                'Por eso quiero invitarte a vivir conmigo una noche en el jardín encantado, donde celebraremos, bailaremos y guardaremos recuerdos para siempre.',
            ],
            'signature' => 'Con cariño, Sofía',
            'photo' => $image('historia.jpg'),
        ],
        'parents' => [
            'role' => 'Mis papás',
            'names' => ['Laura Méndez Ríos', 'Ricardo Salinas Ortega'],
        ],
        'godparents' => [
            ['role' => 'Padrinos de velación', 'names' => ['Andrea Ruiz', 'Fernando Ruiz']],
            ['role' => 'Padrinos de anillo', 'names' => ['Mónica Torres', 'Daniel Herrera']],
        ],
        'venues' => [
            [
                'icon' => '⛪',
                'tag' => 'Misa de acción de gracias',
                'name' => 'Parroquia de San Rafael Arcángel',
                'address_lines' => ['Calle de los Laureles 214', 'Barrio de San Rafael, Villa del Mar'],
                'time' => '17:30 hrs',
                'latitude' => 15.861208,
                'longitude' => -97.065710,
                'image' => '/invitations/boda-clasica/images/catedral.jpg',
            ],
            [
                'icon' => '✨',
                'tag' => 'Recepción',
                'name' => 'Jardín Las Magnolias',
                'address_lines' => ['Camino Real a La Ensenada km 3', 'Col. Las Palmas, Villa del Mar'],
                'time' => '19:00 hrs',
                'latitude' => 15.862436,
                'longitude' => -97.071639,
                'image' => '/invitations/boda-clasica/images/salon.jpeg',
            ],
        ],
        'program' => [
            ['time' => '19:00 hrs', 'icon' => '🥂', 'title' => 'Recepción', 'description' => 'Bienvenida entre faroles y flores blancas.'],
            ['time' => '20:00 hrs', 'icon' => '👑', 'title' => 'Mi entrada', 'description' => 'El momento en que comienza el cuento.'],
            ['time' => '20:30 hrs', 'icon' => '💃', 'title' => 'Vals', 'description' => 'Bailaré con mi papá y mis chambelanes.'],
            ['time' => '21:15 hrs', 'icon' => '🍽️', 'title' => 'Cena', 'description' => 'Una cena especial bajo las estrellas.'],
            ['time' => '22:30 hrs', 'icon' => '🎂', 'title' => 'Brindis y pastel', 'description' => 'Unas palabras, un brindis y un momento dulce.'],
            ['time' => '23:00 hrs', 'icon' => '🪩', 'title' => '¡A bailar!', 'description' => 'Música y fiesta hasta que termine la noche.'],
        ],
        'gallery' => [
            ['image' => $image('01.svg'), 'alt' => 'Foto 1', 'caption' => 'Un sueño dorado'],
            ['image' => $image('02.svg'), 'alt' => 'Foto 2', 'caption' => 'Mis primeros pasos'],
            ['image' => $image('03.svg'), 'alt' => 'Foto 3', 'caption' => 'La magia está en los detalles'],
            ['image' => $image('04.svg'), 'alt' => 'Foto 4', 'caption' => 'Con mi familia'],
            ['image' => $image('05.svg'), 'alt' => 'Foto 5', 'caption' => 'Mis amigas'],
            ['image' => $image('06.svg'), 'alt' => 'Foto 6', 'caption' => 'Quince primaveras'],
            ['image' => $image('07.svg'), 'alt' => 'Foto 7', 'caption' => 'Lo que viene'],
        ],
        'dress_code' => [
            'type' => 'Formal',
            'description' => 'Te sugerimos vestir de gala, en tonos de jardín.',
            'men' => 'Traje',
            'women' => 'Vestido largo',
            'reserved_color' => [
                'name' => 'Verde esmeralda',
                'hex' => '#2F6B4F',
                'description' => 'está reservado para la quinceañera; te pedimos evitarlo.',
            ],
        ],
        'swatches' => [
            ['hex' => '#8F9C7B', 'label' => 'Salvia'],
            ['hex' => '#67754B', 'label' => 'Oliva'],
            ['hex' => '#D9C796', 'label' => 'Champagne'],
            ['hex' => '#B99A5A', 'label' => 'Dorado'],
            ['hex' => '#E3D5C4', 'label' => 'Arena'],
            ['hex' => '#C7B7D6', 'label' => 'Lavanda'],
            ['hex' => '#E7C3BE', 'label' => 'Rosa Polvo'],
            ['hex' => '#A9B8C6', 'label' => 'Azul Niebla'],
        ],
        'gifts' => [
            [
                'kind' => 'envelope',
                'title' => 'Lluvia de sobres',
                'description' => 'El día de la fiesta habrá un buzón a la entrada para tu sobre.',
            ],
            [
                'kind' => 'bank',
                'title' => 'Transferencia',
                'details' => [
                    ['label' => 'Banco', 'value' => 'BBVA'],
                    ['label' => 'Titular', 'value' => 'Laura Méndez Ríos'],
                    ['label' => 'Cuenta', 'value' => '4189 1431 8018 4403'],
                ],
                'copy_value' => '4189143180184403',
            ],
        ],
    ],
];
