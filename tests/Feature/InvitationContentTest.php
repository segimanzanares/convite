<?php

use App\Models\Invitation;
use App\Models\Order;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

beforeEach(function () {
    Storage::fake('public');
});

it('reads the templates and their kind from the manifests', function () {
    expect(Invitation::templates())->toHaveKeys(['baby-shower-lluvia', 'baby-shower-patito', 'baby-shower-safari', 'baby-shower-tendedero', 'bautizo-celeste', 'bautizo-luz', 'bautizo-nube', 'bautizo-olivo', 'boda-clasica', 'boda-floral', 'boda-moderna', 'boda-serena', 'cumpleanos-confeti', 'cumpleanos-floral', 'cumpleanos-grafito', 'cumpleanos-reserva', 'infantil-dino', 'infantil-dulce', 'infantil-espacial', 'infantil-unicornio', 'revelacion-dulce', 'revelacion-estrellas', 'revelacion-globos', 'revelacion-osito', 'xv-aurora', 'xv-celestial', 'xv-disco', 'xv-jardin'])
        ->and(Invitation::factory()->make(['template' => 'cumpleanos-floral'])->kind()->value)->toBe('birthday')
        ->and(Invitation::factory()->make(['template' => 'xv-jardin'])->kind()->value)->toBe('xv')
        ->and(Invitation::factory()->make(['template' => 'bautizo-nube'])->kind()->value)->toBe('baptism')
        ->and(Invitation::factory()->make(['template' => 'revelacion-globos'])->kind()->value)->toBe('gender_reveal')
        ->and(Invitation::factory()->make(['template' => 'baby-shower-patito'])->kind()->value)->toBe('baby_shower');
});

it('declares the fonts of every template in its manifest', function () {
    expect(Invitation::templates())->each(fn ($template) => $template->fonts->not->toBeEmpty());
});

it('declares the colors of every template in its manifest', function () {
    expect(Invitation::templates())->each(fn ($template) => $template->colors->primary->not->toBeNull()
        ->colors->background->not->toBeNull()
        ->colors->suggestions->not->toBeEmpty());
});

it('opens the content form for the admin', function () {
    $invitation = Invitation::factory()->withContent()->create(['template' => 'boda-clasica']);

    $this->actingAs(User::factory()->create())
        ->get(route('admin.invitations.content.edit', $invitation))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('invitations/content')
            ->where('kind', 'wedding')
            ->where('content.names', ['Ana', 'Luis'])
            ->where('palette.primary', '#C9A84C')
            ->has('palette.suggestions.0', fn (Assert $suggestion) => $suggestion->hasAll(['label', 'primary'])));
});

it('saves the content of a wedding', function () {
    $invitation = Invitation::factory()->create(['template' => 'boda-clasica']);

    $this->actingAs(User::factory()->create())
        ->put(route('admin.invitations.content.update', $invitation), [
            'content' => [
                'names' => ['Ana', 'Luis'],
                'rsvp_whatsapp' => '55 1234 5678',
                'venues' => [[
                    'tag' => 'Ceremonia',
                    'name' => 'Parroquia',
                    'address_lines' => ['Calle 1', ''],
                    'latitude' => '15.86',
                    'longitude' => '-97.06',
                ]],
                // Fields of another kind are dropped
                'story' => ['title' => 'Érase una vez'],
            ],
        ])
        ->assertRedirect(route('admin.invitations.content.edit', $invitation))
        ->assertSessionHasNoErrors();

    $content = $invitation->fresh()->content;

    expect($content['names'])->toBe(['Ana', 'Luis'])
        ->and($content['venues'][0]['address_lines'])->toBe(['Calle 1'])
        ->and($content)->not->toHaveKey('story');
});

