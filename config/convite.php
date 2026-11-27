<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Guest Data Retention
    |--------------------------------------------------------------------------
    |
    | Guests and RSVPs of an invitation are deleted this many days after its
    | event date by the guests:purge command, which runs daily.
    |
    */

    'guest_retention_days' => (int) env('CONVITE_GUEST_RETENTION_DAYS', 30),

    /*
    |--------------------------------------------------------------------------
    | Uploads Retention
    |--------------------------------------------------------------------------
    |
    | The photos, music and live gallery of an archived invitation are deleted
    | this many days after its event date by the invitations:purge-uploads
    | command, which runs daily.
    |
    */

    'uploads_retention_days' => (int) env('CONVITE_UPLOADS_RETENTION_DAYS', 7),

    /*
    |--------------------------------------------------------------------------
    | Open RSVP Form
    |--------------------------------------------------------------------------
    |
    | The most people (the person answering plus their companions) a single
    | answer through the open, tokenless RSVP form may confirm.
    |
    */

    'open_rsvp_max_seats' => (int) env('CONVITE_OPEN_RSVP_MAX_SEATS', 5),

    /*
    |--------------------------------------------------------------------------
    | Default Phone Country Code
    |--------------------------------------------------------------------------
    |
    | Guests' phone numbers with ten digits are taken as local and get this
    | country code when the panel opens WhatsApp to send their invitation.
    |
    */

    'default_phone_country_code' => env('CONVITE_DEFAULT_PHONE_COUNTRY_CODE', '52'),

    /*
    |--------------------------------------------------------------------------
    | Live Gallery
    |--------------------------------------------------------------------------
    |
    | The most photos the guests of one event may share in its live gallery,
    | so a link that leaks cannot fill the disk.
    |
    */

    'live_gallery_max_photos' => (int) env('CONVITE_LIVE_GALLERY_MAX_PHOTOS', 1000),

    /*
    |--------------------------------------------------------------------------
    | Wishes Book
    |--------------------------------------------------------------------------
    |
    | The wishes book keeps taking messages until the end of this many days
    | after the event, and takes at most this many per invitation, so a link
    | that leaks cannot flood it.
    |
    */

    'wishes_days_after_event' => (int) env('CONVITE_WISHES_DAYS_AFTER_EVENT', 7),

    'wishes_max_messages' => (int) env('CONVITE_WISHES_MAX_MESSAGES', 1000),

    /*
    |--------------------------------------------------------------------------
    | Referral Program
    |--------------------------------------------------------------------------
    |
    | Every client has a referral code to share. Whoever opens the landing
    | page with it (?ref=CODE) is offered this discount, and the code is
    | remembered in a cookie for this many days so it reaches WhatsApp even
    | if they come back later. The admin applies the discount on the order.
    |
    | Turning the program off hides it from the landing page, the invitations
    | and the panel, and new orders can no longer be referrals. The codes and
    | the referrers of past orders are kept, so turning it back on restores it.
    |
    */

    'referrals_enabled' => (bool) env('CONVITE_REFERRALS_ENABLED', true),

    'referral_discount_percent' => (int) env('CONVITE_REFERRAL_DISCOUNT_PERCENT', 10),

    'referral_cookie_days' => (int) env('CONVITE_REFERRAL_COOKIE_DAYS', 60),

    /*
    |--------------------------------------------------------------------------
    | Partners ("Aliados")
    |--------------------------------------------------------------------------
    |
    | Wedding planners, influencers and other partners share a link with
    | their code. Whoever opens it is offered the partner's discount, and the
    | code is remembered in a cookie for this many days so it reaches
    | WhatsApp even if they come back later. Only the latest link counts:
    | a partner's link replaces a client's referral code, and vice versa.
    |
    */

    'partner_cookie_days' => (int) env('CONVITE_PARTNER_COOKIE_DAYS', 60),

    /*
    |--------------------------------------------------------------------------
    | Legal Pages
    |--------------------------------------------------------------------------
    |
    | Who is responsible for the service, as the terms and conditions and the
    | privacy notice name them: the name of the person or company behind
    | Convite, the email that takes privacy requests (access, correction,
    | deletion...), its address and the city whose courts settle disputes.
    | The pages leave out the address and city when they are not set.
    |
    */

    'legal' => [
        'name' => env('CONVITE_LEGAL_NAME', 'Convite'),
        'email' => env('CONVITE_LEGAL_EMAIL', env('MAIL_FROM_ADDRESS')),
        'address' => env('CONVITE_LEGAL_ADDRESS'),
        'city' => env('CONVITE_LEGAL_CITY'),
    ],

];
