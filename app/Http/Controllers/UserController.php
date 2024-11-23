<?php

namespace App\Http\Controllers;

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

class UserController extends Controller
{
    protected $helpers;

    public function __construct(Helpers $helpers)
    {
        $this->helpers = $helpers;
    }

    public function create()
    {
        return Inertia::render('Users/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $userRole = Role::where('name', 'user')->first();
        if ($userRole) {
            $user->roles()->sync([$userRole->id]);
        }

        return redirect()->route('admin.users.index')
            ->with('success', translate('users.createSuccess'));
    }

    public function index()
    {
        return Inertia::render('Users/Index', [
            'users' => User::with('roles')->get()->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'created_at' => $user->created_at,
                    'roles' => $user->roles->map(function ($role) {
                        return [
                            'id' => $role->id,
                            'name' => $role->name
                        ];
                    })
                ];
            })
        ]);
    }

    public function edit(User $user)
    {
        return Inertia::render('Users/Edit', [
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
            ->with('success', 'Kullanıcı başarıyla silindi.');
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
        return Inertia::render('Users/ResetPassword', [
            'user' => $user->only(['id', 'name', 'email'])
        ]);
    }

    public function resetPassword(Request $request, User $user)
    {
        $validated = $request->validate([
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user->update([
            'password' => Hash::make($validated['password'])
        ]);

        try {
            Mail::to($user->email)->send(new PasswordResetNotification($user));
        } catch (\Exception $e) {
            // E-posta gönderilemese bile şifre değişikliği başarılı
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
} 