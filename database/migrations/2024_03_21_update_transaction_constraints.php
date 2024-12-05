<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Eski constraint'leri kaldır
        DB::statement("ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_type_check");
        DB::statement("ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_status_check");

        // Mevcut kayıtları güncelle
        DB::table('transactions')
            ->where('type', 'withdrawal')
            ->whereNotNull('crypto_address')
            ->update(['type' => 'crypto_withdrawal']);

        DB::table('transactions')
            ->where('type', 'withdrawal')
            ->whereNull('crypto_address')
            ->update(['type' => 'bank_withdrawal']);

        // Diğer tipleri bank_withdrawal olarak güncelle
        DB::table('transactions')
            ->whereNotIn('type', ['bank_withdrawal', 'crypto_withdrawal'])
            ->update(['type' => 'bank_withdrawal']);

        // Status güncellemesi
        DB::table('transactions')
            ->whereIn('status', ['waiting', 'approved'])
            ->update(['status' => 'pending']);

        // Yeni constraint'leri ekle
        DB::statement("ALTER TABLE transactions ADD CONSTRAINT transactions_type_check
            CHECK (type::text = ANY (ARRAY['bank_withdrawal'::text, 'crypto_withdrawal'::text]))");

        DB::statement("ALTER TABLE transactions ADD CONSTRAINT transactions_status_check
            CHECK (status::text = ANY (ARRAY['pending'::text, 'completed'::text, 'cancelled'::text, 'rejected'::text]))");
    }

    public function down()
    {
        // Eski constraint'leri kaldır
        DB::statement("ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_type_check");
        DB::statement("ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_status_check");

        // Kayıtları eski haline döndür
        DB::table('transactions')
            ->where('type', 'crypto_withdrawal')
            ->update(['type' => 'withdrawal']);

        DB::table('transactions')
            ->where('type', 'bank_withdrawal')
            ->update(['type' => 'withdrawal']);

        // Eski constraint'leri geri ekle
        DB::statement("ALTER TABLE transactions ADD CONSTRAINT transactions_type_check
            CHECK (type::text = ANY (ARRAY['withdrawal'::text, 'deposit'::text, 'transfer'::text, 'crypto_withdrawal'::text]))");

        DB::statement("ALTER TABLE transactions ADD CONSTRAINT transactions_status_check
            CHECK (status::text = ANY (ARRAY['waiting'::text, 'completed'::text, 'cancelled'::text, 'rejected'::text, 'approved'::text, 'pending'::text]))");
    }
};
