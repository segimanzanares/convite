<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\RendersClientPage;
use App\Http\Controllers\Controller;
use App\Http\Requests\Client\GrantClientAccessRequest;
use App\Models\Client;
use App\Models\User;
use App\Services\ClientService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Panel users of a client. Only clients whose orders include a feature used from the panel may have them.
 */
class ClientUserController extends Controller
{
    use RendersClientPage;

    public function __construct(private readonly ClientService $clients) {}

    /**
     * Display the client page with the form to give access open in a modal.
     */
    public function create(Client $client): Response
    {
        Gate::authorize('update', $client);

        return $this->renderClientPage($client, 'access');
    }

    /**
     * Create a panel user for the client, who gets an email to choose their password.
     */
    public function store(GrantClientAccessRequest $request, Client $client): RedirectResponse
    {
        $user = $this->clients->grantAccess($client, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Access granted. We sent an email to :email to choose a password.', ['email' => $user->email])]);

        return to_route('admin.clients.show', $client);
    }

    /**
     * Remove a panel user of the client.
     */
    public function destroy(Client $client, User $user): RedirectResponse
    {
        Gate::authorize('update', $client);
        abort_unless($user->client_id === $client->id, 404);

        $this->clients->revokeAccess($user);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Access removed.')]);

        return to_route('admin.clients.show', $client);
    }
}
