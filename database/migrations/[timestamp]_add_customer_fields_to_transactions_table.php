<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Yeni müşteri alanlarını ekle
            $table->string('customer_name')->nullable()->after('user_id');
            $table->string('customer_surname')->nullable()->after('customer_name');
            $table->unsignedBigInteger('customer_meta_id')->nullable()->after('customer_surname');

            // customer_meta_id için index
            $table->index('customer_meta_id');
        });

        // Sütun açıklamalarını ekle
        DB::statement("COMMENT ON COLUMN transactions.customer_name IS 'Müşteri adı'");
        DB::statement("COMMENT ON COLUMN transactions.customer_surname IS 'Müşteri soyadı'");
        DB::statement("COMMENT ON COLUMN transactions.customer_meta_id IS 'Müşteri meta verisi ID'");
    }

    public function down()
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn(['customer_name', 'customer_surname', 'customer_meta_id']);
            $table->dropIndex(['customer_meta_id']);
        });
    }
};