it('requires the names the kind of the template needs', function (string $template, array $content, string $error) {
    $invitation = Invitation::factory()->create(['template' => $template]);

    $this->actingAs(User::factory()->create())
        ->put(route('admin.invitations.content.update', $invitation), ['content' => $content])
        ->assertSessionHasErrors($error);
})->with([
    'wedding with one name' => ['boda-clasica', ['names' => ['Ana']], 'content.names'],
    'birthday without a name' => ['cumpleanos-floral', ['first_name' => 'Flora'], 'content.name'],
    'wedding parents without names' => ['boda-clasica', ['names' => ['Ana', 'Luis'], 'parents' => [['role' => 'Padres de la novia']]], 'content.parents.0.names'],
    'xv godparents without names' => ['xv-jardin', ['name' => 'Sofía', 'first_name' => 'Sofía', 'godparents' => [['role' => 'Padrinos']]], 'content.godparents.0.names'],
    'baptism without a name' => ['bautizo-luz', ['first_name' => 'Julieta'], 'content.name'],
    'gender reveal without a name' => ['revelacion-osito', ['names' => ['', 'Luis']], 'content.names.0'],
    'gender reveal with an unknown answer' => ['revelacion-dulce', ['names' => ['Ana'], 'reveal' => 'both'], 'content.reveal'],
    'baby shower without a name' => ['baby-shower-safari', ['names' => ['', 'Luis']], 'content.names.0'],
    'baby shower diaper size without a label' => ['baby-shower-lluvia', ['names' => ['Ana'], 'diapers' => ['sizes' => [['note' => 'Apellidos A–M']]]], 'content.diapers.sizes.0.label'],
]);

it('only accepts files of the invitation itself', function () {
    $invitation = Invitation::factory()->create(['template' => 'boda-clasica']);

    $this->actingAs(User::factory()->create())
        ->put(route('admin.invitations.content.update', $invitation), [
            'content' => ['names' => ['Ana', 'Luis'], 'cover' => 'invitations/999/foto.jpg'],
        ])
        ->assertSessionHasErrors(['content.cover' => 'El archivo no pertenece a esta invitación.']);
});

it('uploads photos and music for the invitation', function (string $type, UploadedFile $file, int $status) {
    $invitation = Invitation::factory()->create();

    $response = $this->actingAs(User::factory()->create())
        ->postJson(route('admin.invitations.media.store', $invitation), ['type' => $type, 'file' => $file])
        ->assertStatus($status);

    if ($status === 201) {
        expect($response->json('path'))->toStartWith("invitations/{$invitation->id}/");
        Storage::disk('public')->assertExists($response->json('path'));
    }
})->with([
    'photo' => fn () => ['image', UploadedFile::fake()->image('foto.jpg'), 201],
    'song' => fn () => ['audio', UploadedFile::fake()->create('cancion.mp3', 500, 'audio/mpeg'), 201],
    'song as a photo' => fn () => ['image', UploadedFile::fake()->create('cancion.mp3', 500, 'audio/mpeg'), 422],
    'photo too large' => fn () => ['image', UploadedFile::fake()->image('foto.jpg')->size(11 * 1024), 422],
]);

it('deletes the uploads the saved content no longer uses', function () {
    $invitation = Invitation::factory()->create(['template' => 'boda-clasica']);
    $disk = Storage::disk('public');
    $disk->put("invitations/{$invitation->id}/vieja.jpg", 'x');
    $disk->put("invitations/{$invitation->id}/nueva.jpg", 'x');
    $disk->put("invitations/{$invitation->id}/og.jpg", 'x');

    $this->actingAs(User::factory()->create())
        ->put(route('admin.invitations.content.update', $invitation), [
            'og_image' => "invitations/{$invitation->id}/og.jpg",
            'content' => ['names' => ['Ana', 'Luis'], 'cover' => "invitations/{$invitation->id}/nueva.jpg"],
        ])
        ->assertSessionHasNoErrors();

    $disk->assertMissing("invitations/{$invitation->id}/vieja.jpg");
    $disk->assertExists("invitations/{$invitation->id}/nueva.jpg");
    $disk->assertExists("invitations/{$invitation->id}/og.jpg");
});

