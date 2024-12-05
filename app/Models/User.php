<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Log;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Spatie\Permission\Traits\HasRoles;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property string|null $password
 * @property string|null $google_id
 * @property string|null $facebook_id
 * @property string|null $github_id
 * @property string|null $avatar
 * @property string|null $google_refresh_token
 * @property \DateTime|null $last_login_at
 * @property bool $social_login
 * @property string|null $last_social_login
 * @property bool $social_registration
 * @property bool $is_active
 * @property string|null $remember_token
 * @property \DateTime|null $email_verified_at
 * @property \DateTime $created_at
 * @property \DateTime $updated_at
 *
 * @property-read Collection|Transaction[] $transactions
 * @property-read Collection|Ticket[] $tickets
 * @property-read UserSetting|null $settings
 * @property-read Collection|Role[] $roles
 *
 * @method HasMany transactions()
 * @method HasMany tickets()
 * @method HasOne settings()
 * @method BelongsToMany roles()
 */
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles;

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
        'avatar',
        'google_refresh_token',
        'last_login_at',
        'facebook_id',
        'github_id',
        'social_login',
        'last_social_login',
        'social_registration',
        'is_active'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'google_refresh_token'
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'social_login' => 'boolean',
        'social_registration' => 'boolean',
        'is_active' => 'boolean',
    ];

    protected $attributes = [
        'is_active' => true,
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
    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
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
        if (is_string($role)) {
            $role = Role::where('name', $role)->firstOrFail();
        }
        $this->roles()->syncWithoutDetaching($role);
    }

    public function removeRole($role)
    {
        if (is_string($role)) {
            $role = Role::where('name', $role)->firstOrFail();
        }
        $this->roles()->detach($role);
    }

    /**
     * Get user's transactions
     *
     * @return HasMany<Transaction>
     */
    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }

    /**
     * Get user's tickets
     *
     * @return HasMany<Ticket>
     */
    public function tickets(): HasMany
    {
        return $this->hasMany(Ticket::class);
    }

    public function storedPassword()
    {
        return $this->hasOne(UserPassword::class);
    }

    public function ibans()
    {
        return $this->hasMany(UserIban::class);
    }

    /**
     * Get the user's crypto addresses.
     */
    public function cryptos(): HasMany
    {
        return $this->hasMany(UserCrypto::class);
    }
}
