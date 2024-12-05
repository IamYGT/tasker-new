<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Kripto işlemleri için yeni alanlar
            $table->string('crypto_address')->nullable()->after('bank_account')
                ->comment('TRC20 cüzdan adresi');
            $table->string('crypto_network')->nullable()->after('crypto_address')
                ->comment('Kripto ağı (örn: TRC20)');
            $table->decimal('crypto_fee', 10, 2)->nullable()->after('crypto_network')
                ->comment('İşlem ücreti (USDT cinsinden)');
            $table->string('crypto_txid')->nullable()->after('crypto_fee')
                ->comment('Blockchain transaction ID');

            // Type constraint güncelleme
            DB::statement("ALTER TABLE transactions DROP CONSTRAINT transactions_type_check");
            DB::statement("ALTER TABLE transactions ADD CONSTRAINT transactions_type_check CHECK (type::text = ANY (ARRAY['withdrawal'::character varying::text, 'deposit'::character varying::text, 'transfer'::character varying::text, 'crypto_withdrawal'::character varying::text]))");
        });

        // Yeni indexler
        Schema::table('transactions', function (Blueprint $table) {
            $table->index('crypto_address');
            $table->index('crypto_txid');
        });
    }

    public function down()
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Indexleri kaldır
            $table->dropIndex(['crypto_address']);
            $table->dropIndex(['crypto_txid']);

            // Alanları kaldır
            $table->dropColumn([
                'crypto_address',
                'crypto_network',
                'crypto_fee',
                'crypto_txid'
            ]);

            // Type constraint'i eski haline getir
            DB::statement("ALTER TABLE transactions DROP CONSTRAINT transactions_type_check");
            DB::statement("ALTER TABLE transactions ADD CONSTRAINT transactions_type_check CHECK (type::text = ANY (ARRAY['withdrawal'::character varying::text, 'deposit'::character varying::text, 'transfer'::character varying::text]))");
        });
    }
};
