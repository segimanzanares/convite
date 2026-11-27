<?php

namespace App\Http\Controllers;

use App\Http\Resources\DemoInvitationResource;
use App\Http\Resources\PlanResource;
use App\Services\InvitationService;
use App\Services\PartnerService;
use App\Services\PlanService;
use App\Services\ReferralService;
use App\Services\StructuredDataService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    /**
     * Display the landing page with the templates' demos, the plans offered with their prices and, for visitors who
     * came with a partner's link or a client's referral link, their discount. A partner's link wins over a referral.
     */
    public function __invoke(
        Request $request,
        PlanService $plans,
        InvitationService $invitations,
        StructuredDataService $structuredData,
        ReferralService $referrals,
        PartnerService $partners,
    ): Response {
        $offeredPlans = $plans->offered();
        $partner = $partners->landingProps($request);

        return Inertia::render('landing/index', [
            'demos' => DemoInvitationResource::collection($invitations->demos()),
            'plans' => PlanResource::collection($offeredPlans),
            'servicePlans' => PlanResource::collection($plans->offeredServices()),
            'partner' => $partner,
            'referral' => $partner === null ? $referrals->landingProps($request) : null,
            // Read by resources/views/partials/meta.blade.php
            'meta' => ['description' => $structuredData->landingDescription($offeredPlans)],
        ])->withViewData([
            // Rendered by resources/views/app.blade.php, not sent to the page
            'structuredData' => $structuredData->landing($offeredPlans),
        ]);
    }
}
