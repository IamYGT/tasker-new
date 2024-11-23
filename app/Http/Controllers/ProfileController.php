<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return redirect()->route('login');
            }

            $sessionData = [
                'mustVerifyEmail' => $user instanceof MustVerifyEmail,
                'status' => session('status'),
                'socialLogin' => (bool)$user->social_login,
                'hasPassword' => !empty($user->password),
                'connectedAccounts' => [],
            ];

            session(['profile_data' => $sessionData]);

            return Inertia::render('Profile/Edit', $sessionData);

        } catch (\Exception $e) {
            Log::error('Profile edit error:', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => $request->user()?->id
            ]);
            
            return redirect()->route('dashboard')
                ->with('error', 'Profil sayfası yüklenirken bir hata oluştu.');
        }
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public function info()
    {
        return Inertia::render('Profile/Info', [
            'user' => Auth::user(),
            'settings' => Auth::user()->settings,
        ]);
    }
}
