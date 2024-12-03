<?php

namespace App\Helpers;

use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PasswordEncryption
{
    private static $cipher = 'aes-256-cbc';
    private static $key;

    public static function initialize()
    {
        $appKey = config('app.key');

        // base64: prefix'ini kaldır
        if (Str::startsWith($appKey, 'base64:')) {
            $appKey = substr($appKey, 7);
        }

        // Base64'ten decode et
        $decodedKey = base64_decode($appKey);

        // 32 byte'lık anahtar oluştur
        self::$key = hash('sha256', $decodedKey, true);

        Log::debug('Encryption key initialized', [
            'key_length' => strlen(self::$key),
            'cipher' => self::$cipher
        ]);
    }

    public static function encrypt($data)
    {
        try {
            self::initialize();

            // IV oluştur
            $ivLength = openssl_cipher_iv_length(self::$cipher);
            $iv = openssl_random_pseudo_bytes($ivLength);

            // Veriyi JSON'a çevir
            $jsonData = json_encode($data);
            if ($jsonData === false) {
                throw new \Exception('Failed to encode data: ' . json_last_error_msg());
            }

            // Şifrele
            $encrypted = openssl_encrypt(
                $jsonData,
                self::$cipher,
                self::$key,
                OPENSSL_RAW_DATA,
                $iv
            );

            if ($encrypted === false) {
                throw new \Exception('Encryption failed: ' . openssl_error_string());
            }

            // IV ve şifrelenmiş veriyi birleştir
            $combined = $iv . $encrypted;

            // Base64 ile kodla
            return base64_encode($combined);
        } catch (\Exception $e) {
            Log::error('Encryption error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    public static function decrypt($data)
    {
        try {
            self::initialize();

            // Base64'ten decode et
            $decoded = base64_decode($data);
            if ($decoded === false) {
                throw new \Exception('Invalid base64 data');
            }

            // IV'yi ayır
            $ivLength = openssl_cipher_iv_length(self::$cipher);
            $iv = substr($decoded, 0, $ivLength);
            $encrypted = substr($decoded, $ivLength);

            // Şifreyi çöz
            $decrypted = openssl_decrypt(
                $encrypted,
                self::$cipher,
                self::$key,
                OPENSSL_RAW_DATA,
                $iv
            );

            if ($decrypted === false) {
                throw new \Exception('Decryption failed: ' . openssl_error_string());
            }

            // JSON'dan decode et
            $result = json_decode($decrypted, true);
            if ($result === null && json_last_error() !== JSON_ERROR_NONE) {
                throw new \Exception('Failed to decode data: ' . json_last_error_msg());
            }

            return $result;
        } catch (\Exception $e) {
            Log::error('Decryption error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return null; // Hata durumunda null dön
        }
    }
}
