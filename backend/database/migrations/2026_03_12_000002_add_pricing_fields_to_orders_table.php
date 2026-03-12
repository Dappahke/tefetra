<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->decimal('base_amount', 10, 2)->default(0);
            $table->decimal('addons_amount', 10, 2)->default(0);
            $table->text('project_notes')->nullable();
        });

        DB::table('orders')->update([
            'base_amount' => DB::raw('amount_paid'),
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $table->dropColumn(['base_amount', 'addons_amount', 'project_notes']);
        });
    }
};
