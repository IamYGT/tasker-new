<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Withdrawal extends Model
{
    protected $fillable = [
        'user_id',
        'amount',
        'bank_account',
        'status',
        'processed_at',
        'notes'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'processed_at' => 'datetime',
    ];

    // Varsayılan değerler
    protected $attributes = [
        'status' => 'pending'
    ];

    // User ilişkisi
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Status sabitleri
    const STATUS_PENDING = 'pending';
    const STATUS_APPROVED = 'approved';
    const STATUS_REJECTED = 'rejected';
    const STATUS_COMPLETED = 'completed';
}
