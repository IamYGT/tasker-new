<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::table('transactions')
            ->whereRaw("reference_id LIKE 'TRX-%'")
            ->update([
                'reference_id' => DB::raw("SUBSTRING(reference_id, 5)")
            ]);
    }

    public function down(): void
    {
        DB::table('transactions')
            ->update([
                'reference_id' => DB::raw("CONCAT('TRX-', reference_id)")
            ]);
    }
};
