<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->string('status')->default('pending')->after('download_token');
            $table->string('payment_provider')->nullable()->after('status');
            $table->string('payment_reference')->nullable()->after('payment_provider');
            $table->json('payment_metadata')->nullable()->after('payment_reference');
            $table->timestamp('paid_at')->nullable()->after('payment_metadata');

            $table->index(['status', 'created_at']);
        });

        DB::table('orders')
            ->where('amount_paid', '>', 0)
            ->update([
                'status' => 'paid',
                'payment_provider' => 'legacy',
                'paid_at' => now(),
            ]);
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropIndex(['status', 'created_at']);
            $table->dropColumn([
                'status',
                'payment_provider',
                'payment_reference',
                'payment_metadata',
                'paid_at',
            ]);
        });
    }
};
