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

    /** One celebrant with an age, e.g. "Carmen Ruiz — 70 años". */
    case Birthday = 'birthday';

    /** A birthday with the XV chapters: story, parents and godparents. */
    case Xv = 'xv';

    /** A baby (or child) being baptized, with the same chapters as a XV: a letter, the parents and the godparents. */
    case Baptism = 'baptism';

    /**
     * Parents-to-be (one or two names, like a couple) revealing whether their baby is a boy or a girl. The answer is
     * captured once known and only shown when the party begins.
     */
    case GenderReveal = 'gender_reveal';

    /**
     * Parents-to-be (one or two names) celebrating the baby on its way with their family and friends: the baby's
     * name if they picked one, the due date, who hosts the party and the diaper sizes guests may bring.
     */
    case BabyShower = 'baby_shower';

    /**
     * Whether the content names one celebrant instead of a couple.
     */
    public function hasCelebrant(): bool
    {
        return $this === self::Birthday || $this->hasChapters();
    }

    /**
     * Whether the content names the parents-to-be (one or two names, like a couple) instead of a celebrant.
     */
    public function hasParentsToBe(): bool
    {
        return $this === self::GenderReveal || $this === self::BabyShower;
    }

    /**
     * Whether the content has the chapters of a XV: monogram, portrait, story, parents and godparents.
     */
    public function hasChapters(): bool
    {
        return $this === self::Xv || $this === self::Baptism;
    }
}
