<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class PasswordResetLinkController extends Controller
{
    /**
     * Display the password reset link request view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/ForgotPassword', [
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming password reset link request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status == Password::RESET_LINK_SENT) {
            $token = DB::table('password_reset_tokens')
                ->where('email', $request->email)
                ->value('token');
            
            // E-posta adresini de URL'ye ekleyin
            $resetUrl = route('password.reset', ['token' => $token, 'email' => $request->email]);
            
            // Burada e-posta gönderme işleminizi yapın ve $resetUrl'yi kullanın
            
            return back()->with('status', __($status));
        }

        return back()->withInput($request->only('email'))
                     ->withErrors(['email' => __($status)]);
    }
}
