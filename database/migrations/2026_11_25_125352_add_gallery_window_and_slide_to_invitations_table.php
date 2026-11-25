<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations. The live gallery's window is counted from the event date, so it follows the date when it
     * changes; the defaults keep the window the gallery had (the event day until noon of the next one).
     */
    public function up(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->unsignedTinyInteger('gallery_opens_days_before')->default(0)->after('gallery_moderated');
            $table->unsignedTinyInteger('gallery_closes_days_after')->default(1)->after('gallery_opens_days_before');
            $table->unsignedTinyInteger('gallery_slide_seconds')->default(7)->after('gallery_closes_days_after');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->dropColumn(['gallery_opens_days_before', 'gallery_closes_days_after', 'gallery_slide_seconds']);
        });
    }
};
