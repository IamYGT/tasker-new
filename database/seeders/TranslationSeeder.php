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
            [
                'tr' => 'Aktif',
                'en' => 'Active',
                'key' => 'users.active'
            ],
            [
                'tr' => 'Pasif',
                'en' => 'Inactive',
                'key' => 'users.inactive'
            ],
            [
                'tr' => 'Kullanıcı durumu başarıyla güncellendi',
                'en' => 'User status updated successfully',
                'key' => 'users.statusUpdateSuccess'
            ],
            [
                'tr' => 'Hesap Durumu',
                'en' => 'Account Status',
                'key' => 'users.accountStatus'
            ],
            [
                'tr' => 'Kullanıcının sisteme erişim durumunu kontrol edin',
                'en' => 'Control user\'s access to the system',
                'key' => 'users.accountStatusDescription'
            ],
            [
                'tr' => 'Aktif',
                'en' => 'Active',
                'key' => 'users.statusActive'
            ],
            [
                'tr' => 'Pasif',
                'en' => 'Inactive',
                'key' => 'users.statusInactive'
            ],
            [
                'tr' => 'Kullanıcı sisteme giriş yapabilir ve tüm özellikleri kullanabilir.',
                'en' => 'User can log in and use all features.',
                'key' => 'users.activeAccountMessage'
            ],
            [
                'tr' => 'Kullanıcı sisteme giriş yapamaz ve özellikleri kullanamaz.',
                'en' => 'User cannot log in and use features.',
                'key' => 'users.inactiveAccountMessage'
            ],
            // Admin Dashboard
            [
                'tr' => 'Admin Paneli',
                'en' => 'Admin Dashboard',
                'key' => 'admin.dashboard'
            ],
            [
                'tr' => 'Toplam Kullanıcılar',
                'en' => 'Total Users',
                'key' => 'admin.totalUsers'
            ],
            [
                'tr' => 'Aktif Kullanıcılar',
                'en' => 'Active Users',
                'key' => 'admin.activeUsers'
            ],
            [
                'tr' => 'Toplam İşlemler',
                'en' => 'Total Transactions',
                'key' => 'admin.totalTransactions'
            ],
            [
                'tr' => 'Bekleyen',
                'en' => 'Pending',
                'key' => 'admin.pending'
            ],
            [
                'tr' => 'Toplam Destek Talepleri',
                'en' => 'Total Tickets',
                'key' => 'admin.totalTickets'
            ],
            [
                'tr' => 'Açık',
                'en' => 'Open',
                'key' => 'admin.open'
            ],
            [
                'tr' => 'Toplam Para Çekme',
                'en' => 'Total Withdrawals',
                'key' => 'admin.totalWithdrawals'
            ],
            [
                'tr' => 'Son Aktiviteler',
                'en' => 'Recent Activity',
                'key' => 'admin.recentActivity'
            ],
            [
                'tr' => 'Hızlı İşlemler',
                'en' => 'Quick Actions',
                'key' => 'admin.quickActions'
            ],
            [
                'tr' => 'Kullanıcıları Yönet',
                'en' => 'Manage Users',
                'key' => 'admin.manageUsers'
            ],
            [
                'tr' => 'İşlemleri Yönet',
                'en' => 'Manage Transactions',
                'key' => 'admin.manageTransactions'
            ],
            [
                'tr' => 'Destek Taleplerini Yönet',
                'en' => 'Manage Tickets',
                'key' => 'admin.manageTickets'
            ],
            [
                'tr' => 'Logları Görüntüle',
                'en' => 'View Logs',
                'key' => 'admin.viewLogs'
            ],
            [
                'tr' => 'Tamamlandı',
                'en' => 'Completed',
                'key' => 'status.completed'
            ],
            [
                'tr' => 'Bekliyor',
                'en' => 'Pending',
                'key' => 'status.pending'
            ],
            [
                'tr' => 'Para Çekme İşlemleri',
                'en' => 'Withdrawal Transactions',
                'key' => 'admin.withdrawals'
            ],
            [
                'tr' => 'Para Çekme Talebi',
                'en' => 'Withdrawal Request',
                'key' => 'withdrawal.request.title'
            ],
            [
                'tr' => 'Miktar',
                'en' => 'Amount',
                'key' => 'withdrawal.request.amount'
            ],
            [
                'tr' => 'Banka Hesabı',
                'en' => 'Bank Account',
                'key' => 'withdrawal.request.bankAccount'
            ],
            [
                'tr' => 'Gönder',
                'en' => 'Submit',
                'key' => 'withdrawal.request.submit'
            ],
            [
                'tr' => 'Para çekme talebi başarıyla oluşturuldu',
                'en' => 'Withdrawal request created successfully',
                'key' => 'withdrawal.requestCreated'
            ],
            [
                'tr' => 'Para çekme durumu güncellendi',
                'en' => 'Withdrawal status updated',
                'key' => 'withdrawal.statusUpdated'
            ],
            [
                'tr' => 'Onaylandı',
                'en' => 'Approved',
                'key' => 'withdrawal.status.approved'
            ],
            [
                'tr' => 'Reddedildi',
                'en' => 'Rejected',
                'key' => 'withdrawal.status.rejected'
            ],
            [
                'tr' => 'İşlem Başarılı',
                'en' => 'Transaction Successful',
                'key' => 'transaction.success'
            ],
            [
                'tr' => 'İşlem Başarısız',
                'en' => 'Transaction Failed',
                'key' => 'transaction.failed'
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