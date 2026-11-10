<?php

namespace App\Models;

use Database\Factories\InvitationFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['slug', 'template', 'title', 'description', 'og_image'])]
class Invitation extends Model
{
    /** @use HasFactory<InvitationFactory> */
    use HasFactory;

    /** Printable 5×7 card, served at /i/{slug}/tarjeta. */
    public const string PRINT_CARD_PAGE = 'PrintCardPage';

    /** Printable guest passes, served at /i/{slug}/pases. */
    public const string GUEST_PASSES_PAGE = 'GuestPassesPage';

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    /**
     * Inertia component name of one of this invitation's React pages,
     * e.g. "invitations/demo/InvitationPage".
     */
    public function component(string $page = 'InvitationPage'): string
    {
        return "invitations/{$this->template}/{$page}";
    }

    /**
     * Whether the invitation's template ships the given page. Printable
     * pages are optional per template, so their routes 404 without one.
     */
    public function hasPage(string $page): bool
    {
        return is_file(resource_path("js/{$this->component($page)}.tsx"));
    }
}
