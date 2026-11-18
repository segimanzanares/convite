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
            $table->boolean('wishes_enabled')->default(false)->after('gallery_moderated');
            $table->boolean('wishes_public')->default(false)->after('wishes_enabled');
            $table->boolean('wishes_moderated')->default(false)->after('wishes_public');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('invitations', function (Blueprint $table) {
            $table->dropColumn(['wishes_enabled', 'wishes_public', 'wishes_moderated']);
        });
    }
};
