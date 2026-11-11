<?php

namespace App\Services;

use App\Enums\UserRole;
use App\Models\Client;
use App\Models\User;
use App\Notifications\ClientAccessGranted;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;

class ClientService
{
    /**
     * List clients ordered by name, optionally filtered by name, email or phone.
     */
    public function paginate(?string $search = null, int $perPage = 15): LengthAwarePaginator
    {
        return Client::query()
            ->withCount('orders')
            ->when($search, function ($query, string $search): void {
                $query->where(function ($query) use ($search): void {
                    $query->whereLike('name', "%{$search}%")
                        ->orWhereLike('email', "%{$search}%")
                        ->orWhereLike('phone', "%{$search}%");
                });
            })
            ->orderBy('name')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Client
    {
        return Client::create($data);
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Client $client, array $data): Client
    {
        $client->update($data);

        return $client;
    }

    /**
     * Delete a client without orders, along with its users. A client with orders is kept for the sales history, so
     * this returns false for it.
     */
    public function delete(Client $client): bool
    {
        if ($client->orders()->exists()) {
            return false;
        }

        return (bool) $client->delete();
    }

    /**
     * Create a panel user for the client and email them a link to choose their password. Accounts created by an
     * admin are trusted, so their email is marked as verified.
     *
     * @param  array{name: string, email: string}  $data
     */
    public function grantAccess(Client $client, array $data): User
    {
        $user = DB::transaction(function () use ($client, $data): User {
            $user = new User([
                ...$data,
                'password' => Str::password(32),
                'role' => UserRole::Client,
                'client_id' => $client->id,
            ]);
            $user->email_verified_at = now();
            $user->save();

            return $user;
        });

        $user->notify(new ClientAccessGranted(Password::broker()->createToken($user)));

        return $user;
    }

    /**
     * Remove a panel user of the client.
     */
    public function revokeAccess(User $user): void
    {
        $user->delete();
    }
}
