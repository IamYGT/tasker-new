<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;
use App\Models\LanguageWord;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;

class AuthenticatedSessionController extends Controller
{
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
            'errors' => session('errors') ? session('errors')->getBag('default')->getMessages() : (object)[],
            'flash' => [
                'message' => session('message'),
                'type' => session('type'),
            ],
        ]);
    }

    public function store(LoginRequest $request): RedirectResponse
    {
        try {
            $user = \App\Models\User::where('email', $request->email)->first();

            if (!$user) {
                return back()
                    ->with('message', $this->getTranslation('login.invalidEmail'))
                    ->with('type', 'error')
                    ->withInput($request->except('password'));
            }

            if (!Hash::check($request->password, $user->password)) {
                return back()
                    ->with('message', $this->getTranslation('login.invalidPassword'))
                    ->with('type', 'error')
                    ->withInput($request->except('password'));
            }

            if (isset($user->is_active) && $user->is_active === 0) {
                return back()
                    ->with('message', $this->getTranslation('login.accountDeactivated'))
                    ->with('type', 'warning')
                    ->withInput($request->except('password'));
            }

            Auth::login($user, $request->boolean('remember'));
            $request->session()->regenerate();

            return redirect()->intended(route('dashboard'))
                ->with('message', $this->getTranslation('login.welcomeBack'))
                ->with('type', 'success');

        } catch (\Exception $e) {
            Log::error('Login error: ' . $e->getMessage());
            return back()
                ->with('message', $this->getTranslation('login.generalError'))
                ->with('type', 'error')
                ->withInput($request->except('password'));
        }
    }

    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect('/')
            ->with('message', $this->getTranslation('login.loggedOut'))
            ->with('type', 'success');
    }

    private function getTranslation(string $key): string
    {
        return LanguageWord::where('kod', App::getLocale())
            ->where('anahtar', $key)
            ->first()?->deger ?? $key;
    }
}
