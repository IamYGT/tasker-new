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
    RedirectBasedOnRole
};
use Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Web Middleware Grubu
        $middleware->web(append: [
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
        ]);

        // API Middleware Grubu
        $middleware->api(append: [
            // API middleware'leri
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        // Exception handler'lar
    })->create();
