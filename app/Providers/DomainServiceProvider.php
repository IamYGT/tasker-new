<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class DomainServiceProvider extends ServiceProvider
{
    public function register()
    {
        $this->app->singleton('domain', function ($app) {
            return new class {
                public function main()
                {
                    return config('app.domains.main');
                }
                
                public function app()
                {
                    return config('app.domains.app');
                }
                
                public function full()
                {
                    return config('app.domains.full');
                }
                
                public function url($path = '')
                {
                    return config('app.url') . ($path ? "/$path" : '');
                }
            };
        });
    }
} 