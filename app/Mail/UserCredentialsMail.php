<?php

namespace App\Mail;

use Illuminate\Mail\Mailable;

class UserCredentialsMail extends Mailable
{
    public $user;
    public $password;

    public function __construct($user, $password)
    {
        $this->user = $user;
        $this->password = $password;
    }

    public function build()
    {
        return $this->markdown('emails.user-credentials')
                    ->subject('Hesap Bilgileriniz');
    }
}
