<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('crypto_networks', function (Blueprint $table) {
            $table->string('id')->primary(); // btc, eth, trx gibi
            $table->string('name');
            $table->string('symbol', 10);
            $table->string('chain');
            $table->string('validation_regex');
            $table->string('explorer_url');
            $table->string('icon')->nullable();
            $table->boolean('is_active')->default(true);
            $table->integer('sort_order')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('crypto_networks');
    }
};
