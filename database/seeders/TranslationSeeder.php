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

            // Ticket durumları için çeviriler
            [
                'key' => 'status.open',
                'tr' => 'Açık',
                'en' => 'Open'
            ],
            [
                'key' => 'status.answered',
                'tr' => 'Yanıtlandı',
                'en' => 'Answered'
            ],
            [
                'key' => 'status.closed',
                'tr' => 'Kapalı',
                'en' => 'Closed'
            ],

            // Ticket durumları için kısa çeviriler
            [
                'key' => 'ticket.status.open',
                'tr' => 'Açık',
                'en' => 'Open'
            ],
            [
                'key' => 'ticket.status.answered',
                'tr' => 'Yanıtlandı',
                'en' => 'Answered'
            ],
            [
                'key' => 'ticket.status.closed',
                'tr' => 'Kapalı',
                'en' => 'Closed'
            ],

            // Ticket durumları için açıklamalar
            [
                'key' => 'ticket.status.open.description',
                'tr' => 'Destek ekibinin yanıtı bekleniyor',
                'en' => 'Waiting for support team response'
            ],
            [
                'key' => 'ticket.status.answered.description',
                'tr' => 'Destek ekibi yanıtladı',
                'en' => 'Support team has responded'
            ],
            [
                'key' => 'ticket.status.closed.description',
                'tr' => 'Talep çözüldü ve kapatıldı',
                'en' => 'Request resolved and closed'
            ],

            // Aktivite mesajları için çeviriler
            [
                'key' => 'activity.transaction',
                'tr' => '{amount} tutarında işlem',
                'en' => 'Transaction of {amount}'
            ],
            [
                'key' => 'activity.ticket.created',
                'tr' => 'Destek talebi oluşturuldu',
                'en' => 'Support ticket created'
            ],
            [
                'key' => 'activity.withdrawal',
                'tr' => '{amount} tutarında çekim talebi',
                'en' => 'Withdrawal request of {amount}'
            ],

            // Son aktiviteler için çeviriler
            [
                'key' => 'dashboard.recentActivity',
                'tr' => 'Son Aktiviteler',
                'en' => 'Recent Activity'
            ],
            [
                'key' => 'dashboard.noRecentActivity',
                'tr' => 'Henüz aktivite yok',
                'en' => 'No recent activity'
            ],
            [
                'key' => 'dashboard.noRecentActivityDescription',
                'tr' => 'Yeni aktiviteler burada görüntülenecek',
                'en' => 'New activities will appear here'
            ],
            [
                'key' => 'common.viewAll',
                'tr' => 'Tümünü Gör',
                'en' => 'View All'
            ],

            // Ticket işlem çevirileri
            [
                'key' => 'ticket.actions.replied',
                'tr' => 'destek talebini yanıtladı',
                'en' => 'replied to the ticket'
            ],
            [
                'key' => 'ticket.actions.statusChanged',
                'tr' => 'durumu {from} -> {to} olarak değiştirildi',
                'en' => 'changed status from {from} to {to}'
            ],
            [
                'key' => 'ticket.actions.created',
                'tr' => 'destek talebi oluşturdu',
                'en' => 'created a ticket'
            ],
            [
                'key' => 'ticket.actions.priorityChanged',
                'tr' => 'önceliği {from} -> {to} olarak değiştirildi',
                'en' => 'changed priority from {from} to {to}'
            ],
            [
                'key' => 'ticket.actions.categoryChanged',
                'tr' => 'kategoriyi {from} -> {to} olarak değiştirildi',
                'en' => 'changed category from {from} to {to}'
            ],
            [
                'key' => 'ticket.noHistory',
                'tr' => 'Henüz işlem geçmişi bulunmuyor',
                'en' => 'No history available yet'
            ],
            [
                'key' => 'ticket.history',
                'tr' => 'İşlem Geçmişi',
                'en' => 'Ticket History'
            ],

            // Kullanıcı işlemleri için çeviriler
            [
                'key' => 'users.currentPassword',
                'tr' => 'Mevcut Şifre',
                'en' => 'Current Password'
            ],
            [
                'key' => 'users.noStoredPassword',
                'tr' => 'Şifre kaydedilmemiş',
                'en' => 'No stored password'
            ],
            [
                'key' => 'users.notAvailable',
                'tr' => 'Mevcut değil',
                'en' => 'Not available'
            ],
            [
                'key' => 'users.generateNewPassword',
                'tr' => 'Yeni şifre oluştur',
                'en' => 'Generate new password'
            ],
            [
                'key' => 'users.lastUpdated',
                'tr' => 'Son güncelleme',
                'en' => 'Last updated'
            ],
            [
                'key' => 'users.passwordNote',
                'tr' => 'Not: Şifreler güvenli bir şekilde saklanır ve sadece yetkili personel tarafından görüntülenebilir.',
                'en' => 'Note: Passwords are stored securely and can only be viewed by authorized personnel.'
            ],
            [
                'key' => 'password.weak',
                'tr' => 'Zayıf: En az 8 karakter',
                'en' => 'Weak: Minimum 8 characters'
            ],
            [
                'key' => 'password.medium',
                'tr' => 'Orta: Harf ve rakam içermeli',
                'en' => 'Medium: Must include letters and numbers'
            ],
            [
                'key' => 'password.strong',
                'tr' => 'Güçlü: Özel karakter içermeli',
                'en' => 'Strong: Must include special characters'
            ],
            [
                'key' => 'users.generatePassword',
                'tr' => 'Otomatik Şifre Oluştur',
                'en' => 'Generate Password'
            ],
            [
                'key' => 'users.passwordGenerated',
                'tr' => 'Güçlü şifre oluşturuldu',
                'en' => 'Strong password generated'
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
