<?php

namespace App\Policies;

use App\Models\User;
use App\Models\UserCrypto;

class UserCryptoPolicy
{
    public function update(User $user, UserCrypto $crypto): bool
    {
        return $user->id === $crypto->user_id;
    }

    public function delete(User $user, UserCrypto $crypto): bool
    {
        return $user->id === $crypto->user_id;
    }
} 
