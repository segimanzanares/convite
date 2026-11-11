<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

/**
 * Welcomes a client user whose account an admin just created, with a link to choose their password. The link goes
 * through Fortify's password reset flow, so it expires like any reset link.
 */
class ClientAccessGranted extends ResetPassword
{
    /**
     * Get the mail representation of the notification.
     */
    public function toMail(mixed $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(__('Welcome to :app', ['app' => config('app.name')]))
            ->greeting(__('Hello :name!', ['name' => $notifiable->name]))
            ->line(__('We created your account in the :app panel, where you can manage the guests and RSVPs of your invitation.', ['app' => config('app.name')]))
            ->action(__('Choose my password'), $this->resetUrl($notifiable))
            ->line(__('This link will expire in :count minutes. After that, you can request a new one with "Forgot password?" on the sign-in page.', [
                'count' => config('auth.passwords.'.config('auth.defaults.passwords').'.expire'),
            ]));
    }
}
