<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Language extends Model
{
    protected $table = 'dil';
    protected $primaryKey = 'dil_id';
    public $timestamps = false;

    protected $fillable = [
        'dil_baslik', 'dil_resim', 'dil_kod', 'dil_varsayilan', 'dil_durum'
    ];
}
