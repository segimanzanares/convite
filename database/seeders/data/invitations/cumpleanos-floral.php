<?php

/*
| Content of the birthday demo. It has no order, so its date always shows 60 days ahead (see
| InvitationContentResource).
*/

return [
    'event_date' => '2027-06-12',
    'event_time' => '16:00',
    'rsvp_deadline' => '2027-05-29',
    'content' => [
        'name' => 'Carmen Ruiz',
        'first_name' => 'Carmen',
        'age' => 70,
        'hosts' => 'Con cariño, sus hijos y nietos',
        'rsvp_whatsapp' => '521234567890',
        'music' => '/invitations/cumpleanos-floral/music.mp3',
        'message' => 'Setenta años de vida, de amor y de historias compartidas. Con el corazón lleno de gratitud, queremos invitarte a celebrar junto a nuestra querida Carmen un día para agradecer, abrazarla y seguir sembrando recuerdos en familia.',
        'tagline' => '70 años de amor · Gracias por tanto',
        'venues' => [
            [
                'icon' => '🥂',
                'tag' => 'Comida & Celebración',
                'name' => 'Jardín Las Bugambilias',
                'address_lines' => ['Calle de los Laureles 120', 'Barrio de San Rafael, Villa del Mar'],
                'time' => '16:00 hrs',
                'latitude' => 15.871279,
                'longitude' => -97.064253,
            ],
        ],
        'program' => [
            ['time' => '16:00 hrs', 'icon' => '🥂', 'title' => 'Recepción', 'description' => 'Bienvenida en el Jardín Las Bugambilias.'],
            ['time' => '16:30 hrs', 'icon' => '🍽️', 'title' => 'Comida', 'description' => 'Disfrutaremos juntos de una comida en familia.'],
            ['time' => '17:30 hrs', 'icon' => '🎂', 'title' => 'Pastel y mañanitas', 'description' => 'Cantaremos juntos para celebrarla.'],
            ['time' => '18:00 hrs', 'icon' => '🎶', 'title' => 'Baile y convivencia', 'description' => 'Música, baile y la mejor compañía hasta el anochecer.'],
        ],
        'dress_code' => [
            'type' => 'Formal de día',
            'description' => 'Te sugerimos vestir en tonos suaves y florales.',
        ],
        'swatches' => [
            ['hex' => '#E8C4CC', 'label' => 'Rosa Palo'],
            ['hex' => '#B98AA0', 'label' => 'Malva'],
            ['hex' => '#B7A7C9', 'label' => 'Lavanda'],
            ['hex' => '#EBC2A8', 'label' => 'Durazno'],
            ['hex' => '#9FB49A', 'label' => 'Salvia'],
            ['hex' => '#E6D3B3', 'label' => 'Champagne'],
        ],
    ],
];
