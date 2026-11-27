<?php

namespace App\Services;

use App\Enums\InvitationKind;
use App\Enums\PlanFeature;
use App\Enums\PlanType;
use App\Models\Invitation;
use App\Models\Plan;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

/**
 * Lets a demo (an invitation without an order) show what a plan includes: `/i/{slug}?plan=premium` turns on the online
 * RSVP and the wishes book of that plan, plus a bar linking to the demo door and live gallery when the plan has them
 * (`/i/{slug}/demo/...`, see DemoShowcaseController). Nothing a visitor sends is stored: the props carry `demo: true`
 * and the pages only pretend to send it, while the routes that store answers, messages and photos keep refusing demos.
 */
class DemoShowcaseService
{
    /**
     * Sample messages of the wishes book, per kind of event, newest first.
     *
     * @var array<string, list<array{author_name: string, message: string}>>
     */
    private const SAMPLE_WISHES = [
        'wedding' => [
            ['author_name' => 'Tía Rosa', 'message' => '¡Que el amor que hoy celebran los acompañe toda la vida! Los queremos muchísimo.'],
            ['author_name' => 'Daniela y Marco', 'message' => 'Gracias por dejarnos ser parte de su historia. ¡Felicidades, novios!'],
            ['author_name' => 'Abuelo Luis', 'message' => 'Cuídense, respétense y nunca dejen de reír juntos.'],
        ],
        'birthday' => [
            ['author_name' => 'Tía Rosa', 'message' => '¡Feliz cumpleaños! Que este año te traiga mucha salud y alegría.'],
            ['author_name' => 'Daniela y Marco', 'message' => 'Gracias por invitarnos a celebrar contigo. ¡Que se repita muchos años más!'],
            ['author_name' => 'Abuelo Luis', 'message' => 'Te queremos mucho. Disfruta tu día como te mereces.'],
        ],
        'xv' => [
            ['author_name' => 'Tía Rosa', 'message' => '¡Felices XV! Que esta nueva etapa esté llena de sueños cumplidos.'],
            ['author_name' => 'Daniela y Marco', 'message' => 'Estás hermosa. Gracias por compartir esta noche tan especial con nosotros.'],
            ['author_name' => 'Abuelo Luis', 'message' => 'Siempre serás mi princesa. Te quiero mucho.'],
        ],
        'baptism' => [
            ['author_name' => 'Tía Rosa', 'message' => 'Que Dios bendiga y guarde siempre a este angelito. ¡Felicidades a la familia!'],
            ['author_name' => 'Daniela y Marco', 'message' => 'Gracias por invitarnos a este día tan bonito. Les mandamos un abrazo enorme.'],
            ['author_name' => 'Abuelo Luis', 'message' => 'Que crezca rodeado de amor, fe y alegría.'],
        ],
        'gender_reveal' => [
            ['author_name' => 'Tía Rosa', 'message' => '¡Sea niño o niña, ya lo amamos! Felicidades, futuros papás.'],
            ['author_name' => 'Daniela y Marco', 'message' => 'Qué emoción compartir este momento con ustedes. ¡Vamos con todo!'],
            ['author_name' => 'Abuelo Luis', 'message' => 'La familia crece y el corazón también. Los quiero mucho.'],
        ],
        'baby_shower' => [
            ['author_name' => 'Tía Rosa', 'message' => '¡Bienvenido, bebé! Te esperamos con mucho amor. Felicidades, papás.'],
            ['author_name' => 'Daniela y Marco', 'message' => 'Les deseamos una dulce espera y muchas noches de sueño tranquilo.'],
            ['author_name' => 'Abuelo Luis', 'message' => 'No hay regalo más grande. Disfruten cada momento.'],
        ],
    ];

