<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Önce check constraint'i kaldır
        DB::statement('ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_status_check');

        // Statüleri güncelle
        DB::table('transactions')
            ->where('status', 'pending')
            ->update(['status' => 'waiting']);

        // Yeni check constraint'i ekle
        DB::statement("ALTER TABLE transactions ADD CONSTRAINT transactions_status_check CHECK (status::text = ANY (ARRAY['waiting'::text, 'completed'::text, 'cancelled'::text, 'rejected'::text]))");
    }

    public function down(): void
    {
        // Önce check constraint'i kaldır
        DB::statement('ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_status_check');

        // Statüleri geri al
        DB::table('transactions')
            ->where('status', 'waiting')
            ->update(['status' => 'pending']);

        // Eski check constraint'i geri ekle
        DB::statement("ALTER TABLE transactions ADD CONSTRAINT transactions_status_check CHECK (status::text = ANY (ARRAY['pending'::text, 'completed'::text, 'cancelled'::text]))");
    }
};
