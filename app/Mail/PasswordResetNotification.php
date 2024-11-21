<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use App\Models\User;

class PasswordResetNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $user;

    public function __construct(User $user)
    {
        $this->user = $user;
    }

    public function envelope()
    {
        return new \Illuminate\Mail\Mailables\Envelope(
            subject: translate('users.passwordResetSubject')
        );
    }

    public function content()
    {
        return new \Illuminate\Mail\Mailables\Content(
            markdown: 'emails.password-reset',
            with: [
                'user' => $this->user,
            ]
        );
    }
} 