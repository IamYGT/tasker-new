<?php

namespace App\Services;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class LogService
{
    private const CRYPTO_CHANNEL = 'crypto';
    private const AUTH_CHANNEL = 'auth';
    private const ERROR_CHANNEL = 'error';

    public static function cryptoActivity(string $action, array $data = [], ?string $status = 'success'): void
    {
        $user = Auth::user();
        $context = [
            'user_id' => $user?->id,
            'email' => $user?->email,
            'action' => $action,
            'status' => $status,
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'data' => $data,
            'timestamp' => now()->toIso8601String(),
        ];

        Log::channel(self::CRYPTO_CHANNEL)->info("Crypto Activity: {$action}", $context);
    }

    public static function authActivity(string $action, array $data = []): void
    {
        $context = [
            'user_id' => Auth::id(),
            'email' => Auth::user()?->email,
            'action' => $action,
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'data' => $data,
            'timestamp' => now()->toIso8601String(),
        ];

        Log::channel(self::AUTH_CHANNEL)->info("Auth Activity: {$action}", $context);
    }

    public static function error(string $message, \Throwable $exception, array $context = []): void
    {
        $user = Auth::user();
        $errorContext = array_merge([
            'user_id' => $user?->id,
            'email' => $user?->email,
            'ip' => request()->ip(),
            'user_agent' => request()->userAgent(),
            'exception' => [
                'message' => $exception->getMessage(),
                'code' => $exception->getCode(),
                'file' => $exception->getFile(),
                'line' => $exception->getLine(),
                'trace' => $exception->getTraceAsString(),
            ],
            'timestamp' => now()->toIso8601String(),
        ], $context);

        Log::channel(self::ERROR_CHANNEL)->error($message, $errorContext);
    }
} 
