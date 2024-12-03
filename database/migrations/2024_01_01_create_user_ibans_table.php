<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('user_ibans', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('bank_id', 50); // turkey_banks.json'daki id'ler
            $table->string('iban', 34); // TR + 24 karakter
            $table->string('title')->nullable(); // Kullanıcının verdiği başlık (örn: "Ana Hesabım")
            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['user_id', 'iban']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_ibans');
    }
};
