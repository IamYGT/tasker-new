<?php

return [
    'x-frame-options' => 'SAMEORIGIN',
    'x-xss-protection' => '1; mode=block',
    'x-content-type-options' => 'nosniff',
    'referrer-policy' => 'strict-origin-when-cross-origin',
    'content-security-policy' => [
        'default-src' => ["'self'"],
        'script-src' => ["'self'", "'unsafe-inline'", "'unsafe-eval'", 'https://cdn.jsdelivr.net'],
        'style-src' => ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
        'img-src' => ["'self'", 'data:', 'https:'],
        'font-src' => ["'self'", 'https://fonts.gstatic.com'],
        'frame-src' => ["'self'"],
        'connect-src' => ["'self'"],
    ],
];
