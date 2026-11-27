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
            $table->string('video_template')->nullable()->after('reveal_shown_at');
            $table->string('video_status')->nullable()->after('video_template');
            $table->timestamp('video_rendered_at')->nullable()->after('video_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->dropColumn(['video_template', 'video_status', 'video_rendered_at']);
        });
    }
};
