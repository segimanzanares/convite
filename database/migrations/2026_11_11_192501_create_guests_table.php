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
        Schema::create('guests', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invitation_id')->constrained()->cascadeOnDelete();
            // A family or group counts as one guest; seats only matter for passes and headcounts
            $table->string('name');
            $table->unsignedSmallInteger('seats')->default(1);
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('table_label')->nullable();
            $table->string('token')->unique();
            $table->timestamp('sent_at')->nullable();
            $table->timestamp('first_opened_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('guests');
    }
};
