<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Each template gets one demo invitation, published at the template's own slug (see InvitationSeeder). The demos
 * seeded before keep their row and take the new slug; only invitations without an order are renamed, and never
 * onto a slug that is already taken.
 */
return new class extends Migration
{
    /**
     * Old slug => new slug.
     *
     * @var array<string, string>
     */
    private const array RENAMES = [
        'demo' => 'boda-clasica',
        'demo-xv' => 'xv-jardin',
        'flora' => 'cumpleanos-floral',
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
        foreach ($renames as $from => $to) {
            if (DB::table('invitations')->where('slug', $to)->exists()) {
                continue;
            }

            DB::table('invitations')
                ->where('slug', $from)
                ->whereNull('order_id')
                ->update(['slug' => $to]);
        }
    }
};
