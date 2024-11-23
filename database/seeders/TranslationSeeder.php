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
         
            // Logo ve Marka
            [
                'tr' => 'YGT Labs',
                'en' => 'YGT Labs',
                'key' => 'brand.name'
            ],

            // Sidebar
            [
                'tr' => 'Kullanıcı Yönetimi',
                'en' => 'User Management',
                'key' => 'sidebar.userManagement'
            ],
            [
                'tr' => 'İşlemler',
                'en' => 'Transactions',
                'key' => 'sidebar.transactions'
            ],
            [
                'tr' => 'Destek Talepleri',
                'en' => 'Support Tickets',
                'key' => 'sidebar.supportTickets'
            ],
            [
                'tr' => 'Ayarlar',
                'en' => 'Settings',
                'key' => 'sidebar.settings'
            ],
            [
                'tr' => 'Profil',
                'en' => 'Profile',
                'key' => 'sidebar.profile'
            ],
            [
                'tr' => 'Çıkış Yap',
                'en' => 'Logout',
                'key' => 'sidebar.logout'
            ],

            // Dil Seçimi
            [
                'tr' => 'Türkçe',
                'en' => 'Turkish',
                'key' => 'language.turkish'
            ],

            // İşlem Detay Sayfası
            [
                'tr' => 'Geri',
                'en' => 'Back',
                'key' => 'common.back'
            ],
            [
                'tr' => 'İşlem Detayları',
                'en' => 'Transaction Details',
                'key' => 'transaction.details'
            ],
            [
                'tr' => 'İşlem detaylarını görüntüle ve yönet',
                'en' => 'View and manage transaction details',
                'key' => 'transaction.viewDescription'
            ],
            [
                'tr' => 'Düzenle',
                'en' => 'Edit',
                'key' => 'common.edit'
            ],
            [
                'tr' => 'İptal Edildi',
                'en' => 'Cancelled',
                'key' => 'status.cancelled'
            ],
            [
                'tr' => 'Para Yatırma',
                'en' => 'Deposit',
                'key' => 'transaction.deposit'
            ],
            [
                'tr' => 'Kullanıcı Detayları',
                'en' => 'User Details',
                'key' => 'transaction.userDetails'
            ],
            [
                'tr' => 'Ödeme Detayları',
                'en' => 'Payment Details',
                'key' => 'transaction.paymentDetails'
            ],
            [
                'tr' => 'Tutar',
                'en' => 'Amount',
                'key' => 'transaction.amount'
            ],
            [
                'tr' => 'Referans No',
                'en' => 'Reference No',
                'key' => 'transaction.referenceId'
            ],
            [
                'tr' => 'Tarih',
                'en' => 'Date',
                'key' => 'transaction.date'
            ],
            [
                'tr' => 'İşlem Durumu',
                'en' => 'Transaction Status',
                'key' => 'transaction.status'
            ],
            [
                'tr' => 'Beklemede',
                'en' => 'Pending',
                'key' => 'status.pending'
            ],
            [
                'tr' => 'Tamamlandı',
                'en' => 'Completed',
                'key' => 'status.completed'
            ],
            [
                'tr' => 'Para Çekme',
                'en' => 'Withdrawal',
                'key' => 'transaction.withdrawal'
            ],
            [
                'tr' => 'Transfer',
                'en' => 'Transfer',
                'key' => 'transaction.transfer'
            ],
            [
                'tr' => 'Notlar',
                'en' => 'Notes',
                'key' => 'transaction.notes'
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