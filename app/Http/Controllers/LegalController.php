<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

class LegalController extends Controller
{
    /**
     * Display the terms and conditions of the service.
     */
    public function terms(): Response
    {
        return Inertia::render('landing/terms', [
            'legal' => $this->legal(),
            'retention' => $this->retention(),
            // Read by resources/views/partials/meta.blade.php
            'meta' => [
                'title' => 'Términos y condiciones - Convite',
                'description' => 'Términos y condiciones del servicio de invitaciones digitales de Convite: contratación, pagos, entrega, cambios, uso de la invitación y responsabilidades.',
            ],
        ]);
    }

    /**
     * Display the privacy notice, with the retention periods the scheduled purges actually apply.
     */
    public function privacy(): Response
    {
        return Inertia::render('landing/privacy', [
            'legal' => $this->legal(),
            'retention' => $this->retention(),
            'meta' => [
                'title' => 'Aviso de privacidad - Convite',
                'description' => 'Aviso de privacidad de Convite: qué datos personales tratamos de clientes e invitados, para qué, cuánto tiempo los conservamos y cómo ejercer sus derechos ARCO.',
            ],
        ]);
    }

    /**
     * Who is responsible for the service (see config/convite.php).
     *
     * @return array{name: string, email: ?string, address: ?string, city: ?string}
     */
    private function legal(): array
    {
        return [
            'name' => config('convite.legal.name') ?: 'Convite',
            'email' => config('convite.legal.email') ?: null,
            'address' => config('convite.legal.address') ?: null,
            'city' => config('convite.legal.city') ?: null,
        ];
    }

    /**
     * How long each kind of data is kept, in days.
     *
     * @return array{guests_days: int, uploads_days: int, backups_days: int, wishes_days_after_event: int, referral_cookie_days: int, partner_cookie_days: int}
     */
    private function retention(): array
    {
        return [
            'guests_days' => (int) config('convite.guest_retention_days'),
            'uploads_days' => (int) config('convite.uploads_retention_days'),
            'backups_days' => (int) config('backup.keep_days'),
            'wishes_days_after_event' => (int) config('convite.wishes_days_after_event'),
            'referral_cookie_days' => (int) config('convite.referral_cookie_days'),
            'partner_cookie_days' => (int) config('convite.partner_cookie_days'),
        ];
    }
}
