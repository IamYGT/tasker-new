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
use App\Models\Role;


class FacebookController extends Controller
{
    public function redirectToFacebook()
    {
        try {
            Log::info('Facebook yönlendirme başlatılıyor...');
            
            if (Auth::check()) {
                return redirect()->route('dashboard')
                    ->with('info', 'Zaten giriş yapmış durumdasınız.');
            }

            return Socialite::driver('facebook')
                ->stateless()
                ->scopes(['email', 'public_profile'])
                ->with(['auth_type' => 'rerequest'])
                ->redirect();

        } catch (Exception $e) {
            Log::error('Facebook yönlendirme hatası:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->route('login')
                ->with('error', 'Facebook bağlantısında bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
        }
    }

    public function handleFacebookCallback()
    {
        try {
            Log::info('Facebook callback başladı');

            $facebookUser = Socialite::driver('facebook')
                ->stateless()
                ->user();
            
            Log::info('Facebook kullanıcı bilgileri alındı:', [
                'name' => $facebookUser->getName(),
                'email' => $facebookUser->getEmail(),
                'id' => $facebookUser->getId()
            ]);

            if (empty($facebookUser->getEmail())) {
                throw ValidationException::withMessages([
                    'email' => ['Facebook hesabınızdan email bilgisi alınamadı.']
                ]);
            }

            return DB::transaction(function () use ($facebookUser) {
                // Önce email ile kullanıcıyı ara
                $user = User::where('email', $facebookUser->getEmail())->first();

                // Eğer email ile kullanıcı bulunduysa
                if ($user) {
                    // Facebook ID'si henüz bağlı değilse, bağla
                    if (!$user->facebook_id) {
                        $user->update([
                            'facebook_id' => $facebookUser->getId(),
                            'last_login_at' => now()
                        ]);
                        
                        Log::info('Mevcut kullanıcıya Facebook bağlantısı eklendi:', [
                            'user_id' => $user->id,
                            'facebook_id' => $facebookUser->getId()
                        ]);
                    }

                    Auth::login($user, true);
                    return redirect()->intended('dashboard')
                        ->with('success', 'Facebook hesabınız başarıyla bağlandı!');
                }

                // Facebook ID ile kullanıcı ara
                $user = User::where('facebook_id', $facebookUser->getId())->first();

                if ($user) {
                    $user->update([
                        'last_login_at' => now()
                    ]);

                    Auth::login($user, true);
                    return redirect()->intended('dashboard')
                        ->with('success', 'Facebook ile giriş başarılı!');
                }

                // Yeni kullanıcı oluştur
                $newUser = DB::transaction(function () use ($facebookUser) {
                    $user = User::create([
                        'name' => $facebookUser->getName(),
                        'email' => $facebookUser->getEmail(),
                        'facebook_id' => $facebookUser->getId(),
                        'avatar' => $facebookUser->getAvatar(),
                        'password' => Hash::make(Str::random(32)),
                        'email_verified_at' => now(),
                        'last_login_at' => now(),
                        'social_login' => true
                    ]);

                    // Varsayılan kullanıcı rolünü ata
                    $userRole = Role::where('name', 'user')->first();
                    if ($userRole) {
                        $user->assignRole($userRole);
                    }

                    return $user;
                });

                Log::info('Yeni Facebook kullanıcısı oluşturuldu:', ['user_id' => $newUser->id]);

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
            Log::error('Facebook callback hatası:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->route('login')
                ->with('error', 'Facebook ile giriş yapılırken bir sorun oluştu. Lütfen tekrar deneyin.');
        }
    }
} 