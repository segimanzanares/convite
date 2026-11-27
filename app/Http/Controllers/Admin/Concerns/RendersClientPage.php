<?php

namespace App\Http\Controllers\Admin\Concerns;

use App\Enums\OrderStatus;
use App\Http\Resources\ClientResource;
use App\Http\Resources\InvitationResource;
use App\Http\Resources\OrderResource;
use App\Http\Resources\PlanResource;
use App\Http\Resources\UserResource;
use App\Models\Client;
use App\Models\Plan;
use App\Services\InvitationService;
use App\Services\PartnerService;
use App\Services\ReferralService;
use Inertia\Inertia;
use Inertia\Response;

/**
 * The client page shows its orders, users and invitations. Its forms open in modals whose state comes from the URL,
 * so several controllers render it.
 */
trait RendersClientPage
{
    /**
     * @param  'order'|'access'|null  $modal
     */
    protected function renderClientPage(Client $client, ?string $modal = null): Response
    {
        $client->load([
            'users' => fn ($query) => $query->orderBy('name'),
            'invitations' => fn ($query) => $query->with('order')->orderBy('event_date'),
            'orders' => fn ($query) => $query->withSum('payments', 'amount')->latest('id'),
        ])->loadCount([
            // The sales the client's referral code brought in; quotes are not sales yet
            'referredOrders' => fn ($query) => $query->where('status', '!=', OrderStatus::Quoted),
        ]);

        return Inertia::render('clients/show', [
            'client' => ClientResource::make($client),
            'orders' => OrderResource::collection($client->orders),
            'users' => UserResource::collection($client->users),
            'invitations' => InvitationResource::collection($client->invitations),
            'canHavePanelAccess' => $client->orders->contains->grantsPanelAccess(),
            'plans' => PlanResource::collection(Plan::query()->offered()->get()),
            'referralsEnabled' => app(ReferralService::class)->isEnabled(),
            'partners' => $modal === 'order' ? app(PartnerService::class)->options() : [],
            // The kinds of event a video invitation's order may be for (it creates the invitation)
            'videoKinds' => $modal === 'order' ? app(InvitationService::class)->videoKinds() : [],
            'modal' => $modal,
        ]);
    }
}
