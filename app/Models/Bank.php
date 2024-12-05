<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Bank extends Model
{
    protected $fillable = [
        'id',
        'name',
        'code',
        'swift',
        'logo',
        'is_active'
    ];

    // Primary key string olduğu için
    public $incrementing = false;
    protected $keyType = 'string';

    public function ibans()
    {
        return $this->hasMany(UserIban::class, 'bank_id', 'id');
    }
}
