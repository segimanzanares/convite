<?php

namespace App\Http\Controllers;

use App\Http\Resources\DemoInvitationResource;
use App\Http\Resources\PlanResource;
use App\Services\InvitationService;
use App\Services\PlanService;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    /**
     * Display the landing page with the templates' demos and the plans offered with their prices.
     */
    public function __invoke(PlanService $plans, InvitationService $invitations): Response
    {
        return Inertia::render('landing/index', [
            'demos' => DemoInvitationResource::collection($invitations->demos()),
            'plans' => PlanResource::collection($plans->offered()),
        ]);
    }
}
