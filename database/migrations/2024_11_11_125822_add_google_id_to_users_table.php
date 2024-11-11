<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Eğer sütun yoksa ekle
            if (!Schema::hasColumn('users', 'google_id')) {
                $table->string('google_id')->nullable()->after('email');
                $table->index('google_id');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Sütun varsa kaldır
            if (Schema::hasColumn('users', 'google_id')) {
                $table->dropIndex(['google_id']);
                $table->dropColumn('google_id');
            }
        });
    }
};