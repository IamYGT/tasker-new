<?php

namespace App\Helpers;

class PasswordEncryption
{
    private static string $encryptionKey;
    private static string $cipher = 'aes-256-cbc';

    public static function initialize()
    {
        self::$encryptionKey = config('app.key');
    }

    public static function encrypt(string $password): string
    {
        $ivLength = openssl_cipher_iv_length(self::$cipher);
        $iv = openssl_random_pseudo_bytes($ivLength);
        $encrypted = openssl_encrypt($password, self::$cipher, self::$encryptionKey, 0, $iv);
        return base64_encode($iv . $encrypted);
    }

    public static function decrypt(string $encryptedPassword): string
    {
        $data = base64_decode($encryptedPassword);
        $ivLength = openssl_cipher_iv_length(self::$cipher);
        $iv = substr($data, 0, $ivLength);
        $encrypted = substr($data, $ivLength);
        return openssl_decrypt($encrypted, self::$cipher, self::$encryptionKey, 0, $iv);
    }
}
