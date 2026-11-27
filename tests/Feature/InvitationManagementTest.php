<?php

use App\Enums\InvitationStatus;
use App\Enums\PlanFeature;
use App\Enums\PlanType;
use App\Models\Invitation;
use App\Models\Order;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Support\Facades\File;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * @return array<string, string>
 */
function invitationFields(array $overrides = []): array
{
    return [
        'slug' => 'ana-y-luis',
        'template' => 'boda-clasica',
        'status' => 'draft',
        'title' => 'Ana & Luis — Nuestra Boda',
        'description' => 'Acompáñanos a celebrar.',
        ...$overrides,
    ];
}

it('creates an invitation that belongs to the client of its order', function () {
    $order = Order::factory()->create();

    $this->actingAs(User::factory()->create())
        ->post(route('admin.invitations.store'), invitationFields([
            'order_id' => $order->id,
            'event_date' => '2027-03-20',
            'rsvp_deadline' => '2027-03-01',
        ]))
        ->assertRedirect(route('admin.invitations.index'))
        ->assertSessionHasNoErrors();

    $invitation = Invitation::sole();

    expect($invitation->order_id)->toBe($order->id)
        ->and($invitation->client_id)->toBe($order->client_id)
        ->and($invitation->event_date->toDateString())->toBe('2027-03-20')
        ->and($invitation->status)->toBe(InvitationStatus::Draft);
});

it('does not link an invitation to an order of a service delivered as files', function () {
    $order = Order::factory()->for(Plan::factory()->ofType(PlanType::Printables))->create();
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->post(route('admin.invitations.store'), invitationFields(['order_id' => $order->id]))
        ->assertSessionHasErrors(['order_id' => 'Esta contratación no es de una invitación.']);

    $this->actingAs($admin)
        ->get(route('admin.invitations.create'))
        ->assertInertia(fn (Assert $page) => $page->has('orders', 0));
});

it('filters the invitations by client, type and status', function () {
    $order = Order::factory()->create();
    $sold = Invitation::factory()->forOrder($order)->draft()->create();
    Invitation::factory()->forOrder($order)->create();
    Invitation::factory()->forOrder(Order::factory()->create())->draft()->create();
    Invitation::factory()->draft()->create();

    $this->actingAs(User::factory()->create())
        ->get(route('admin.invitations.index', ['client' => $order->client_id, 'type' => 'order', 'status' => 'draft']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('invitations/index')
            ->has('invitations.data', 1)
            ->where('invitations.data.0.id', $sold->id)
            ->where('filters', ['client' => $order->client_id, 'type' => 'order', 'kind' => null, 'status' => 'draft'])
            ->has('clients', 2));
});

it('filters the invitations by the kind of event of their template', function () {
    $xv = Invitation::factory()->create(['template' => 'xv-jardin']);
    Invitation::factory()->create(['template' => 'boda-clasica']);
    Invitation::factory()->create(['template' => 'cumpleanos-floral']);

    $this->actingAs(User::factory()->create())
        ->get(route('admin.invitations.index', ['kind' => 'xv']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('invitations.data', 1)
            ->where('invitations.data.0.id', $xv->id)
            ->where('filters.kind', 'xv'));
});

it('lists only the demos and ignores unknown filter values', function () {
    $demo = Invitation::factory()->create();
    Invitation::factory()->forOrder(Order::factory()->create())->create();

    $this->actingAs(User::factory()->create())
        ->get(route('admin.invitations.index', ['type' => 'demo', 'status' => 'gone', 'kind' => 'party', 'client' => 'x']))
        ->assertInertia(fn (Assert $page) => $page
            ->has('invitations.data', 1)
            ->where('invitations.data.0.id', $demo->id)
            ->where('filters', ['client' => null, 'type' => 'demo', 'kind' => null, 'status' => null]));
});

it('returns to the filtered page of the list after saving an invitation', function () {
    $invitation = Invitation::factory()->create();
    $listQuery = ['type' => 'demo', 'status' => 'published', 'page' => '2'];

    $this->actingAs(User::factory()->create())
        ->put(route('admin.invitations.update', [$invitation, ...$listQuery]), invitationFields([
            'slug' => $invitation->slug,
            'status' => 'draft',
        ]))
        ->assertSessionHasNoErrors()
        ->assertRedirect(route('admin.invitations.index', $listQuery));

    expect($invitation->fresh()->status)->toBe(InvitationStatus::Draft);
});

it('leaves an invitation without a client when it is unlinked from its order', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->create())->create();

    $this->actingAs(User::factory()->create())
        ->put(route('admin.invitations.update', $invitation), invitationFields([
            'slug' => $invitation->slug,
            'order_id' => '',
        ]))
        ->assertSessionHasNoErrors();

    expect($invitation->fresh()->order_id)->toBeNull()
        ->and($invitation->fresh()->client_id)->toBeNull();
});

