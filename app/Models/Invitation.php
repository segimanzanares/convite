<?php

namespace App\Models;

use App\Enums\InvitationStatus;
use App\Enums\PlanFeature;
use Carbon\CarbonImmutable;
use Database\Factories\InvitationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Scope;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 * Routing and meta data of an invitation. Its content is React code under resources/js/site/invitations/{template}/.
 *
 * @property int $id
 * @property int|null $client_id
 * @property int|null $order_id
 * @property string $slug
 * @property string $template
 * @property Carbon|null $event_date
 * @property Carbon|null $rsvp_deadline
 * @property InvitationStatus $status
 * @property string $title
 * @property string $description
 * @property string|null $og_image
 * @property Carbon|null $guests_purged_at
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['client_id', 'order_id', 'slug', 'template', 'event_date', 'rsvp_deadline', 'status', 'title', 'description', 'og_image'])]
class Invitation extends Model
{
    /** @use HasFactory<InvitationFactory> */
    use HasFactory;

    /** Printable 5×7 card, served at /i/{slug}/tarjeta. */
    public const string PRINT_CARD_PAGE = 'PrintCardPage';

    /** Printable guest passes, served at /i/{slug}/pases. */
    public const string GUEST_PASSES_PAGE = 'GuestPassesPage';

    /**
     * The plan feature each printable page requires when the invitation belongs to an order.
     *
     * @var array<string, PlanFeature>
     */
    private const array PAGE_FEATURES = [
        self::PRINT_CARD_PAGE => PlanFeature::PrintCard,
        self::GUEST_PASSES_PAGE => PlanFeature::GuestPasses,
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'event_date' => 'date',
            'rsvp_deadline' => 'date',
            'status' => InvitationStatus::class,
            'guests_purged_at' => 'datetime',
        ];
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /** @return BelongsTo<Client, $this> */
    public function client(): BelongsTo
    {
        return $this->belongsTo(Client::class);
    }

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }

    /** @return HasMany<Guest, $this> */
    public function guests(): HasMany
    {
        return $this->hasMany(Guest::class)->chaperone();
    }

    /** @return HasMany<Rsvp, $this> */
    public function rsvps(): HasMany
    {
        return $this->hasMany(Rsvp::class);
    }

    /**
     * Whether the order the invitation was sold through includes the given feature. Invitations without an order (the
     * demos) have no guest list and no online RSVPs, so visitors of a demo never leave data behind.
     */
    public function hasFeature(PlanFeature $feature): bool
    {
        return $this->order?->hasFeature($feature) ?? false;
    }

    /**
     * The most guests the invitation may have, or null when the plan sets no limit.
     */
    public function guestLimit(): ?int
    {
        return $this->order?->maxGuests();
    }

    /**
     * When the RSVP form closes: the end of the deadline day, or of the event day without a deadline, in the
     * application's time zone. Null when the invitation has neither date.
     */
    public function rsvpClosesAt(): ?CarbonImmutable
    {
        return ($this->rsvp_deadline ?? $this->event_date)?->toImmutable()->endOfDay();
    }

    /**
     * Whether the public may open the invitation. Drafts and archived invitations are only shown to its panel users,
     * as a preview (see EnsureInvitationIsVisible).
     */
    public function isPublished(): bool
    {
        return $this->status === InvitationStatus::Published;
    }

    /**
     * Whether the invitation stores RSVPs and still takes them: it is published, the plan includes online RSVPs, the
     * deadline has not passed and its guest data was not purged. A preview never leaves test answers behind.
     */
    public function acceptsRsvps(): bool
    {
        if (! $this->isPublished() || ! $this->hasFeature(PlanFeature::OnlineRsvp) || $this->guests_purged_at !== null) {
            return false;
        }

        $closesAt = $this->rsvpClosesAt();

        return $closesAt === null || now()->lessThanOrEqualTo($closesAt);
    }

    /**
     * Limit the query to the invitations whose guest data must be deleted: their event ended the given number of
     * days ago or more, and they were not purged yet.
     *
     * @param  Builder<Invitation>  $query
     */
    #[Scope]
    protected function dueForGuestPurge(Builder $query, int $retentionDays): void
    {
        $query->whereNull('guests_purged_at')
            ->whereNotNull('event_date')
            ->whereDate('event_date', '<', today()->subDays($retentionDays));
    }

    /**
     * Inertia component name of one of this invitation's React pages,
     * e.g. "invitations/demo/InvitationPage".
     */
    public function component(string $page = 'InvitationPage'): string
    {
        return "invitations/{$this->template}/{$page}";
    }

    /**
     * Whether the invitation's template ships the given page. Printable
     * pages are optional per template, so their routes 404 without one.
     */
    public function hasPage(string $page): bool
    {
        return is_file(resource_path("js/site/{$this->component($page)}.tsx"));
    }

    /**
     * Whether the given page may be served: the template ships it and, when the invitation was sold through an order,
     * the order's plan includes it. Invitations without an order (the demos) serve every page their template has.
     */
    public function offersPage(string $page): bool
    {
        if (! $this->hasPage($page)) {
            return false;
        }

        $feature = self::PAGE_FEATURES[$page] ?? null;

        if ($feature === null || $this->order === null) {
            return true;
        }

        return $this->order->hasFeature($feature);
    }

    /**
     * The templates that can be assigned to an invitation: every folder that ships an InvitationPage.
     *
     * @return list<string>
     */
    public static function templates(): array
    {
        $pages = glob(resource_path('js/site/invitations/*/InvitationPage.tsx')) ?: [];

        return collect($pages)->map(fn (string $path) => basename(dirname($path)))->sort()->values()->all();
    }
}
