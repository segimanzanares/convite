<?php

namespace App\Services;

use App\Enums\InvitationKind;
use App\Enums\InvitationStatus;
use App\Models\Client;
use App\Models\Invitation;
use App\Models\Order;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Str;
use InvalidArgumentException;

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
     * The orders an invitation can be linked to (those that sold a web or video invitation; the other services are
     * delivered as files), with their client, the most recent first.
     *
     * @return Collection<int, Order>
     */
    public function linkableOrders(): Collection
    {
        return Order::query()->with('client')->latest('id')->get()
            ->filter(fn (Order $order): bool => $order->type()->hasInvitation())
            ->values();
    }

    /**
     * The kinds of event a video invitation can be made for: those with a catalog template, whose content form the
     * video's invitation uses.
     *
     * @return list<InvitationKind>
     */
    public function videoKinds(): array
    {
        $kinds = array_map(fn (array $template) => $template['kind'], Invitation::assignableTemplates());

        return array_values(array_filter(InvitationKind::cases(), fn (InvitationKind $kind) => in_array($kind, $kinds, true)));
    }

    /**
     * Create the invitation of a video invitation's order, which only holds the video's content: a draft with the
     * catalog template of the kind that asks for the most of what the video shows (its design is never seen), named
     * after the client. The admin then captures its content and renders the video.
     */
    public function createForVideoOrder(Order $order, InvitationKind $kind, ?string $eventDate, ?string $eventTime): Invitation
    {
        $client = $order->client;

        return Invitation::create([
            'order_id' => $order->id,
            'client_id' => $order->client_id,
            'slug' => $this->uniqueSlug("video-{$client->name}"),
            'template' => $this->videoTemplate($kind),
            'event_date' => $eventDate,
            'event_time' => $eventTime,
            'status' => InvitationStatus::Draft,
            'title' => "{$client->name} · Invitación en video",
            'description' => 'Invitación en video',
        ]);
    }

    /**
     * The catalog template of the kind whose sections cover the most of the video's (family, venues, gallery), the
     * first by name among equals.
     */
    private function videoTemplate(InvitationKind $kind): string
    {
        return collect(Invitation::assignableTemplates())
            ->filter(fn (array $template) => $template['kind'] === $kind)
            ->sortBy([
                fn (array $a, array $b) => count(array_intersect($b['sections'], Invitation::VIDEO_SECTIONS)) <=> count(array_intersect($a['sections'], Invitation::VIDEO_SECTIONS)),
            ])
            ->keys()
            ->first() ?? throw new InvalidArgumentException("No template for {$kind->value}.");
    }

    private function uniqueSlug(string $text): string
    {
        $base = Str::limit(Str::slug($text), 60, '');
        $slug = $base;

        for ($suffix = 2; Invitation::query()->where('slug', $slug)->exists(); $suffix++) {
            $slug = "{$base}-{$suffix}";
        }

        return $slug;
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

    /**
     * Show the result of a gender reveal on the invitation from now on, or hide it again.
     */
    public function showReveal(Invitation $invitation, bool $shown): void
    {
        $invitation->forceFill(['reveal_shown_at' => $shown ? now() : null])->save();
    }
}
