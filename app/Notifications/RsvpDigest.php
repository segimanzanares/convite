<?php

namespace App\Notifications;

use App\Models\Invitation;
use App\Models\User;
use App\Services\RsvpDigestService;
use App\Services\RsvpService;
use Carbon\CarbonImmutable;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

/**
 * Tells a client user who answered their invitation on a given day, with the invitation's running totals.
 */
class RsvpDigest extends Notification implements ShouldQueue
{
    use Queueable;

    /** The most answers listed in the email; the rest are counted and left for the panel. */
    public const int MAX_LISTED_ANSWERS = 25;

    public function __construct(public Invitation $invitation, public CarbonImmutable $day) {}

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(User $notifiable): MailMessage
    {
        $answers = app(RsvpDigestService::class)->answers($this->invitation, $this->day);
        $date = $this->day->locale(app()->getLocale())->translatedFormat('j \d\e F');

        return (new MailMessage)
            ->subject(__('RSVPs of :date: :title', ['date' => $date, 'title' => $this->invitation->title]))
            ->markdown('mail.rsvp-digest', [
                'name' => $notifiable->name,
                'title' => $this->invitation->title,
                'date' => $date,
                'answers' => $answers->take(self::MAX_LISTED_ANSWERS),
                'unlisted' => max(0, $answers->count() - self::MAX_LISTED_ANSWERS),
                'answerCount' => $answers->count(),
                'summary' => app(RsvpService::class)->summary($this->invitation),
                'url' => route('admin.invitations.rsvps.index', $this->invitation),
                'settingsUrl' => route('profile.edit'),
            ]);
    }
}
