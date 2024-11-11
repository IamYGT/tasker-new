<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserSetting extends Model
{
    protected $fillable = [
        'user_id',
        'language',
        'timezone',
        'notifications_enabled',
        'preferences'
    ];

    protected $casts = [
        'notifications_enabled' => 'boolean',
        'preferences' => 'array'
    ];

    /**
     * Bu ayarların sahibi olan kullanıcı
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
} 