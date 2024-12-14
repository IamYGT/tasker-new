<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class UserIban extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'bank_id',
        'iban',
        'title',
        'is_default',
        'is_active',
        'name',
        'surname'
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'is_active' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function bank()
    {
        return $this->belongsTo(Bank::class);
    }
}
