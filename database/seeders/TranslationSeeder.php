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
                'tr' => 'Şifre güncellenirken bir hata oluştu',
                'en' => 'An error occurred while updating your password',
                'key' => 'password_update_error'
            ],
            [
                'tr' => 'Şifre en az 6 karakter olmalıdır',
                'en' => 'Password must be at least 6 characters',
                'key' => 'password_min_length_6'
            ],
            [
                'tr' => 'Şifre en az bir harf içermelidir',
                'en' => 'Password must contain at least one letter',
                'key' => 'password_letter'
            ],
            [
                'tr' => 'Şifre en az bir rakam içermelidir',
                'en' => 'Password must contain at least one number',
                'key' => 'password_number'
            ],
            [
                'tr' => 'Şifre en az bir özel karakter içermelidir',
                'en' => 'Password must contain at least one special character',
                'key' => 'password_special'
            ],
            [
                'tr' => 'Şifreler eşleşmelidir',
                'en' => 'Passwords must match',
                'key' => 'passwords_match'
            ],
            [
                'tr' => 'Güvende kalmak için hesabınızın uzun, rastgele bir şifre kullandığından emin olun.',
                'en' => 'Ensure your account is using a long, random password to stay secure.',
                'key' => 'ensure_long_password'
            ],
            [
                'tr' => 'Mevcut Şifre',
                'en' => 'Current Password',
                'key' => 'current_password'
            ],
            [
                'tr' => 'Yeni Şifre',
                'en' => 'New Password',
                'key' => 'new_password'
            ],
            [
                'tr' => 'Şifreyi Onayla',
                'en' => 'Confirm Password',
                'key' => 'confirm_password'
            ],
            [
                'tr' => 'Kaydet',
                'en' => 'Save',
                'key' => 'save'
            ],
            [
                'tr' => 'Kaydedildi',
                'en' => 'Saved',
                'key' => 'saved'
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