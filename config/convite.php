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
    | Open RSVP Form
    |--------------------------------------------------------------------------
    |
    | The most people (the person answering plus their companions) a single
    | answer through the open, tokenless RSVP form may confirm.
    |
    */

    'open_rsvp_max_seats' => (int) env('CONVITE_OPEN_RSVP_MAX_SEATS', 5),

];
