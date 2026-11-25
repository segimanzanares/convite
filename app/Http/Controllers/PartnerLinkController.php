<?php

namespace App\Http\Controllers;

use App\Models\Partner;
use Illuminate\Http\RedirectResponse;

class PartnerLinkController extends Controller
{
    /**
     * A partner's short link (/a/CODE), easy to put in a bio or print as a QR code. It lands on the landing page with
     * the partner's code and UTM parameters (see Partner::landingUrl()). Unknown codes and inactive partners land on
     * the plain landing page.
     */
    public function __invoke(string $code): RedirectResponse
    {
        $partner = Partner::findActiveByCode($code);

        return redirect()->to($partner?->landingUrl() ?? route('landing'));
    }
}
