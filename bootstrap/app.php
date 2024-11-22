<?php

require_once __DIR__ . '/../app/Helpers/Helpers.php';
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\LocaleMiddleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Global middleware'ler
        $middleware->use([
          
        ]);
        
        // Web middleware grubu
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        // Locale middleware
        $middleware->append(LocaleMiddleware::class);
        
        // Cookie şifreleme ayarları
        $middleware->encryptCookies(except: ['language', 'locale']);

        // Middleware alias'ları
        $middleware->alias([
            'role' => \App\Http\Middleware\CheckRole::class,
            'admin' => \App\Http\Middleware\AdminMiddleware::class,
        ]);

        // API middleware grubu
        $middleware->api(append: [
            // API middleware'leri buraya eklenebilir
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();
