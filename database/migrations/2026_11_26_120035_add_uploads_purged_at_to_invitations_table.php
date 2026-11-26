<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations. Records when invitations:purge-uploads deleted the invitation's photos and music, so it is
     * not purged again.
     */
    public function up(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->timestamp('uploads_purged_at')->nullable()->after('guests_purged_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->dropColumn('uploads_purged_at');
        });
    }
};
