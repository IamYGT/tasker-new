<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TranslationSeeder extends Seeder
{
    public function run()
    {
        $translations = [
            // Şifre güncelleme formu çevirileri
            [
                'tr' => 'Şifreniz başarıyla güncellendi!',
                'en' => 'Your password has been updated successfully!',
                'key' => 'password_updated_successfully'
            ],
            [
                'tr' => 'Kullanıcı Yönetimi',
                'en' => 'User Management',
                'key' => 'sidebar.userManagement'
            ],
            [
                'tr' => 'Kullanıcı Listesi',
                'en' => 'User List',
                'key' => 'sidebar.userList'
            ],
            [
                'tr' => 'Kullanıcı Ekle',
                'en' => 'Add User',
                'key' => 'sidebar.addUser'
            ],
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