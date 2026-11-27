<?php

namespace App\Http\Controllers;

use App\Http\Resources\PlanResource;
use App\Services\PartnerService;
use App\Services\PlanService;
use App\Services\ReferralService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ServicesController extends Controller
{
    /**
     * Display the services offered besides the digital invitations (videos and custom printables), with the active plans
     * of each one as its options.
     * Visitors who came with a partner's link or a client's referral link keep their discount, as on the landing page.
     */
    public function __invoke(Request $request, ReferralService $referrals, PartnerService $partners, PlanService $plans): Response
    {
        $partner = $partners->landingProps($request);

        return Inertia::render('landing/services', [
            'partner' => $partner,
            'referral' => $partner === null ? $referrals->landingProps($request) : null,
            'servicePlans' => PlanResource::collection($plans->offeredServices()),
            // Read by resources/views/partials/meta.blade.php
            'meta' => [
                'title' => 'Video semblanza, invitación en video e imprimibles - Convite',
                'description' => 'Además de invitaciones digitales: video semblanza, invitación en video, tarjeta y pases imprimibles con diseño personalizado para bodas, XV años, bautizos, baby showers y cumpleaños. Entrega en 2 a 5 días hábiles.',
            ],
        ]);
    }
}
