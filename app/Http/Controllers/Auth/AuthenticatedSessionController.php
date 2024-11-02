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

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        try {
            $request->authenticate();
        } catch (\Illuminate\Validation\ValidationException $e) {
            $user = \App\Models\User::where('email', $request->email)->first();
            
            if (!$user) {
                return back()->withErrors([
                    'email' => $this->getTranslation('login.invalidEmail'),
                ])->onlyInput('email');
            } else {
                return back()->withErrors([
                    'password' => $this->getTranslation('login.invalidPassword'),
                ])->onlyInput('email');
            }
        }

        $request->session()->regenerate();

        return redirect()->intended(route('dashboard', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }

    private function getTranslation(string $key): string
    {
        $locale = App::getLocale();
        $translation = LanguageWord::where('kod', $locale)
            ->where('anahtar', $key)
            ->first();

        return $translation ? $translation->deger : $key;
    }
}
