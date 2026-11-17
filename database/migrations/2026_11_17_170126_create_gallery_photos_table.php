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
            $table->string('gallery_token', 32)->nullable()->unique()->after('door_token');
            $table->boolean('gallery_moderated')->default(false)->after('gallery_token');
        });

        Schema::create('gallery_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invitation_id')->constrained()->cascadeOnDelete();
            $table->string('path');
            $table->string('thumb_path');
            $table->unsignedSmallInteger('width');
            $table->unsignedSmallInteger('height');
            $table->string('uploader_name', 60)->nullable();
            $table->string('message', 140)->nullable();
            $table->string('status', 16);
            $table->timestamps();

            $table->index(['invitation_id', 'status', 'id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('gallery_photos');

        Schema::table('invitations', function (Blueprint $table) {
            $table->dropColumn(['gallery_token', 'gallery_moderated']);
        });
    }
};
