<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserIban extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'bank_id',
        'iban',
        'title',
        'is_default',
        'is_active'
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'is_active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // IBAN formatını düzenle
    public function setIbanAttribute($value)
    {
        $this->attributes['iban'] = strtoupper(preg_replace('/[^A-Z0-9]/', '', $value));
    }

    // IBAN formatını görüntüle
    public function getFormattedIbanAttribute(): string
    {
        $iban = $this->attributes['iban'];
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
