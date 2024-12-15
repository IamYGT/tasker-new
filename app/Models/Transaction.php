<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Http;

class Transaction extends Model
{
    use HasFactory;

    // Status sabitleri
    const STATUS_PENDING = 'pending';
    const STATUS_COMPLETED = 'completed';
    const STATUS_CANCELLED = 'cancelled';
    const STATUS_REJECTED = 'rejected';

    // Type sabitleri
    const TYPE_BANK_WITHDRAWAL = 'bank_withdrawal';
    const TYPE_CRYPTO_WITHDRAWAL = 'crypto_withdrawal';

    // Tüm statüsler
    const STATUSES = [
        self::STATUS_PENDING,
        self::STATUS_COMPLETED,
        self::STATUS_CANCELLED,
        self::STATUS_REJECTED,
    ];

    // Tüm tipler
    const TYPES = [
        self::TYPE_BANK_WITHDRAWAL,
        self::TYPE_CRYPTO_WITHDRAWAL,
    ];

    // Status çevirileri
    const STATUS_TRANSLATIONS = [
        self::STATUS_PENDING => 'Bekliyor',
        self::STATUS_COMPLETED => 'Tamamlandı',
        self::STATUS_CANCELLED => 'İptal Edildi',
        self::STATUS_REJECTED => 'Red Edildi'
    ];

    // Para birimi sabiti ekleyelim
    const CURRENCY = 'USD';

    protected $fillable = [
        'user_id',
        'amount',
        'amount_usd',
        'exchange_rate',
        'type',
        'status',
        'description',
        'bank_account',
        'bank_id',
        'reference_id',
        'processed_at',
        'notes',
        'history',
        'crypto_address',
        'crypto_network',
        'crypto_fee',
        'crypto_txid',
        'customer_name',
        'customer_surname',
        'customer_meta_id'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'amount_usd' => 'decimal:2',
        'exchange_rate' => 'decimal:4',
        'processed_at' => 'datetime',
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
    public function addToHistory(string $messageKey, string $type, ?array $params = null)
    {
        // Mevcut history'yi JSON'dan diziye çevir
        $history = $this->history ? json_decode($this->history, true) : [];

        // Eğer history geçerli bir dizi değilse, yeni bir dizi oluştur
        if (!is_array($history)) {
            $history = [];
        }

        // Parametre değerlerini çevir
        if ($params) {
            foreach ($params as $key => $value) {
                if (in_array($key, ['old', 'new'])) {
                    $params[$key] = translate("status.{$value}");
                }
            }
        }

        // Yeni history öğesini ekle
        $history[] = [
            'messageKey' => $messageKey, // Çeviri anahtarını sakla
            'params' => $params, // Parametreleri sakla
            'type' => $type,
            'date' => now()->toIso8601String(),
            'user' => auth()->user()->name ?? null
        ];

        // History'yi JSON olarak güncelle
        $this->update(['history' => json_encode($history)]);
    }

    // Kur dönüşümü için yardımcı method
    public function convertToUSD($amount)
    {
        // Exchange rate API'den güncel kur bilgisini al
        $exchangeRate = cache()->remember('usd_try_rate', 3600, function () {
            $response = Http::get('https://api.exchangerate-api.com/v4/latest/USD');
            return $response->json()['rates']['TRY'] ?? 30.0; // Fallback değeri
        });

        $this->exchange_rate = $exchangeRate;
        $this->amount_usd = $amount / $exchangeRate;

        return $this->amount_usd;
    }

    // İşlem oluşturulurken otomatik USD dönüşümü
    protected static function booted()
    {
        static::creating(function ($transaction) {
            $transaction->convertToUSD($transaction->amount);
        });

        static::updating(function ($transaction) {
            if ($transaction->isDirty('amount')) {
                $transaction->convertToUSD($transaction->amount);
            }
        });
    }

    // IBAN formatını düzenle
    public function setBankAccountAttribute($value)
    {
        if ($value) {
            $this->attributes['bank_account'] = strtoupper(preg_replace('/[^A-Z0-9]/', '', $value));
        }
    }

    // IBAN formatını görüntüle
    public function getFormattedIbanAttribute(): ?string
    {
        if (!$this->bank_account) return null;
        return trim(chunk_split($this->bank_account, 4, ' '));
    }

    // Banka bilgilerini al
    public function getBankDetailsAttribute(): ?array
    {
        if (!$this->bank_id) return null;

        $banksJson = file_get_contents(resource_path('js/Data/turkey_banks.json'));
        $banks = json_decode($banksJson, true)['banks'];

        return collect($banks)->firstWhere('id', $this->bank_id);
    }
}
