<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PartnerKind;
use App\Http\Controllers\Admin\Concerns\KeepsListQuery;
use App\Http\Controllers\Controller;
use App\Http\Requests\Partner\StorePartnerRequest;
use App\Http\Requests\Partner\UpdatePartnerRequest;
use App\Http\Resources\OrderResource;
use App\Http\Resources\PartnerResource;
use App\Models\Partner;
use App\Services\PartnerService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

/**
 * The partners ("aliados"): wedding planners, influencers... who bring clients for a commission.
 */
class PartnerController extends Controller
{
    use KeepsListQuery;

    /** The query string keys of the list: its search and page. */
    private const LIST_QUERY = ['search', 'page'];

    public function __construct(private readonly PartnerService $partners) {}

    /**
     * Display the partners, optionally filtered by a search term, with their sales and commissions.
     */
    public function index(Request $request): Response
    {
        Gate::authorize('viewAny', Partner::class);

        return $this->render($request);
    }

    /**
     * Display the partner list with the create form open in a modal.
     */
    public function create(Request $request): Response
    {
        Gate::authorize('create', Partner::class);

        return $this->render($request, 'create');
    }

    public function store(StorePartnerRequest $request): RedirectResponse
    {
        $partner = $this->partners->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Partner created.')]);

        return to_route('admin.partners.show', $partner);
    }

    /**
     * Display a partner with their link, the orders they brought and the commission of each one.
     */
    public function show(Partner $partner): Response
    {
        Gate::authorize('view', $partner);

        $this->partners->loadDetails($partner);

        return Inertia::render('partners/show', [
            'partner' => PartnerResource::make($partner),
            'orders' => OrderResource::collection($partner->orders),
            'landingUrl' => $partner->landingUrl(),
        ]);
    }

    /**
     * Display the partner list with the edit form open in a modal.
     */
    public function edit(Request $request, Partner $partner): Response
    {
        Gate::authorize('update', $partner);

        return $this->render($request, 'edit', $partner);
    }

    public function update(UpdatePartnerRequest $request, Partner $partner): RedirectResponse
    {
        $this->partners->update($partner, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Partner updated.')]);

        return to_route('admin.partners.index', $this->listQuery($request, self::LIST_QUERY));
    }

    /**
     * Delete a partner without orders. Partners with orders are kept for the commissions history.
     */
    public function destroy(Request $request, Partner $partner): RedirectResponse
    {
        Gate::authorize('delete', $partner);

        if (! $this->partners->delete($partner)) {
            Inertia::flash('toast', ['type' => 'error', 'message' => __('The partner has orders, so it cannot be deleted. Deactivate it instead.')]);

            return back();
        }

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Partner deleted.')]);

        return to_route('admin.partners.index', $this->listQuery($request, self::LIST_QUERY));
    }

    /**
     * Render the partner list, optionally with the form modal open for a new or existing partner.
     */
    private function render(Request $request, ?string $modal = null, ?Partner $partner = null): Response
    {
        $search = $request->string('search')->trim()->value() ?: null;

        return Inertia::render('partners/index', [
            'partners' => PartnerResource::collection($this->partners->paginate($search)),
            'filters' => ['search' => $search],
            'kinds' => array_column(PartnerKind::cases(), 'value'),
            'modal' => $modal,
            'partner' => $partner ? PartnerResource::make($partner) : null,
        ]);
    }
}
