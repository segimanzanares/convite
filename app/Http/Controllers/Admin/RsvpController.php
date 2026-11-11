<?php

namespace App\Http\Controllers\Admin;

use App\Enums\PlanFeature;
use App\Http\Controllers\Controller;
use App\Http\Resources\GuestResource;
use App\Http\Resources\InvitationResource;
use App\Http\Resources\RsvpResource;
use App\Models\Invitation;
use App\Models\Rsvp;
use App\Services\GuestService;
use App\Services\RsvpService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class RsvpController extends Controller
{
    public function __construct(
        private readonly RsvpService $rsvps,
        private readonly GuestService $guests,
    ) {}

    /**
     * Display the headcounts and answers of an invitation: every guest with their answer, and the open answers.
     */
    public function index(Invitation $invitation): Response
    {
        Gate::authorize('manageRsvps', $invitation);

        $hasGuestList = $invitation->hasFeature(PlanFeature::GuestManagement);

        return Inertia::render('rsvps/index', [
            'invitation' => InvitationResource::make($invitation->loadMissing('order')),
            'summary' => $this->rsvps->summary($invitation),
            'guests' => $hasGuestList ? GuestResource::collection($this->guests->list($invitation)) : [],
            'openAnswers' => RsvpResource::collection($this->rsvps->openAnswers($invitation)),
        ]);
    }

    /**
     * Download every guest and answer as a CSV file that opens in Excel.
     */
    public function export(Invitation $invitation): StreamedResponse
    {
        Gate::authorize('manageRsvps', $invitation);

        $rows = $this->rsvps->exportRows($invitation);

        return response()->streamDownload(function () use ($rows): void {
            $output = fopen('php://output', 'w');
            // The byte order mark makes Excel read the file as UTF-8
            fwrite($output, "\u{FEFF}");

            foreach ($rows as $row) {
                fputcsv($output, $row, escape: '');
            }

            fclose($output);
        }, "confirmaciones-{$invitation->slug}.csv", ['Content-Type' => 'text/csv; charset=UTF-8']);
    }

    /**
     * Remove an answer, e.g. a duplicate from the open form. A guest whose answer is removed is pending again.
     */
    public function destroy(Invitation $invitation, Rsvp $rsvp): RedirectResponse
    {
        Gate::authorize('manageRsvps', $invitation);

        $this->rsvps->delete($rsvp);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('Answer deleted.')]);

        return to_route('admin.invitations.rsvps.index', $invitation);
    }
}
