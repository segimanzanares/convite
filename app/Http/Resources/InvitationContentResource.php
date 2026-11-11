<?php

namespace App\Http\Resources;

use App\Enums\InvitationKind;
use App\Models\Invitation;
use App\Services\GuestDeliveryService;
use Carbon\CarbonImmutable;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

/**
 * The content of an invitation as its template pages read it (the `invitation` prop): media paths become URLs,
 * maps are built from each venue's coordinates and the keys follow the frontend types (resources/js/site/types).
 * The date labels are formatted by each template from `eventAt` and `rsvpDeadline`.
 *
 * @mixin Invitation
 */
class InvitationContentResource extends JsonResource
{
    /** Demo invitations (without an order) always take place this many days from today, so their countdown runs. */
    public const int DEMO_DAYS_AHEAD = 60;

    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $content = $this->content ?? [];
        $kind = $this->kind() ?? InvitationKind::Wedding;
        [$eventAt, $rsvpDeadline] = $this->eventDates();

        return [
            'kind' => $kind,
            'eventAt' => $eventAt?->format('Y-m-d\TH:i:s'),
            'rsvpDeadline' => $rsvpDeadline?->toDateString(),
            ...$this->names($kind, $content),
            'rsvpWhatsappNumber' => app(GuestDeliveryService::class)->whatsappPhone($content['rsvp_whatsapp'] ?? null) ?? '',
            'musicFile' => Invitation::mediaUrl($content['music'] ?? null),
            'cover' => Invitation::mediaUrl($content['cover'] ?? null),
            'message' => $content['message'] ?? null,
            'closingMessage' => $content['closing_message'] ?? null,
            'tagline' => $content['tagline'] ?? null,
            'venues' => array_map($this->venue(...), $content['venues'] ?? []),
            'program' => array_map(fn (array $item) => [
                'time' => $item['time'],
                'icon' => $item['icon'] ?? null,
                'title' => $item['title'],
                'description' => $item['description'] ?? null,
            ], $content['program'] ?? []),
            'gallery' => array_map(fn (array $photo) => [
                'src' => Invitation::mediaUrl($photo['image']),
                'alt' => $photo['alt'] ?? $photo['caption'] ?? '',
                'caption' => $photo['caption'] ?? '',
            ], $content['gallery'] ?? []),
            'dressCode' => $this->dressCode($content['dress_code'] ?? []),
            'swatches' => $content['swatches'] ?? [],
            'gifts' => array_map($this->gift(...), $content['gifts'] ?? []),
            ...($kind === InvitationKind::Xv ? $this->xvChapters($content) : []),
        ];
    }

    /**
     * When the event takes place and when the RSVP closes. Demo invitations move both to DEMO_DAYS_AHEAD days from
     * today, keeping the captured time and the distance between the deadline and the event.
     *
     * @return array{0: CarbonImmutable|null, 1: CarbonImmutable|null}
     */
    private function eventDates(): array
    {
        $eventDate = $this->event_date?->toImmutable();
        $deadline = $this->rsvp_deadline?->toImmutable();

        if ($this->order_id === null) {
            $demoDate = CarbonImmutable::today()->addDays(self::DEMO_DAYS_AHEAD);
            $deadline = $eventDate && $deadline ? $demoDate->subDays((int) $deadline->diffInDays($eventDate)) : null;
            $eventDate = $demoDate;
        }

        if ($eventDate === null) {
            return [null, $deadline];
        }

        [$hours, $minutes] = array_map(intval(...), explode(':', $this->event_time ?? '00:00'));

        return [$eventDate->setTime($hours, $minutes), $deadline];
    }

    /**
     * @param  array<string, mixed>  $content
     * @return array<string, mixed>
     */
    private function names(InvitationKind $kind, array $content): array
    {
        if ($kind === InvitationKind::Wedding) {
            return [
                'names' => array_values($content['names'] ?? ['', '']),
                'families' => $content['families'] ?? '',
            ];
        }

        return [
            'name' => $content['name'] ?? '',
            'firstName' => $content['first_name'] ?? $content['name'] ?? '',
            'age' => $content['age'] ?? null,
            'hosts' => $content['hosts'] ?? '',
        ];
    }

    /**
     * @param  array<string, mixed>  $venue
     * @return array<string, mixed>
     */
    private function venue(array $venue): array
    {
        $hasMap = isset($venue['latitude'], $venue['longitude']);
        $coordinates = $hasMap ? "{$venue['latitude']},{$venue['longitude']}" : null;

        return [
            'icon' => $venue['icon'] ?? '',
            'tag' => $venue['tag'],
            'name' => $venue['name'],
            'addressLines' => $venue['address_lines'] ?? [],
            'time' => $venue['time'] ?? '',
            'mapEmbedUrl' => $hasMap ? "https://www.google.com/maps?q={$coordinates}&z=16&output=embed" : null,
            'mapTitle' => "{$venue['name']} — {$venue['tag']}",
            'directionsUrl' => $hasMap ? "https://www.google.com/maps/dir/?api=1&destination={$coordinates}" : null,
            'image' => Invitation::mediaUrl($venue['image'] ?? null),
        ];
    }

    /**
     * The dress code, or null when it has no type (the section is hidden then).
     *
     * @param  array<string, mixed>  $dressCode
     * @return array<string, mixed>|null
     */
    private function dressCode(array $dressCode): ?array
    {
        if (blank($dressCode['type'] ?? null)) {
            return null;
        }

        $reservedColor = $dressCode['reserved_color'] ?? [];

        return [
            'type' => $dressCode['type'],
            'description' => $dressCode['description'] ?? null,
            'men' => $dressCode['men'] ?? null,
            'women' => $dressCode['women'] ?? null,
            'reservedColor' => filled($reservedColor['name'] ?? null) ? [
                'name' => $reservedColor['name'],
                'hex' => $reservedColor['hex'] ?? null,
                'description' => $reservedColor['description'] ?? '',
            ] : null,
        ];
    }

    /**
     * @param  array<string, mixed>  $gift
     * @return array<string, mixed>
     */
    private function gift(array $gift): array
    {
        return [
            'kind' => $gift['kind'],
            'title' => $gift['title'],
            'description' => $gift['description'] ?? null,
            'details' => $gift['details'] ?? [],
            'copy' => filled($gift['copy_value'] ?? null) ? ['value' => $gift['copy_value']] : null,
            'link' => filled($gift['link_url'] ?? null)
                ? ['url' => $gift['link_url'], 'label' => $gift['link_label'] ?? null]
                : null,
        ];
    }

    /**
     * The sections only XV templates have.
     *
     * @param  array<string, mixed>  $content
     * @return array<string, mixed>
     */
    private function xvChapters(array $content): array
    {
        $name = $content['name'] ?? '';
        $story = $content['story'] ?? [];
        $parents = $content['parents'] ?? [];

        return [
            'monogram' => $content['monogram'] ?? null,
            'heroPhoto' => filled($content['hero_photo'] ?? null) ? [
                'src' => Invitation::mediaUrl($content['hero_photo']),
                'alt' => "Retrato de {$name}",
                'position' => $content['hero_photo_position'] ?? null,
            ] : null,
            'story' => filled($story['paragraphs'] ?? null) ? [
                'eyebrow' => $story['eyebrow'] ?? '',
                'title' => $story['title'] ?? '',
                'opening' => $story['opening'] ?? '',
                'paragraphs' => $story['paragraphs'],
                'signature' => $story['signature'] ?? '',
                'photo' => filled($story['photo'] ?? null)
                    ? ['src' => Invitation::mediaUrl($story['photo']), 'alt' => "Foto de {$name}"]
                    : null,
            ] : null,
            'parents' => filled($parents['names'] ?? null)
                ? ['role' => $parents['role'] ?? 'Mis papás', 'names' => $parents['names']]
                : null,
            'godparents' => $content['godparents'] ?? [],
        ];
    }
}
