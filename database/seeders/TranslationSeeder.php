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

            // Withdrawal Form Çevirileri
            [
                'tr' => 'Müşteri Meta ID',
                'en' => 'Customer Meta ID',
                'key' => 'withdrawal.customerMetaId'
            ],
            [
                'tr' => 'Opsiyonel müşteri referans numarası',
                'en' => 'Optional customer reference number',
                'key' => 'withdrawal.customerMetaIdPlaceholder'
            ],
            [
                'tr' => 'İsteğe bağlı olarak müşteri referans numarası ekleyebilirsiniz',
                'en' => 'You can optionally add a customer reference number',
                'key' => 'withdrawal.customerMetaIdHelp'
            ],
            [
                'tr' => 'Müşteri Bilgileri',
                'en' => 'Customer Information',
                'key' => 'withdrawal.customerInfo'
            ],
            [
                'tr' => 'Müşteri Adı',
                'en' => 'Customer Name',
                'key' => 'withdrawal.customerName'
            ],
            [
                'tr' => 'Müşteri Soyadı',
                'en' => 'Customer Surname',
                'key' => 'withdrawal.customerSurname'
            ],
            [
                'tr' => 'Tutar',
                'en' => 'Amount',
                'key' => 'withdrawal.amount'
            ],
            [
                'tr' => 'Banka Seçin',
                'en' => 'Select Bank',
                'key' => 'withdrawal.selectBank'
            ],
            [
                'tr' => 'Kayıtlı IBAN\'lar',
                'en' => 'Saved IBANs',
                'key' => 'withdrawal.savedIbans'
            ],
            [
                'tr' => 'Manuel IBAN Girişi',
                'en' => 'Manual IBAN Entry',
                'key' => 'withdrawal.manualIban'
            ],
            [
                'tr' => 'Geçerli IBAN',
                'en' => 'Valid IBAN',
                'key' => 'withdrawal.validIBAN'
            ],
            [
                'tr' => 'Geçersiz IBAN',
                'en' => 'Invalid IBAN',
                'key' => 'withdrawal.invalidIBAN'
            ],
            [
                'tr' => 'IBAN yapıştırıldı',
                'en' => 'IBAN pasted',
                'key' => 'withdrawal.ibanPasted'
            ],
            [
                'tr' => 'Yapıştırma hatası',
                'en' => 'Paste error',
                'key' => 'withdrawal.pasteError'
            ],
            [
                'tr' => 'Para Çekme Talebi',
                'en' => 'Withdrawal Request',
                'key' => 'withdrawal.submit'
            ],
            [
                'tr' => 'Para çekme talebi oluşturuldu',
                'en' => 'Withdrawal request created',
                'key' => 'withdrawal.requestCreated'
            ],
            [
                'tr' => 'Para çekme talebi oluşturulurken hata oluştu',
                'en' => 'Error creating withdrawal request',
                'key' => 'withdrawal.createError'
            ],

            // Common Çevirileri
            [
                'tr' => 'Seçin',
                'en' => 'Select',
                'key' => 'common.select'
            ],
            [
                'tr' => 'Varsayılan',
                'en' => 'Default',
                'key' => 'common.default'
            ],
            [
                'tr' => 'Kopyalandı',
                'en' => 'Copied',
                'key' => 'common.copied'
            ],
            [
                'tr' => 'Kopyalama hatası',
                'en' => 'Copy error',
                'key' => 'common.copyError'
            ],
            [
                'tr' => 'Yapıştır',
                'en' => 'Paste',
                'key' => 'common.paste'
            ],
            [
                'tr' => 'İşleniyor',
                'en' => 'Processing',
                'key' => 'common.processing'
            ],
            [
                'tr' => 'Opsiyonel',
                'en' => 'Optional',
                'key' => 'common.optional'
            ],

            // USD ile ilgili çeviriler
            [
                'tr' => 'Sadece USD',
                'en' => 'USD Only',
                'key' => 'withdrawal.usdOnly'
            ],
            [
                'tr' => 'Para çekme işlemleri yalnızca USD (Amerikan Doları) cinsinden yapılmaktadır. Lütfen çekmek istediğiniz tutarı USD olarak giriniz.',
                'en' => 'Withdrawals can only be made in USD (US Dollars). Please enter the amount you wish to withdraw in USD.',
                'key' => 'withdrawal.usdOnlyInfo'
            ],
            [
                'tr' => 'Çekilecek Miktar (USD)',
                'en' => 'Withdrawal Amount (USD)',
                'key' => 'withdrawal.amount'
            ],
            [
                'tr' => 'Banka Hesabı',
                'en' => 'Bank Account',
                'key' => 'withdrawal.bankAccount'
            ],
            [
                'tr' => 'Müşteri Referans No',
                'en' => 'Customer Reference No',
                'key' => 'withdrawal.customerMetaId'
            ],
            [
                'tr' => 'Banka Hesabı',
                'en' => 'Bank Account',
                'key' => 'withdrawal.bankAccount'
            ],
            [
                'tr' => 'IBAN Numarası',
                'en' => 'IBAN Number',
                'key' => 'withdrawal.ibanNumber'
            ],
            [
                'tr' => 'Hesap Sahibi',
                'en' => 'Account Holder',
                'key' => 'withdrawal.accountHolder'
            ],
            [
                'tr' => 'Hesap Bilgileri',
                'en' => 'Account Information',
                'key' => 'withdrawal.accountInfo'
            ],
            [
                'tr' => 'IBAN Sahibi Adı',
                'en' => 'Account Holder Name',
                'key' => 'withdrawal.accountHolderName'
            ],
            [
                'tr' => 'IBAN Sahibi Soyadı',
                'en' => 'Account Holder Surname',
                'key' => 'withdrawal.accountHolderSurname'
            ],

            // Kripto adresi göster
            [
                'tr' => 'Kripto Adresi',
                'en' => 'Crypto Address',
                'key' => 'transaction.cryptoAddress'
            ],
            [
                'tr' => 'Ağ',
                'en' => 'Network',
                'key' => 'transaction.cryptoNetwork'
            ],
            [
                'tr' => 'İşlem Ücreti',
                'en' => 'Transaction Fee',
                'key' => 'transaction.cryptoFee'
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
