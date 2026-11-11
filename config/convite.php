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

];
