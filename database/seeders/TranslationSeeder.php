<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TranslationSeeder extends Seeder
{
    public function run()
    {
        $translations = [
            // Sidebar Genel
            [
                'tr' => 'Gösterge Paneli',
                'en' => 'Dashboard',
                'key' => 'sidebar.dashboard'
            ],

            // IBAN Yönetimi
            [
                'key' => 'iban.management',
                'tr' => 'IBAN Yönetimi',
                'en' => 'IBAN Management'
            ],
            [
                'key' => 'iban.add',
                'tr' => 'IBAN Ekle',
                'en' => 'Add IBAN'
            ],

            // IBAN Silme Modalı
            [
                'key' => 'iban.deleteTitle',
                'tr' => 'IBAN\'ı Sil',
                'en' => 'Delete IBAN'
            ],
            [
                'key' => 'iban.deleteConfirmation',
                'tr' => '"{title}" başlıklı {iban} IBAN\'ını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
                'en' => 'Are you sure you want to delete the IBAN {iban} titled "{title}"? This action cannot be undone.'
            ],
            [
                'key' => 'iban.deleteDefaultWarning',
                'tr' => 'Bu varsayılan IBAN\'ınızdır. Silmeden önce başka bir IBAN\'ı varsayılan olarak ayarlamanız önerilir.',
                'en' => 'This is your default IBAN. It is recommended to set another IBAN as default before deleting this one.'
            ],

            // Genel Butonlar
            [
                'key' => 'common.delete',
                'tr' => 'Sil',
                'en' => 'Delete'
            ],
            [
                'key' => 'common.cancel',
                'tr' => 'İptal',
                'en' => 'Cancel'
            ],
            [
                'key' => 'common.confirm',
                'tr' => 'Onayla',
                'en' => 'Confirm'
            ],

            // IBAN İşlem Sonuçları
            [
                'key' => 'iban.deleted',
                'tr' => 'IBAN başarıyla silindi',
                'en' => 'IBAN successfully deleted'
            ],
            [
                'key' => 'iban.errors.delete_failed',
                'tr' => 'IBAN silinirken bir hata oluştu',
                'en' => 'An error occurred while deleting the IBAN'
            ],

            // Kripto Yönetimi
            [
                'key' => 'crypto.management',
                'tr' => 'Kripto Adres Yönetimi',
                'en' => 'Crypto Address Management'
            ],
            [
                'key' => 'crypto.add',
                'tr' => 'Kripto Adres Ekle',
                'en' => 'Add Crypto Address'
            ],
            [
                'key' => 'crypto.deleteTitle',
                'tr' => 'Kripto Adresi Sil',
                'en' => 'Delete Crypto Address'
            ],
            [
                'key' => 'crypto.deleteConfirmation',
                'tr' => '"{title}" başlıklı {address} adresini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
                'en' => 'Are you sure you want to delete the address {address} titled "{title}"? This action cannot be undone.'
            ],
            [
                'key' => 'crypto.deleteDefaultWarning',
                'tr' => 'Bu varsayılan kripto adresinizdir. Silmeden önce başka bir adresi varsayılan olarak ayarlamanız önerilir.',
                'en' => 'This is your default crypto address. It is recommended to set another address as default before deleting this one.'
            ],
            [
                'key' => 'crypto.errors.network_required',
                'tr' => 'Lütfen bir ağ seçin',
                'en' => 'Please select a network'
            ],
            [
                'key' => 'crypto.errors.network_invalid',
                'tr' => 'Geçersiz ağ seçimi',
                'en' => 'Invalid network selection'
            ],
            [
                'key' => 'crypto.errors.address_required',
                'tr' => 'Adres alanı zorunludur',
                'en' => 'Address field is required'
            ],
            [
                'key' => 'crypto.errors.address_exists',
                'tr' => 'Bu adres zaten kayıtlı',
                'en' => 'This address is already registered'
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
