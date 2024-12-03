<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Ticket extends Model
{
    protected $fillable = [
        'user_id',
        'subject',
        'message',
        'status',
        'priority',
        'category',
        'last_reply_at',
        'closed_at',
        'history'
    ];

    protected $casts = [
        'history' => 'array',
        'last_reply_at' => 'datetime',
        'closed_at' => 'datetime'
    ];

    const STATUSES = ['open', 'answered', 'closed'];
    const PRIORITIES = ['low', 'medium', 'high'];
    const CATEGORIES = ['general', 'technical', 'billing', 'other'];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function replies(): HasMany
    {
        return $this->hasMany(TicketMessage::class);
    }

    public function histories(): HasMany
    {
        return $this->hasMany(TicketHistory::class);
    }

    public function addToHistory(string $messageKey, string $type = 'info', ?array $params = null): void
    {
        $history = $this->history ?? [];

        $history[] = [
            'id' => count($history) + 1,
            'action' => $messageKey,
            'params' => $params,
            'type' => $type,
            'created_at' => now()->toIso8601String(),
            'user' => [
                'name' => request()->user()->name
            ]
        ];

        $this->update(['history' => $history]);

        $this->histories()->create([
            'user_id' => auth()->id(),
            'action' => $messageKey,
            'type' => $type,
            'params' => $params
        ]);
    }

    public function updateStatus(string $status): void
    {
        $oldStatus = $this->status;
        $this->update([
            'status' => $status,
            'last_reply_at' => now()
        ]);

        if ($oldStatus !== $status) {
            $this->addToHistory('ticket.statusChanged', 'status', [
                'from' => $oldStatus,
                'to' => $status
            ]);
        }
    }

    public function messages(): HasMany
    {
        return $this->hasMany(TicketMessage::class);
    }
}
