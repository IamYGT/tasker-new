<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Laravel\Socialite\Two\InvalidStateException;

class GoogleController extends Controller
{
    /**
     * Google'a yönlendirme işlemi
     */
    public function redirectToGoogle()
    {
        try {
            Log::info('Google yönlendirme başlatılıyor...');
            
            if (Auth::check()) {
                return redirect()->route('dashboard')
                    ->with('info', 'Zaten giriş yapmış durumdasınız.');
            }

            return Socialite::driver('google')
                ->with([
                    'scope' => ['openid', 'email', 'profile'],
                    'prompt' => 'select_account consent',
                    'access_type' => 'offline'
                ])
                ->redirect();

        } catch (Exception $e) {
            Log::error('Google yönlendirme hatası:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->route('login')
                ->with('error', 'Google bağlantısında bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
        }
    }

    /**
     * Google'dan dönen callback işlemi
     */
    public function handleGoogleCallback()
    {
        try {
            Log::info('Google callback başladı');

            $googleUser = Socialite::driver('google')->user();
            
            Log::info('Google kullanıcı bilgileri alındı:', [
                'name' => $googleUser->name,
                'email' => $googleUser->email,
                'id' => $googleUser->id
            ]);

            if (empty($googleUser->email)) {
                throw ValidationException::withMessages([
                    'email' => ['Google hesabınızdan email bilgisi alınamadı.']
                ]);
            }

            return DB::transaction(function () use ($googleUser) {
                // Önce email ile kullanıcıyı ara
                $user = User::where('email', $googleUser->email)->first();

                // Eğer email ile kullanıcı bulunduysa
                if ($user) {
                    // Google ID'si henüz bağlı değilse, bağla
                    if (!$user->google_id) {
                        $user->update([
                            'google_id' => $googleUser->id,
                            'google_refresh_token' => $googleUser->refreshToken,
                            'last_login_at' => now()
                        ]);
                        
                        Log::info('Mevcut kullanıcıya Google bağlantısı eklendi:', [
                            'user_id' => $user->id,
                            'google_id' => $googleUser->id
                        ]);
                    }

                    Auth::login($user, true);
                    return redirect()->intended('dashboard')
                        ->with('success', 'Google hesabınız başarıyla bağlandı!');
                }

                // Google ID ile kullanıcı ara
                $user = User::where('google_id', $googleUser->id)->first();

                if ($user) {
                    $user->update([
                        'google_refresh_token' => $googleUser->refreshToken,
                        'last_login_at' => now()
                    ]);

                    Auth::login($user, true);
                    return redirect()->intended('dashboard')
                        ->with('success', 'Google ile giriş başarılı!');
                }

                // Yeni kullanıcı oluştur
                $newUser = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'google_id' => $googleUser->id,
                    'avatar' => $googleUser->avatar,
                    'password' => Hash::make(Str::random(32)),
                    'email_verified_at' => now(),
                    'google_refresh_token' => $googleUser->refreshToken,
                    'last_login_at' => now(),
                    'social_login' => true
                ]);

                Log::info('Yeni Google kullanıcısı oluşturuldu:', ['user_id' => $newUser->id]);

                $newUser->settings()->create([
                    'language' => app()->getLocale(),
                    'timezone' => config('app.timezone'),
                    'notifications_enabled' => true
                ]);

                Auth::login($newUser, true);
                return redirect()->intended('dashboard')
                    ->with('success', 'Hesabınız başarıyla oluşturuldu!')
                    ->with('showWelcomeModal', true);
            });

        } catch (Exception $e) {
            Log::error('Google callback hatası:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->route('login')
                ->with('error', 'Google ile giriş yapılırken bir sorun oluştu. Lütfen tekrar deneyin.');
        }
    }
}
