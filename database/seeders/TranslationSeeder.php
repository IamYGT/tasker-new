<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TranslationSeeder extends Seeder
{
    public function run()
    {
        $translations = [
            // Genel çeviriler
            [
                'tr' => 'Gösterge Paneli',
                'en' => 'Dashboard',
                'key' => 'sidebar.dashboard'
            ],
            // Admin sayfaları çevirileri
            [
                'tr' => 'Ödemeler',
                'en' => 'Payments',
                'key' => 'admin.payments.title'
            ],
            [
                'tr' => 'Roller',
                'en' => 'Roles',
                'key' => 'admin.roles.title'
            ],
            [
                'tr' => 'Ayarlar',
                'en' => 'Settings',
                'key' => 'admin.settings.title'
            ],
            [
                'tr' => 'Sistem Logları',
                'en' => 'System Logs',
                'key' => 'admin.logs.title'
            ]
        ];

        foreach ($translations as $translation) {
            // TR için kontrol ve ekleme
            $existingTr = DB::table('dil_kelimeler')
                ->where('anahtar', $translation['key'])
                ->where('kod', 'tr')
                ->first();

            if (!$existingTr) {
                DB::table('dil_kelimeler')->insert([
                    'adi' => $translation['tr'],
                    'anahtar' => $translation['key'],
                    'deger' => $translation['tr'],
                    'kod' => 'tr'
                ]);
            }

            // EN için kontrol ve ekleme
            $existingEn = DB::table('dil_kelimeler')
                ->where('anahtar', $translation['key'])
                ->where('kod', 'en')
                ->first();

            if (!$existingEn) {
                DB::table('dil_kelimeler')->insert([
                    'adi' => $translation['en'],
                    'anahtar' => $translation['key'],
                    'deger' => $translation['en'],
                    'kod' => 'en'
                ]);
            }
        }
    }
} 