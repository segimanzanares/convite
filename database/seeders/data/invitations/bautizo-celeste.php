<?php

/*
| Content of the bautizo-celeste demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource). The venue photos come from the wedding demo.
*/

$image = fn (string $file): string => "/invitations/bautizo-celeste/images/{$file}";

return [
    'event_date' => '2027-03-21',
    'event_time' => '12:00',
    'rsvp_deadline' => '2027-03-07',
    'content' => [
        'name' => 'Emiliano José',
        'first_name' => 'Emiliano',
        'hosts' => 'Con amor, Andrea y Joaquín',
        'monogram' => 'EJ',
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/bautizo-celeste/music.mp3',
        'hero_photo' => $image('portada.svg'),
        'closing_message' => 'Gracias por acompañarme en el día en que comienzo mi camino en la fe. Que la luz de Dios nos acompañe siempre.',
        'tagline' => 'Mi bautizo · Un regalo del cielo',
        'story' => [
            'eyebrow' => 'Una carta para ti',
            'title' => 'Mi primer paso en la fe',
            'opening' => 'Querida familia, queridos amigos:',
            'paragraphs' => [
                'Llegué a este mundo hace unos meses y desde entonces no he dejado de recibir abrazos, besos y canciones de cuna. Mis papás dicen que soy su regalo del cielo.',
                'Ahora quieren presentarme ante Dios para que me acompañe toda la vida, y yo quiero que tú estés ahí para verlo.',
                'Ven a celebrar conmigo este día tan especial: prometo portarme bien (o casi).',
            ],
            'signature' => 'Emiliano',
            'photo' => $image('historia.svg'),
        ],
        'parents' => [
            'role' => 'Mis papás',
            'names' => ['Andrea Salinas Ríos', 'Joaquín Ortega Luna'],
        ],
        'godparents' => [
            ['role' => 'Mis padrinos de bautizo', 'names' => ['Mariana Salinas', 'Héctor Domínguez']],
        ],
        'venues' => [
            [
                'icon' => '⛪',
                'tag' => 'Ceremonia',
                'name' => 'Parroquia de San José',
                'address_lines' => ['Av. de los Pinos 210', 'Col. Centro, Villa del Mar'],
                'time' => '12:00 hrs',
                'latitude' => 15.861208,
                'longitude' => -97.065710,
                'image' => '/invitations/boda-clasica/images/catedral.jpg',
            ],
            [
                'icon' => '🕊️',
                'tag' => 'Celebración',
                'name' => 'Jardín Cielo Azul',
                'address_lines' => ['Camino Real 455', 'Lomas del Mar, Villa del Mar'],
                'time' => '14:00 hrs',
                'latitude' => 15.862436,
                'longitude' => -97.071639,
                'image' => '/invitations/boda-clasica/images/salon.jpeg',
            ],
        ],
        'program' => [
            ['time' => '12:00 hrs', 'icon' => '⛪', 'title' => 'Ceremonia', 'description' => 'Recibo las aguas del bautismo.'],
            ['time' => '13:15 hrs', 'icon' => '📸', 'title' => 'Fotos en familia', 'description' => 'A la salida de la parroquia.'],
            ['time' => '14:00 hrs', 'icon' => '🥂', 'title' => 'Bienvenida', 'description' => 'Bebidas y bocadillos en el jardín.'],
            ['time' => '15:00 hrs', 'icon' => '🍽️', 'title' => 'Comida', 'description' => 'Un menú para compartir en familia.'],
            ['time' => '17:00 hrs', 'icon' => '🎂', 'title' => 'Pastel', 'description' => 'Y unas palabras de mis padrinos.'],
        ],
        'gallery' => [
            ['image' => $image('01.svg'), 'alt' => 'Foto 1', 'caption' => 'Mi primer día'],
            ['image' => $image('02.svg'), 'alt' => 'Foto 2', 'caption' => 'En brazos de mamá'],
            ['image' => $image('03.svg'), 'alt' => 'Foto 3', 'caption' => 'Mi primera sonrisa'],
            ['image' => $image('04.svg'), 'alt' => 'Foto 4', 'caption' => 'Con mis abuelos'],
            ['image' => $image('05.svg'), 'alt' => 'Foto 5', 'caption' => 'Siesta con papá'],
            ['image' => $image('06.svg'), 'alt' => 'Foto 6', 'caption' => 'Listo para mi bautizo'],
        ],
        'dress_code' => [
            'type' => 'Formal de día',
            'description' => 'Te sugerimos tonos claros y pastel para acompañar el cielo de este día.',
            'men' => 'Guayabera o camisa de vestir',
            'women' => 'Vestido de día',
            'reserved_color' => [
                'name' => 'Blanco',
                'hex' => '#FFFFFF',
                'description' => 'es el color del bautizado; te pedimos evitarlo.',
            ],
        ],
        'gifts' => [
            [
                'kind' => 'registry',
                'title' => 'Mesa de regalos',
                'description' => 'Elige un detalle de mi lista en Liverpool.',
                'link_url' => 'https://mesaderegalos.liverpool.com.mx/',
                'link_label' => 'Ver mi mesa de regalos',
            ],
            [
                'kind' => 'bank',
                'title' => 'Transferencia',
                'details' => [
                    ['label' => 'Banco', 'value' => 'BBVA'],
                    ['label' => 'Titular', 'value' => 'Andrea Salinas Ríos'],
                    ['label' => 'Cuenta', 'value' => '0123 4567 8901 2345'],
                ],
                'copy_value' => '0123456789012345',
            ],
        ],
    ],
];