it('does not let clients edit the content or upload files', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->withPanel()->create())->create();
    $client = User::factory()->client($invitation->client)->create();

    $this->actingAs($client)->get(route('admin.invitations.content.edit', $invitation))->assertForbidden();
    $this->actingAs($client)
        ->put(route('admin.invitations.content.update', $invitation), ['content' => ['names' => ['Ana', 'Luis']]])
        ->assertForbidden();
    $this->actingAs($client)
        ->postJson(route('admin.invitations.media.store', $invitation), ['type' => 'image', 'file' => UploadedFile::fake()->image('a.jpg')])
        ->assertForbidden();
});

it('publishes an invitation only once its date, time and content are captured', function () {
    $invitation = Invitation::factory()->draft()->create(['template' => 'boda-clasica']);
    $fields = ['slug' => $invitation->slug, 'template' => 'boda-clasica', 'status' => 'published', 'title' => 'Boda', 'description' => 'Ven'];
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->put(route('admin.invitations.update', $invitation), $fields)
        ->assertSessionHasErrors(['event_date', 'event_time', 'status' => 'Captura el contenido de la invitación antes de publicarla.']);

    $invitation->update(['content' => ['names' => ['Ana', 'Luis']]]);

    $this->actingAs($admin)
        ->put(route('admin.invitations.update', $invitation), [...$fields, 'event_date' => '2027-03-20', 'event_time' => '17:30'])
        ->assertSessionHasNoErrors();

    expect($invitation->fresh()->isPublished())->toBeTrue()
        ->and($invitation->fresh()->event_time)->toBe('17:30:00');
});

it('sends the content to the template pages', function () {
    $order = Order::factory()->create();
    $invitation = Invitation::factory()->forOrder($order)->withContent([
        'venues' => [['tag' => 'Ceremonia', 'name' => 'Parroquia', 'latitude' => 15.86, 'longitude' => -97.06]],
        'gallery' => [['image' => '/invitations/boda-clasica/images/01.jpeg', 'caption' => 'El comienzo']],
    ])->create(['template' => 'boda-clasica', 'rsvp_deadline' => '2027-03-01']);

    $this->get("/i/{$invitation->slug}")
        ->assertInertia(fn (Assert $page) => $page
            ->where('invitation.kind', 'wedding')
            ->where('invitation.names', ['Ana', 'Luis'])
            ->where('invitation.eventAt', '2027-03-20T17:00:00')
            ->where('invitation.rsvpDeadline', '2027-03-01')
            ->where('invitation.rsvpWhatsappNumber', '525512345678')
            ->where('invitation.venues.0.mapEmbedUrl', 'https://www.google.com/maps?q=15.86,-97.06&z=16&output=embed')
            ->where('invitation.gallery.0.src', '/invitations/boda-clasica/images/01.jpeg')
            ->where('invitation.dressCode', null));
});

it('saves a primary color and sends it with the text color that reads on it', function (string $primary, string $foreground) {
    $invitation = Invitation::factory()->withContent()->create(['template' => 'boda-clasica']);

    $this->actingAs(User::factory()->create())
        ->put(route('admin.invitations.content.update', $invitation), [
            'content' => [...$invitation->content, 'colors' => ['primary' => $primary]],
        ])
        ->assertSessionHasNoErrors();

    $this->get("/i/{$invitation->slug}")
        ->assertInertia(fn (Assert $page) => $page
            ->where('invitation.colors.primary', strtoupper($primary))
            ->where('invitation.colors.primaryForeground', $foreground));
})->with([
    'dark' => ['#3f7a62', '#FFFFFF'],
    'light' => ['#FACC15', '#18181B'],
]);

it('keeps the template colors without a primary color', function (?array $colors) {
    $invitation = Invitation::factory()->withContent(['colors' => $colors])->create(['template' => 'boda-clasica']);

    $this->get("/i/{$invitation->slug}")
        ->assertInertia(fn (Assert $page) => $page->where('invitation.colors', null));
})->with([
    'no colors' => [null],
    'reset' => [['primary' => null]],
]);

