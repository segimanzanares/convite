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
        Schema::create('partners', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            // App\Enums\PartnerKind
            $table->string('kind');
            $table->string('phone', 30)->nullable();
            $table->string('email')->nullable();
            // Goes in the partner's link (/a/CODE) and in the visitors' WhatsApp messages
            $table->string('code', 20)->unique();
            // Of the order's price, copied to each order when the partner is assigned to it
            $table->decimal('commission_percent', 5, 2);
            // Offered on the landing page to whoever comes with the partner's link
            $table->unsignedTinyInteger('discount_percent')->default(0);
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('partners');
    }
};
