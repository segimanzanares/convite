<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Plans sell web invitations (every plan so far) or the services of /servicios, whose options show what each one
 * includes, a note under the price and which one stands out.
 */
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->string('type')->default('web_invitation')->after('slug')->index();
            $table->json('details')->nullable()->after('description');
            $table->string('price_note')->nullable()->after('price');
            $table->boolean('is_featured')->default(false)->after('is_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('plans', function (Blueprint $table) {
            $table->dropColumn(['type', 'details', 'price_note', 'is_featured']);
        });
    }
};
