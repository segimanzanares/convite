<?php

namespace App\Http\Controllers;

use App\Http\Resources\PlanResource;
use App\Services\PlanService;
use Inertia\Inertia;
use Inertia\Response;

class LandingController extends Controller
{
    /**
     * Display the landing page with the plans offered and their prices.
     */
    public function __invoke(PlanService $plans): Response
    {
        return Inertia::render('landing/index', [
            'plans' => PlanResource::collection($plans->offered()),
        ]);
    }
}
