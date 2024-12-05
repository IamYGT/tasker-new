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

            // Para çekme formları için miktar alanı çevirileri
            [
                'key' => 'withdrawal.amountLabel',
                'tr' => 'Çekilecek USD Miktarı (1 USD = {rate} TRY)',
                'en' => 'USD Amount to Withdraw (1 USD = {rate} TRY)'
            ],
            [
                'key' => 'withdrawal.crypto.amountLabel',
                'tr' => 'Çekilecek USDT Miktarı (1 USDT = 1 USD)',
                'en' => 'USDT Amount to Withdraw (1 USDT = 1 USD)'
            ],
            [
                'key' => 'withdrawal.amountPlaceholder',
                'tr' => 'USD cinsinden miktar giriniz',
                'en' => 'Enter amount in USD'
            ],
            [
                'key' => 'withdrawal.crypto.amountPlaceholder',
                'tr' => 'USDT cinsinden miktar giriniz',
                'en' => 'Enter amount in USDT'
            ],
            [
                'key' => 'withdrawal.amountHelp',
                'tr' => 'Tüm ödemeler USD olarak işlenir. Güncel kur: 1 USD = {rate} TRY',
                'en' => 'All payments are processed in USD. Current rate: 1 USD = {rate} TRY'
            ],
            [
                'key' => 'withdrawal.crypto.amountHelp',
                'tr' => 'Tüm ödemeler USDT olarak işlenir. 1 USDT her zaman 1 USD\'ye eşittir.',
                'en' => 'All payments are processed in USDT. 1 USDT is always equal to 1 USD.'
            ],

            // Para çekme formları için döviz kuru çevirileri
            [
                'key' => 'withdrawal.exchangeRates',
                'tr' => 'Güncel Kurlar',
                'en' => 'Current Rates'
            ],
            [
                'key' => 'withdrawal.exchangeRate.usdToEur',
                'tr' => '1 USD = {rate} EUR',
                'en' => '1 USD = {rate} EUR'
            ],
            [
                'key' => 'withdrawal.exchangeRate.usdToTry',
                'tr' => '1 USD = {rate} TRY',
                'en' => '1 USD = {rate} TRY'
            ],
            [
                'key' => 'withdrawal.exchangeRate.lastUpdate',
                'tr' => 'Son Güncelleme: {time}',
                'en' => 'Last Update: {time}'
            ],

            // Kripto para çekme işlemleri için çeviriler
            [
                'key' => 'withdrawal.crypto.network',
                'tr' => 'Ağ Seçimi',
                'en' => 'Select Network'
            ],
            [
                'key' => 'withdrawal.crypto.networkName',
                'tr' => 'Tron (TRC20) Ağı',
                'en' => 'Tron (TRC20) Network'
            ],
            [
                'key' => 'withdrawal.crypto.fee',
                'tr' => 'İşlem ücreti: {amount} USDT',
                'en' => 'Network fee: {amount} USDT'
            ],
            [
                'key' => 'withdrawal.crypto.walletAddress',
                'tr' => 'USDT Cüzdan Adresi (TRC20)',
                'en' => 'USDT Wallet Address (TRC20)'
            ],
            [
                'key' => 'withdrawal.crypto.walletPlaceholder',
                'tr' => 'TRC20 cüzdan adresinizi girin',
                'en' => 'Enter your TRC20 wallet address'
            ],

            // Dashboard çevirileri
            [
                'key' => 'dashboard',
                'tr' => 'Gösterge Paneli',
                'en' => 'Dashboard'
            ],
            [
                'key' => 'dashboard.totalTransactions',
                'tr' => 'Toplam İşlem',
                'en' => 'Total Transactions'
            ],
            [
                'key' => 'dashboard.totalAmount',
                'tr' => 'Toplam Tutar',
                'en' => 'Total Amount'
            ],
            [
                'key' => 'dashboard.pendingTransactions',
                'tr' => 'Bekleyen İşlemler',
                'en' => 'Pending Transactions'
            ],
            [
                'key' => 'dashboard.completedTransactions',
                'tr' => 'Tamamlanan İşlemler',
                'en' => 'Completed Transactions'
            ],
            [
                'key' => 'dashboard.quickActions',
                'tr' => 'Hızlı İşlemler',
                'en' => 'Quick Actions'
            ],
            [
                'key' => 'dashboard.newTransaction',
                'tr' => 'Yeni İşlem',
                'en' => 'New Transaction'
            ],
            [
                'key' => 'dashboard.addUser',
                'tr' => 'Kullanıcı Ekle',
                'en' => 'Add User'
            ],
            [
                'key' => 'dashboard.viewReports',
                'tr' => 'Raporları Görüntüle',
                'en' => 'View Reports'
            ],
            [
                'key' => 'dashboard.dailyAverage',
                'tr' => 'Günlük Ortalama',
                'en' => 'Daily Average'
            ],
            [
                'key' => 'dashboard.last30Days',
                'tr' => 'Son 30 Gün',
                'en' => 'Last 30 Days'
            ],
            [
                'key' => 'dashboard.successRate',
                'tr' => 'Başarı Oranı',
                'en' => 'Success Rate'
            ],
            [
                'key' => 'dashboard.completionRate',
                'tr' => 'Tamamlanma Oranı',
                'en' => 'Completion Rate'
            ],
            [
                'key' => 'dashboard.recentActivity',
                'tr' => 'Son Aktiviteler',
                'en' => 'Recent Activity'
            ],
            [
                'key' => 'dashboard.welcomeMessage',
                'tr' => 'Hoş geldiniz!',
                'en' => 'Welcome!'
            ],
            [
                'key' => 'dashboard.transactionTrend',
                'tr' => 'İşlem Trendi',
                'en' => 'Transaction Trend'
            ],

            // Activity ve Status çevirileri
            [
                'key' => 'activity.transaction',
                'tr' => '{amount} tutarında işlem',
                'en' => 'Transaction of {amount}'
            ],
            [
                'key' => 'activity.ticket',
                'tr' => 'Destek talebi oluşturuldu',
                'en' => 'Support ticket created'
            ],
            [
                'key' => 'activity.withdrawal',
                'tr' => '{amount} tutarında çekim talebi',
                'en' => 'Withdrawal request of {amount}'
            ],
            [
                'key' => 'status.completed',
                'tr' => 'Tamamlandı',
                'en' => 'Completed'
            ],
            [
                'key' => 'status.pending',
                'tr' => 'Beklemede',
                'en' => 'Pending'
            ],
            [
                'key' => 'status.cancelled',
                'tr' => 'İptal Edildi',
                'en' => 'Cancelled'
            ],

            // Common çevirileri
            [
                'key' => 'common.viewAll',
                'tr' => 'Tümünü Gör',
                'en' => 'View All'
            ],
            [
                'key' => 'common.loading',
                'tr' => 'Yükleniyor...',
                'en' => 'Loading...'
            ],
            [
                'key' => 'common.exchangeRateError',
                'tr' => 'Döviz kurları güncellenirken bir hata oluştu. Varsayılan değerler kullanılıyor.',
                'en' => 'An error occurred while updating exchange rates. Using default values.'
            ],
            [
                'key' => 'withdrawal.lastUpdate',
                'tr' => 'Son Güncelleme: {time}',
                'en' => 'Last Update: {time}'
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