    /**
     * The guests of the demo door: name, seats, table, RSVP and, for the ones already in, how many arrived and how many
     * minutes ago.
     *
     * @var list<array{0: string, 1: int, 2: string, 3: int|null, 4: int, 5: int|null}>
     */
    private const SAMPLE_GUESTS = [
        ['Familia García López', 4, '1', 4, 4, 42],
        ['Familia Hernández Ruiz', 5, '2', 5, 3, 35],
        ['Sofía Martínez', 1, '3', 1, 1, 28],
        ['Familia Torres Medina', 3, '2', 3, 3, 21],
        ['Carlos y Mariana Vega', 2, '4', 2, 2, 12],
        ['Familia Ramírez Soto', 4, '5', 4, 0, null],
        ['Familia Flores Castillo', 3, '1', 2, 0, null],
        ['Andrea Navarro', 1, '3', 1, 0, null],
        ['Familia Morales Díaz', 5, '6', 4, 0, null],
        ['Luis y Fernanda Ortiz', 2, '4', null, 0, null],
        ['Familia Jiménez Rojas', 4, '6', 4, 0, null],
        ['Familia Mendoza Cruz', 3, '5', 0, 0, null],
        ['Ricardo Salinas', 1, '3', 1, 0, null],
        ['Familia Aguilar Reyes', 4, '7', 3, 0, null],
        ['Daniela y Marco Peña', 2, '7', 2, 0, null],
        ['Familia Castro Vargas', 5, '8', 5, 0, null],
    ];

    /**
     * Who shared the sample photos of the demo gallery, and their messages.
     *
     * @var list<array{0: string|null, 1: string|null}>
     */
    private const SAMPLE_UPLOADERS = [
        ['Tía Rosa', '¡Qué noche tan bonita!'],
        ['Daniela', null],
        [null, null],
        ['Marco', 'La mejor fiesta del año'],
        ['Abuelo Luis', null],
        ['Sofía', '¡Los queremos!'],
    ];

    /**
     * The offered plan the visitor asked the demo to show (`?plan=<slug>`), or null when the invitation is not a demo
     * or the slug names no active plan of web invitations.
     */
    public function requestedPlan(Request $request, Invitation $invitation): ?Plan
    {
        $slug = $request->query('plan');

        if ($invitation->order_id !== null || ! is_string($slug) || $slug === '') {
            return null;
        }

        $plan = Plan::query()->where('is_active', true)->where('slug', $slug)->first();

        return $plan?->type === PlanType::WebInvitation ? $plan : null;
    }

    /**
     * The RSVP settings of a demo showing the plan, or null when the plan does not include online RSVPs.
     *
     * @return array{online: bool, open: bool, url: string, max_seats: int, demo: bool}|null
     */
    public function rsvpSettings(Invitation $invitation, Plan $plan): ?array
    {
        if (! $this->includes($plan, PlanFeature::OnlineRsvp)) {
            return null;
        }

        return [
            'online' => true,
            'open' => true,
            'url' => route('invitations.rsvp.store', $invitation),
            'max_seats' => config('convite.open_rsvp_max_seats'),
            'demo' => true,
        ];
    }

    /**
     * The wishes book of a demo showing the plan, with sample messages, or null when the plan does not include it.
     *
     * @return array{open: bool, url: string, public: bool, moderated: bool, max_length: int, wishes: list<array{id: int, author_name: string, message: string, created_at: string}>, demo: bool}|null
     */
    public function wishesProps(Invitation $invitation, Plan $plan): ?array
    {
        if (! $this->includes($plan, PlanFeature::Wishes)) {
            return null;
        }

        $samples = self::SAMPLE_WISHES[($invitation->kind() ?? InvitationKind::Wedding)->value];

        return [
            'open' => true,
            'url' => route('invitations.wishes.store', $invitation),
            'public' => true,
            'moderated' => false,
            'max_length' => WishService::MAX_LENGTH,
            'wishes' => collect($samples)
                ->map(fn (array $wish, int $index): array => [
                    // Negative ids keep them apart from the ones the page gives the visitor's messages
                    'id' => -($index + 1),
                    ...$wish,
                    'created_at' => now()->subDays($index + 1)->toIso8601String(),
                ])
                ->all(),
            'demo' => true,
        ];
    }

