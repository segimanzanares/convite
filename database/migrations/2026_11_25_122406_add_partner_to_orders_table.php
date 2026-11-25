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
            // The partner who brought the client, when the source is a partner. Partners with orders are not deleted
            $table->foreignId('partner_id')->nullable()->after('referrer_client_id')->constrained()->restrictOnDelete();
            // The partner's commission when they were assigned, so later changes to the partner do not affect it
            $table->decimal('commission_percent', 5, 2)->nullable()->after('partner_id');
            $table->timestamp('commission_paid_at')->nullable()->after('commission_percent');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropConstrainedForeignId('partner_id');
            $table->dropColumn(['commission_percent', 'commission_paid_at']);
        });
    }
};
