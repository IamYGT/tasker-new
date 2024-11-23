<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

/**
 * @property int $id
 * @property int $user_id
 * @property string $subject
 * @property string $status
 * @property string $priority
 * @property \DateTime $created_at
 * @property \DateTime $updated_at
 * 
 * @property-read User $user
 * @property-read Collection|TicketMessage[] $messages
 * @property-read TicketMessage|null $lastMessage
 * 
 * @method BelongsTo user()
 * @method HasMany messages()
 * @method HasOne lastMessage()
 */
class Ticket extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'subject',
        'status',
        'priority'
    ];

    /**
     * Get the user that owns the ticket
     *
     * @return BelongsTo<User>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get ticket messages
     *
     * @return HasMany<TicketMessage>
     */
    public function messages(): HasMany
    {
        return $this->hasMany(TicketMessage::class);
    }

    /**
     * Get the latest message
     *
     * @return HasOne<TicketMessage>
     */
    public function lastMessage(): HasOne
    {
        return $this->hasOne(TicketMessage::class)->latest();
    }
} 