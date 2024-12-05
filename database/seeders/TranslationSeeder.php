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