    /**
     * The bar of a demo showing the plan: its name and the pages of what it includes besides the invitation. The
     * printable card and passes only when the template ships them.
     *
     * @return array{plan: string, print_card_url: string|null, guest_passes_url: string|null, door_url: string|null, gallery_url: string|null, wall_url: string|null}
     */
    public function invitationBar(Invitation $invitation, Plan $plan): array
    {
        $hasGallery = $this->includes($plan, PlanFeature::LiveGallery);
        $offersPage = fn (string $page, PlanFeature $feature): bool => $this->includes($plan, $feature) && $invitation->hasPage($page);

        return [
            'plan' => $plan->name,
            'print_card_url' => $offersPage(Invitation::PRINT_CARD_PAGE, PlanFeature::PrintCard) ? route('invitations.print-card', $invitation) : null,
            'guest_passes_url' => $offersPage(Invitation::GUEST_PASSES_PAGE, PlanFeature::GuestPasses) ? route('invitations.guest-passes', $invitation) : null,
            'door_url' => $this->includes($plan, PlanFeature::CheckIn) ? route('invitations.demo.door', $invitation) : null,
            'gallery_url' => $hasGallery ? route('invitations.demo.gallery', $invitation) : null,
            'wall_url' => $hasGallery ? route('invitations.demo.wall', $invitation) : null,
        ];
    }

    /**
     * The props of the door pages for the demo door: open, with sample guests, some of them already in.
     *
     * @return array{door: array<string, mixed>, guests: list<array<string, mixed>>, meta: array<string, string>}
     */
    public function doorProps(Invitation $invitation): array
    {
        $guests = collect(self::SAMPLE_GUESTS)
            ->map(fn (array $guest, int $index): array => [
                'id' => $index + 1,
                'name' => $guest[0],
                'seats' => $guest[1],
                'table_label' => $guest[2],
                'checked_in_at' => $guest[5] === null ? null : Carbon::now()->subMinutes($guest[5])->toIso8601String(),
                'checked_in_seats' => $guest[4],
                'rsvp' => $guest[3] === null ? null : ['attending' => $guest[3] > 0, 'seats_confirmed' => $guest[3]],
                'check_in_url' => '',
            ]);
        $arrived = $guests->whereNotNull('checked_in_at');

        return [
            'door' => [
                'title' => $invitation->title,
                'is_open' => true,
                'opens_at' => null,
                'closes_at' => null,
                'url' => route('invitations.demo.door', $invitation),
                'summary' => [
                    'guests' => $guests->count(),
                    'seats' => $guests->sum('seats'),
                    'arrived_guests' => $arrived->count(),
                    'arrived_seats' => $arrived->sum('checked_in_seats'),
                ],
                'demo' => true,
            ],
            'guests' => $guests->all(),
            'meta' => ['title' => "Registro de llegadas (demo) — {$invitation->title}", 'robots' => 'noindex, nofollow'],
        ];
    }

    /**
     * The props of the live gallery pages for the demo gallery: open, with the photos of the invitation's own gallery
     * as if guests had shared them.
     *
     * @return array{gallery: array<string, mixed>, photos: list<array<string, mixed>>, meta: array<string, string>}
     */
    public function galleryProps(Invitation $invitation): array
    {
        $photos = collect($invitation->content['gallery'] ?? [])
            ->pluck('image')
            ->filter()
            ->values()
            ->map(function (string $image, int $index): array {
                [$uploaderName, $message] = self::SAMPLE_UPLOADERS[$index % count(self::SAMPLE_UPLOADERS)];
                $url = Invitation::mediaUrl($image);

                return [
                    // Negative ids keep them apart from the ones the page gives the visitor's photos
                    'id' => -($index + 1),
                    'url' => $url,
                    'thumb_url' => $url,
                    'width' => 0,
                    'height' => 0,
                    'uploader_name' => $uploaderName,
                    'message' => $message,
                    'created_at' => Carbon::now()->subMinutes(($index + 1) * 6)->toIso8601String(),
                ];
            });

        return [
            'gallery' => [
                'title' => $invitation->title,
                'is_open' => true,
                'opens_at' => null,
                'closes_at' => null,
                'moderated' => false,
                // Null on a model made in memory, before the database applies the column's default
                'slide_seconds' => $invitation->gallery_slide_seconds ?? 7,
                'upload_url' => route('invitations.demo.gallery', $invitation),
                'wall_url' => route('invitations.demo.wall', $invitation),
                'demo' => true,
            ],
            'photos' => $photos->all(),
            'meta' => ['title' => "Fotos (demo) — {$invitation->title}", 'robots' => 'noindex, nofollow'],
        ];
    }

    private function includes(Plan $plan, PlanFeature $feature): bool
    {
        return $plan->features->contains($feature);
    }
}
