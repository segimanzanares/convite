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
        Schema::create('invitations', function (Blueprint $table) {
            $table->id();
            // Public URL segment: /i/{slug}
            $table->string('slug')->unique();
            // Folder under resources/js/invitations/ that holds the React pages
            $table->string('template');
            // Social / SEO meta tags rendered server-side for link previews
            $table->string('title');
            $table->string('description', 500);
            $table->string('og_image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invitations');
    }
};
