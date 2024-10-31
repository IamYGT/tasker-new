<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Log;
use App\Models\Language;
use Illuminate\Support\Facades\Cache;

class LocaleMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        $locale = $this->determineLocale($request);
        $this->setLocale($locale);
        $this->shareSelectedLanguage($locale);

        return $next($request);
    }

    private function determineLocale(Request $request): string
    {
        $locale = $request->cookie('locale') ?? Session::get('locale') ?? config('app.locale');
        return (strlen($locale) > 10) ? config('app.locale') : $locale;
    }

    private function setLocale(string $locale): void
    {
        try {
            $availableLanguages = Cache::remember('available_languages', 60 * 24, function () {
                return Language::where('dil_durum', 1)->pluck('dil_kod')->toArray();
            });

            $locale = in_array($locale, $availableLanguages) ? $locale : config('app.locale');

            App::setLocale($locale);
            Session::put('locale', $locale);
            Cookie::queue('locale', $locale, 60 * 24 * 365);
        } catch (\Exception $e) {
            Log::error("Error in LocaleMiddleware: " . $e->getMessage());
            App::setLocale(config('app.locale'));
        }
    }

    private function shareSelectedLanguage(string $locale): void
    {
        try {
            $selectedLanguage = Cache::remember('selected_language_' . $locale, 60 * 24, function () use ($locale) {
                return Language::where('dil_kod', $locale)->first();
            });
            view()->share('secili_dil', $selectedLanguage);
        } catch (\Exception $e) {
            Log::error("Error in shareSelectedLanguage: " . $e->getMessage());
            view()->share('secili_dil', null);
        }
    }
}