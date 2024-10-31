<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cookie;
use App\Models\Language;
use Illuminate\Support\Facades\Cache;

class LanguageController extends Controller
{
    public function switchLanguage(Request $request, string $lang)
    {
        $availableLanguages = Cache::remember('available_languages', 60 * 24, function () {
            return Language::where('dil_durum', 1)->pluck('dil_kod')->toArray();
        });

        if (in_array($lang, $availableLanguages)) {
            App::setLocale($lang);
            session(['locale' => $lang]);
            Cookie::queue('locale', $lang, 60 * 24 * 365);

            // Önbelleği temizle
            Cache::forget('selected_language_' . App::getLocale());
            Cache::forget("translations_" . App::getLocale());
        }

        if ($request->wantsJson()) {
            return response()->json([
                'languages' => Language::where('dil_durum', 1)->get(),
                'secili_dil' => Language::where('dil_kod', App::getLocale())->first(),
            ]);
        }

        return redirect()->back();
    }
}
