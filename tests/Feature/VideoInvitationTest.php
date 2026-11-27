<?php

use App\Enums\InvitationKind;
use App\Enums\InvitationStatus;
use App\Enums\PlanType;
use App\Enums\VideoStatus;
use App\Jobs\RenderInvitationVideo;
use App\Models\Client;
use App\Models\Invitation;
use App\Models\Order;
use App\Models\Plan;
use App\Models\User;
use App\Services\InvitationVideoService;
use Illuminate\Http\UploadedFile;
use Illuminate\Process\PendingProcess;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Queue;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

/**
 * A published wedding sold as a video invitation, without the web page.
 */
function videoInvitation(array $attributes = []): Invitation
{
    return Invitation::factory()
        ->forOrder(Order::factory()->for(Plan::factory()->ofType(PlanType::VideoInvitation))->create())
        ->create(['template' => 'boda-clasica', ...$attributes]);
}

it('has no public page when the order sold a video invitation, for admins too', function () {
    $invitation = videoInvitation();

    $this->get(route('invitations.show', $invitation))->assertNotFound();

    $this->actingAs(User::factory()->create())
        ->get(route('invitations.show', $invitation))
        ->assertNotFound();
});

it('keeps the public page of orders from before plans had a type', function () {
    $order = Order::factory()->create();
    $order->update(['plan_snapshot' => array_diff_key($order->plan_snapshot, ['type' => true])]);
    $invitation = Invitation::factory()->forOrder($order)->create();

    $this->get(route('invitations.show', $invitation))->assertOk();
});

it('asks only for what the video shows for a video invitation', function () {
    $invitation = videoInvitation();

    $this->actingAs(User::factory()->create())
        ->get(route('admin.invitations.content.edit', $invitation))
        ->assertInertia(fn (Assert $page) => $page
            ->where('videoOnly', true)
            ->where('sections', ['family', 'venues', 'gallery']));
});

it('keeps the rendered video when the content is saved', function () {
    Storage::fake('public');
    $invitation = videoInvitation();
    Storage::disk('public')->put($invitation->videoPath(), 'mp4');
    Storage::disk('public')->put("invitations/{$invitation->id}/unused.jpg", 'jpg');

    $this->actingAs(User::factory()->create())
        ->put(route('admin.invitations.content.update', $invitation), ['content' => [
            'names' => ['Mariana', 'Alejandro'],
        ]])
        ->assertSessionHasNoErrors();

    Storage::disk('public')->assertExists($invitation->videoPath());
    Storage::disk('public')->assertMissing("invitations/{$invitation->id}/unused.jpg");
});

