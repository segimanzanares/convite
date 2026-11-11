<?php

namespace App\Mail;

use App\Enums\PlanFeature;
use App\Models\Guest;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

/**
 * A guest's invitation by email, with their personalized link. Replies go to the client who bought the invitation,
 * so guests can write to the hosts. It is sent from the SendGuestInvitation job, which also marks the guest as sent.
 */
class GuestInvitationMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Guest $guest) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $client = $this->guest->invitation->client;

        return new Envelope(
            replyTo: $client?->email ? [new Address($client->email, $client->name)] : [],
            subject: __('Your invitation: :title', ['title' => $this->guest->invitation->title]),
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $invitation = $this->guest->invitation;
        $closesAt = $invitation->hasFeature(PlanFeature::OnlineRsvp) ? $invitation->rsvpClosesAt() : null;

        return new Content(
            markdown: 'mail.guest-invitation',
            with: [
                'name' => $this->guest->name,
                'title' => $invitation->title,
                'description' => $invitation->description,
                'url' => $this->guest->url(),
                'rsvpDeadline' => $closesAt?->locale(app()->getLocale())->translatedFormat('j \d\e F'),
            ],
        );
    }
}
