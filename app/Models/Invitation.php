<?php

namespace App\Models;

use App\Enums\InvitationKind;
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
use Illuminate\Support\Facades\Storage;

/**
 * An invitation: its routing and meta data, and the content the admin captured. Its design is a template under
 * resources/js/invitations/templates/{template}/.
 *
 * @property int $id
 * @property int|null $client_id
 * @property int|null $order_id
 * @property string $slug
 * @property string $template
 * @property Carbon|null $event_date
 * @property string|null $event_time
 * @property Carbon|null $rsvp_deadline
 * @property InvitationStatus $status
 * @property string $title
 * @property string $description
 * @property string|null $og_image
 * @property array<string, mixed>|null $content
 * @property Carbon|null $guests_purged_at
 * @property Carbon|null $uploads_purged_at
 * @property string|null $door_token
 * @property string|null $gallery_token
 * @property bool $gallery_moderated
 * @property int $gallery_opens_days_before
 * @property int $gallery_closes_days_after
 * @property int $gallery_slide_seconds
 * @property bool $wishes_enabled
 * @property bool $wishes_public
 * @property bool $wishes_moderated
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['client_id', 'order_id', 'slug', 'template', 'event_date', 'event_time', 'rsvp_deadline', 'status', 'title', 'description', 'og_image', 'content'])]
class Invitation extends Model
{
    /** @use HasFactory<InvitationFactory> */
    use HasFactory;

    /** Printable 5×7 card, served at /i/{slug}/tarjeta. */
    public const string PRINT_CARD_PAGE = 'PrintCardPage';

    /** Printable guest passes, served at /i/{slug}/pases. */
    public const string GUEST_PASSES_PAGE = 'GuestPassesPage';

    /**
     * The optional sections a template may show. Each template lists the ones its design has in its template.json,
     * and the content form only asks for those.
     *
     * @var list<string>
     */
    public const array SECTIONS = ['family', 'venues', 'program', 'gallery', 'dress_code', 'swatches', 'gifts'];

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
            'uploads_purged_at' => 'datetime',
            'content' => 'array',
            'gallery_moderated' => 'boolean',
            'gallery_opens_days_before' => 'integer',
            'gallery_closes_days_after' => 'integer',
            'gallery_slide_seconds' => 'integer',
            'wishes_enabled' => 'boolean',
            'wishes_public' => 'boolean',
            'wishes_moderated' => 'boolean',
            'reveal_shown_at' => 'datetime',
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

    /** @return HasMany<GalleryPhoto, $this> */
    public function galleryPhotos(): HasMany
    {
        return $this->hasMany(GalleryPhoto::class);
    }

    /** @return HasMany<Wish, $this> */
    public function wishes(): HasMany
    {
        return $this->hasMany(Wish::class);
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
     * The most seats a single guest may have: the plan's limit, never above Guest::MAX_SEATS.
     */
    public function seatLimit(): int
    {
        return min($this->order?->maxSeatsPerGuest() ?? Guest::MAX_SEATS, Guest::MAX_SEATS);
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
     * When guests may start being checked in at the door: the day before the event, so the staff can try the door
     * link while setting up. Null without an event date.
     */
    public function checkInOpensAt(): ?CarbonImmutable
    {
        return $this->event_date?->toImmutable()->subDay()->startOfDay();
    }

    /**
     * When check-in closes: noon of the day after the event, since parties run past midnight.
     */
    public function checkInClosesAt(): ?CarbonImmutable
    {
        return $this->event_date?->toImmutable()->addDay()->setTime(12, 0);
    }

    /**
     * Whether guests may be checked in now: the plan includes it, the guest data was not purged and the time falls
     * within the check-in window, in the application's time zone.
     */
    public function checkInIsOpen(): bool
    {
        if (! $this->hasFeature(PlanFeature::CheckIn) || $this->guests_purged_at !== null || $this->event_date === null) {
            return false;
        }

        return now()->between($this->checkInOpensAt(), $this->checkInClosesAt());
    }

    /**
     * When guests may start sharing photos in the live gallery: the start of the event day, or of as many days before
     * it as the invitation chose (gallery_opens_days_before). Null without an event date.
     */
    public function galleryOpensAt(): ?CarbonImmutable
    {
        return $this->event_date?->toImmutable()->subDays($this->gallery_opens_days_before ?? 0)->startOfDay();
    }

    /**
     * When the live gallery stops taking photos: noon of the day the invitation chose after the event
     * (gallery_closes_days_after, the next day by default, like check-in), since parties run past midnight.
     */
    public function galleryClosesAt(): ?CarbonImmutable
    {
        return $this->event_date?->toImmutable()->addDays($this->gallery_closes_days_after ?? 1)->setTime(12, 0);
    }

    /**
     * Whether guests may share photos now: the plan includes the live gallery, the guest data was not purged and the
     * time falls within the gallery's window, in the application's time zone.
     */
    public function galleryIsOpen(): bool
    {
        if (! $this->hasFeature(PlanFeature::LiveGallery) || $this->guests_purged_at !== null || $this->event_date === null) {
            return false;
        }

        return now()->between($this->galleryOpensAt(), $this->galleryClosesAt());
    }

    /**
     * Whether the invitation shows its wishes book: the plan includes it, a panel user turned it on and the guest data
     * (the messages among them) was not purged.
     */
    public function offersWishes(): bool
    {
        return $this->hasFeature(PlanFeature::Wishes) && $this->wishes_enabled && $this->guests_purged_at === null;
    }

    /**
     * When the wishes book stops taking messages: the end of the given number of days after the event, so guests can
     * still send their congratulations once it is over. Null without an event date.
     */
    public function wishesCloseAt(): ?CarbonImmutable
    {
        return $this->event_date?->toImmutable()->addDays(config('convite.wishes_days_after_event'))->endOfDay();
    }

    /**
     * Whether the wishes book takes messages now: the invitation offers it, is published (a preview never leaves test
     * messages behind) and the book has not closed, in the application's time zone.
     */
    public function acceptsWishes(): bool
    {
        if (! $this->offersWishes() || ! $this->isPublished()) {
            return false;
        }

        $closesAt = $this->wishesCloseAt();

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
     * Limit the query to the archived invitations whose uploads must be deleted: their event was the given number of
     * days ago or more, and they were not purged yet.
     *
     * @param  Builder<Invitation>  $query
     */
    #[Scope]
    protected function dueForUploadsPurge(Builder $query, int $retentionDays): void
    {
        $query->where('status', InvitationStatus::Archived)
            ->whereNull('uploads_purged_at')
            ->whereNotNull('event_date')
            ->whereDate('event_date', '<=', today()->subDays($retentionDays));
    }

    /**
     * Inertia component name of one of this invitation's React pages,
     * e.g. "templates/boda-clasica/InvitationPage".
     */
    public function component(string $page = 'InvitationPage'): string
    {
        return "templates/{$this->template}/{$page}";
    }

    /**
     * Whether the invitation's template ships the given page. Printable
     * pages are optional per template, so their routes 404 without one.
     */
    public function hasPage(string $page): bool
    {
        return is_file(resource_path("js/invitations/{$this->component($page)}.tsx"));
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
     * The kind of event of the invitation's template, which decides the shape of its content.
     */
    public function kind(): ?InvitationKind
    {
        return self::templates()[$this->template]['kind'] ?? null;
    }

    /**
     * Whether the content was captured far enough to publish the invitation: it names the couple, the celebrant or
     * the parents-to-be (one name is enough for them).
     */
    public function hasContent(): bool
    {
        $kind = $this->kind();

        if ($kind === null) {
            return false;
        }

        if ($kind->hasCelebrant()) {
            return filled($this->content['name'] ?? null);
        }

        $names = $this->content['names'] ?? [];

        if ($kind->hasParentsToBe()) {
            return is_array($names) && filled($names[0] ?? null);
        }

        return is_array($names) && count(array_filter($names, filled(...))) === 2;
    }

    /**
     * The public URL of a media path of the invitation. Paths starting with "/" are static files shipped in
     * public/ (the seeded demos) and stay relative to the site; the rest were uploaded to the public disk.
     */
    public static function mediaUrl(?string $path): ?string
    {
        if (blank($path)) {
            return null;
        }

        return str_starts_with($path, '/') ? $path : Storage::disk('public')->url($path);
    }

    /**
     * The folder of the public disk the invitation's uploads go to.
     */
    public function mediaDirectory(): string
    {
        return "invitations/{$this->id}";
    }

    /**
     * The templates the given invitation may use: every template that is not exclusive, plus the one it already
     * uses. A new invitation (null) only gets the shared ones.
     *
     * @return array<string, array{kind: InvitationKind, label: string, sections: list<string>, exclusive: bool}>
     */
    public static function assignableTemplates(?self $invitation = null): array
    {
        return array_filter(
            self::templates(),
            fn (array $template, string $name) => ! $template['exclusive'] || $name === $invitation?->template,
            ARRAY_FILTER_USE_BOTH,
        );
    }

    /**
     * Every template: each folder that ships an InvitationPage and declares its kind in a template.json manifest,
     * keyed by folder name. A design made for one client sets "exclusive": true, so other invitations cannot pick it.
     * "fonts" lists the Google Fonts families its pages use (as in the css2 API's family parameter, e.g.
     * "Cinzel:wght@300;400;500"), and "print_fonts" the ones only its printable pages add. "colors" names the
     * design's own primary color and background (hex) and the primary colors the panel suggests in its place.
     *
     * @return array<string, array{kind: InvitationKind, label: string, sections: list<string>, exclusive: bool, fonts: list<string>, print_fonts: list<string>, colors: array{primary: string|null, background: string|null, suggestions: list<array{label: string, primary: string}>}}>
     */
    public static function templates(): array
    {
        return once(function (): array {
            $templates = [];

            foreach (glob(resource_path('js/invitations/templates/*/template.json')) ?: [] as $manifestPath) {
                $folder = dirname($manifestPath);
                $manifest = json_decode((string) file_get_contents($manifestPath), true);
                $kind = InvitationKind::tryFrom($manifest['kind'] ?? '');

                if ($kind === null || ! is_file("{$folder}/InvitationPage.tsx")) {
                    continue;
                }

                $templates[basename($folder)] = [
                    'kind' => $kind,
                    'label' => (string) ($manifest['label'] ?? basename($folder)),
                    'sections' => array_values(array_intersect($manifest['sections'] ?? [], self::SECTIONS)),
                    'exclusive' => (bool) ($manifest['exclusive'] ?? false),
                    'fonts' => array_values(array_filter($manifest['fonts'] ?? [], is_string(...))),
                    'print_fonts' => array_values(array_filter($manifest['print_fonts'] ?? [], is_string(...))),
                    'colors' => self::manifestColors($manifest['colors'] ?? []),
                ];
            }

            ksort($templates);

            return $templates;
        });
    }

    /**
     * The "colors" of a template's manifest, keeping only well-formed hex colors.
     *
     * @return array{primary: string|null, background: string|null, suggestions: list<array{label: string, primary: string}>}
     */
    private static function manifestColors(mixed $colors): array
    {
        $colors = is_array($colors) ? $colors : [];
        $hex = fn (mixed $value): ?string => is_string($value) && self::isHexColor($value) ? strtoupper($value) : null;

        return [
            'primary' => $hex($colors['primary'] ?? null),
            'background' => $hex($colors['background'] ?? null),
            'suggestions' => array_values(array_filter(array_map(
                fn (mixed $suggestion) => is_array($suggestion) && is_string($suggestion['label'] ?? null) && $hex($suggestion['primary'] ?? null)
                    ? ['label' => $suggestion['label'], 'primary' => $hex($suggestion['primary'])]
                    : null,
                is_array($colors['suggestions'] ?? null) ? $colors['suggestions'] : [],
            ))),
        ];
    }

    /**
     * A color as the panel captures it: # and six hex digits.
     */
    public static function isHexColor(string $value): bool
    {
        return preg_match('/^#[0-9A-Fa-f]{6}$/', $value) === 1;
    }
}
