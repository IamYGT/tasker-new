<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class ContentSecurityPolicy
{
    public function handle(Request $request, Closure $next)
    {
        $response = $next($request);

        $cspHeader = "default-src 'self'; "
            . "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com; "
            . "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            . "font-src 'self' https://fonts.gstatic.com; "
            . "img-src 'self' data: https:; "
            . "connect-src 'self' https://accounts.google.com; "
            . "frame-src 'self' https://accounts.google.com";

        $response->headers->set('Content-Security-Policy', $cspHeader);

        return $response;
    }
} 