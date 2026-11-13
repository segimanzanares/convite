<?php

namespace App\Services;

use App\Models\Invitation;

class InvitationFontService
{
    /**
     * The fonts of the banners every page of the invitations app may show (cookie consent, preview).
     *
     * @var list<string>
     */
    private const array SHARED_FONTS = ['Jost:wght@300;400;500'];

    /**
     * The shared components' own fonts (--font-body, --font-display and --font-script), for the pages that are not a
     * template's (the 404 and 410 pages).
     *
     * @var list<string>
     */
    private const array DEFAULT_FONTS = [
        'Cormorant Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500',
        'Cinzel:wght@300;400;500',
        'Great Vibes',
    ];

    /**
     * The Google Fonts stylesheet for a page of the invitations app, given its Inertia component (e.g.
     * "templates/boda-clasica/InvitationPage"): the families its template lists in its template.json, plus the
     * printable pages' own when it is one of them.
     */
    public function stylesheetUrl(string $component): string
    {
        $families = [...$this->pageFonts($component), ...self::SHARED_FONTS];

        $query = collect($families)
            ->unique()
            ->map(fn (string $family): string => 'family='.str_replace(' ', '+', $family))
            ->implode('&');

        return "https://fonts.googleapis.com/css2?{$query}&display=swap";
    }

    /**
     * @return list<string>
     */
    private function pageFonts(string $component): array
    {
        if (! preg_match('#^templates/([^/]+)/(\w+)$#', $component, $matches)) {
            return self::DEFAULT_FONTS;
        }

        [, $template, $page] = $matches;
        $manifest = Invitation::templates()[$template] ?? null;

        if ($manifest === null) {
            return self::DEFAULT_FONTS;
        }

        return $page === 'InvitationPage' ? $manifest['fonts'] : [...$manifest['fonts'], ...$manifest['print_fonts']];
    }
}
