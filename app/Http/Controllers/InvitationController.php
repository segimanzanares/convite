<?php

namespace App\Http\Controllers;

use App\Models\Invitation;
use Inertia\Inertia;
use Inertia\Response;

class InvitationController extends Controller
{
    public function show(Invitation $invitation): Response
    {
        return $this->render($invitation, 'InvitationPage', $invitation->title);
    }

    public function printCard(Invitation $invitation): Response
    {
        return $this->render($invitation, Invitation::PRINT_CARD_PAGE, "Tarjeta impresa — {$invitation->title}");
    }

    public function guestPasses(Invitation $invitation): Response
    {
        return $this->render($invitation, Invitation::GUEST_PASSES_PAGE, "Pases de invitados — {$invitation->title}");
    }

    private function render(Invitation $invitation, string $page, string $title): Response
    {
        abort_unless($invitation->offersPage($page), 404);

        return Inertia::render($invitation->component($page), [
            // Read by resources/views/app.blade.php for link previews
            'meta' => [
                'title' => $title,
                'description' => $invitation->description,
                'image' => $invitation->og_image ? url($invitation->og_image) : null,
                'robots' => 'noindex, nofollow',
            ],
        ]);
    }
}
