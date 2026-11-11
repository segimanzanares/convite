<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Admin\Concerns\RendersGuestPage;
use App\Http\Controllers\Controller;
use App\Http\Requests\Guest\ImportGuestsRequest;
use App\Http\Requests\Guest\PreviewGuestImportRequest;
use App\Models\Invitation;
use App\Services\GuestImportService;
use App\Services\GuestService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Inertia\Inertia;
use Inertia\Response;

/**
 * Imports a guest list from a CSV file in two steps: the file is parsed into a preview with each row's errors, and
 * the rows the user confirms are then added.
 */
class GuestImportController extends Controller
{
    use RendersGuestPage;

    public function __construct(
        private readonly GuestService $guests,
        private readonly GuestImportService $imports,
    ) {}

    /**
     * Display the guest list with the import form open in a modal.
     */
    public function create(Invitation $invitation): Response
    {
        Gate::authorize('manageGuests', $invitation);

        return $this->renderGuestPage($invitation, 'import');
    }

    /**
     * Parse the uploaded file without saving anything, as JSON for the import form.
     */
    public function preview(PreviewGuestImportRequest $request, Invitation $invitation): JsonResponse
    {
        return response()->json([
            'rows' => $this->imports->preview($request->file('file')),
            'remaining' => $this->guests->remainingSlots($invitation),
        ]);
    }

    public function store(ImportGuestsRequest $request, Invitation $invitation): RedirectResponse
    {
        $imported = $this->guests->import($invitation, $request->validated('rows'));

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => trans_choice('{1} :count guest imported.|[2,*] :count guests imported.', $imported->count()),
        ]);

        return to_route('admin.invitations.guests.index', $invitation);
    }
}
