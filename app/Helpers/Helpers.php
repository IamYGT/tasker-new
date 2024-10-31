<?php

namespace App\Helpers;

use App\Models\LanguageWord;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\App;

class Helpers
{
    public function getTranslation(string $key): string
    {
        $locale = App::getLocale();
        $cacheKey = "translation_{$locale}_{$key}";

        return Cache::remember($cacheKey, 60 * 24, function () use ($key, $locale) {
            $translation = LanguageWord::where('anahtar', $key)
                ->where('kod', $locale)
                ->first();

            return $translation ? $translation->deger : $key;
        });
    }
}

if (!function_exists('translate')) {
    function translate($key)
    {
        return app(\App\Helpers\Helpers::class)->getTranslation($key);
    }
}