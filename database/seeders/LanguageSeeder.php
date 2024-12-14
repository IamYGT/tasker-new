<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class LanguageSeeder extends Seeder
{
    public function run()
    {
        // Önce mevcut dilleri temizleyelim
        DB::table('dil')->truncate();

        // Dilleri ekleyelim
        DB::table('dil')->insert([
            [
                'dil_id' => 1,
                'dil_baslik' => 'Türkçe',
                'dil_resim' => 'flag-tr.png',
                'dil_kod' => 'tr',
                'dil_varsayilan' => true,
                'dil_durum' => 1
            ],
            [
                'dil_id' => 2,
                'dil_baslik' => 'English',
                'dil_resim' => 'flag-gp.png',
                'dil_kod' => 'en',
                'dil_varsayilan' => false,
                'dil_durum' => 1
            ]
        ]);
    }
}
