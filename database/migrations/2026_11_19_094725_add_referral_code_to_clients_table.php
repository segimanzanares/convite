<?php

use App\Models\Client;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations. Existing clients get their referral code here; new ones get it when they are created.
     */
    public function up(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->string('referral_code', 16)->nullable()->unique()->after('notes');
        });

        DB::table('clients')->orderBy('id')->select(['id', 'name'])->each(function (object $client): void {
            DB::table('clients')->where('id', $client->id)->update([
                'referral_code' => Client::generateReferralCode($client->name),
            ]);
        });

        Schema::table('clients', function (Blueprint $table) {
            $table->string('referral_code', 16)->nullable(false)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('clients', function (Blueprint $table) {
            $table->dropColumn('referral_code');
        });
    }
};
