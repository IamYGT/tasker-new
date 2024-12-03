<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Withdrawal extends Model
{
    use HasFactory;

    // Status sabitleri
    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS_COMPLETED = 'completed';

    // Tüm statüsler
    const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_APPROVED,
        self::STATUS_REJECTED,
        self::STATUS_COMPLETED,
    ];

    protected $fillable = [
        'user_id',
        'amount',
        'amount_usd',
        'exchange_rate',
        'bank_id',
        'bank_account',
        'reference_id',
        'status',
        'processed_at',
        'notes',
        'history'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'amount_usd' => 'decimal:2',
        'exchange_rate' => 'decimal:4',
        'processed_at' => 'datetime',
        'history' => 'json'
    ];

    // Varsayılan değerler
    protected $attributes = [
        'status' => self::STATUS_PENDING
    ];

    // User ilişkisi
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // İşlem geçmişini kaydetmek için yardımcı method
    public function addToHistory(string $messageKey, string $type = 'info', ?array $params = null): void
    {
        $history = $this->history ?? [];

        if ($params) {
            foreach ($params as $key => $value) {
                if (in_array($key, ['old', 'new'])) {
                    $params[$key] = translate("status.{$value}");
                }
            }
        }

        $history[] = [
            'messageKey' => $messageKey,
            'params' => $params,
            'type' => $type,
            'date' => now()->toIso8601String(),
            'user' => auth()->user()->name ?? null
        ];

        $this->update(['history' => $history]);
    }

    // IBAN formatını düzenle
    public function setBankAccountAttribute($value)
    {
        $this->attributes['bank_account'] = strtoupper(preg_replace('/[^A-Z0-9]/', '', $value));
    }

    // IBAN formatını görüntüle
    public function getFormattedIbanAttribute(): string
    {
        $iban = $this->bank_account;
        return trim(chunk_split($iban, 4, ' '));
    }

    // Banka bilgilerini al
    public function getBankDetailsAttribute(): ?array
    {
        $banksJson = file_get_contents(resource_path('js/Data/turkey_banks.json'));
        $banks = json_decode($banksJson, true)['banks'];

        return collect($banks)->firstWhere('id', $this->bank_id);
    }
}
