<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * The template folders (and the demo files under public/invitations/) were renamed after their labels. Existing
 * invitations keep pointing at them: their template and the static paths in their content and preview image are
 * rewritten.
 */
return new class extends Migration
{
    /**
     * Old folder => new folder.
     *
     * @var array<string, string>
     */
    private const array RENAMES = [
        'demo' => 'boda-clasica',
        'demo-xv' => 'xv-jardin',
        'flora' => 'cumpleanos-floral',
        'matilde-nayith' => 'boda-floral',
    ];

    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $this->rename(self::RENAMES);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $this->rename(array_flip(self::RENAMES));
    }

    /**
     * @param  array<string, string>  $renames
     */
    private function rename(array $renames): void
    {
        // The trailing slash keeps "/invitations/demo/" from matching "/invitations/demo-xv/"
        $paths = [];

        foreach ($renames as $from => $to) {
            $paths["/invitations/{$from}/"] = "/invitations/{$to}/";
        }

        DB::table('invitations')->orderBy('id')->each(function (object $invitation) use ($renames, $paths): void {
            DB::table('invitations')->where('id', $invitation->id)->update([
                'template' => $renames[$invitation->template] ?? $invitation->template,
                'og_image' => $invitation->og_image === null ? null : strtr($invitation->og_image, $paths),
                // JSON escapes "/" as "\/" unless told otherwise, so the paths are replaced in both spellings
                'content' => $invitation->content === null ? null : strtr($invitation->content, [
                    ...$paths,
                    ...array_combine(
                        array_map(fn (string $path) => str_replace('/', '\/', $path), array_keys($paths)),
                        array_map(fn (string $path) => str_replace('/', '\/', $path), $paths),
                    ),
                ]),
            ]);
        });
    }
};
