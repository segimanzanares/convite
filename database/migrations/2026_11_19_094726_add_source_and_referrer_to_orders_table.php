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
        Schema::table('orders', function (Blueprint $table) {
            // How the client found Convite (App\Enums\OrderSource)
            $table->string('source')->nullable()->after('status');
            // The client who recommended Convite, when the source is a referral
            $table->foreignId('referrer_client_id')->nullable()->after('source')->constrained('clients')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropConstrainedForeignId('referrer_client_id');
            $table->dropColumn('source');
        });
    }
};
