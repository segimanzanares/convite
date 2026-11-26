<?php

namespace App\Services;

use App\Enums\InvitationKind;
use App\Enums\PlanFeature;
use App\Models\Invitation;
use App\Models\Plan;
use Illuminate\Http\Request;

/**
 * Lets a demo (an invitation without an order) show what a plan includes: `/i/{slug}?plan=premium` turns on the online
 * RSVP and the wishes book of that plan. Nothing a visitor sends is stored: the props carry `demo: true` and the page
 * only pretends to send it, while the routes that store answers and messages keep refusing demos.
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
     * The offered plan the visitor asked the demo to show (`?plan=<slug>`), or null when the invitation is not a demo
     * or the slug names no active plan.
     */
    public function requestedPlan(Request $request, Invitation $invitation): ?Plan
    {
        $slug = $request->query('plan');

        if ($invitation->order_id !== null || ! is_string($slug) || $slug === '') {
            return null;
        }

        return Plan::query()->where('is_active', true)->where('slug', $slug)->first();
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

    private function includes(Plan $plan, PlanFeature $feature): bool
    {
        return $plan->features->contains($feature);
    }
}
