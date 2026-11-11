<?php

namespace App\Services;

use App\Models\Guest;
use App\Models\Invitation;
use App\Models\Rsvp;
use Illuminate\Database\Eloquent\Collection;

class RsvpService
{
    /**
     * Store an answer from the invitation page. A guest has a single answer, which a new one replaces; every answer
     * through the open form is a new record.
     *
     * @param  array{name: string, attending: bool, seats_confirmed: int, message: string|null}  $answer
     */
    public function submit(Invitation $invitation, ?Guest $guest, array $answer): Rsvp
    {
        $answer['responded_at'] = now();

        if ($guest === null) {
            return $invitation->rsvps()->create($answer);
        }

        return $invitation->rsvps()->updateOrCreate(['guest_id' => $guest->id], $answer);
    }

    /**
     * The answers sent through the open form, the most recent first.
     *
     * @return Collection<int, Rsvp>
     */
    public function openAnswers(Invitation $invitation): Collection
    {
        return $invitation->rsvps()->whereNull('guest_id')->latest('responded_at')->get();
    }

    /**
     * Headcounts of an invitation. Guests count once each, whatever their seats; open answers only add to the
     * attending, declined and people totals, since they have no guest to be pending.
     *
     * @return array{guests: int, attending: int, declined: int, pending: int, people: int}
     */
    public function summary(Invitation $invitation): array
    {
        $guests = $invitation->guests()->count();
        $answers = $invitation->rsvps()
            ->selectRaw('count(*) filter (where attending) as attending')
            ->selectRaw('count(*) filter (where not attending) as declined')
            ->selectRaw('count(guest_id) as answered_guests')
            ->selectRaw('coalesce(sum(seats_confirmed) filter (where attending), 0) as people')
            ->toBase()
            ->first();

        return [
            'guests' => $guests,
            'attending' => (int) $answers->attending,
            'declined' => (int) $answers->declined,
            'pending' => $guests - (int) $answers->answered_guests,
            'people' => (int) $answers->people,
        ];
    }

    /**
     * Rows for the spreadsheet export: every guest, answered or not, then the open answers.
     *
     * @return list<list<string|int>>
     */
    public function exportRows(Invitation $invitation): array
    {
        $rows = [['Nombre', 'Origen', 'Lugares', 'Mesa', 'Respuesta', 'Personas', 'Mensaje', 'Fecha de respuesta']];

        foreach ($invitation->guests()->with('rsvp')->orderBy('name')->get() as $guest) {
            $rows[] = [
                $guest->name,
                'Invitado',
                $guest->seats,
                $guest->table_label ?? '',
                ...$this->answerColumns($guest->rsvp),
            ];
        }

        foreach ($this->openAnswers($invitation) as $rsvp) {
            $rows[] = [$rsvp->name, 'Formulario abierto', '', '', ...$this->answerColumns($rsvp)];
        }

        return $rows;
    }

    public function delete(Rsvp $rsvp): void
    {
        $rsvp->delete();
    }

    /**
     * @return list<string|int>
     */
    private function answerColumns(?Rsvp $rsvp): array
    {
        if ($rsvp === null) {
            return ['Pendiente', '', '', ''];
        }

        return [
            $rsvp->attending ? 'Asistirá' : 'No asistirá',
            $rsvp->seats_confirmed,
            $rsvp->message ?? '',
            $rsvp->responded_at->format('Y-m-d H:i'),
        ];
    }
}
