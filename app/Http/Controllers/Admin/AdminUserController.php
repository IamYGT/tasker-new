<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use App\Mail\PasswordResetNotification;
use Illuminate\Support\Facades\Log;
use App\Models\Role;
use App\Helpers\Helpers;
use App\Helpers\PasswordEncryption;
use App\Models\UserPassword;
use App\Mail\UserCredentialsMail;

class AdminUserController extends Controller
{
    protected $helpers;

    public function __construct(Helpers $helpers)
    {
        $this->helpers = $helpers;
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        $user = User::create([
            'name' => $validatedData['name'],
            'email' => $validatedData['email'],
            'password' => Hash::make($validatedData['password']),
            'encrypted_plain_password' => PasswordEncryption::encrypt($validatedData['password']),
            'password_updated_at' => now()
        ]);

        $user->assignRole('user');

        return redirect()->route('admin.users.index')
            ->with('success', translate('users.createSuccess'));
    }

    public function index()
    {
        $users = User::with('roles')
            ->select('id', 'name', 'email', 'created_at', 'updated_at', 'encrypted_plain_password', 'password')
            ->get()
            ->map(function ($user) {
                $plainPassword = null;
                if ($user->encrypted_plain_password) {
                    try {
                        $plainPassword = PasswordEncryption::decrypt($user->encrypted_plain_password);
                    } catch (\Exception $e) {
                        Log::error('Şifre çözme hatası: ' . $e->getMessage());
                    }
                }

                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at,
                    'roles' => $user->roles,
                    'current_password' => $plainPassword,
                    'password_updated_at' => $user->updated_at,
                    'has_encrypted_password' => !empty($user->encrypted_plain_password)
                ];
            });

        return Inertia::render('Admin/Users/Index', [
            'users' => $users
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'is_active' => $user->is_active,
                'roles' => $user->roles,
            ],
            'availableRoles' => Role::orderBy('name')->get(),
        ]);
    }

    public function update(Request $request, User $user)
    {
        Log::info('Update request data:', $request->all()); // Debug için

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'role' => 'required|exists:roles,id',
            'is_active' => 'required|boolean',
        ]);

        Log::info('Validated data:', $validated); // Debug için

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'is_active' => $validated['is_active'],
        ]);

        $user->roles()->sync([$validated['role']]);

        return redirect()->route('admin.users.index')
            ->with('success', translate('users.updateSuccess'));
    }

    public function destroy(User $user)
    {
        $user->delete();
        return redirect()->route('admin.users.index')
            ->with('success', translate('users.deleteSuccess'));
    }

    public function autoResetPassword(User $user)
    {
        try {
            $newPassword = Str::random(10);
            $user->password = bcrypt($newPassword);
            $user->save();

            Mail::to($user->email)->send(new PasswordResetNotification($user));

            return back()->with('success', 'Kullanıcı şifresi başarıyla sıfırlandı ve mail gönderildi.');
        } catch (\Exception $e) {
            Log::error('Şifre sıfırlama hatası:', [
                'user_id' => $user->id,
                'error' => $e->getMessage()
            ]);
            return back()->with('error', 'Şifre sıfırlanırken bir hata oluştu.');
        }
    }

    public function resetPasswordForm(User $user)
    {
        return Inertia::render('Admin/Users/ResetPassword', [
            'user' => $user->only(['id', 'name', 'email'])
        ]);
    }

    public function resetPassword(Request $request, User $user)
    {
        $validated = $request->validate([
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user->update([
            'password' => Hash::make($validated['password']),
            'encrypted_plain_password' => PasswordEncryption::encrypt($validated['password'])
        ]);

        try {
            Mail::to($user->email)->send(new PasswordResetNotification($user));
        } catch (\Exception $e) {
            Log::error('Şifre sıfırlama e-postası gönderilemedi: ' . $e->getMessage());
        }

        if ($request->wantsJson()) {
            return response()->json([
                'message' => translate('users.resetPasswordSuccess')
            ]);
        }

        return redirect()->route('admin.users.index')
            ->with('success', translate('users.resetPasswordSuccess'));
    }

    public function assignRole(User $user, Request $request)
    {
        $request->validate([
            'role' => 'required|exists:roles,name'
        ]);

        $user->assignRole($request->role);

        return redirect()->back()->with('success', 'Rol başarıyla atandı.');
    }

    public function storePassword(Request $request)
    {
        try {
            $data = $request->validate([
                'password' => 'required|string',
                'email' => 'required|email'
            ]);

            // Kullanıcıyı e-posta ile bul
            $user = User::where('email', $data['email'])->first();

            if ($user) {
                // Şifreyi session'da sakla
                session()->put("user_{$user->id}_plain_password", $data['password']);

                // Sessizce devam et - JSON yanıtı döndürme
                return null;
            }

            // Kullanıcı bulunamazsa sessizce devam et
            return null;

        } catch (\Exception $e) {
            Log::error('Password store error:', ['error' => $e->getMessage()]);
            // Hata durumunda da sessizce devam et
            return null;
        }
    }

    public function sendCredentials(Request $request, $userId)
    {
        try {
            $user = User::findOrFail($userId);
            $password = Str::random(12);

            // Şifreyi güncelle ve şifrelenmiş halini sakla
            $user->update([
                'password' => Hash::make($password),
                'encrypted_plain_password' => PasswordEncryption::encrypt($password)
            ]);

            // Mail gönder
            Mail::to($user->email)->send(new UserCredentialsMail($user, $password));

            Log::info('Kullanıcı bilgileri mail olarak gönderildi', [
                'user_id' => $userId,
                'email' => $user->email
            ]);

            return back()->with('success', 'user.credentials.sent');

        } catch (\Exception $e) {
            Log::error('Mail gönderme hatası:', [
                'error' => $e->getMessage(),
                'user_id' => $userId,
                'trace' => $e->getTraceAsString()
            ]);

            return back()->with('error', 'user.credentials.error');
        }
    }
}
