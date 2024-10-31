<?php

namespace App\Providers;

use Illuminate\Support\Facades\Vite;
use Illuminate\Support\ServiceProvider;
use App\Models\Language;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Cache;
use Inertia\Inertia;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //
    }

    public function boot(): void
    {
        Vite::prefetch(concurrency: 3);
        $this->configureBladeDirectives();
        $this->shareLanguages();
        $this->setApplicationLocale();
        Inertia::share([
            'locale' => function () {
                return App::getLocale();
            },
            'translations' => function () {
                $locale = App::getLocale();
                $translations = cache()->remember("translations_{$locale}", now()->addHours(24), function () use ($locale) {
                    return collect(trans('*', [], $locale))->flatMap(function ($item, $key) {
                        return collect($item)->flatMap(function ($value, $nestedKey) use ($key) {
                            return ["{$key}.{$nestedKey}" => $value];
                        });
                    })->toArray();
                });
                return $translations;
            },
        ]);
    }

    private function configureBladeDirectives(): void
    {
        Blade::directive('translate', function ($expression) {
            return "<?php echo translate($expression); ?>";
        });
    }

    private function shareLanguages(): void
    {
        $languages = Cache::remember('active_languages', 60 * 24, function () {
            return Language::where('dil_durum', 1)->get();
        });

        $selectedLanguage = Cache::remember('selected_language_' . app()->getLocale(), 60 * 24, function () {
            return Language::where('dil_kod', app()->getLocale())->first();
        });

        View::share('languages', $languages);
        View::share('secili_dil', $selectedLanguage);
    }

    private function setApplicationLocale(): void
    {
        $locale = request()->cookie('locale') ?? session('locale') ?? config('app.locale');
        App::setLocale($locale);
    }
}
