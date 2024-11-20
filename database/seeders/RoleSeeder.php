<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RoleSeeder extends Seeder
{
    public function run()
    {
        try {
            DB::transaction(function () {
                $roles = ['admin', 'user'];

                foreach ($roles as $role) {
                    Role::firstOrCreate(['name' => $role]);
                }

                Log::info('Roller başarıyla eklendi');
            });
        } catch (\Exception $e) {
            Log::error('Role Seeder hatası:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
} 