it('rejects a primary color that is not a hex color', function () {
    $invitation = Invitation::factory()->withContent()->create(['template' => 'boda-clasica']);

    $this->actingAs(User::factory()->create())
        ->put(route('admin.invitations.content.update', $invitation), [
            'content' => [...$invitation->content, 'colors' => ['primary' => 'red; background: url(x)']],
        ])
        ->assertSessionHasErrors('content.colors.primary');
});

it('saves and sends the chapters of a baptism', function () {
    $invitation = Invitation::factory()->create(['template' => 'bautizo-olivo']);

    $this->actingAs(User::factory()->create())
        ->put(route('admin.invitations.content.update', $invitation), [
            'content' => [
                'name' => 'Ana Lucía',
                'first_name' => 'Ana Lucía',
                'story' => ['title' => 'Una nueva vida', 'paragraphs' => ['Llegué en primavera.']],
                'parents' => ['role' => 'Mis papás', 'names' => ['Paola', 'Ricardo']],
                'godparents' => [['role' => 'Mis padrinos', 'names' => ['Fernanda', 'Luis']]],
            ],
        ])
        ->assertSessionHasNoErrors();

    $this->get("/i/{$invitation->slug}")
        ->assertInertia(fn (Assert $page) => $page
            ->component('templates/bautizo-olivo/InvitationPage')
            ->where('invitation.kind', 'baptism')
            ->where('invitation.name', 'Ana Lucía')
            ->where('invitation.story.title', 'Una nueva vida')
            ->where('invitation.parents.names', ['Paola', 'Ricardo'])
            ->where('invitation.godparents.0.role', 'Mis padrinos'));
});

it('saves and sends the content of a baby shower', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->create())->create(['template' => 'baby-shower-tendedero']);

    $this->actingAs(User::factory()->create())
        ->put(route('admin.invitations.content.update', $invitation), [
            'content' => [
                'names' => ['Regina', ''],
                'baby_name' => 'Emilia',
                'due_label' => 'Llega en junio',
                'hosts' => [['role' => 'Organizan con cariño', 'names' => ['Las tías']]],
                'diapers' => ['note' => 'Según tu apellido', 'sizes' => [['label' => 'Etapa 2', 'note' => 'A a la M']]],
                // Fields of another kind are dropped
                'grandparents' => [['role' => 'Abuelos', 'names' => ['Rosa']]],
            ],
        ])
        ->assertSessionHasNoErrors();

    $invitation->refresh();

    // One parent-to-be is enough to publish
    expect($invitation->hasContent())->toBeTrue()
        ->and($invitation->content)->not->toHaveKey('grandparents');

    $this->get("/i/{$invitation->slug}")
        ->assertInertia(fn (Assert $page) => $page
            ->component('templates/baby-shower-tendedero/InvitationPage')
            ->where('invitation.kind', 'baby_shower')
            ->where('invitation.names', ['Regina'])
            ->where('invitation.babyName', 'Emilia')
            ->where('invitation.dueLabel', 'Llega en junio')
            ->where('invitation.hosts.0.names', ['Las tías'])
            ->where('invitation.diapers', ['note' => 'Según tu apellido', 'sizes' => [['label' => 'Etapa 2', 'note' => 'A a la M']]])
            ->missing('invitation.grandparents'));
});

it('sends no diaper section for a baby shower without sizes nor a note', function () {
    $invitation = Invitation::factory()->create([
        'template' => 'baby-shower-patito',
        'content' => ['names' => ['Karla'], 'diapers' => ['note' => null, 'sizes' => []]],
    ]);

    $this->get("/i/{$invitation->slug}")
        ->assertInertia(fn (Assert $page) => $page->where('invitation.diapers', null)->where('invitation.hosts', []));
});

