<?php

namespace Database\Seeders;

use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Seeder;

class TransactionSeeder extends Seeder
{
    public function run(): void
    {
        User::all()->each(function ($user) {
            Transaction::factory()
                ->count(5)
                ->create(['user_id' => $user->id]);
        });
    }
} 