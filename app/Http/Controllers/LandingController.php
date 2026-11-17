<?php

namespace App\Http\Controllers;

use App\Http\Resources\DemoInvitationResource;
use App\Http\Resources\PlanResource;
use App\Services\InvitationService;
use App\Services\PlanService;
use App\Services\StructuredDataService;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    /**
     * Display the landing page with the templates' demos and the plans offered with their prices.
     */
    public function __invoke(PlanService $plans, InvitationService $invitations, StructuredDataService $structuredData): Response
    {
        $offeredPlans = $plans->offered();

        return Inertia::render('landing/index', [
            'demos' => DemoInvitationResource::collection($invitations->demos()),
            'plans' => PlanResource::collection($offeredPlans),
            // Read by resources/views/partials/meta.blade.php
            'meta' => ['description' => $structuredData->landingDescription($offeredPlans)],
        ])->withViewData([
            // Rendered by resources/views/app.blade.php, not sent to the page
            'structuredData' => $structuredData->landing($offeredPlans),
        ]);
    }
}
