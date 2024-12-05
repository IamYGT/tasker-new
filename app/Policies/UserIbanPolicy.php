<?php

namespace App\Policies;

use App\Models\User;
use App\Models\UserIban;

class UserIbanPolicy
{
    public function update(User $user, UserIban $iban): bool
    {
        return $user->id === $iban->user_id;
    }

    public function delete(User $user, UserIban $iban): bool
    {
        return $user->id === $iban->user_id;
    }
}
