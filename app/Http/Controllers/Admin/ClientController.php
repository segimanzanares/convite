<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\RendersClientPage;
use App\Http\Controllers\Controller;
use App\Http\Requests\Client\StoreClientRequest;
use App\Http\Requests\Client\UpdateClientRequest;
use App\Http\Resources\ClientResource;
use App\Models\Client;
use App\Services\ClientService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class ClientController extends Controller
{
    use RendersClientPage;

    public function __construct(private readonly ClientService $clients) {}

    /**
     * Display the clients, optionally filtered by a search term.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Client::class);

        return $this->render($request);
    }

    /**
     * Display the client list with the create form open in a modal.
     */
    public function create(Request $request): Response
    {
        Gate::authorize('create', Client::class);

        return $this->render($request, 'create');
    }

    public function store(StoreClientRequest $request): RedirectResponse
    {
        $client = $this->clients->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Client created.')]);

        return to_route('admin.clients.show', $client);
    }

    /**
     * Display a client with its orders, users and invitations.
     */
    public function show(Client $client): Response
    {
        Gate::authorize('view', $client);

        return $this->renderClientPage($client);
    }

    /**
     * Display the client list with the edit form open in a modal.
     */
    public function edit(Request $request, Client $client): Response
    {
        Gate::authorize('update', $client);

        return $this->render($request, 'edit', $client);
    }

    public function update(UpdateClientRequest $request, Client $client): RedirectResponse
    {
        $this->clients->update($client, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Client updated.')]);

        return to_route('admin.clients.index');
    }

    /**
     * Delete a client without orders. Clients with orders are kept for the sales history.
     */
    public function destroy(Client $client): RedirectResponse
    {
        Gate::authorize('delete', $client);

        if (! $this->clients->delete($client)) {
            Inertia::flash('toast', ['type' => 'error', 'message' => __('The client has orders, so it cannot be deleted.')]);

            return back();
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Client deleted.')]);

        return to_route('admin.clients.index');
    }

    /**
     * Render the client list, optionally with the form modal open for a new or existing client.
     */
    private function render(Request $request, ?string $modal = null, ?Client $client = null): Response
    {
        $search = $request->string('search')->trim()->value() ?: null;

        return Inertia::render('clients/index', [
            'clients' => ClientResource::collection($this->clients->paginate($search)),
            'filters' => ['search' => $search],
            'modal' => $modal,
            'client' => $client ? ClientResource::make($client) : null,
        ]);
    }
}
