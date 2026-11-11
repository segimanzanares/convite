<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            // Nullable so the demo invitations seeded by InvitationSeeder need no client
            $table->foreignId('client_id')->nullable()->after('id')->constrained()->nullOnDelete();
            $table->foreignId('order_id')->nullable()->after('client_id')->constrained()->nullOnDelete();
            $table->date('event_date')->nullable()->after('template');
            $table->date('rsvp_deadline')->nullable()->after('event_date');
            // Existing invitations are already live
            $table->string('status')->default('published')->after('rsvp_deadline');
            $table->timestamp('guests_purged_at')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->dropConstrainedForeignId('client_id');
            $table->dropConstrainedForeignId('order_id');
            $table->dropColumn(['event_date', 'rsvp_deadline', 'status', 'guests_purged_at']);
        });
    }
};
