<?php

use App\Models\Guest;
use App\Models\Invitation;
use App\Models\Order;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Http\UploadedFile;

it('previews a CSV file with each row and its errors without saving anything', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->withPanel(10)->create())->create();
    // Saved by a spreadsheet in Spanish: semicolons, Windows-1252 and a header row
    $contents = mb_convert_encoding("Nombre;Lugares;Mesa\nFamilia Hernández;4;3\n\nCarlos;;5;;carlos@\n;2;1\n", 'Windows-1252', 'UTF-8');

    $this->actingAs(User::factory()->client($invitation->client)->create())
        ->post(route('admin.invitations.guests.import.preview', $invitation), [
            'file' => UploadedFile::fake()->createWithContent('invitados.csv', $contents),
        ])
        ->assertOk()
        ->assertJson([
            'remaining' => 10,
            'rows' => [
                ['line' => 2, 'name' => 'Familia Hernández', 'seats' => 4, 'table_label' => '3', 'email' => null, 'errors' => []],
                ['line' => 4, 'name' => 'Carlos', 'seats' => 1, 'table_label' => '5', 'email' => 'carlos@', 'errors' => [
                    'El campo correo electrónico debe ser un correo electrónico válido.',
                ]],
                ['line' => 5, 'name' => '', 'seats' => 2, 'errors' => ['El campo nombre es obligatorio.']],
            ],
        ])
        ->assertJsonCount(3, 'rows');

    expect(Guest::count())->toBe(0);
});

it('imports the reviewed rows', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->withPanel(10)->create())->create();

    $this->actingAs(User::factory()->client($invitation->client)->create())
        ->post(route('admin.invitations.guests.import.store', $invitation), [
            'rows' => [
                ['name' => 'Familia Hernández', 'seats' => 4, 'table_label' => '3'],
                ['name' => 'Carlos', 'seats' => 1],
            ],
        ])
        ->assertRedirect(route('admin.invitations.guests.index', $invitation))
        ->assertInertiaFlash('toast.message', 'Se importaron 2 invitados.');

    expect($invitation->guests()->pluck('seats', 'name')->all())->toBe(['Familia Hernández' => 4, 'Carlos' => 1]);
});

it('imports nothing when the rows do not fit in the plan', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->withPanel(3)->create())->create();
    Guest::factory()->for($invitation)->create();

    $this->actingAs(User::factory()->create())
        ->post(route('admin.invitations.guests.import.store', $invitation), [
            'rows' => [['name' => 'A', 'seats' => 1], ['name' => 'B', 'seats' => 1], ['name' => 'C', 'seats' => 1]],
        ])
        ->assertSessionHasErrors(['guests' => 'El plan permite 3 invitaciones, así que solo puedes agregar 2 más.']);

    expect($invitation->guests()->count())->toBe(1);
});

it('rejects rows with errors', function () {
    $invitation = Invitation::factory()->forOrder(Order::factory()->withPanel()->create())->create();

    $this->actingAs(User::factory()->create())
        ->post(route('admin.invitations.guests.import.store', $invitation), [
            'rows' => [['name' => 'Ana', 'seats' => 1], ['name' => '', 'seats' => 1]],
        ])
        ->assertSessionHasErrors(['rows.1.name' => 'El campo nombre es obligatorio.']);

    expect(Guest::count())->toBe(0);
});

it('flags the rows with more seats than the plan allows per invitation', function () {
    $plan = Plan::factory()->withPanel()->create(['max_seats_per_guest' => 4]);
    $invitation = Invitation::factory()->forOrder(Order::factory()->for($plan)->create())->create();
    $user = User::factory()->client($invitation->client)->create();

    $this->actingAs($user)
        ->post(route('admin.invitations.guests.import.preview', $invitation), [
            'file' => UploadedFile::fake()->createWithContent('invitados.csv', "Familia Hernández,4\nFamilia Ruiz,6\n"),
        ])
        ->assertOk()
        ->assertJson(['rows' => [
            ['name' => 'Familia Hernández', 'errors' => []],
            ['name' => 'Familia Ruiz', 'errors' => ['El campo lugares no debe ser mayor que 4.']],
        ]]);

    $this->actingAs($user)
        ->post(route('admin.invitations.guests.import.store', $invitation), [
            'rows' => [['name' => 'Familia Ruiz', 'seats' => 6]],
        ])
        ->assertSessionHasErrors(['rows.0.seats']);

    expect(Guest::count())->toBe(0);
});