it('saves a gender reveal and keeps its answer secret until it is shown', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->create())->create(['template' => 'revelacion-globos']);

    $this->actingAs(User::factory()->create())
        ->put(route('admin.invitations.content.update', $invitation), [
            'content' => [
                'names' => ['Ana', ''],
                'due_label' => 'Llega en agosto',
                'baby_names' => ['girl' => 'Valentina', 'boy' => 'Mateo'],
                'reveal' => 'girl',
                'grandparents' => [['role' => 'Abuelos maternos', 'names' => ['Rosa', 'Ernesto']]],
                // Fields of another kind are dropped
                'godparents' => [['role' => 'Padrinos', 'names' => ['Luis']]],
            ],
        ])
        ->assertSessionHasNoErrors();

    $invitation->refresh();

    // One parent-to-be is enough to publish
    expect($invitation->hasContent())->toBeTrue()
        ->and($invitation->content)->not->toHaveKey('godparents');

    $this->get("/i/{$invitation->slug}")
        ->assertInertia(fn (Assert $page) => $page
            ->component('templates/revelacion-globos/InvitationPage')
            ->where('invitation.kind', 'gender_reveal')
            ->where('invitation.names', ['Ana'])
            ->where('invitation.dueLabel', 'Llega en agosto')
            ->where('invitation.babyNames', ['boy' => 'Mateo', 'girl' => 'Valentina'])
            ->where('invitation.grandparents.0.role', 'Abuelos maternos')
            ->where('invitation.reveal', null)
            ->missing('invitation.godparents'));

    $invitation->forceFill(['reveal_shown_at' => now()])->save();

    $this->get("/i/{$invitation->slug}")
        ->assertInertia(fn (Assert $page) => $page->where('invitation.reveal', 'girl'));
});

it('saves and sends the parents and godparents of a wedding', function () {
    $invitation = Invitation::factory()->create(['template' => 'boda-moderna']);

    $this->actingAs(User::factory()->create())
        ->put(route('admin.invitations.content.update', $invitation), [
            'content' => [
                'names' => ['Ana', 'Luis'],
                'parents' => [
                    ['role' => 'Padres de la novia', 'names' => ['Paola', 'Ricardo']],
                    ['role' => 'Padres del novio', 'names' => ['Elena']],
                ],
                'godparents' => [['role' => 'Padrinos de velación', 'names' => ['Fernanda', 'Luis']]],
            ],
        ])
        ->assertSessionHasNoErrors();

    $this->get("/i/{$invitation->slug}")
        ->assertInertia(fn (Assert $page) => $page
            ->where('invitation.parents.0.role', 'Padres de la novia')
            ->where('invitation.parents.1.names', ['Elena'])
            ->where('invitation.godparents.0.role', 'Padrinos de velación'));
});

it('sends the parents of a birthday, without godparents', function () {
    $invitation = Invitation::factory()->create(['template' => 'infantil-dino']);

    $this->actingAs(User::factory()->create())
        ->put(route('admin.invitations.content.update', $invitation), [
            'content' => [
                'name' => 'Santiago',
                'first_name' => 'Santiago',
                'age' => 5,
                'parents' => ['names' => ['Daniela', '', 'Roberto']],
                'godparents' => [['role' => 'Padrinos', 'names' => ['Luis']]],
            ],
        ])
        ->assertSessionHasNoErrors();

    expect($invitation->fresh()->content)->not->toHaveKey('godparents');

    $this->get("/i/{$invitation->slug}")
        ->assertInertia(fn (Assert $page) => $page
            ->where('invitation.parents', ['role' => 'Sus papás', 'names' => ['Daniela', 'Roberto']])
            ->missing('invitation.godparents'));
});

it('moves the date of demo invitations ahead of today, keeping the time and the deadline', function () {
    $this->travelTo('2026-11-11 10:00:00');
    $invitation = Invitation::factory()->withContent()->create(['template' => 'boda-clasica', 'rsvp_deadline' => '2027-02-27']);

    $this->get("/i/{$invitation->slug}")
        ->assertInertia(fn (Assert $page) => $page
            ->where('invitation.eventAt', '2027-01-10T17:00:00')
            ->where('invitation.rsvpDeadline', '2026-12-20'));
});
