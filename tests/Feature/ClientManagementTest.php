<?php

use App\Enums\UserRole;
use App\Models\Client;
use App\Models\Order;
use App\Models\User;
use App\Notifications\ClientAccessGranted;
use Illuminate\Support\Facades\Notification;
use Inertia\Testing\AssertableInertia as Assert;

it('filters the clients by name, email or phone', function () {
    Client::factory()->create(['name' => 'Ana Pérez']);
    Client::factory()->create(['name' => 'Luis Gómez', 'email' => 'luis@example.com']);

    $this->actingAs(User::factory()->create())
        ->get(route('admin.clients.index', ['search' => 'ANA']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('clients/index')
            ->has('clients.data', 1)
            ->where('clients.data.0.name', 'Ana Pérez')
            ->where('filters.search', 'ANA'));
});

it('creates a client and shows its page', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('admin.clients.store'), [
            'name' => 'Ana y Luis',
            'phone' => '5512345678',
            'email' => 'ana@example.com',
        ])
        ->assertRedirect(route('admin.clients.show', Client::sole()))
        ->assertSessionHasNoErrors();

    expect(Client::sole()->name)->toBe('Ana y Luis');
});

it('requires the client name', function () {
    $this->actingAs(User::factory()->create())
        ->post(route('admin.clients.store'), [])
        ->assertSessionHasErrors(['name' => 'El campo nombre es obligatorio.']);
});

it('deletes a client without orders along with its users', function () {
    $client = Client::factory()->create();
    $clientUser = User::factory()->client($client)->create();

    $this->actingAs(User::factory()->create())
        ->delete(route('admin.clients.destroy', $client))
        ->assertRedirect(route('admin.clients.index'));

    $this->assertModelMissing($client);
    $this->assertModelMissing($clientUser);
});

it('keeps a client that has orders', function () {
    $order = Order::factory()->create();

    $this->actingAs(User::factory()->create())
        ->delete(route('admin.clients.destroy', $order->client))
        ->assertInertiaFlash('toast.type', 'error');

    $this->assertModelExists($order->client);
});

it('gives panel access to a client whose plan includes it', function () {
    Notification::fake();
    $order = Order::factory()->withPanel()->create();

    $this->actingAs(User::factory()->create())
        ->post(route('admin.clients.users.store', $order->client), [
            'name' => 'Ana',
            'email' => 'ana@example.com',
        ])
        ->assertRedirect(route('admin.clients.show', $order->client))
        ->assertSessionHasNoErrors();

    $user = User::firstWhere('email', 'ana@example.com');

    expect($user->role)->toBe(UserRole::Client)
        ->and($user->client_id)->toBe($order->client_id)
        ->and($user->hasVerifiedEmail())->toBeTrue();

    Notification::assertSentTo($user, ClientAccessGranted::class, function (ClientAccessGranted $notification) use ($user) {
        $mail = $notification->toMail($user);

        return $mail->actionUrl === route('password.reset', ['token' => $notification->token, 'email' => $user->email])
            && $mail->subject === 'Bienvenido a Convite';
    });
});

it('refuses panel access to a client whose plans do not include it', function () {
    Notification::fake();
    $order = Order::factory()->create();

    $this->actingAs(User::factory()->create())
        ->post(route('admin.clients.users.store', $order->client), [
            'name' => 'Ana',
            'email' => 'ana@example.com',
        ])
        ->assertSessionHasErrors(['client' => 'Ninguna contratación de este cliente incluye acceso al panel.']);

    expect(User::where('email', 'ana@example.com')->exists())->toBeFalse();
    Notification::assertNothingSent();
});

it('lets the welcome link set the password of a new client user', function () {
    Notification::fake();
    $order = Order::factory()->withPanel()->create();
    $this->actingAs(User::factory()->create())
        ->post(route('admin.clients.users.store', $order->client), ['name' => 'Ana', 'email' => 'ana@example.com']);
    $user = User::firstWhere('email', 'ana@example.com');
    $token = Notification::sent($user, ClientAccessGranted::class)->sole()->token;
    auth()->logout();

    $this->post(route('password.update'), [
        'token' => $token,
        'email' => 'ana@example.com',
        'password' => 'una-contraseña-larga',
        'password_confirmation' => 'una-contraseña-larga',
    ])->assertSessionHasNoErrors();

    $this->post(route('login.store'), ['email' => 'ana@example.com', 'password' => 'una-contraseña-larga']);
    $this->assertAuthenticatedAs($user);
});

it('removes a panel user only from its own client', function () {
    $client = Client::factory()->create();
    $clientUser = User::factory()->client($client)->create();
    $otherClientUser = User::factory()->client()->create();
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->delete(route('admin.clients.users.destroy', [$client, $otherClientUser]))
        ->assertNotFound();
    $this->actingAs($admin)
        ->delete(route('admin.clients.users.destroy', [$client, $clientUser]))
        ->assertRedirect(route('admin.clients.show', $client));

    $this->assertModelMissing($clientUser);
    $this->assertModelExists($otherClientUser);
});
