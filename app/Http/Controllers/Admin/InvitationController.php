<?php

namespace App\Http\Controllers\Admin;

use App\Enums\InvitationKind;
use App\Enums\InvitationStatus;
use App\Http\Controllers\Admin\Concerns\KeepsListQuery;
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
    use KeepsListQuery;

    /** The query string keys of the list: its filters and page. */
    private const LIST_QUERY = ['client', 'type', 'kind', 'status', 'page'];

    public function __construct(private readonly InvitationService $invitations) {}

    /**
     * Display the invitations, optionally filtered by client, type, kind of event and status.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Invitation::class);

        return $this->render($request);
    }

    /**
     * Display the invitation list with the create form open in a modal.
     */
    public function create(Request $request): Response
    {
        Gate::authorize('create', Invitation::class);

        return $this->render($request, 'create');
    }

    public function store(StoreInvitationRequest $request): RedirectResponse
    {
        $this->invitations->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Invitation created.')]);

        return to_route('admin.invitations.index', $this->listQuery($request, self::LIST_QUERY));
    }

    /**
     * Display the invitation list with the edit form open in a modal.
     */
    public function edit(Request $request, Invitation $invitation): Response
    {
        Gate::authorize('update', $invitation);

        return $this->render($request, 'edit', $invitation);
    }

    public function update(UpdateInvitationRequest $request, Invitation $invitation): RedirectResponse
    {
        $this->invitations->update($invitation, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Invitation updated.')]);

        return to_route('admin.invitations.index', $this->listQuery($request, self::LIST_QUERY));
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
    private function render(Request $request, ?string $modal = null, ?Invitation $invitation = null): Response
    {
        $filters = $this->filters($request);

        return Inertia::render('invitations/index', [
            'invitations' => InvitationResource::collection($this->invitations->paginate($filters)),
            'filters' => [...$filters, 'kind' => $filters['kind']?->value, 'status' => $filters['status']?->value],
            'clients' => $this->invitations->clientsWithInvitations()->map->only(['id', 'name']),
            'modal' => $modal,
            'invitation' => $invitation ? InvitationResource::make($invitation) : null,
            'templates' => collect(Invitation::assignableTemplates($invitation))
                ->map(fn (array $template, string $name) => ['name' => $name, ...$template])
                ->values(),
            'orders' => $modal ? OrderResource::collection($this->invitations->linkableOrders()) : [],
        ]);
    }

    /**
     * The list filters in the query string, ignoring unknown values.
     *
     * @return array{client: ?int, type: ?string, kind: ?InvitationKind, status: ?InvitationStatus}
     */
    private function filters(Request $request): array
    {
        $type = $request->query('type');
        $kind = $request->query('kind');
        $status = $request->query('status');

        return [
            'client' => filter_var($request->query('client'), FILTER_VALIDATE_INT) ?: null,
            'type' => in_array($type, [InvitationService::TYPE_DEMO, InvitationService::TYPE_ORDER], true) ? $type : null,
            'kind' => is_string($kind) ? InvitationKind::tryFrom($kind) : null,
            'status' => is_string($status) ? InvitationStatus::tryFrom($status) : null,
        ];
    }
}
