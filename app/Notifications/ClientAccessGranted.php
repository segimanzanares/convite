<?php

namespace App\Notifications;

use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Notifications\Messages\MailMessage;

/**
 * Sends a client user a link to choose their password, when an admin creates their account or resends it from the
 * panel, so its wording fits both. The link goes through Fortify's password reset flow, so it expires like any reset
 * link.
 */
class ClientAccessGranted extends ResetPassword
{
    /**
     * Get the mail representation of the notification.
     */
    public function toMail(mixed $notifiable): MailMessage
    {
        return (new MailMessage)
            ->subject(__('Your access to the :app panel', ['app' => config('app.name')]))
            ->greeting(__('Hello :name!', ['name' => $notifiable->name]))
            ->line(__('You have an account in the :app panel, where you can manage the guests and RSVPs of your invitation. Use the button below to choose your password.', ['app' => config('app.name')]))
            ->action(__('Choose my password'), $this->resetUrl($notifiable))
            ->line(__('This link will expire in :count minutes. After that, you can request a new one with "Forgot password?" on the sign-in page.', [
                'count' => config('auth.passwords.'.config('auth.defaults.passwords').'.expire'),
            ]));
    }
}
