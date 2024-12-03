<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    // Status sabitleri
    const STATUS_PENDING = 'pending';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';

    // Type sabitleri
    const TYPE_WITHDRAWAL = 'withdrawal';
    const TYPE_DEPOSIT = 'deposit';
    const TYPE_TRANSFER = 'transfer';

    // Tüm statüsler
    const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_COMPLETED,
        self::STATUS_CANCELLED,
    ];

    // Tüm tipler
    const TYPES = [
        self::TYPE_WITHDRAWAL,
        self::TYPE_DEPOSIT,
        self::TYPE_TRANSFER,
    ];

    // Status çevirileri
    const STATUS_TRANSLATIONS = [
        self::STATUS_PENDING => 'Beklemede',
        self::STATUS_COMPLETED => 'Tamamlandı',
        self::STATUS_CANCELLED => 'İptal Edildi'
    ];

    protected $fillable = [
        'user_id',
        'amount',
        'type',
        'status',
        'description',
        'bank_account',
        'reference_id',
        'notes',
        'history'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'history' => 'json'
    ];

    // İlişkiler
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // İşlem geçmişini kaydetmek için yardımcı method
    public function addToHistory(string $messageKey, string $type = 'info', ?array $params = null): void
    {
        $history = $this->history ?? [];
        
        // Parametre değerlerini çevir
        if ($params) {
            foreach ($params as $key => $value) {
                if (in_array($key, ['old', 'new'])) {
                    $params[$key] = translate("status.{$value}");
                }
            }
        }

        $history[] = [
            'messageKey' => $messageKey, // Çeviri anahtarını sakla
            'params' => $params, // Parametreleri sakla
            'type' => $type,
            'date' => now()->toIso8601String(),
            'user' => auth()->user()->name ?? null
        ];
        
        $this->update(['history' => $history]);
    }
} 