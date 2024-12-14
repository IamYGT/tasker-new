<?php

namespace App\Providers;

use Illuminate\Support\Facades\{
    Vite,
    Blade,
    View,
    App,
    Cache,
    Route,
    DB,
    Log,
    Auth
};
use Illuminate\Support\ServiceProvider;
use Inertia\Inertia;
use App\Models\Language;
use App\Helpers\PasswordEncryption;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        $this->registerSessionHandler();
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        PasswordEncryption::initialize();

        $this->configureVite();
        $this->configureBladeDirectives();
        $this->configureInertia();
        $this->configureLanguages();
        $this->configureSqlLogging();
    }

    /**
     * Session handler yapılandırması
     */
    private function registerSessionHandler(): void
    {
        $this->app->bind('session.handler', function ($app) {
            return new \Illuminate\Session\DatabaseSessionHandler(
                $app['db']->connection(),
                'sessions',
                config('session.lifetime', 120),
                $app
            );
        });
    }

    /**
     * Vite yapılandırması
     */
    private function configureVite(): void
    {
        Vite::prefetch(concurrency: 3);
    }

    /**
     * Blade direktifleri yapılandırması
     */
    private function configureBladeDirectives(): void
    {
        Blade::directive('translate', function ($expression) {
            return "<?php echo translate($expression); ?>";
        });
    }

    /**
     * Inertia paylaşımları yapılandırması
     */
    private function configureInertia(): void
    {
        Inertia::share([
            'locale' => fn() => app()->getLocale(),
            'translations' => fn() => $this->getTranslations(),
            'auth.user' => fn() => $this->getAuthUser(),
        ]);
    }

    /**
     * Dil yapılandırması
     */
    private function configureLanguages(): void
    {
        // Aktif dilleri önbellekle
        $languages = Cache::remember('active_languages', 60 * 24, function () {
            return Language::where('dil_durum', 1)->get();
        });

        // Varsayılan dili önbellekle
        $defaultLanguage = Cache::remember('default_language', 60 * 24, function () {
            return Language::where('dil_varsayilan', true)->first();
        });

        // Seçili dili önbellekle
        $selectedLanguage = Cache::remember(
            'selected_language_' . app()->getLocale(),
            60 * 24,
            function () use ($defaultLanguage) {
                return Language::where('dil_kod', app()->getLocale())->first() ?? $defaultLanguage;
            }
        );

        // View ile paylaş
        View::share('languages', $languages);
        View::share('secili_dil', $selectedLanguage);

        // Uygulama dilini ayarla
        $locale = request()->cookie('locale')
            ?? session('locale')
            ?? $defaultLanguage->dil_kod
            ?? config('app.locale');
        App::setLocale($locale);
    }

    /**
     * SQL loglarını yapılandır
     */
    private function configureSqlLogging(): void
    {
        if ($this->shouldLogSqlQueries()) {
            DB::listen(function ($query) {
                if ($query->time > 1000) {
                    Log::warning('Slow SQL Query:', [
                        'sql' => $query->sql,
                        'bindings' => $query->bindings,
                        'time' => $query->time
                    ]);
                }
            });
        }
    }

    /**
     * SQL loglaması yapılmalı mı kontrolü
     */
    private function shouldLogSqlQueries(): bool
    {
        return config('app.debug')
            && config('app.env') === 'local'
            && config('logging.sql_queries', false);
    }

    /**
     * Çevirileri getir
     */
    private function getTranslations(): array
    {
        try {
            $locale = app()->getLocale();
            return Cache::remember("translations_{$locale}", now()->addHours(24), function () use ($locale) {
                return collect(glob(lang_path($locale . '/*.php')))
                    ->mapWithKeys(function ($file) {
                        $name = basename($file, '.php');
                        return [$name => require $file];
                    })
                    ->flatMap(function ($translations, $group) {
                        return collect($translations)->flatMap(function ($translation, $key) use ($group) {
                            return ["{$group}.{$key}" => $translation];
                        });
                    })
                    ->toArray();
            });
        } catch (\Exception $e) {
            Log::error('Translation error:', ['error' => $e->getMessage()]);
            return [];
        }
    }

    /**
     * Kimlik doğrulaması yapılmış kullanıcıyı getir
     */
    private function getAuthUser(): ?array
    {
        if (!Auth::check()) {
            return null;
        }

        $user = Auth::user();
        return $user ? [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email
        ] : null;
    }
}
