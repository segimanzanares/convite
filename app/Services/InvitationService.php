<?php

namespace App\Services;

use App\Enums\InvitationStatus;
use App\Models\Client;
use App\Models\Invitation;
use App\Models\Order;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class InvitationService
{
    /**
     * List every invitation, the upcoming events first and the ones without a date last.
     */
    public function paginate(int $perPage = 15): LengthAwarePaginator
    {
        return Invitation::query()
            ->with(['client', 'order'])
            ->orderByRaw('event_date is null')
            ->orderByDesc('event_date')
            ->orderBy('slug')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * The published demo of each template, as the landing page shows them. A demo has no order and is published at
     * its template's own slug (see InvitationSeeder).
     *
     * @return Collection<int, Invitation>
     */
    public function demos(): Collection
    {
        return Invitation::query()
            ->where('status', InvitationStatus::Published)
            ->whereNull('order_id')
            ->whereColumn('slug', 'template')
            ->orderBy('template')
            ->get();
    }

    /**
     * The invitations of a client, as its users see them.
     *
     * @return Collection<int, Invitation>
     */
    public function ownedBy(Client $client): Collection
    {
        return $client->invitations()->with('order')->orderBy('event_date')->orderBy('slug')->get();
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function create(array $data): Invitation
    {
        return Invitation::create($this->withClientOfOrder($data));
    }

    /**
     * @param  array<string, mixed>  $data
     */
    public function update(Invitation $invitation, array $data): Invitation
    {
        $invitation->update($this->withClientOfOrder($data));

        return $invitation;
    }

    /**
     * The orders an invitation can be linked to, with their client, the most recent first.
     *
     * @return Collection<int, Order>
     */
    public function linkableOrders(): Collection
    {
        return Order::query()->with('client')->latest('id')->get();
    }

    /**
     * An invitation belongs to the client of the order it was sold through, or to no client without an order.
     *
     * @param  array<string, mixed>  $data
     * @return array<string, mixed>
     */
    private function withClientOfOrder(array $data): array
    {
        if (! array_key_exists('order_id', $data)) {
            return $data;
        }

        $data['client_id'] = $data['order_id'] ? Order::findOrFail($data['order_id'])->client_id : null;

        return $data;
    }
}
