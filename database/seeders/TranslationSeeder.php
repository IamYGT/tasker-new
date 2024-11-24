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
            // Ticket Detay Sayfası
            [
                'tr' => 'Destek Talebi',
                'en' => 'Support Ticket',
                'key' => 'ticket.ticket'
            ],
            [
                'tr' => 'Yanıtla',
                'en' => 'Reply',
                'key' => 'ticket.reply'
            ],
            [
                'tr' => 'Yanıtınızı yazın...',
                'en' => 'Type your reply...',
                'key' => 'ticket.typeYourReply'
            ],
            [
                'tr' => 'Yanıt Gönder',
                'en' => 'Send Reply',
                'key' => 'ticket.sendReply'
            ],
            [
                'tr' => 'Yanıt başarıyla gönderildi',
                'en' => 'Reply sent successfully',
                'key' => 'ticket.replySent'
            ],
            [
                'tr' => 'Kategori',
                'en' => 'Category',
                'key' => 'ticket.category'
            ],
            [
                'tr' => 'Öncelik',
                'en' => 'Priority',
                'key' => 'ticket.priority'
            ],
            [
                'tr' => 'Durum',
                'en' => 'Status',
                'key' => 'ticket.status'
            ],
            [
                'tr' => 'Oluşturulma Tarihi',
                'en' => 'Created At',
                'key' => 'ticket.createdAt'
            ],
            [
                'tr' => 'Son Yanıt',
                'en' => 'Last Reply',
                'key' => 'ticket.lastReply'
            ],
            [
                'tr' => 'Talep Sahibi',
                'en' => 'Ticket Owner',
                'key' => 'ticket.owner'
            ],
            [
                'tr' => 'Mesaj',
                'en' => 'Message',
                'key' => 'ticket.message'
            ],
            [
                'tr' => 'Yanıtlar',
                'en' => 'Replies',
                'key' => 'ticket.replies'
            ],
            
            // Genel Butonlar ve Mesajlar
            [
                'tr' => 'İptal',
                'en' => 'Cancel',
                'key' => 'common.cancel'
            ],
            [
                'tr' => 'Kaydet',
                'en' => 'Save',
                'key' => 'common.save'
            ],
            [
                'tr' => 'Düzenle',
                'en' => 'Edit',
                'key' => 'common.edit'
            ],
            [
                'tr' => 'Sil',
                'en' => 'Delete',
                'key' => 'common.delete'
            ],
            [
                'tr' => 'Görüntüle',
                'en' => 'View',
                'key' => 'common.view'
            ],
            [
                'tr' => 'İşlemler',
                'en' => 'Actions',
                'key' => 'common.actions'
            ],
            [
                'tr' => 'Başarılı',
                'en' => 'Success',
                'key' => 'common.success'
            ],
            [
                'tr' => 'Hata',
                'en' => 'Error',
                'key' => 'common.error'
            ],
            
            // Hata Mesajları
            [
                'tr' => 'Bir hata oluştu',
                'en' => 'An error occurred',
                'key' => 'errors.general'
            ],
            [
                'tr' => 'Bu alan zorunludur',
                'en' => 'This field is required',
                'key' => 'errors.required'
            ],
            [
                'tr' => 'Geçersiz değer',
                'en' => 'Invalid value',
                'key' => 'errors.invalid'
            ],

            // Ticket Durumları
            [
                'tr' => 'Açık',
                'en' => 'Open',
                'key' => 'ticket.status.open'
            ],
            [
                'tr' => 'Yanıtlandı',
                'en' => 'Answered',
                'key' => 'ticket.status.answered'
            ],
            [
                'tr' => 'Kapalı',
                'en' => 'Closed',
                'key' => 'ticket.status.closed'
            ],

            // Ticket Öncelikleri
            [
                'tr' => 'Düşük',
                'en' => 'Low',
                'key' => 'ticket.priority.low'
            ],
            [
                'tr' => 'Orta',
                'en' => 'Medium',
                'key' => 'ticket.priority.medium'
            ],
            [
                'tr' => 'Yüksek',
                'en' => 'High',
                'key' => 'ticket.priority.high'
            ],

            // Ticket Kategorileri
            [
                'tr' => 'Genel',
                'en' => 'General',
                'key' => 'ticket.category.general'
            ],
            [
                'tr' => 'Teknik',
                'en' => 'Technical',
                'key' => 'ticket.category.technical'
            ],
            [
                'tr' => 'Fatura',
                'en' => 'Billing',
                'key' => 'ticket.category.billing'
            ],
            [
                'tr' => 'Diğer',
                'en' => 'Other',
                'key' => 'ticket.category.other'
            ],

            // Ticket İşlem Mesajları
            [
                'tr' => 'Durum güncellendi',
                'en' => 'Status updated',
                'key' => 'ticket.statusUpdated'
            ],
            [
                'tr' => 'Yanıt gönderildi',
                'en' => 'Reply sent',
                'key' => 'ticket.replySent'
            ],
            [
                'tr' => 'Dosya(lar) eklendi',
                'en' => 'File(s) attached',
                'key' => 'ticket.filesAttached'
            ],

            // Ticket History Mesajları
            [
                'tr' => 'durumu {{old}} -> {{new}} olarak değiştirildi',
                'en' => 'status changed from {{old}} to {{new}}',
                'key' => 'ticket.statusChanged'
            ],
            [
                'tr' => 'yanıt verdi',
                'en' => 'replied',
                'key' => 'ticket.replied'
            ],
            [
                'tr' => 'destek talebi oluşturdu',
                'en' => 'created ticket',
                'key' => 'ticket.created'
            ],

            // Ticket Detay Sayfası
            [
                'tr' => 'Detaylar',
                'en' => 'Details',
                'key' => 'ticket.details'
            ],
            [
                'tr' => 'Dosya Ekle',
                'en' => 'Add Files',
                'key' => 'ticket.addFiles'
            ],
            [
                'tr' => 'Dosyalar',
                'en' => 'Attachments',
                'key' => 'ticket.attachments'
            ],
            [
                'tr' => 'Geçmiş',
                'en' => 'History',
                'key' => 'ticket.history'
            ],
            [
                'tr' => 'Yanıtınız',
                'en' => 'Your Reply',
                'key' => 'ticket.yourReply'
            ],

            // Ticket Liste Sayfası
            [
                'tr' => 'Tüm Durumlar',
                'en' => 'All Statuses',
                'key' => 'ticket.allStatuses'
            ],
            [
                'tr' => 'Tüm Öncelikler',
                'en' => 'All Priorities',
                'key' => 'ticket.allPriorities'
            ],
            [
                'tr' => 'Tüm Kategoriler',
                'en' => 'All Categories',
                'key' => 'ticket.allCategories'
            ],
            [
                'tr' => 'Destek Talebi Bulunamadı',
                'en' => 'No Tickets Found',
                'key' => 'ticket.noTickets'
            ],
            [
                'tr' => 'Henüz destek talebi oluşturulmamış veya filtrelere uygun talep bulunamadı.',
                'en' => 'No tickets have been created yet or no tickets match your filters.',
                'key' => 'ticket.noTicketsDescription'
            ],

            // İstatistikler
            [
                'tr' => 'Toplam Talepler',
                'en' => 'Total Tickets',
                'key' => 'stats.totalTickets'
            ],
            [
                'tr' => 'Açık Talepler',
                'en' => 'Open Tickets',
                'key' => 'stats.openTickets'
            ],
            [
                'tr' => 'Yanıtlanan Talepler',
                'en' => 'Answered Tickets',
                'key' => 'stats.answeredTickets'
            ],
            [
                'tr' => 'Yüksek Öncelikli',
                'en' => 'High Priority',
                'key' => 'stats.highPriority'
            ],

            // Genel Arayüz
            [
                'tr' => 'Filtreler',
                'en' => 'Filters',
                'key' => 'common.filters'
            ],
            [
                'tr' => 'Ara',
                'en' => 'Search',
                'key' => 'common.search'
            ],
            [
                'tr' => 'Gönderiliyor...',
                'en' => 'Sending...',
                'key' => 'common.sending'
            ],
            [
                'tr' => 'Gönder',
                'en' => 'Send',
                'key' => 'common.send'
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