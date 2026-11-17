<?php

namespace Database\Factories;

use App\Enums\GalleryPhotoStatus;
use App\Models\GalleryPhoto;
use App\Models\Invitation;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<GalleryPhoto>
 */
class GalleryPhotoFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = Str::uuid();

        return [
            'invitation_id' => Invitation::factory(),
            'path' => "invitations/1/live/{$name}.jpg",
            'thumb_path' => "invitations/1/live/thumbs/{$name}.jpg",
            'width' => 1600,
            'height' => 1200,
            'uploader_name' => null,
            'message' => null,
            'status' => GalleryPhotoStatus::Approved,
        ];
    }

    /**
     * A photo waiting for a panel user to approve it.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => ['status' => GalleryPhotoStatus::Pending]);
    }

    /**
     * A photo a panel user took off the wall.
     */
    public function hidden(): static
    {
        return $this->state(fn (array $attributes) => ['status' => GalleryPhotoStatus::Hidden]);
    }
}
