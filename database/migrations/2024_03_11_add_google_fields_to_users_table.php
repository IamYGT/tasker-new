<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Mevcut sütunları kontrol et
            if (!Schema::hasColumn('users', 'avatar')) {
                $table->string('avatar')->nullable()->after('google_id');
            }
            
            if (!Schema::hasColumn('users', 'google_refresh_token')) {
                $table->text('google_refresh_token')->nullable();
            }
            
            if (!Schema::hasColumn('users', 'last_login_at')) {
                $table->timestamp('last_login_at')->nullable();
            }

            // Index'i kontrol et ve ekle
            $indexExists = DB::select("
                SELECT 1 
                FROM pg_indexes 
                WHERE schemaname = 'public' 
                AND tablename = 'users' 
                AND indexname = 'users_google_id_index'
            ");

            if (empty($indexExists)) {
                $table->index('google_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $columns = ['avatar', 'google_refresh_token', 'last_login_at'];
            
            // Var olan sütunları kaldır
            foreach ($columns as $column) {
                if (Schema::hasColumn('users', $column)) {
                    $table->dropColumn($column);
                }
            }

            // Index'i kontrol et ve kaldır
            $indexExists = DB::select("
                SELECT 1 
                FROM pg_indexes 
                WHERE schemaname = 'public' 
                AND tablename = 'users' 
                AND indexname = 'users_google_id_index'
            ");

            if (!empty($indexExists)) {
                $table->dropIndex(['google_id']);
            }
        });
    }
}; 