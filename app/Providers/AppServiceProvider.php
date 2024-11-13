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
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

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
        
        // Session kontrolü
        $this->app->bind('session.handler', function ($app) {
            return new \Illuminate\Session\DatabaseSessionHandler(
                $app['db']->connection(),
                'sessions',
                config('session.lifetime', 120),
                $app
            );
        });

        // Inertia paylaşımları
        Inertia::share([
            'locale' => fn () => app()->getLocale(),
            'translations' => function () {
                try {
                    $locale = app()->getLocale();
                    return cache()->remember("translations_{$locale}", now()->addHours(24), function () use ($locale) {
                        $translations = [];
                        foreach (glob(lang_path($locale.'/*.php')) as $file) {
                            $name = basename($file, '.php');
                            $translations[$name] = require $file;
                        }
                        return collect($translations)->flatMap(function ($item, $key) {
                            return collect($item)->flatMap(function ($value, $nestedKey) use ($key) {
                                return ["{$key}.{$nestedKey}" => $value];
                            });
                        })->toArray();
                    });
                } catch (\Exception $e) {
                    Log::error('Translation error:', ['error' => $e->getMessage()]);
                    return [];
                }
            },
            'auth.user' => function () {
                if (Auth::check()) {
                    $user = Auth::user();
                    return $user ? [
                        'id' => $user->id,
                        'name' => $user->name, 
                        'email' => $user->email
                    ] : null;
                }
                return null;
            },
        ]);

        if (config('app.debug')) {
            DB::listen(function ($query) {
                Log::info('SQL Query:', [
                    'sql' => $query->sql,
                    'bindings' => $query->bindings,
                    'time' => $query->time
                ]);
            });
        }
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
