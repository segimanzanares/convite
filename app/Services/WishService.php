<?php

namespace App\Services;

use App\Enums\PlanFeature;
use App\Enums\WishStatus;
use App\Models\Guest;
use App\Models\Invitation;
use App\Models\Wish;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

/**
 * The wishes book: guests leave their congratulations and good wishes from the invitation, the panel moderates them
 * and downloads them in a PDF. Each invitation whose plan includes it chooses whether to show it, whether the messages
 * show on the invitation and whether they wait for approval first.
 */
class WishService
{
    /** Longest message a guest may leave. */
    public const int MAX_LENGTH = 500;

    /** How many of the latest approved messages the invitation shows, when they are public. */
    public const int PUBLIC_WISHES = 60;

    /**
     * Store a message from the invitation page. It shows right away unless the invitation moderates its book.
     *
     * @throws ValidationException when the book is closed or full.
     */
    public function submit(Invitation $invitation, ?Guest $guest, string $authorName, string $message): Wish
    {
        if (! $invitation->acceptsWishes()) {
            throw ValidationException::withMessages(['wish' => __('The wishes book is closed.')]);
        }

        if ($invitation->wishes()->count() >= config('convite.wishes_max_messages')) {
            throw ValidationException::withMessages(['wish' => __('The wishes book is full.')]);
        }

        return $invitation->wishes()->create([
            'guest_id' => $guest?->id,
            'author_name' => $authorName,
            'message' => $message,
            'status' => $invitation->wishes_moderated ? WishStatus::Pending : WishStatus::Approved,
        ]);
    }

    /**
     * Approve a message (it shows on the invitation and goes into the PDF) or hide it (it does neither).
     */
    public function setStatus(Wish $wish, WishStatus $status): Wish
    {
        $wish->update(['status' => $status]);

        return $wish;
    }

    public function delete(Wish $wish): void
    {
        $wish->delete();
    }

    /**
     * Whether the invitation shows its wishes book, whether the messages show on it and whether they wait for a
     * panel user's approval.
     *
     * @param  array{enabled: bool, public: bool, moderated: bool}  $settings
     */
    public function updateSettings(Invitation $invitation, array $settings): void
    {
        $invitation->forceFill([
            'wishes_enabled' => $settings['enabled'],
            'wishes_public' => $settings['public'],
            'wishes_moderated' => $settings['moderated'],
        ])->save();
    }

    /**
     * Every message of the invitation, newest first, as the panel lists them.
     *
     * @return Collection<int, Wish>
     */
    public function list(Invitation $invitation): Collection
    {
        return $invitation->wishes()->latest('id')->get();
    }

    /**
     * The messages the PDF keeps: every one but the hidden ones (the pending ones too, so none is lost if nobody
     * reviewed it), oldest first.
     *
     * @return Collection<int, Wish>
     */
    public function keptWishes(Invitation $invitation): Collection
    {
        return $invitation->wishes()->where('status', '!=', WishStatus::Hidden)->orderBy('id')->get();
    }

    /**
     * How many messages the book has, by status.
     *
     * @return array{total: int, pending: int, approved: int, hidden: int}
     */
    public function summary(Invitation $invitation): array
    {
        $counts = $invitation->wishes()
            ->toBase()
            ->selectRaw('status, count(*) as wishes')
            ->groupBy('status')
            ->pluck('wishes', 'status');

        return [
            'total' => (int) $counts->sum(),
            'pending' => (int) ($counts[WishStatus::Pending->value] ?? 0),
            'approved' => (int) ($counts[WishStatus::Approved->value] ?? 0),
            'hidden' => (int) ($counts[WishStatus::Hidden->value] ?? 0),
        ];
    }

    /**
     * The book as the invitation page shows it, or null when the invitation does not offer it. The messages are only
     * sent when the invitation makes them public.
     *
     * @return array{open: bool, url: string, public: bool, moderated: bool, max_length: int, wishes: list<array{id: int, author_name: string, message: string, created_at: string|null}>}|null
     */
    public function invitationProps(Invitation $invitation): ?array
    {
        if (! $invitation->offersWishes()) {
            return null;
        }

        $wishes = $invitation->wishes_public
            ? $invitation->wishes()->approved()->latest('id')->limit(self::PUBLIC_WISHES)->get()
            : collect();

        return [
            'open' => $invitation->acceptsWishes(),
            'url' => route('invitations.wishes.store', $invitation),
            'public' => $invitation->wishes_public,
            'moderated' => $invitation->wishes_moderated,
            'max_length' => self::MAX_LENGTH,
            'wishes' => $wishes->map(fn (Wish $wish): array => $this->publicWish($wish))->values()->all(),
        ];
    }

    /**
     * A message as the invitation page shows it, without its status or guest.
     *
     * @return array{id: int, author_name: string, message: string, created_at: string|null}
     */
    public function publicWish(Wish $wish): array
    {
        return [
            'id' => $wish->id,
            'author_name' => $wish->author_name,
            'message' => $wish->message,
            'created_at' => $wish->created_at?->toIso8601String(),
        ];
    }

    /**
     * The book as the panel shows it, or null when the plan does not include it.
     *
     * @return array{enabled: bool, public: bool, moderated: bool, is_open: bool, closes_at: string|null, purges_at: string|null, purged: bool, max_messages: int, summary: array{total: int, pending: int, approved: int, hidden: int}}|null
     */
    public function panelSettings(Invitation $invitation): ?array
    {
        if (! $invitation->hasFeature(PlanFeature::Wishes)) {
            return null;
        }

        return [
            'enabled' => $invitation->wishes_enabled,
            'public' => $invitation->wishes_public,
            'moderated' => $invitation->wishes_moderated,
            'is_open' => $invitation->acceptsWishes(),
            'closes_at' => $invitation->wishesCloseAt()?->toIso8601String(),
            // The guest data purge deletes the messages too (see GuestPurgeService)
            'purges_at' => $invitation->event_date?->toImmutable()
                ->addDays(config('convite.guest_retention_days') + 1)
                ->toIso8601String(),
            'purged' => $invitation->guests_purged_at !== null,
            'max_messages' => (int) config('convite.wishes_max_messages'),
            'summary' => $this->summary($invitation),
        ];
    }

    /**
     * The PDF with the messages the client keeps, ready to download.
     */
    public function pdf(Invitation $invitation): string
    {
        $timezone = config('app.timezone');
        $wishes = $this->keptWishes($invitation);

        return Pdf::loadView('pdf.wishes', [
            'title' => $invitation->title,
            'dateLabel' => $invitation->event_date?->locale('es')->translatedFormat('j \d\e F \d\e Y'),
            'wishes' => $wishes->map(fn (Wish $wish): array => [
                'author_name' => $wish->author_name,
                'message' => $wish->message,
                'date' => $wish->created_at?->timezone($timezone)->locale('es')->translatedFormat('j \d\e F \d\e Y'),
            ])->all(),
            'fontDirectory' => resource_path('fonts/pdf'),
        ])
            ->setPaper('letter')
            ->setOption('defaultFont', 'Cormorant Garamond')
            ->output();
    }

    /**
     * Delete every message of the invitation.
     */
    public function purge(Invitation $invitation): void
    {
        $invitation->wishes()->delete();
    }
}
