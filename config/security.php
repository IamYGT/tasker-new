<?php

return [
    'headers' => [
        'Content-Security-Policy' => [
            'default-src' => ["'self'"],
            'script-src' => [
                "'self'",
                "'unsafe-inline'",
                "'unsafe-eval'",
                "'wasm-unsafe-eval'",
                "'inline-speculation-rules'",
                "https://fonts.bunny.net",
                "https://fonts.googleapis.com",
                "chrome-extension:",
            ],
            'style-src' => [
                "'self'",
                "'unsafe-inline'",
                "https://fonts.bunny.net",
                "https://fonts.googleapis.com",
            ],
            'font-src' => [
                "'self'",
                "https://fonts.bunny.net",
                "https://fonts.gstatic.com",
                "data:",
            ],
            'img-src' => [
                "'self'",
                "data:",
                "https:",
                "http:",
            ],
            'connect-src' => [
                "'self'",
                "wss:",
                "https:",
            ],
            'frame-src' => ["'self'"],
            'media-src' => ["'self'"],
            'object-src' => ["'none'"],
            'base-uri' => ["'self'"],
            'form-action' => ["'self'"],
        ],
        'X-Frame-Options' => 'SAMEORIGIN',
        'X-Content-Type-Options' => 'nosniff',
        'X-XSS-Protection' => '1; mode=block',
        'Referrer-Policy' => 'strict-origin-when-cross-origin',
        'Permissions-Policy' => 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=()',
    ],
]; 