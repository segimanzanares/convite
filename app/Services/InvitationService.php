<?php

namespace App\Services;

use App\Enums\InvitationKind;
use App\Enums\InvitationStatus;
use App\Models\Client;
use App\Models\Invitation;
use App\Models\Order;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class InvitationService
{
    /** Invitations without an order: the template demos. */
    public const TYPE_DEMO = 'demo';

    /** Invitations sold through an order. */
    public const TYPE_ORDER = 'order';

    /**
     * List the invitations, the upcoming events first and the ones without a date last, optionally only those of a
     * client, only the demos (no order) or only the sold ones (with an order), only those whose template is of a kind
     * of event, and only those with a status.
     *
     * @param  array{client: ?int, type: ?string, kind: ?InvitationKind, status: ?InvitationStatus}  $filters
     */
    public function paginate(array $filters, int $perPage = 15): LengthAwarePaginator
    {
        return Invitation::query()
            ->with(['client', 'order'])
            ->when($filters['client'], fn ($query, int $client) => $query->where('client_id', $client))
            ->when($filters['type'] === self::TYPE_DEMO, fn ($query) => $query->whereNull('order_id'))
            ->when($filters['type'] === self::TYPE_ORDER, fn ($query) => $query->whereNotNull('order_id'))
            ->when($filters['kind'], fn ($query, InvitationKind $kind) => $query->whereIn(
                'template',
                array_keys(array_filter(Invitation::templates(), fn (array $template): bool => $template['kind'] === $kind)),
            ))
            ->when($filters['status'], fn ($query, InvitationStatus $status) => $query->where('status', $status))
            ->orderByRaw('event_date is null')
            ->orderByDesc('event_date')
            ->orderBy('slug')
            ->paginate($perPage)
            ->withQueryString();
    }

    /**
     * The clients that have invitations, by name, to filter the list by.
     *
     * @return Collection<int, Client>
     */
    public function clientsWithInvitations(): Collection
    {
        return Client::query()->whereHas('invitations')->orderBy('name')->get(['id', 'name']);
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
