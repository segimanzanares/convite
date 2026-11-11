<?php

use App\Enums\UserRole;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

it('creates an admin with a verified email address', function () {
    $this->artisan('admin:create', [
        '--name' => 'Ana Admin',
        '--email' => 'ana@example.com',
        '--password' => 'secreto-largo-123',
    ])->assertSuccessful();

    $admin = User::firstWhere('email', 'ana@example.com');

    expect($admin->name)->toBe('Ana Admin')
        ->and($admin->fresh()->role)->toBe(UserRole::Admin)
        ->and($admin->hasVerifiedEmail())->toBeTrue()
        ->and(Hash::check('secreto-largo-123', $admin->password))->toBeTrue();
});

it('rejects an email address that is already registered', function () {
    User::factory()->create(['email' => 'ana@example.com']);

    $this->artisan('admin:create', [
        '--name' => 'Ana Admin',
        '--email' => 'ana@example.com',
        '--password' => 'secreto-largo-123',
    ])
        ->expectsOutputToContain('ya está en uso')
        ->assertFailed();

    expect(User::count())->toBe(1);
});
