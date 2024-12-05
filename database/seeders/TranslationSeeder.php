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
                'tr' => 'Lütfen bir a seçin',
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

            // Kripto Adresleri - Genel
            [
                'key' => 'crypto.title',
                'tr' => 'Kripto Adresleri',
                'en' => 'Crypto Addresses'
            ],
            [
                'key' => 'crypto.my_addresses',
                'tr' => 'Adreslerim',
                'en' => 'My Addresses'
            ],
            [
                'key' => 'crypto.add_new',
                'tr' => 'Yeni Adres Ekle',
                'en' => 'Add New Address'
            ],
            [
                'key' => 'crypto.network',
                'tr' => 'Ağ',
                'en' => 'Network'
            ],
            [
                'key' => 'crypto.address',
                'tr' => 'Adres',
                'en' => 'Address'
            ],
            [
                'key' => 'crypto.title_field',
                'tr' => 'Başlık',
                'en' => 'Title'
            ],
            [
                'key' => 'crypto.set_as_default',
                'tr' => 'Varsayılan Olarak Ayarla',
                'en' => 'Set as Default'
            ],
            [
                'key' => 'crypto.select_network',
                'tr' => 'Ağ Seçin',
                'en' => 'Select Network'
            ],

            // Boş Durum Mesajları
            [
                'key' => 'crypto.empty.title',
                'tr' => 'Henüz adres eklenmemiş',
                'en' => 'No addresses yet'
            ],
            [
                'key' => 'crypto.empty.description',
                'tr' => 'Kripto para almak için adres ekleyebilirsiniz.',
                'en' => 'You can add addresses to receive crypto.'
            ],

            // Başarı Mesajları
            [
                'key' => 'crypto.success.created',
                'tr' => 'Adres başarıyla eklendi',
                'en' => 'Address added successfully'
            ],
            [
                'key' => 'crypto.success.updated',
                'tr' => 'Adres başarıyla güncellendi',
                'en' => 'Address updated successfully'
            ],
            [
                'key' => 'crypto.success.deleted',
                'tr' => 'Adres başarıyla silindi',
                'en' => 'Address deleted successfully'
            ],

            // Onay Mesajları
            [
                'key' => 'crypto.confirm.delete',
                'tr' => 'Bu adresi silmek istediğinizden emin misiniz?',
                'en' => 'Are you sure you want to delete this address?'
            ],
            [
                'key' => 'crypto.confirm.make_default',
                'tr' => 'Bu adresi varsayılan yapmak istediğinizden emin misiniz?',
                'en' => 'Are you sure you want to make this address default?'
            ],

            // Validasyon Mesajları
            [
                'key' => 'crypto.validation.address_min',
                'tr' => 'Adres en az {min} karakter olmalıdır',
                'en' => 'Address must be at least {min} characters'
            ],
            [
                'key' => 'crypto.validation.address_max',
                'tr' => 'Adres en fazla {max} karakter olabilir',
                'en' => 'Address cannot be longer than {max} characters'
            ],

            // Etiketler
            [
                'key' => 'crypto.labels.default',
                'tr' => 'Varsayılan',
                'en' => 'Default'
            ],
            [
                'key' => 'crypto.labels.created_at',
                'tr' => 'Eklenme Tarihi',
                'en' => 'Added Date'
            ],
            [
                'key' => 'crypto.labels.actions',
                'tr' => 'İşlemler',
                'en' => 'Actions'
            ],

            // İpuçları
            [
                'key' => 'crypto.tooltips.copy',
                'tr' => 'Adresi Kopyala',
                'en' => 'Copy Address'
            ],
            [
                'key' => 'crypto.tooltips.view_on_explorer',
                'tr' => 'Explorer\'da Görüntüle',
                'en' => 'View on Explorer'
            ],
            [
                'key' => 'crypto.tooltips.edit',
                'tr' => 'Düzenle',
                'en' => 'Edit'
            ],
            [
                'key' => 'crypto.tooltips.delete',
                'tr' => 'Sil',
                'en' => 'Delete'
            ],
            [
                'key' => 'crypto.tooltips.make_default',
                'tr' => 'Varsayılan Yap',
                'en' => 'Make Default'
            ],

            // İstatistik çevirileri
            [
                'key' => 'crypto.stats.total_addresses',
                'tr' => 'Toplam Adres',
                'en' => 'Total Addresses'
            ],
            [
                'key' => 'crypto.stats.networks',
                'tr' => 'Kullanılan Ağlar',
                'en' => 'Networks Used'
            ],
            [
                'key' => 'crypto.stats.default_addresses',
                'tr' => 'Varsayılan Adresler',
                'en' => 'Default Addresses'
            ],
            [
                'key' => 'crypto.stats.last_added',
                'tr' => 'Son Eklenen',
                'en' => 'Last Added'
            ],
            [
                'key' => 'crypto.description',
                'tr' => 'Kripto para alım ve gönderimi için kullanacağınız adreslerinizi yönetin.',
                'en' => 'Manage your addresses for receiving and sending cryptocurrencies.'
            ],

            // Para Çekme İşlemleri - Genel
            [
                'key' => 'withdrawal.request.title',
                'tr' => 'Para Çekme Talebi',
                'en' => 'Withdrawal Request'
            ],
            [
                'key' => 'withdrawal.paymentMethod',
                'tr' => 'Ödeme Yöntemi',
                'en' => 'Payment Method'
            ],
            [
                'key' => 'withdrawal.bankTransfer',
                'tr' => 'Banka Transferi',
                'en' => 'Bank Transfer'
            ],
            [
                'key' => 'withdrawal.crypto',
                'tr' => 'Kripto Para',
                'en' => 'Cryptocurrency'
            ],
            [
                'key' => 'withdrawal.request.amountUSD',
                'tr' => 'Çekilecek Miktar (USD)',
                'en' => 'Amount to Withdraw (USD)'
            ],
            [
                'key' => 'withdrawal.request.selectBank',
                'tr' => 'Banka Seçin',
                'en' => 'Select Bank'
            ],
            [
                'key' => 'withdrawal.request.iban',
                'tr' => 'IBAN Numarası',
                'en' => 'IBAN Number'
            ],
            [
                'key' => 'withdrawal.savedIbans',
                'tr' => 'Kayıtlı IBAN\'larınız',
                'en' => 'Your Saved IBANs'
            ],
            [
                'key' => 'withdrawal.cryptoNetwork',
                'tr' => 'Kripto Ağı',
                'en' => 'Crypto Network'
            ],
            [
                'key' => 'withdrawal.trc20Only',
                'tr' => 'Şu anda sadece TRC20 ağı desteklenmektedir.',
                'en' => 'Currently only TRC20 network is supported.'
            ],
            [
                'key' => 'withdrawal.cryptoAddress',
                'tr' => 'Kripto Cüzdan Adresi',
                'en' => 'Crypto Wallet Address'
            ],

            // IBAN Yardım Metinleri
            [
                'key' => 'withdrawal.ibanHelp.title',
                'tr' => 'IBAN Bilgileri',
                'en' => 'IBAN Information'
            ],
            [
                'key' => 'withdrawal.ibanHelp.format',
                'tr' => 'IBAN TR ile başlamalı ve 26 karakter olmalıdır',
                'en' => 'IBAN must start with TR and be 26 characters long'
            ],
            [
                'key' => 'withdrawal.ibanHelp.paste',
                'tr' => 'Kopyala-yapıştır yapabilirsiniz',
                'en' => 'You can copy and paste'
            ],
            [
                'key' => 'withdrawal.ibanHelp.check',
                'tr' => 'IBAN otomatik olarak kontrol edilir',
                'en' => 'IBAN is automatically validated'
            ],
            [
                'key' => 'withdrawal.ibanExample',
                'tr' => 'IBAN Örneği',
                'en' => 'IBAN Example'
            ],

            // Validasyon Mesajları
            [
                'key' => 'withdrawal.validIBAN',
                'tr' => 'Geçerli IBAN',
                'en' => 'Valid IBAN'
            ],
            [
                'key' => 'withdrawal.invalidIBAN',
                'tr' => 'Geçersiz IBAN',
                'en' => 'Invalid IBAN'
            ],

            // İşlem Durumları
            [
                'key' => 'withdrawal.processing',
                'tr' => 'Para çekme talebiniz işleniyor...',
                'en' => 'Processing your withdrawal request...'
            ],
            [
                'key' => 'withdrawal.request.success',
                'tr' => 'Para çekme talebiniz başarıyla oluşturuldu',
                'en' => 'Your withdrawal request has been created successfully'
            ],
            [
                'key' => 'withdrawal.request.error',
                'tr' => 'Para çekme talebi oluşturulurken bir hata oluştu',
                'en' => 'An error occurred while creating withdrawal request'
            ],

            // Genel Butonlar ve Mesajlar
            [
                'key' => 'withdrawal.request.submit',
                'tr' => 'Para Çekme Talebi Oluştur',
                'en' => 'Create Withdrawal Request'
            ],
            [
                'key' => 'common.processing',
                'tr' => 'İşleniyor...',
                'en' => 'Processing...'
            ],
            [
                'key' => 'common.select',
                'tr' => 'Seçiniz',
                'en' => 'Select'
            ],
            [
                'key' => 'common.default',
                'tr' => 'Varsayılan',
                'en' => 'Default'
            ],
            [
                'key' => 'common.copy',
                'tr' => 'Kopyala',
                'en' => 'Copy'
            ],
            [
                'key' => 'common.paste',
                'tr' => 'Yapıştır',
                'en' => 'Paste'
            ],
            [
                'key' => 'common.copied',
                'tr' => 'Kopyalandı',
                'en' => 'Copied'
            ],
            [
                'key' => 'common.copyError',
                'tr' => 'Kopyalama başarısız',
                'en' => 'Copy failed'
            ],
            [
                'key' => 'common.unknownBank',
                'tr' => 'Bilinmeyen Banka',
                'en' => 'Unknown Bank'
            ],

            // TRC20 ile ilgili çeviriler
            [
                'key' => 'withdrawal.crypto.amount',
                'tr' => 'Çekilecek USDT Miktarı',
                'en' => 'USDT Amount to Withdraw'
            ],
            [
                'key' => 'withdrawal.crypto.minAmount',
                'tr' => 'Minimum çekim miktarı: {amount} USDT',
                'en' => 'Minimum withdrawal amount: {amount} USDT'
            ],
            [
                'key' => 'withdrawal.crypto.maxAmount',
                'tr' => 'Maksimum çekim miktarı: {amount} USDT',
                'en' => 'Maximum withdrawal amount: {amount} USDT'
            ],
            [
                'key' => 'withdrawal.crypto.fee',
                'tr' => 'İşlem ücreti: {amount} USDT',
                'en' => 'Transaction fee: {amount} USDT'
            ],
            [
                'key' => 'withdrawal.crypto.netAmount',
                'tr' => 'Net alacağınız miktar: {amount} USDT',
                'en' => 'Net amount you will receive: {amount} USDT'
            ],
            [
                'key' => 'withdrawal.crypto.info',
                'tr' => 'TRC20 ağında USDT token olarak gönderilecektir',
                'en' => 'Will be sent as USDT token on TRC20 network'
            ],
            [
                'key' => 'withdrawal.crypto.addressWarning',
                'tr' => 'Lütfen TRC20 ağını destekleyen bir cüzdan adresi girin',
                'en' => 'Please enter a wallet address that supports TRC20 network'
            ],
            [
                'key' => 'withdrawal.crypto.addressPlaceholder',
                'tr' => 'TRC20 Cüzdan Adresi (T ile başlar)',
                'en' => 'TRC20 Wallet Address (Starts with T)'
            ],
            [
                'key' => 'withdrawal.crypto.invalidAddress',
                'tr' => 'Geçersiz TRC20 cüzdan adresi',
                'en' => 'Invalid TRC20 wallet address'
            ],
            [
                'key' => 'withdrawal.crypto.validAddress',
                'tr' => 'Geçerli TRC20 cüzdan adresi',
                'en' => 'Valid TRC20 wallet address'
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
