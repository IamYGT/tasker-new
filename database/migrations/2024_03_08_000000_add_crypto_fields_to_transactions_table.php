<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up()
    {
        // Önce type constraint'i kaldır
        DB::statement("ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_type_check");

        Schema::table('transactions', function (Blueprint $table) {
            // Yeni kolonları ekle
            $table->string('crypto_address')->nullable();
            $table->string('crypto_network')->nullable();
            $table->decimal('crypto_fee', 10, 2)->nullable();
            $table->string('crypto_txid')->nullable();

            // İndexleri ekle
            $table->index('crypto_address', 'transactions_crypto_address_index');
            $table->index('crypto_txid', 'transactions_crypto_txid_index');
        });

        // Yeni type constraint'i ekle
        DB::statement("ALTER TABLE transactions ADD CONSTRAINT transactions_type_check CHECK (type::text = ANY (ARRAY[
            'withdrawal'::character varying::text,
            'deposit'::character varying::text,
            'transfer'::character varying::text,
            'crypto_withdrawal'::character varying::text
        ]))");
    }

    public function down()
    {
        // Önce type constraint'i kaldır
        DB::statement("ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_type_check");

        Schema::table('transactions', function (Blueprint $table) {
            // İndexleri kontrol ederek kaldır
            if (Schema::hasTable('transactions')) {
                $sm = Schema::getConnection()->getDoctrineSchemaManager();
                $indexes = $sm->listTableIndexes('transactions');

                if (array_key_exists('transactions_crypto_address_index', $indexes)) {
                    $table->dropIndex('transactions_crypto_address_index');
                }
                if (array_key_exists('transactions_crypto_txid_index', $indexes)) {
                    $table->dropIndex('transactions_crypto_txid_index');
                }
            }

            // Kolonları kaldır
            $table->dropColumn([
                'crypto_address',
                'crypto_network',
                'crypto_fee',
                'crypto_txid'
            ]);
        });

        // Eski type constraint'i geri ekle
        DB::statement("ALTER TABLE transactions ADD CONSTRAINT transactions_type_check CHECK (type::text = ANY (ARRAY[
            'withdrawal'::character varying::text,
            'deposit'::character varying::text,
            'transfer'::character varying::text
        ]))");
    }
};
