<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class LanguageWord extends Model
{


    protected $table = 'dil_kelimeler';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
      'name', 'anahtar', 'deger', 'kod'
    ];

    public function toSearchableArray()
    {
        return [
            'id' => $this->id,
            'anahtar' => $this->anahtar,
            'deger' => $this->deger,
            'kod' => $this->kod,
        ];
    }
}