it('shows only web invitations in the pricing and the active services as their options', function () {
    Plan::factory()->create(['slug' => 'basico']);
    Plan::factory()->ofType(PlanType::TributeVideo)->create([
        'slug' => 'semblanza-premium',
        'price' => 999,
        'price_note' => 'Hasta 5 minutos',
        'details' => ['Fotos al ritmo de la música'],
        'is_featured' => true,
    ]);
    Plan::factory()->ofType(PlanType::Printables)->inactive()->create(['slug' => 'pases']);

    $this->get(route('landing'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('plans', 1)
            ->where('plans.0.slug', 'basico')
            ->has('servicePlans', 1));

    $this->get(route('services'))
        ->assertInertia(fn (Assert $page) => $page
            ->has('servicePlans', 1)
            ->where('servicePlans.0.type', 'tribute_video')
            ->where('servicePlans.0.price', '999.00')
            ->where('servicePlans.0.price_note', 'Hasta 5 minutos')
            ->where('servicePlans.0.details', ['Fotos al ritmo de la música'])
            ->where('servicePlans.0.is_featured', true));
});

it('shows the video page to admins only, and only for video invitations', function () {
    $invitation = videoInvitation();

    $this->actingAs(User::factory()->create())
        ->get(route('admin.invitations.video.index', $invitation))
        ->assertInertia(fn (Assert $page) => $page
            ->component('invitations/video')
            ->where('video.status', null)
            ->where('video.url', null)
            ->has('themes', 2));

    $this->actingAs(User::factory()->client($invitation->client)->create())
        ->get(route('admin.invitations.video.index', $invitation))
        ->assertForbidden();

    $webOnly = Invitation::factory()->forOrder(Order::factory()->create())->create();

    $this->actingAs(User::factory()->create())
        ->get(route('admin.invitations.video.index', $webOnly))
        ->assertNotFound();
});

it('queues a render with the chosen theme on the videos connection', function () {
    Queue::fake([RenderInvitationVideo::class]);
    $invitation = videoInvitation();

    $this->actingAs(User::factory()->create())
        ->post(route('admin.invitations.video.store', $invitation), ['theme' => 'noche'])
        ->assertRedirect(route('admin.invitations.video.index', $invitation));

    expect($invitation->refresh())
        ->video_template->toBe('noche')
        ->video_status->toBe(VideoStatus::Queued);
    Queue::assertPushed(RenderInvitationVideo::class, fn (RenderInvitationVideo $job) => $job->invitation->is($invitation) && $job->connection === 'videos');
});

it('does not queue another render while one is running', function () {
    Queue::fake([RenderInvitationVideo::class]);
    $invitation = videoInvitation(['video_status' => VideoStatus::Rendering]);

    $this->actingAs(User::factory()->create())
        ->post(route('admin.invitations.video.store', $invitation), ['theme' => 'clasico']);

    Queue::assertNotPushed(RenderInvitationVideo::class);
});

it('rejects a theme that does not exist', function () {
    $invitation = videoInvitation();

    $this->actingAs(User::factory()->create())
        ->post(route('admin.invitations.video.store', $invitation), ['theme' => 'neon'])
        ->assertSessionHasErrors('theme');
});

it('renders the video into the invitation folder and marks it ready', function () {
    Storage::fake('public');
    $invitation = videoInvitation(['video_template' => 'noche']);
    Process::fake(function (PendingProcess $process) {
        $command = $process->command;
        File::put($command[array_search('--out', $command, true) + 1], 'mp4');

        return Process::result();
    });

    app(InvitationVideoService::class)->render($invitation);

    Process::assertRan(fn (PendingProcess $process) => in_array('noche', $process->command, true));
    Storage::disk('public')->assertExists($invitation->videoPath());
    expect($invitation->refresh())
        ->video_status->toBe(VideoStatus::Ready)
        ->video_rendered_at->not->toBeNull();
});

it('marks the video as failed and keeps the previous one when the render fails', function () {
    Storage::fake('public');
    $invitation = videoInvitation();
    Storage::disk('public')->put($invitation->videoPath(), 'previous');
    Process::fake(fn () => Process::result(errorOutput: 'boom', exitCode: 1));

    expect(fn () => app(InvitationVideoService::class)->render($invitation))->toThrow(RuntimeException::class);

    expect($invitation->refresh()->video_status)->toBe(VideoStatus::Failed);
    expect(Storage::disk('public')->get($invitation->videoPath()))->toBe('previous');
});

it('downloads the rendered video', function () {
    Storage::fake('public');
    $invitation = videoInvitation();
    $admin = User::factory()->create();

    $this->actingAs($admin)->get(route('admin.invitations.video.download', $invitation))->assertNotFound();

    Storage::disk('public')->put($invitation->videoPath(), 'mp4');

    $this->actingAs($admin)
        ->get(route('admin.invitations.video.download', $invitation))
        ->assertOk()
        ->assertDownload("invitacion-{$invitation->slug}.mp4");
});

it('sends the renderer the content without the answer of a gender reveal', function () {
    Storage::fake('public');
    $invitation = videoInvitation([
        'template' => 'revelacion-globos',
        'event_date' => '2027-06-12',
        'event_time' => '17:00:00',
    ]);
    $photo = UploadedFile::fake()->image('foto.jpg')->storeAs("invitations/{$invitation->id}", 'foto.jpg', 'public');
    $invitation->update(['content' => [
        'names' => ['Ana', ''],
        'reveal' => 'girl',
        'cover' => $photo,
        'grandparents' => [['role' => 'Abuelos maternos', 'names' => ['Rosa', '']], ['role' => 'Abuelos paternos', 'names' => []]],
        'venues' => [['tag' => 'Fiesta', 'name' => 'Jardín Lila', 'address_lines' => ['Centro', '']]],
        'colors' => ['primary' => '#8e4b8f'],
    ]]);

    $data = app(InvitationVideoService::class)->data($invitation);

    expect($data)
        ->toMatchArray([
            'kind' => 'gender_reveal',
            'names' => ['Ana'],
            'date' => '2027-06-12',
            'time' => '17:00',
            'honor' => [['key' => 'grandparents', 'groups' => [['role' => 'Abuelos maternos', 'names' => ['Rosa']]]]],
            'venues' => [['icon' => '', 'tag' => 'Fiesta', 'name' => 'Jardín Lila', 'address_lines' => ['Centro'], 'time' => '']],
            'photos' => [Storage::disk('public')->path($photo)],
            'music' => null,
            'primary' => '#8e4b8f',
        ])
        ->not->toHaveKey('reveal');
    expect(json_encode($data))->not->toContain('girl');
});

it('creates the invitation of a video invitation order and opens its content', function () {
    $client = Client::factory()->create(['name' => 'Ana Ruiz']);
    $plan = Plan::factory()->ofType(PlanType::VideoInvitation)->create();
    Invitation::factory()->create(['slug' => 'video-ana-ruiz']);

    $response = $this->actingAs(User::factory()->create())
        ->post(route('admin.clients.orders.store', $client), [
            'plan_id' => $plan->id,
            'price' => '499',
            'event_kind' => 'xv',
            'event_date' => '2027-03-20',
            'event_time' => '19:00',
        ]);

    $order = Order::sole();
    $invitation = $order->invitations()->sole();
    $response->assertRedirect(route('admin.invitations.content.edit', $invitation));

    expect($invitation)
        ->client_id->toBe($client->id)
        ->slug->toBe('video-ana-ruiz-2')
        ->title->toBe('Ana Ruiz · Invitación en video')
        ->status->toBe(InvitationStatus::Draft)
        ->event_date->toDateString()->toBe('2027-03-20')
        ->event_time->toStartWith('19:00')
        ->and($invitation->kind())->toBe(InvitationKind::Xv)
        ->and(Invitation::templates()[$invitation->template]['exclusive'])->toBeFalse()
        ->and($invitation->offersWebInvitation())->toBeFalse();
});

it('requires the kind of event of a video invitation order', function () {
    $plan = Plan::factory()->ofType(PlanType::VideoInvitation)->create();

    $this->actingAs(User::factory()->create())
        ->post(route('admin.clients.orders.store', Client::factory()->create()), ['plan_id' => $plan->id, 'price' => '499'])
        ->assertSessionHasErrors(['event_kind' => 'El campo tipo de evento es obligatorio.']);

    expect(Order::count())->toBe(0);
});

it('creates no invitation for the orders of other plans', function () {
    $plan = Plan::factory()->ofType(PlanType::TributeVideo)->create();

    $this->actingAs(User::factory()->create())
        ->post(route('admin.clients.orders.store', Client::factory()->create()), ['plan_id' => $plan->id, 'price' => '599', 'event_kind' => 'wedding'])
        ->assertRedirect(route('admin.orders.show', Order::sole()));

    expect(Invitation::count())->toBe(0);
});
