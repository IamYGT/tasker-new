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
class GitHubController extends Controller
{
    public function redirectToGithub()
    {
        try {
            Log::info('GitHub yönlendirme başlatılıyor...');
            
            if (Auth::check()) {
                return redirect()->route('dashboard')
                    ->with('info', 'Zaten giriş yapmış durumdasınız.');
            }

            return Socialite::driver('github')
                ->scopes(['user:email'])
                ->redirect();

        } catch (Exception $e) {
            Log::error('GitHub yönlendirme hatası:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->route('login')
                ->with('error', 'GitHub bağlantısında bir sorun oluştu. Lütfen daha sonra tekrar deneyin.');
        }
    }

    public function handleGithubCallback()
    {
        try {
            Log::info('GitHub callback başladı');

            $githubUser = Socialite::driver('github')->user();
            
            Log::info('GitHub kullanıcı bilgileri alındı:', [
                'name' => $githubUser->getName(),
                'email' => $githubUser->getEmail(),
                'id' => $githubUser->getId()
            ]);

            return DB::transaction(function () use ($githubUser) {
                // Önce email ile kullanıcıyı ara
                $user = User::where('email', $githubUser->getEmail())->first();

                // Eğer email ile kullanıcı bulunduysa
                if ($user) {
                    // GitHub ID'si henüz bağlı değilse, bağla
                    if (!$user->github_id) {
                        $user->update([
                            'github_id' => $githubUser->getId(),
                            'last_login_at' => now()
                        ]);
                        
                        Log::info('Mevcut kullanıcıya GitHub bağlantısı eklendi:', [
                            'user_id' => $user->id,
                            'github_id' => $githubUser->getId()
                        ]);
                    }

                    Auth::login($user, true);
                    return redirect()->intended('dashboard')
                        ->with('success', 'GitHub hesabınız başarıyla bağlandı!');
                }

                // GitHub ID ile kullanıcı ara
                $user = User::where('github_id', $githubUser->getId())->first();

                if ($user) {
                    $user->update([
                        'last_login_at' => now()
                    ]);

                    Auth::login($user, true);
                    return redirect()->intended('dashboard')
                        ->with('success', 'GitHub ile giriş başarılı!');
                }

                // Yeni kullanıcı oluştur
                $newUser = DB::transaction(function () use ($githubUser) {
                    $user = User::create([
                        'name' => $githubUser->getName() ?? 'GitHub User',
                        'email' => $githubUser->getEmail(),
                        'github_id' => $githubUser->getId(),
                        'avatar' => $githubUser->getAvatar(),
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
            Log::error('GitHub callback hatası:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->route('login')
                ->with('error', 'GitHub ile giriş yapılırken bir sorun oluştu. Lütfen tekrar deneyin.');
        }
    }
} 