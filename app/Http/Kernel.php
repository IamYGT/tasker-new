<?php

namespace App\Http;

use Illuminate\Foundation\Http\Kernel as HttpKernel;

class Kernel extends HttpKernel
{
    protected $middleware = [
        // Diğer middleware'ler...
        \App\Http\Middleware\ContentSecurityPolicy::class,
    ];
} 