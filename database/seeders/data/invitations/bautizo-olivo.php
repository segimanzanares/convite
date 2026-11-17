<?php

/*
| Content of the bautizo-olivo demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource). The venue photos come from the wedding demo.
*/

$image = fn (string $file): string => "/invitations/bautizo-olivo/images/{$file}";

return [
    'event_date' => '2027-05-16',
    'event_time' => '11:00',
    'rsvp_deadline' => '2027-05-01',
    'content' => [
        'name' => 'Ana Lucía',
        'first_name' => 'Ana Lucía',
        'hosts' => 'Con cariño, Paola y Ricardo',
        'monogram' => 'AL',
        'rsvp_whatsapp' => '521234567890',
        'hero_photo' => $image('portada.svg'),
        'closing_message' => 'Hoy comienzo mi camino en la fe junto a las personas que más me quieren. Gracias por ser parte de este día.',
        'tagline' => 'Mi bautizo · Con amor y fe',
        'story' => [
            'eyebrow' => 'Mi historia',
            'title' => 'Una nueva vida',
            'opening' => 'Hola, soy Ana Lucía…',
            'paragraphs' => [
                'Llegué en primavera, como las flores del olivo, y desde ese día mi casa se llenó de risas, desvelos y mucho amor.',
                'Mis papás quieren darle gracias a Dios por mi vida, y han elegido a dos personas muy especiales para que me guíen en la fe.',
                'Me haría muy feliz que estuvieras con nosotros en mi bautizo y en la comida que preparamos para celebrarlo.',
            ],
            'signature' => 'Ana Lucía',
            'photo' => $image('historia.svg'),
        ],
        'parents' => [
            'role' => 'Mis papás',
            'names' => ['Paola Medina Cruz', 'Ricardo Ibarra Soto'],
        ],
        'godparents' => [
            ['role' => 'Mis padrinos de bautizo', 'names' => ['Fernanda Medina', 'Luis Alberto Ríos']],
            ['role' => 'Padrinos de vela', 'names' => ['Teresa Soto', 'Manuel Ibarra']],
        ],
        'venues' => [
            [
                'icon' => '⛪',
                'tag' => 'Ceremonia',
                'name' => 'Capilla de Nuestra Señora del Olivar',
                'address_lines' => ['Calle Olivos 18', 'Barrio Antiguo, Villa del Mar'],
                'time' => '11:00 hrs',
                'latitude' => 15.861208,
                'longitude' => -97.065710,
                'image' => '/invitations/boda-clasica/images/catedral.jpg',
            ],
            [
                'icon' => '🌿',
                'tag' => 'Comida',
                'name' => 'Hacienda Los Olivos',
                'address_lines' => ['Carretera a San Pedro km 4', 'Villa del Mar'],
                'time' => '13:30 hrs',
                'latitude' => 15.862436,
                'longitude' => -97.071639,
                'image' => '/invitations/boda-clasica/images/salon.jpeg',
            ],
        ],
        'program' => [
            ['time' => '11:00 hrs', 'icon' => '🕯️', 'title' => 'Bautizo', 'description' => 'La ceremonia en la capilla.'],
            ['time' => '13:30 hrs', 'icon' => '🌿', 'title' => 'Bienvenida', 'description' => 'Aguas frescas y botanas bajo los olivos.'],
            ['time' => '14:30 hrs', 'icon' => '🍽️', 'title' => 'Comida', 'description' => 'Una mesa larga para toda la familia.'],
            ['time' => '16:30 hrs', 'icon' => '🎂', 'title' => 'Pastel y brindis', 'description' => 'Unas palabras de mis papás y mis padrinos.'],
        ],
        'gallery' => [
            ['image' => $image('01.svg'), 'alt' => 'Foto 1', 'caption' => 'Recién llegada'],
            ['image' => $image('02.svg'), 'alt' => 'Foto 2', 'caption' => 'Mis manitas'],
            ['image' => $image('03.svg'), 'alt' => 'Foto 3', 'caption' => 'Con mi hermano'],
            ['image' => $image('04.svg'), 'alt' => 'Foto 4', 'caption' => 'Paseo en el jardín'],
            ['image' => $image('05.svg'), 'alt' => 'Foto 5', 'caption' => 'Mi primer mes'],
            ['image' => $image('06.svg'), 'alt' => 'Foto 6', 'caption' => 'Con mis padrinos'],
        ],
        'dress_code' => [
            'type' => 'Casual elegante',
            'description' => 'Tonos neutros, verdes y tierra, cómodos para una comida al aire libre.',
            'men' => 'Pantalón de vestir y camisa',
            'women' => 'Vestido midi o conjunto de lino',
            'reserved_color' => [
                'name' => 'Blanco',
                'hex' => '#FFFFFF',
                'description' => 'lo llevará la bautizada; te pedimos evitarlo.',
            ],
        ],
        'gifts' => [
            [
                'kind' => 'registry',
                'title' => 'Mesa de regalos',
                'description' => 'Mis papás eligieron algunas cosas que voy a necesitar.',
                'link_url' => 'https://www.amazon.com.mx/baby-reg/homepage',
                'link_label' => 'Ver mi lista',
            ],
            [
                'kind' => 'envelope',
                'title' => 'Lluvia de sobres',
                'description' => 'Habrá un buzón a la entrada de la hacienda.',
            ],
        ],
    ],
];
