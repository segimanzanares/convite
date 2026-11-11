<?php

namespace App\Enums;

/**
 * The kind of event a template is designed for. It decides the shape of the invitation's content (see
 * InvitationContentRules); each template declares it in its template.json.
 */
enum InvitationKind: string
{
    /** Two names, e.g. "Mariana & Alejandro", and their families. */
    case Wedding = 'wedding';

    /** One celebrant with an age, e.g. "Lucila Santos — 76 años". */
    case Birthday = 'birthday';

    /** A birthday with the XV chapters: story, parents and godparents. */
    case Xv = 'xv';

    /**
     * Whether the content names one celebrant instead of a couple.
     */
    public function hasCelebrant(): bool
    {
        return $this !== self::Wedding;
    }
}
