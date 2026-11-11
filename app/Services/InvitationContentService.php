<?php

namespace App\Services;

use App\Models\Invitation;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;

/**
 * The content of an invitation and the photos and music it uses, stored on the public disk under
 * invitations/{id}/.
 */
class InvitationContentService
{
    /**
     * Store an uploaded photo or song for the invitation and return its path on the public disk.
     */
    public function storeMedia(Invitation $invitation, UploadedFile $file): string
    {
        return $file->store($invitation->mediaDirectory(), 'public');
    }

    /**
     * Save the content and the link preview image, then delete the uploads neither of them uses anymore (photos
     * replaced or removed in the form).
     *
     * @param  array<string, mixed>  $content
     */
    public function update(Invitation $invitation, array $content, ?string $ogImage): Invitation
    {
        $invitation->update([
            'content' => $this->withoutBlankLines($content),
            'og_image' => $ogImage,
        ]);

        $this->deleteUnusedMedia($invitation);

        return $invitation;
    }

    /**
     * Delete the files of the invitation's folder that its content and preview image do not reference.
     */
    public function deleteUnusedMedia(Invitation $invitation): void
    {
        $disk = Storage::disk('public');
        $used = collect(Arr::flatten([$invitation->content ?? [], $invitation->og_image]))
            ->filter(fn (mixed $value) => is_string($value))
            ->all();

        $unused = array_diff($disk->files($invitation->mediaDirectory()), $used);

        if ($unused !== []) {
            $disk->delete($unused);
        }
    }

    /**
     * Drop the empty entries of the free-form lists (address lines, story paragraphs, parents' names), which the
     * form sends as blank inputs.
     *
     * @param  array<string, mixed>  $content
     * @return array<string, mixed>
     */
    private function withoutBlankLines(array $content): array
    {
        $paths = ['story.paragraphs', 'parents.names'];

        foreach (array_keys($content['venues'] ?? []) as $index) {
            $paths[] = "venues.{$index}.address_lines";
        }

        foreach ($paths as $path) {
            if (is_array($lines = Arr::get($content, $path))) {
                Arr::set($content, $path, array_values(array_filter($lines, filled(...))));
            }
        }

        return $content;
    }
}
