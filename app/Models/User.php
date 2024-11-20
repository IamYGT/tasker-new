<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Log;
use Illuminate\Auth\Notifications\ResetPassword;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'google_id',
        'facebook_id',
        'github_id',
        'avatar',
        'google_refresh_token',
        'last_login_at',
        'social_login',
        'last_social_login',
        'social_registration',
        'role_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'google_refresh_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'last_login_at' => 'datetime',
        'password' => 'hashed',
        'social_login' => 'boolean',
        'social_registration' => 'boolean',
    ];

    public function sendPasswordResetNotification($token)
    {
        Log::info('Sending Password Reset Notification', ['email' => $this->email, 'token' => $token]);
        $this->notify(new ResetPassword($token));
    }

    /**
     * Kullanıcının ayarları ile ilişki
     */
    public function settings()
    {
        return $this->hasOne(UserSetting::class);
    }

    /**
     * Roles ilişkisini ekleyelim
     */
    public function roles()
    {
        return $this->belongsToMany(Role::class, 'role_user');
    }

    /**
     * Role kontrol metodları
     */
    public function hasRole($role)
    {
        return $this->roles()->where('name', $role)->exists();
    }

    public function hasAnyRole($roles)
    {
        return $this->roles()->whereIn('name', $roles)->exists();
    }

    public function assignRole($role)
    {
        try {
            if (is_string($role)) {
                $role = Role::where('name', $role)->firstOrFail();
            }
            $this->roles()->syncWithoutDetaching($role);
            return true;
        } catch (\Exception $e) {
            Log::error('Rol atama hatası:', [
                'user_id' => $this->id,
                'role' => $role,
                'error' => $e->getMessage()
            ]);
            return false;
        }
    }
}
