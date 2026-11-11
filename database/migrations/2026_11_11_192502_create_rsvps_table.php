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
        Schema::create('rsvps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invitation_id')->constrained()->cascadeOnDelete();
            // Null for answers sent through the open (tokenless) form; one answer per guest otherwise
            $table->foreignId('guest_id')->nullable()->unique()->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->boolean('attending');
            $table->unsignedSmallInteger('seats_confirmed')->default(0);
            $table->text('message')->nullable();
            $table->timestamp('responded_at');
            $table->timestamps();

            $table->index(['invitation_id', 'guest_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rsvps');
    }
};
