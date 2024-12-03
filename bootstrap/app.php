<?php

require_once __DIR__ . '/../app/Helpers/Helpers.php';

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\{
    LocaleMiddleware,
    HandleInertiaRequests,
    CheckRole,
    AdminMiddleware,
    UserMiddleware,
    RedirectBasedOnRole,
    StorageAccessMiddleware,
    VerifyCsrfToken
};
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;
use App\Console\Commands\UpdateTransactionUsdAmounts;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withCommands([
        UpdateTransactionUsdAmounts::class
    ])
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \Illuminate\Cookie\Middleware\EncryptCookies::class,
            \Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse::class,
            \Illuminate\Session\Middleware\StartSession::class,
            \Illuminate\View\Middleware\ShareErrorsFromSession::class,
            VerifyCsrfToken::class,
            HandleInertiaRequests::class,
            AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Locale Middleware
        $middleware->append(LocaleMiddleware::class);

        // Şifrelenmeyecek Cookie'ler
        $middleware->encryptCookies(except: [
            'language',
            'locale'
        ]);

        // Middleware Alias Tanımlamaları
        $middleware->alias([
            'role' => CheckRole::class,
            'admin' => AdminMiddleware::class,
            'user' => UserMiddleware::class,
            'role.redirect' => RedirectBasedOnRole::class,
            'storage.access' => StorageAccessMiddleware::class
        ]);

        // API Middleware Grubu
        $middleware->api(append: [
            // API middleware'leri
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Exception handler'lar
    })->create();
