<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Invitation\StoreInvitationRequest;
use App\Http\Requests\Invitation\UpdateInvitationRequest;
use App\Http\Resources\InvitationResource;
use App\Http\Resources\OrderResource;
use App\Models\Invitation;
use App\Services\InvitationService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class InvitationController extends Controller
{
    public function __construct(private readonly InvitationService $invitations) {}

    /**
     * Display every invitation.
     */
    public function index(): Response
    {
        Gate::authorize('viewAny', Invitation::class);

        return $this->render();
    }

    /**
     * Display the invitation list with the create form open in a modal.
     */
    public function create(): Response
    {
        Gate::authorize('create', Invitation::class);

        return $this->render('create');
    }

    public function store(StoreInvitationRequest $request): RedirectResponse
    {
        $this->invitations->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Invitation created.')]);

        return to_route('admin.invitations.index');
    }

    /**
     * Display the invitation list with the edit form open in a modal.
     */
    public function edit(Invitation $invitation): Response
    {
        Gate::authorize('update', $invitation);

        return $this->render('edit', $invitation);
    }

    public function update(UpdateInvitationRequest $request, Invitation $invitation): RedirectResponse
    {
        $this->invitations->update($invitation, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Invitation updated.')]);

        return to_route('admin.invitations.index');
    }

    /**
     * Display the invitations of the authenticated client user, read only.
     */
    public function mine(Request $request): Response
    {
        $client = $request->user()->client;
        abort_if($client === null, 403);

        return Inertia::render('invitations/mine', [
            'invitations' => InvitationResource::collection($this->invitations->ownedBy($client)),
        ]);
    }

    /**
     * Render the invitation list, optionally with the form modal open for a new or existing invitation.
     */
    private function render(?string $modal = null, ?Invitation $invitation = null): Response
    {
        return Inertia::render('invitations/index', [
            'invitations' => InvitationResource::collection($this->invitations->paginate()),
            'modal' => $modal,
            'invitation' => $invitation ? InvitationResource::make($invitation) : null,
            'templates' => Invitation::templates(),
            'orders' => $modal ? OrderResource::collection($this->invitations->linkableOrders()) : [],
        ]);
    }
}
