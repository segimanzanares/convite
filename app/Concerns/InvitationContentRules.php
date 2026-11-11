<?php

namespace App\Concerns;

use App\Enums\InvitationKind;
use App\Models\Invitation;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;

/**
 * The content of an invitation as the admin captures it. Every section is optional (the template hides an empty
 * one) except the names, and the kind of the template decides which fields exist: validated() drops the rest.
 */
trait InvitationContentRules
{
    private const string HEX_COLOR = 'regex:/^#[0-9A-Fa-f]{6}$/';

    /**
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    protected function invitationContentRules(Invitation $invitation, InvitationKind $kind): array
    {
        $media = ['nullable', 'string', 'max:255', $this->mediaPathRule($invitation)];

        return [
            'og_image' => $media,
            ...$this->kindRules($kind, $media),

            'content.rsvp_whatsapp' => ['nullable', 'string', 'max:20', 'regex:/^\+?[\d\s()-]+$/'],
            'content.music' => $media,
            'content.cover' => $media,
            'content.message' => ['nullable', 'string', 'max:2000'],
            'content.closing_message' => ['nullable', 'string', 'max:2000'],
            'content.tagline' => ['nullable', 'string', 'max:255'],

            'content.venues' => ['nullable', 'array', 'max:6'],
            'content.venues.*.icon' => ['nullable', 'string', 'max:16'],
            'content.venues.*.tag' => ['required', 'string', 'max:100'],
            'content.venues.*.name' => ['required', 'string', 'max:255'],
            'content.venues.*.address_lines' => ['nullable', 'array', 'max:4'],
            'content.venues.*.address_lines.*' => ['nullable', 'string', 'max:255'],
            'content.venues.*.time' => ['nullable', 'string', 'max:50'],
            'content.venues.*.latitude' => ['nullable', 'numeric', 'between:-90,90', 'required_with:content.venues.*.longitude'],
            'content.venues.*.longitude' => ['nullable', 'numeric', 'between:-180,180', 'required_with:content.venues.*.latitude'],
            'content.venues.*.image' => $media,

            'content.program' => ['nullable', 'array', 'max:20'],
            'content.program.*.time' => ['required', 'string', 'max:50'],
            'content.program.*.icon' => ['nullable', 'string', 'max:16'],
            'content.program.*.title' => ['required', 'string', 'max:255'],
            'content.program.*.description' => ['nullable', 'string', 'max:500'],

            'content.gallery' => ['nullable', 'array', 'max:30'],
            'content.gallery.*.image' => ['required', ...array_slice($media, 1)],
            'content.gallery.*.alt' => ['nullable', 'string', 'max:255'],
            'content.gallery.*.caption' => ['nullable', 'string', 'max:255'],

            'content.dress_code' => ['nullable', 'array'],
            'content.dress_code.type' => ['nullable', 'string', 'max:100'],
            'content.dress_code.description' => ['nullable', 'string', 'max:500'],
            'content.dress_code.men' => ['nullable', 'string', 'max:255'],
            'content.dress_code.women' => ['nullable', 'string', 'max:255'],
            'content.dress_code.reserved_color' => ['nullable', 'array'],
            'content.dress_code.reserved_color.name' => ['nullable', 'string', 'max:100'],
            'content.dress_code.reserved_color.hex' => ['nullable', self::HEX_COLOR],
            'content.dress_code.reserved_color.description' => ['nullable', 'string', 'max:255'],

            'content.swatches' => ['nullable', 'array', 'max:12'],
            'content.swatches.*.hex' => ['required', self::HEX_COLOR],
            'content.swatches.*.label' => ['required', 'string', 'max:50'],

            'content.gifts' => ['nullable', 'array', 'max:6'],
            'content.gifts.*.kind' => ['required', 'in:bank,registry,envelope'],
            'content.gifts.*.title' => ['required', 'string', 'max:100'],
            'content.gifts.*.description' => ['nullable', 'string', 'max:500'],
            'content.gifts.*.details' => ['nullable', 'array', 'max:6'],
            'content.gifts.*.details.*.label' => ['required', 'string', 'max:50'],
            'content.gifts.*.details.*.value' => ['required', 'string', 'max:255'],
            'content.gifts.*.copy_value' => ['nullable', 'string', 'max:255'],
            'content.gifts.*.link_url' => ['nullable', 'url:https', 'max:500'],
            'content.gifts.*.link_label' => ['nullable', 'string', 'max:100'],
        ];
    }

    /**
     * The names and the sections that only exist for one kind of event.
     *
     * @param  list<mixed>  $media
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    private function kindRules(InvitationKind $kind, array $media): array
    {
        if ($kind === InvitationKind::Wedding) {
            return [
                'content.names' => ['required', 'array', 'size:2'],
                'content.names.*' => ['required', 'string', 'max:100'],
                'content.families' => ['nullable', 'string', 'max:255'],
            ];
        }

        $celebrant = [
            'content.name' => ['required', 'string', 'max:255'],
            'content.first_name' => ['required', 'string', 'max:100'],
            'content.age' => ['nullable', 'integer', 'between:1,150'],
            'content.hosts' => ['nullable', 'string', 'max:255'],
        ];

        if ($kind === InvitationKind::Birthday) {
            // The birthday templates show the age in the hero, the title and the footer
            return [...$celebrant, 'content.age' => ['required', 'integer', 'between:1,150']];
        }

        return [
            ...$celebrant,
            'content.monogram' => ['nullable', 'string', 'max:4'],
            'content.hero_photo' => $media,
            'content.hero_photo_position' => ['nullable', 'string', 'max:20', 'regex:/^\d{1,3}% \d{1,3}%$/'],
            'content.story' => ['nullable', 'array'],
            'content.story.eyebrow' => ['nullable', 'string', 'max:100'],
            'content.story.title' => ['nullable', 'string', 'max:255'],
            'content.story.opening' => ['nullable', 'string', 'max:255'],
            'content.story.paragraphs' => ['nullable', 'array', 'max:6'],
            'content.story.paragraphs.*' => ['nullable', 'string', 'max:2000'],
            'content.story.signature' => ['nullable', 'string', 'max:255'],
            'content.story.photo' => $media,
            'content.parents' => ['nullable', 'array'],
            'content.parents.role' => ['nullable', 'string', 'max:100'],
            'content.parents.names' => ['nullable', 'array', 'max:4'],
            'content.parents.names.*' => ['nullable', 'string', 'max:255'],
            'content.godparents' => ['nullable', 'array', 'max:12'],
            'content.godparents.*.role' => ['required', 'string', 'max:100'],
            'content.godparents.*.names' => ['required', 'array', 'min:1', 'max:4'],
            'content.godparents.*.names.*' => ['required', 'string', 'max:255'],
        ];
    }

    /**
     * A media path must be a file uploaded for this invitation, or a static file shipped in public/ (the demos).
     */
    private function mediaPathRule(Invitation $invitation): Closure
    {
        return function (string $attribute, mixed $value, Closure $fail) use ($invitation): void {
            $isStatic = str_starts_with($value, '/') && ! str_contains($value, '..');
            $isUpload = str_starts_with($value, $invitation->mediaDirectory().'/') && ! str_contains($value, '..');

            if (! $isStatic && ! $isUpload) {
                $fail(__('The file does not belong to this invitation.'));
            }
        };
    }
}
