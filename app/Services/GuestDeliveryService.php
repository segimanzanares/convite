<?php

namespace App\Services;

use App\Jobs\SendGuestInvitation;
use App\Models\Guest;
use App\Models\Invitation;
use Illuminate\Validation\ValidationException;

/**
 * Sending guests their personalized link, by WhatsApp (a wa.me link the panel opens) or by queued email.
 */
class GuestDeliveryService
{
    /** Phone numbers with this many digits are local and get the default country code. */
    private const int LOCAL_PHONE_DIGITS = 10;

    /**
     * The message a guest gets with their link.
     */
    public function message(Guest $guest): string
    {
        return __("Hello :name! We are happy to share your invitation to :title. Open it to see the details and confirm your attendance:\n:url", [
            'name' => $guest->name,
            'title' => $guest->invitation->title,
            'url' => $guest->url(),
        ]);
    }

    /**
     * A wa.me link that opens WhatsApp with the message ready to send: to the guest's phone, or to a contact the
     * sender picks when the guest has none.
     */
    public function whatsappUrl(Guest $guest): string
    {
        $phone = $this->whatsappPhone($guest->phone);

        return 'https://wa.me/'.($phone ?? '').'?text='.rawurlencode($this->message($guest));
    }

    /**
     * Guests may only be sent a published invitation: the link of a draft or an archived one does not open for them.
     *
     * @throws ValidationException when the invitation is not published.
     */
    public function ensureSendable(Invitation $invitation): void
    {
        if (! $invitation->isPublished()) {
            throw ValidationException::withMessages([
                'invitation' => __('The invitation must be published before it is sent to the guests.'),
            ]);
        }
    }

    /**
     * Record that the guest was sent their invitation, keeping the latest time when it is sent again.
     */
    public function markSent(Guest $guest): void
    {
        $guest->forceFill(['sent_at' => now()])->save();
    }

    /**
     * Queue the invitation email to one guest.
     *
     * @throws ValidationException when the invitation is not published or the guest has no email address.
     */
    public function email(Guest $guest): void
    {
        $this->ensureSendable($guest->invitation);

        if (blank($guest->email)) {
            throw ValidationException::withMessages([
                'email' => __(':name has no email address.', ['name' => $guest->name]),
            ]);
        }

        SendGuestInvitation::dispatch($guest);
    }

    /**
     * Queue the invitation email to every guest with an email address who was not sent their invitation yet.
     *
     * @return int How many emails were queued.
     *
     * @throws ValidationException when the invitation is not published.
     */
    public function emailPending(Invitation $invitation): int
    {
        $this->ensureSendable($invitation);

        $guests = $invitation->guests()->whereNull('sent_at')->whereNotNull('email')->where('email', '!=', '')->get();

        $guests->each(fn (Guest $guest) => SendGuestInvitation::dispatch($guest));

        return $guests->count();
    }

    /**
     * The phone number in the international format wa.me expects (digits only), or null without one. Ten-digit
     * numbers are taken as local and get the default country code.
     */
    private function whatsappPhone(?string $phone): ?string
    {
        $digits = preg_replace('/\D+/', '', (string) $phone);

        if ($digits === '') {
            return null;
        }

        return strlen($digits) === self::LOCAL_PHONE_DIGITS
            ? config('convite.default_phone_country_code').$digits
            : $digits;
    }
}
