<?php

namespace App\Services;

use App\Enums\InvitationKind;
use App\Enums\VideoStatus;
use App\Jobs\RenderInvitationVideo;
use App\Models\Invitation;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Process;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use RuntimeException;

/**
 * The video invitation: the data the renderer draws (videos/invitation/render.py), the themes it offers and the render
 * itself, which runs in the "videos" queue connection and leaves the MP4 in the invitation's media folder.
 */
class InvitationVideoService
{
    /**
     * The renderer's themes, keyed by name, with their labels for the panel.
     *
     * @return array<string, string>
     */
    public function themes(): array
    {
        return collect(File::glob($this->scriptDirectory().'/themes/*.json'))
            ->mapWithKeys(fn (string $path) => [
                pathinfo($path, PATHINFO_FILENAME) => json_decode(File::get($path), true)['label'] ?? pathinfo($path, PATHINFO_FILENAME),
            ])
            ->sort()
            ->all();
    }

    /**
     * Queue a render of the invitation's video with the given theme. Returns false when one is already queued or
     * running.
     */
    public function queue(Invitation $invitation, string $theme): bool
    {
        if ($invitation->video_status?->isBusy()) {
            return false;
        }

        $invitation->update(['video_template' => $theme, 'video_status' => VideoStatus::Queued]);

        RenderInvitationVideo::dispatch($invitation)->onConnection('videos');

        return true;
    }

    /**
     * Render the video now and keep it in the invitation's media folder, replacing the previous one only when the
     * render succeeds. Throws when it fails, after marking it as failed.
     */
    public function render(Invitation $invitation): void
    {
        $invitation->update(['video_status' => VideoStatus::Rendering]);

        $work = storage_path('app/private/videos/'.Str::uuid());
        File::ensureDirectoryExists($work);

        try {
            File::put("{$work}/data.json", json_encode($this->data($invitation), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR));

            $command = [
                config('convite.video.python'), $this->scriptDirectory().'/render.py',
                '--data', "{$work}/data.json",
                '--theme', $invitation->video_template ?? 'clasico',
                '--out', "{$work}/video.mp4",
            ];

            if (config('convite.video.workers') !== null) {
                array_push($command, '--workers', (string) config('convite.video.workers'));
            }

            $result = Process::timeout(config('convite.video.timeout'))
                ->env(['CONVITE_VIDEO_CACHE' => storage_path('app/private/videos/cache')])
                ->run($command);

            if ($result->failed() || ! File::exists("{$work}/video.mp4")) {
                throw new RuntimeException("The video of invitation {$invitation->slug} failed to render: ".Str::limit($result->errorOutput(), 2000));
            }

            Storage::disk('public')->put($invitation->videoPath(), File::get("{$work}/video.mp4"));

            $invitation->update(['video_status' => VideoStatus::Ready, 'video_rendered_at' => now()]);
        } catch (\Throwable $exception) {
            $invitation->update(['video_status' => VideoStatus::Failed]);
            Log::error($exception->getMessage());

            throw $exception;
        } finally {
            File::deleteDirectory($work);
        }
    }

    /**
     * Whether the invitation's last render left a video to download.
     */
    public function exists(Invitation $invitation): bool
    {
        return Storage::disk('public')->exists($invitation->videoPath());
    }

    /**
     * What the renderer draws, from the invitation's content: the names, date, family groups and venues, the photos
     * (main photo first, then the gallery) and the song as local paths, and the custom primary color. A gender
     * reveal's answer is never sent: the video goes to the guests before the reveal.
     *
     * @return array{kind: string, names: list<string>, age: int|null, date: string|null, time: string|null, honor: list<array{key: string, groups: list<array{role: string, names: list<string>}>}>, venues: list<array<string, mixed>>, photos: list<string>, music: string|null, primary: string|null}
     */
    public function data(Invitation $invitation): array
    {
        $kind = $invitation->kind() ?? InvitationKind::Wedding;
        $content = $invitation->content ?? [];
        $couple = in_array($kind, [InvitationKind::Wedding, InvitationKind::GenderReveal, InvitationKind::BabyShower], true);

        $photos = [
            $content['hero_photo'] ?? null,
            $content['cover'] ?? null,
            ...array_column($content['gallery'] ?? [], 'image'),
        ];

        return [
            'kind' => $kind->value,
            'names' => $couple
                ? array_values(array_filter($content['names'] ?? [], 'filled'))
                : array_values(array_filter([$content['first_name'] ?? $content['name'] ?? null], 'filled')),
            'age' => isset($content['age']) ? (int) $content['age'] : null,
            'date' => $invitation->event_date?->toDateString(),
            'time' => $invitation->event_time ? substr($invitation->event_time, 0, 5) : null,
            'honor' => $this->honor($kind, $content),
            'venues' => array_map(fn (array $venue) => [
                'icon' => $venue['icon'] ?? '',
                'tag' => $venue['tag'] ?? '',
                'name' => $venue['name'] ?? '',
                'address_lines' => array_values(array_filter($venue['address_lines'] ?? [], 'filled')),
                'time' => $venue['time'] ?? '',
            ], array_values($content['venues'] ?? [])),
            'photos' => array_values(array_unique(array_filter(array_map($this->localPath(...), $photos)))),
            'music' => $this->localPath($content['music'] ?? null),
            'primary' => $content['colors']['primary'] ?? null,
        ];
    }

    /**
     * The family groups in the order the video shows them. A wedding names the parents of each one of the couple and
     * its godparents; XV, baptism and birthday the celebrant's parents (one group) and godparents; a gender reveal the
     * grandparents and a baby shower its hosts.
     *
     * @param  array<string, mixed>  $content
     * @return list<array{key: string, groups: list<array{role: string, names: list<string>}>}>
     */
    private function honor(InvitationKind $kind, array $content): array
    {
        $keys = match ($kind) {
            InvitationKind::GenderReveal => ['grandparents'],
            InvitationKind::BabyShower => ['hosts'],
            InvitationKind::Birthday => ['parents'],
            default => ['parents', 'godparents'],
        };

        $honor = [];

        foreach ($keys as $key) {
            $groups = $content[$key] ?? [];

            // The celebrant's parents are one group, not a list of them
            if ($key === 'parents' && $kind !== InvitationKind::Wedding) {
                $groups = filled($groups['names'] ?? null)
                    ? [['role' => $groups['role'] ?? ($kind === InvitationKind::Birthday ? 'Sus papás' : 'Mis papás'), 'names' => $groups['names']]]
                    : [];
            }

            $groups = array_values(array_filter(array_map(fn (array $group) => [
                'role' => $group['role'] ?? '',
                'names' => array_values(array_filter($group['names'] ?? [], 'filled')),
            ], is_array($groups) ? $groups : []), fn (array $group) => $group['names'] !== []));

            if ($groups !== []) {
                $honor[] = ['key' => $key, 'groups' => $groups];
            }
        }

        return $honor;
    }

    /**
     * The file behind a media path of the content: an upload on the public disk, or a static file under public/ (the
     * paths starting with "/", used by the seeded demos). Null when it is missing.
     */
    private function localPath(?string $path): ?string
    {
        if (blank($path)) {
            return null;
        }

        $file = str_starts_with($path, '/') ? public_path(ltrim($path, '/')) : Storage::disk('public')->path($path);

        return is_file($file) ? $file : null;
    }

    private function scriptDirectory(): string
    {
        return base_path('videos/invitation');
    }
}
