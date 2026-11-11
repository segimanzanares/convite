<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Plan\StorePlanRequest;
use App\Http\Requests\Plan\UpdatePlanRequest;
use App\Http\Resources\PlanResource;
use App\Models\Plan;
use App\Services\PlanService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

class PlanController extends Controller
{
    public function __construct(private readonly PlanService $plans) {}

    /**
     * Display every plan.
     */
    public function index(): Response
    {
        Gate::authorize('viewAny', Plan::class);

        return $this->render();
    }

    /**
     * Display the plan list with the create form open in a modal.
     */
    public function create(): Response
    {
        Gate::authorize('create', Plan::class);

        return $this->render('create');
    }

    public function store(StorePlanRequest $request): RedirectResponse
    {
        $this->plans->create($request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Plan created.')]);

        return to_route('admin.plans.index');
    }

    /**
     * Display the plan list with the edit form open in a modal.
     */
    public function edit(Plan $plan): Response
    {
        Gate::authorize('update', $plan);

        return $this->render('edit', $plan);
    }

    public function update(UpdatePlanRequest $request, Plan $plan): RedirectResponse
    {
        $this->plans->update($plan, $request->validated());

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Plan updated.')]);

        return to_route('admin.plans.index');
    }

    /**
     * Delete a plan that was never sold. Sold plans are deactivated instead.
     */
    public function destroy(Plan $plan): RedirectResponse
    {
        Gate::authorize('delete', $plan);

        Inertia::flash('toast', $this->plans->delete($plan)
            ? ['type' => 'success', 'message' => __('Plan deleted.')]
            : ['type' => 'error', 'message' => __('The plan has orders, so it cannot be deleted. Deactivate it instead.')]);

        return to_route('admin.plans.index');
    }

    /**
     * Render the plan list, optionally with the form modal open for a new or existing plan.
     */
    private function render(?string $modal = null, ?Plan $plan = null): Response
    {
        return Inertia::render('plans/index', [
            'plans' => PlanResource::collection($this->plans->all()),
            'modal' => $modal,
            'plan' => $plan ? PlanResource::make($plan) : null,
            'features' => $this->plans->features(),
        ]);
    }
}
