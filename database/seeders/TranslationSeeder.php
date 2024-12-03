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

        ];


        $translations = array_merge($translations, [
            // Admin Dashboard Translations
            [
                'key' => 'admin.dashboard',
                'tr' => 'Yönetici Paneli',
                'en' => 'Admin Dashboard',
            ],


        ]);

        $translations = array_merge($translations, [
            [
                'key' => 'transaction.pendingTransactions',
                'tr' => 'Bekleyen İşlemler',
                'en' => 'Pending Transactions'
            ],
            [
                'key' => 'transaction.noPendingTransactions',
                'tr' => 'Bekleyen İşlem Bulunmuyor',
                'en' => 'No Pending Transactions'
            ],
            [
                'key' => 'transaction.allTransactionsCompleted',
                'tr' => 'Tüm işlemleriniz tamamlanmış durumda',
                'en' => 'All your transactions are completed'
            ],
            [
                'key' => 'transaction.createTicket',
                'tr' => 'Destek Talebi Oluştur',
                'en' => 'Create Support Ticket'
            ],
            [
                'key' => 'transaction.pendingInfo.title',
                'tr' => 'İşleminiz Beklemede',
                'en' => 'Your Transaction is Pending'
            ],
            [
                'key' => 'transaction.pendingInfo.description',
                'tr' => 'İşleminiz inceleme aşamasındadır. Herhangi bir sorunuz veya sorununuz varsa destek talebi oluşturabilirsiniz.',
                'en' => 'Your transaction is under review. If you have any questions or concerns, you can create a support ticket.'
            ],
            [
                'key' => 'transaction.openSupportTicket',
                'tr' => 'Destek Talebi Oluştur',
                'en' => 'Open Support Ticket'
            ],
            [
                'key' => 'transaction.pendingInfo.help',
                'tr' => 'İşleminizle ilgili herhangi bir sorunuz varsa, destek ekibimiz size yardımcı olmaktan memnuniyet duyacaktır.',
                'en' => 'If you have any questions about your transaction, our support team will be happy to help you.'
            ],
            [
                'key' => 'transaction.pendingInfo.note',
                'tr' => 'Not: İşlem süreleri banka ve işlem tipine göre değişiklik gösterebilir.',
                'en' => 'Note: Processing times may vary depending on the bank and transaction type.'
            ]
        ]);

        $translations = array_merge($translations, [
            // İşlem Detay Sayfası Çevirileri
            [
                'key' => 'transaction.details',
                'tr' => 'İşlem Detayları',
                'en' => 'Transaction Details'
            ],
            [
                'key' => 'transaction.lastUpdated',
                'tr' => 'Son Güncelleme',
                'en' => 'Last Updated'
            ],
            [
                'key' => 'transaction.amountUSD',
                'tr' => 'USD Tutarı',
                'en' => 'USD Amount'
            ],
            [
                'key' => 'transaction.amountTRY',
                'tr' => 'TL Tutarı',
                'en' => 'TRY Amount'
            ],
            [
                'key' => 'transaction.exchangeRate',
                'tr' => 'Döviz Kuru',
                'en' => 'Exchange Rate'
            ],
            [
                'key' => 'transaction.type',
                'tr' => 'İşlem Tipi',
                'en' => 'Transaction Type'
            ],
            [
                'key' => 'transaction.bankAccount',
                'tr' => 'Banka Hesabı',
                'en' => 'Bank Account'
            ],
            [
                'key' => 'transaction.date',
                'tr' => 'İşlem Tarihi',
                'en' => 'Transaction Date'
            ],
            [
                'key' => 'transaction.type.withdrawal',
                'tr' => 'Para Çekme',
                'en' => 'Withdrawal'
            ],
            [
                'key' => 'transaction.type.deposit',
                'tr' => 'Para Yatırma',
                'en' => 'Deposit'
            ],
            [
                'key' => 'transaction.type.transfer',
                'tr' => 'Transfer',
                'en' => 'Transfer'
            ],
            [
                'key' => 'status.pending',
                'tr' => 'Beklemede',
                'en' => 'Pending'
            ],
            [
                'key' => 'status.waiting',
                'tr' => 'Bekliyor',
                'en' => 'Waiting'
            ],
            [
                'key' => 'status.completed',
                'tr' => 'Tamamlandı',
                'en' => 'Completed'
            ],
            [
                'key' => 'status.cancelled',
                'tr' => 'İptal Edildi',
                'en' => 'Cancelled'
            ],
            [
                'key' => 'status.rejected',
                'tr' => 'Reddedildi',
                'en' => 'Rejected'
            ],
            [
                'key' => 'status.approved',
                'tr' => 'Onaylandı',
                'en' => 'Approved'
            ],
            [
                'key' => 'transaction.referenceId',
                'tr' => 'Referans No',
                'en' => 'Reference No'
            ],
            [
                'key' => 'transaction.status',
                'tr' => 'Durum',
                'en' => 'Status'
            ],
            [
                'key' => 'transaction.paymentDetails',
                'tr' => 'Ödeme Detayları',
                'en' => 'Payment Details'
            ],
            [
                'key' => 'transaction.processingTime',
                'tr' => 'İşlem Süresi',
                'en' => 'Processing Time'
            ],
            [
                'key' => 'transaction.processingTimeNote',
                'tr' => 'İşlem süresi banka ve işlem tipine göre değişiklik gösterebilir.',
                'en' => 'Processing time may vary depending on bank and transaction type.'
            ],
            [
                'key' => 'common.back',
                'tr' => 'Geri Dön',
                'en' => 'Go Back'
            ],
            [
                'key' => 'common.details',
                'tr' => 'Detaylar',
                'en' => 'Details'
            ],
            [
                'key' => 'common.processing',
                'tr' => 'İşleniyor',
                'en' => 'Processing'
            ],
            [
                'key' => 'common.close',
                'tr' => 'Kapat',
                'en' => 'Close'
            ]
        ]);

        $translations = array_merge($translations, [
            [
                'key' => 'iban.created',
                'tr' => 'IBAN başarıyla eklendi',
                'en' => 'IBAN added successfully'
            ],
            [
                'key' => 'iban.createError',
                'tr' => 'IBAN eklenirken bir hata oluştu',
                'en' => 'Error occurred while adding IBAN'
            ],
            [
                'key' => 'iban.updated',
                'tr' => 'IBAN başarıyla güncellendi',
                'en' => 'IBAN updated successfully'
            ],
            [
                'key' => 'iban.updateError',
                'tr' => 'IBAN güncellenirken bir hata oluştu',
                'en' => 'Error occurred while updating IBAN'
            ]
        ]);

        $translations = array_merge($translations, [
            [
                'key' => 'iban.management',
                'tr' => 'IBAN Yönetimi',
                'en' => 'IBAN Management'
            ],
            [
                'key' => 'iban.add',
                'tr' => 'Yeni IBAN Ekle',
                'en' => 'Add New IBAN'
            ],
            [
                'key' => 'iban.bankSelect',
                'tr' => 'Banka Seçin',
                'en' => 'Select Bank'
            ],
            [
                'key' => 'iban.title',
                'tr' => 'Başlık',
                'en' => 'Title'
            ],
            [
                'key' => 'iban.number',
                'tr' => 'IBAN Numarası',
                'en' => 'IBAN Number'
            ],
            [
                'key' => 'iban.setDefault',
                'tr' => 'Varsayılan IBAN olarak ayarla',
                'en' => 'Set as Default IBAN'
            ],
            [
                'key' => 'iban.default',
                'tr' => 'Varsayılan',
                'en' => 'Default'
            ],
            [
                'key' => 'iban.bankNotFound',
                'tr' => 'Banka Bulunamadı',
                'en' => 'Bank Not Found'
            ],
            [
                'key' => 'common.save',
                'tr' => 'Kaydet',
                'en' => 'Save'
            ],
            [
                'key' => 'common.saving',
                'tr' => 'Kaydediliyor...',
                'en' => 'Saving...'
            ]
        ]);

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