it('only accepts templates that exist and a deadline before the event', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('admin.invitations.store'), invitationFields([
            'template' => 'no-existe',
            'event_date' => '2027-03-20',
            'rsvp_deadline' => '2027-03-21',
        ]))
        ->assertSessionHasErrors([
            'template' => 'El valor seleccionado en plantilla no es válido.',
            'rsvp_deadline' => 'El campo fecha límite para confirmar debe ser una fecha anterior o igual a fecha del evento.',
        ]);
});

it('opens the edit form with the orders an invitation can be linked to', function () {
    $invitation = Invitation::factory()->create();
    Order::factory()->count(2)->create();

    $this->actingAs(User::factory()->create())
        ->get(route('admin.invitations.edit', $invitation))
        ->assertInertia(fn (Assert $page) => $page
            ->component('invitations/index')
            ->where('modal', 'edit')
            ->where('invitation.id', $invitation->id)
            ->where('invitation.template_label', 'Boda clásica')
            ->has('orders', 2)
            ->where('templates.0.name', 'baby-shower-lluvia')
            ->where('templates.0.kind', 'baby_shower'));
});

it('serves the printable pages only when the plan of the order includes them', function (array $features, int $cardStatus, int $passesStatus) {
    $order = Order::factory()->for(Plan::factory()->withFeatures(...$features))->create();
    $invitation = Invitation::factory()->forOrder($order)->create(['template' => 'boda-clasica']);

    $this->get("/i/{$invitation->slug}/tarjeta")->assertStatus($cardStatus);
    $this->get("/i/{$invitation->slug}/pases")->assertStatus($passesStatus);
    $this->get("/i/{$invitation->slug}")->assertOk();
})->with([
    'no printable pages' => [[], 404, 404],
    'print card only' => [[PlanFeature::PrintCard], 200, 404],
    'guest passes only' => [[PlanFeature::GuestPasses], 404, 200],
]);

it('only offers an exclusive template to the invitation that uses it', function () {
    $folder = resource_path('js/invitations/templates/test-exclusiva');
    File::ensureDirectoryExists($folder);
    File::put("{$folder}/InvitationPage.tsx", '');
    File::put("{$folder}/template.json", json_encode(['kind' => 'wedding', 'label' => 'Boda de Ana', 'exclusive' => true]));

    try {
        $owner = Invitation::factory()->create(['template' => 'test-exclusiva']);
        $other = Invitation::factory()->create();
        $admin = User::factory()->create();

        $this->actingAs($admin)
            ->get(route('admin.invitations.edit', $other))
            ->assertInertia(fn (Assert $page) => $page->where('templates', fn ($templates) => ! collect($templates)->contains('name', 'test-exclusiva')));
        $this->actingAs($admin)
            ->get(route('admin.invitations.edit', $owner))
            ->assertInertia(fn (Assert $page) => $page->where('templates', fn ($templates) => collect($templates)->contains('name', 'test-exclusiva')));

        $this->actingAs($admin)
            ->post(route('admin.invitations.store'), invitationFields(['template' => 'test-exclusiva']))
            ->assertSessionHasErrors('template');
        $this->actingAs($admin)
            ->put(route('admin.invitations.update', $owner), invitationFields(['slug' => $owner->slug, 'template' => 'test-exclusiva']))
            ->assertSessionHasNoErrors();
    } finally {
        File::deleteDirectory($folder);
    }
});

it('only lets an exclusive template be used with an order whose plan includes a custom design', function () {
    $folder = resource_path('js/invitations/templates/test-exclusiva');
    File::ensureDirectoryExists($folder);
    File::put("{$folder}/InvitationPage.tsx", '');
    File::put("{$folder}/template.json", json_encode(['kind' => 'wedding', 'label' => 'Boda de Ana', 'exclusive' => true]));

    try {
        $catalogOrder = Order::factory()->for(Plan::factory()->withFeatures(PlanFeature::PrintCard))->create();
        $customOrder = Order::factory()->for(Plan::factory()->withFeatures(PlanFeature::CustomDesign))->create();
        $invitation = Invitation::factory()->forOrder($customOrder)->create(['template' => 'test-exclusiva']);
        $admin = User::factory()->create();
        $update = fn (?Order $order) => $this->actingAs($admin)->put(
            route('admin.invitations.update', $invitation),
            invitationFields(['slug' => $invitation->slug, 'template' => 'test-exclusiva', 'order_id' => $order?->id]),
        );

        $update($catalogOrder)->assertSessionHasErrors('template');
        $update($customOrder)->assertSessionHasNoErrors();
        $update(null)->assertSessionHasNoErrors();
    } finally {
        File::deleteDirectory($folder);
    }
});
