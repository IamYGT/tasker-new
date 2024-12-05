<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_cryptos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                ->constrained()
                ->onDelete('cascade');
            $table->string('network_id');
            $table->string('address');
            $table->string('title');
            $table->boolean('is_default')->default(false);
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();

            // İndeksler
            $table->index('network_id');
            $table->index('is_default');
            $table->index('is_active');

            // Benzersiz adres kontrolü (soft delete dahil)
            $table->unique(['user_id', 'network_id', 'address', 'deleted_at'], 'unique_user_network_address');

            // Her kullanıcı için network başına sadece bir varsayılan adres
            $table->unique(['user_id', 'network_id', 'is_default', 'deleted_at'], 'unique_user_network_default')
                ->where('is_default', true);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_cryptos');
    }
}; 
