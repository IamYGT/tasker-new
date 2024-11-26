<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;


class TicketAttachment extends Model

{
    protected $fillable = [
        'ticket_message_id',
        'name',
        'path',
        'type',
        'size'
    ];

    protected $appends = ['url'];

    public function getUrlAttribute()
    {
        if (empty($this->path)) {
            Log::warning('Dosya path\'i bulunamadı', ['attachment_id' => $this->id]);
            return null;
        }

        try {
            if (!Storage::disk('public')->exists($this->path)) {
                Log::warning('Dosya bulunamadı', [
                    'attachment_id' => $this->id,
                    'path' => $this->path
                ]);
                return null;
            }

            return Storage::disk('public')->url($this->path);
        } catch (\Exception $e) {
            Log::error('Dosya URL oluşturma hatası:', [
                'attachment_id' => $this->id,
                'path' => $this->path,
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    public function message()
    {
        return $this->belongsTo(TicketMessage::class, 'ticket_message_id');
    }

    protected static function boot()
    {
        parent::boot();

        static::deleting(function ($attachment) {
            if ($attachment->path) {
                try {
                    Storage::disk('public')->delete($attachment->path);
                } catch (\Exception $e) {
                    Log::error('Dosya silme hatası: ' . $e->getMessage(), [
                        'path' => $attachment->path,
                        'error' => $e->getMessage()
                    ]);
                }
            }
        });
    }
} 