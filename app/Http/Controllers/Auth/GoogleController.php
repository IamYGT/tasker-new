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
            
            // Oturum durumunu kontrol et
            if (Auth::check()) {
                Log::info('Kullanıcı zaten giriş yapmış:', ['user_id' => Auth::id()]);
                return redirect()->route('dashboard')
                    ->with('info', 'Zaten giriş yapmış durumdasınız.');
            }

            // State token'ı oluştur ve session'a kaydet
            $state = Str::random(40);
            session(['google_auth_state' => $state]);
            
            Log::info('Google state oluşturuldu:', ['state' => $state]);

            return Socialite::driver('google')
                ->setScopes(['openid', 'email', 'profile'])
                ->with([
                    'prompt' => 'select_account consent',
                    'access_type' => 'offline',
                    'state' => $state
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

            // Session'dan state'i al
            $savedState = session('google_auth_state');
            $currentState = request('state');

            Log::info('State kontrolü:', [
                'saved_state' => $savedState,
                'current_state' => $currentState
            ]);

            // State kontrolü
            if (empty($savedState) || $savedState !== $currentState) {
                Log::warning('Google callback state uyuşmazlığı', [
                    'saved_state' => $savedState,
                    'current_state' => $currentState
                ]);
                
                session()->forget('google_auth_state');
                return redirect()->route('login')
                    ->with('error', 'Güvenlik doğrulaması başarısız oldu. Lütfen tekrar deneyin.');
            }

            // State'i temizle
            session()->forget('google_auth_state');

            try {
                // Google kullanıcı bilgilerini al
                $googleUser = Socialite::driver('google')->stateless()->user();
                
                Log::info('Google kullanıcı bilgileri alındı:', [
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'id' => $googleUser->id
                ]);

                // Email zorunluluğu kontrolü
                if (empty($googleUser->email)) {
                    throw ValidationException::withMessages([
                        'email' => ['Google hesabınızdan email bilgisi alınamadı.']
                    ]);
                }

                // Transaction başlat
                return DB::transaction(function () use ($googleUser) {
                    // Kullanıcıyı bul
                    $user = User::where('google_id', $googleUser->id)
                        ->orWhere('email', $googleUser->email)
                        ->first();

                    if ($user) {
                        // Mevcut kullanıcı güncelleme
                        $user->update([
                            'google_id' => $googleUser->id,
                            'name' => $googleUser->name,
                            'avatar' => $googleUser->avatar,
                            'google_refresh_token' => $googleUser->refreshToken,
                            'last_login_at' => now()
                        ]);

                        Log::info('Mevcut kullanıcı güncellendi:', ['user_id' => $user->id]);
                        
                        Auth::login($user, true);
                        return redirect()->intended('dashboard')
                            ->with('success', 'Google ile giriş başarılı!');
                    }

                    // Yeni kullanıcı oluştur
                    $newUser = User::create([
                        'name' => $googleUser->name,
                        'email' => $googleUser->email,
                        'google_id' => $googleUser->id,
                        'avatar' => $googleUser->avatar ?? null,
                        'password' => Hash::make(Str::random(32)),
                        'email_verified_at' => now(),
                        'google_refresh_token' => $googleUser->refreshToken,
                        'last_login_at' => now()
                    ]);

                    Log::info('Yeni kullanıcı oluşturuldu:', ['user_id' => $newUser->id]);

                    // Varsayılan ayarları ata
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
                Log::error('Google kullanıcı bilgileri alınamadı:', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                
                return redirect()->route('login')
                    ->with('error', 'Google bilgileri alınamadı. Lütfen tekrar deneyin.');
            }

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