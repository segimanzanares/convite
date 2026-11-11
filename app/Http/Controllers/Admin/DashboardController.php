<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\InvitationResource;
use App\Http\Resources\OrderResource;
use App\Http\Resources\RsvpResource;
use App\Models\Invitation;
use App\Services\DashboardService;
use App\Services\InvitationService;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function __construct(
        private readonly DashboardService $dashboard,
        private readonly InvitationService $invitations,
    ) {}

    /**
     * Display the panel's home page: the business metrics for admins, the progress of their invitations for client
     * users.
     */
    public function __invoke(Request $request): Response
    {
        return $request->user()->isAdmin() ? $this->admin() : $this->client($request);
    }

    private function admin(): Response
    {
        $revenue = $this->dashboard->monthlyRevenue();
        $currentMonth = end($revenue);
        $ordersWithBalance = $this->dashboard->ordersWithBalanceDue();
        $upcomingEvents = $this->dashboard->upcomingEvents();

        return Inertia::render('dashboard/admin', [
            'totals' => [
                'sales_this_month' => $currentMonth['sales'],
                'collected_this_month' => $currentMonth['collected'],
                'balance_due' => $this->dashboard->totalBalance($ordersWithBalance),
                'upcoming_events' => $upcomingEvents->count(),
            ],
            'revenue' => $revenue,
            'upcomingEvents' => InvitationResource::collection($upcomingEvents),
            'upcomingEventDays' => DashboardService::UPCOMING_EVENT_DAYS,
            'ordersWithBalance' => OrderResource::collection($ordersWithBalance),
        ]);
    }

    private function client(Request $request): Response
    {
        $client = $request->user()->client;
        abort_if($client === null, 403);

        return Inertia::render('dashboard/client', [
            'invitations' => $this->invitations->ownedBy($client)->map(fn (Invitation $invitation) => [
                'invitation' => InvitationResource::make($invitation),
                ...$this->dashboard->invitationProgress($invitation),
            ]),
            'recentAnswers' => RsvpResource::collection($this->dashboard->recentAnswers($client)),
            'answersByDay' => $this->dashboard->answersByDay($client),
        ]);
    }
}
