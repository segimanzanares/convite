<?php

/*
| Content of the serene wedding demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource). The photos and music are shared with the classic wedding demo.
*/

$image = fn (string $file): string => "/invitations/boda-clasica/images/{$file}";

return [
    'event_date' => '2027-11-06',
    'event_time' => '18:00',
    'rsvp_deadline' => '2027-10-16',
    'content' => [
        'names' => ['Lucía', 'Mateo'],
        'families' => 'Familia Herrera Soto & Familia Ibarra León',
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/boda-clasica/music.mp3',
        'cover' => $image('09.jpeg'),
        'message' => 'Siete años, dos mudanzas y un perro después, decidimos que es momento de hacerlo oficial. Queremos que estés con nosotros el día en que empezamos esta nueva etapa: sin ti, la fiesta no estaría completa.',
        'tagline' => 'Gracias por acompañarnos en el comienzo de nuestra historia.',
        'venues' => [
            [
                'icon' => '🕊️',
                'tag' => 'Ceremonia civil',
                'name' => 'Jardín de la Hacienda San Gabriel',
                'address_lines' => ['Camino a San Gabriel 45', 'San Gabriel, Villa del Mar'],
                'time' => '18:00 hrs',
                'latitude' => 15.861208,
                'longitude' => -97.065710,
                'image' => $image('catedral.jpg'),
            ],
            [
                'icon' => '🌙',
                'tag' => 'Cena y fiesta',
                'name' => 'Salón Azul del Lago',
                'address_lines' => ['Blvd. del Lago 300', 'Col. La Ribera, Villa del Mar'],
                'time' => '19:30 hrs',
                'latitude' => 15.862436,
                'longitude' => -97.071639,
                'image' => $image('salon.jpeg'),
            ],
        ],
        'program' => [
            ['time' => '18:00', 'icon' => '🕊️', 'title' => 'Nos damos el «sí»', 'description' => 'Ceremonia civil al aire libre, entre los árboles de la hacienda.'],
            ['time' => '19:00', 'icon' => '📸', 'title' => 'Fotos y abrazos', 'description' => 'Un rato para saludarnos y tomarnos la foto del recuerdo.'],
            ['time' => '19:30', 'icon' => '🥂', 'title' => 'Brindis junto al lago', 'description' => 'Levantamos las copas mientras cae la tarde.'],
            ['time' => '20:30', 'icon' => '🍷', 'title' => 'Cena', 'description' => 'Nos sentamos a la mesa a compartir.'],
            ['time' => '22:00', 'icon' => '🎶', 'title' => '¡A bailar!', 'description' => 'La pista se abre y no se cierra hasta el amanecer.'],
        ],
        'gallery' => [
            ['image' => $image('08.jpeg'), 'alt' => 'Lucía y Mateo, foto 1', 'caption' => 'Donde todo empezó'],
            ['image' => $image('10.jpeg'), 'alt' => 'Lucía y Mateo, foto 2', 'caption' => 'Nuestro primer viaje'],
            ['image' => $image('03.jpeg'), 'alt' => 'Lucía y Mateo, foto 3', 'caption' => 'Domingos lentos'],
            ['image' => $image('06.jpeg'), 'alt' => 'Lucía y Mateo, foto 4', 'caption' => 'El día que dijimos que sí'],
            ['image' => $image('04.jpeg'), 'alt' => 'Lucía y Mateo, foto 5', 'caption' => 'Risas de siempre'],
            ['image' => $image('07.jpeg'), 'alt' => 'Lucía y Mateo, foto 6', 'caption' => 'Lo que viene'],
        ],
        'dress_code' => [
            'type' => 'Etiqueta',
            'description' => 'Será una noche elegante junto al lago: ven arreglado y con zapatos cómodos para bailar.',
            'men' => 'Smoking o traje oscuro',
            'women' => 'Vestido largo',
            'reserved_color' => [
                'name' => 'Blanco',
                'hex' => '#FFFFFF',
                'description' => 'y sus variantes (marfil, crema) quedan para la novia.',
            ],
        ],
        'swatches' => [
            ['hex' => '#1E3A8A', 'label' => 'Azul noche'],
            ['hex' => '#4682B4', 'label' => 'Azul acero'],
            ['hex' => '#93C5FD', 'label' => 'Azul cielo'],
            ['hex' => '#64748B', 'label' => 'Pizarra'],
            ['hex' => '#CBD5E1', 'label' => 'Plata'],
            ['hex' => '#E7DCC8', 'label' => 'Arena'],
        ],
        'gifts' => [
            [
                'kind' => 'envelope',
                'title' => 'Lluvia de sobres',
                'description' => 'Habrá una caja a la entrada del salón para tus buenos deseos.',
            ],
            [
                'kind' => 'bank',
                'title' => 'Transferencia',
                'description' => 'Para nuestra luna de miel, si prefieres hacerlo desde casa.',
                'details' => [
                    ['label' => 'Banco', 'value' => 'Banco Ejemplo'],
                    ['label' => 'Titular', 'value' => 'Lucía Herrera Soto'],
                    ['label' => 'CLABE', 'value' => '012 180 001234567891'],
                ],
                'copy_value' => '012180001234567891',
            ],
            [
                'kind' => 'registry',
                'title' => 'Mesa de regalos',
                'description' => 'Elegimos algunas cosas para nuestra nueva casa.',
                'details' => [['label' => 'Número de evento', 'value' => '51234570']],
                'link_url' => 'https://mesaderegalos.liverpool.com.mx/',
                'link_label' => 'Ver la mesa de regalos',
            ],
        ],
    ],
];
