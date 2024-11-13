<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Validation\Rules\Rule;

class PasswordController extends Controller
{
    /**
     * Update the user's password.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();
        
        $validated = $request->validateWithBag('updatePassword', [
            'password' => ['required', 'confirmed', Password::defaults()],
            'current_password' => [
                'required_if:social_login,false',
                'current_password',
            ],
        ]);

        $user->password = Hash::make($validated['password']);
        
        if ($user->social_login) {
            $user->social_login = false;
        }
        
        $user->save();

        return back()->with('status', 'password-updated');
    }
}
