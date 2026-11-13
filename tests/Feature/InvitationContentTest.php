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
    expect(Invitation::templates())->toHaveKeys(['boda-clasica', 'boda-floral', 'boda-moderna', 'boda-serena', 'cumpleanos-confeti', 'cumpleanos-floral', 'cumpleanos-grafito', 'cumpleanos-reserva', 'xv-jardin'])
        ->and(Invitation::factory()->make(['template' => 'cumpleanos-floral'])->kind()->value)->toBe('birthday')
        ->and(Invitation::factory()->make(['template' => 'xv-jardin'])->kind()->value)->toBe('xv');
});

it('opens the content form for the admin', function () {
    $invitation = Invitation::factory()->withContent()->create(['template' => 'boda-clasica']);

    $this->actingAs(User::factory()->create())
        ->get(route('admin.invitations.content.edit', $invitation))
        ->assertOk()
        ->assertInertia(fn (Assert $page) => $page
            ->component('invitations/content')
            ->where('kind', 'wedding')
            ->where('content.names', ['Ana', 'Luis']));
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
    'xv godparents without names' => ['xv-jardin', ['name' => 'Sofía', 'first_name' => 'Sofía', 'godparents' => [['role' => 'Padrinos']]], 'content.godparents.0.names'],
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

it('moves the date of demo invitations ahead of today, keeping the time and the deadline', function () {
    $this->travelTo('2026-11-11 10:00:00');
    $invitation = Invitation::factory()->withContent()->create(['template' => 'boda-clasica', 'rsvp_deadline' => '2027-02-27']);

    $this->get("/i/{$invitation->slug}")
        ->assertInertia(fn (Assert $page) => $page
            ->where('invitation.eventAt', '2027-01-10T17:00:00')
            ->where('invitation.rsvpDeadline', '2026-12-20'));
});
