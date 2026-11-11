<?php

namespace App\Services;

use App\Enums\OrderStatus;
use App\Enums\PlanFeature;
use App\Models\Client;
use App\Models\Invitation;
use App\Models\Order;
use App\Models\Payment;
use App\Models\Rsvp;
use Carbon\CarbonImmutable;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;

/**
 * The metrics of the panel's home page: sales, payments, balances and upcoming events for admins, and the progress of
 * their guest lists and RSVPs for client users. Months and days are those of the application's time zone.
 */
class DashboardService
{
    /** How many months, the current one included, the sales chart covers. */
    public const int REVENUE_MONTHS = 6;

    /** How many days ahead the list of upcoming events covers. */
    public const int UPCOMING_EVENT_DAYS = 60;

    /** How many days, today included, the client's chart of answers covers. */
    public const int ANSWER_DAYS = 14;

    public function __construct(private readonly RsvpService $rsvps) {}

    /**
     * Sales (the price of every order that is not a quote, by the month it was created) and payments (by the month
     * they were made) of the last months, the oldest first. Months without either are included with zeros.
     *
     * @return list<array{month: string, sales: string, collected: string}>
     */
    public function monthlyRevenue(): array
    {
        $firstMonth = CarbonImmutable::today()->startOfMonth()->subMonths(self::REVENUE_MONTHS - 1);

        $sales = Order::query()
            ->where('status', '!=', OrderStatus::Quoted)
            ->where('created_at', '>=', $firstMonth)
            ->selectRaw("to_char(created_at, 'YYYY-MM') as month, sum(price) as total")
            ->groupBy('month')
            ->toBase()
            ->pluck('total', 'month');

        $collected = Payment::query()
            ->where('paid_at', '>=', $firstMonth)
            ->selectRaw("to_char(paid_at, 'YYYY-MM') as month, sum(amount) as total")
            ->groupBy('month')
            ->toBase()
            ->pluck('total', 'month');

        return collect(range(0, self::REVENUE_MONTHS - 1))
            ->map(function (int $offset) use ($firstMonth, $sales, $collected): array {
                $month = $firstMonth->addMonths($offset)->format('Y-m');

                return [
                    'month' => $month,
                    'sales' => $this->money($sales[$month] ?? 0),
                    'collected' => $this->money($collected[$month] ?? 0),
                ];
            })
            ->all();
    }

    /**
     * The orders that still owe part of their price, the oldest first, with their client and the amount paid.
     *
     * @return Collection<int, Order>
     */
    public function ordersWithBalanceDue(): Collection
    {
        return Order::query()
            ->whereIn('status', [OrderStatus::Active, OrderStatus::Delivered])
            ->where('price', '>', Payment::query()
                ->selectRaw('coalesce(sum(amount), 0)')
                ->whereColumn('payments.order_id', 'orders.id'))
            ->with('client')
            ->withSum('payments', 'amount')
            ->oldest('id')
            ->get();
    }

    /**
     * The sum of the balances of the given orders.
     *
     * @param  Collection<int, Order>  $orders
     */
    public function totalBalance(Collection $orders): string
    {
        return $this->money($orders->sum(fn (Order $order) => (float) $order->balance()));
    }

    /**
     * The invitations sold to clients whose event is today or in the coming days, the nearest first. Demos (without
     * an order) are left out.
     *
     * @return Collection<int, Invitation>
     */
    public function upcomingEvents(): Collection
    {
        return Invitation::query()
            ->whereNotNull('order_id')
            ->whereBetween('event_date', [today(), today()->addDays(self::UPCOMING_EVENT_DAYS)])
            ->with(['client', 'order'])
            ->orderBy('event_date')
            ->orderBy('slug')
            ->get();
    }

    /**
     * How far along an invitation of a client is: the days left to the event, how many guests got and opened their
     * link (guest list plans) and the RSVP headcounts (online RSVP plans). Sections the plan lacks are null.
     *
     * @return array{days_until_event: int|null, guests: array{total: int, sent: int, opened: int, limit: int|null}|null, rsvps: array{guests: int, attending: int, declined: int, pending: int, people: int}|null}
     */
    public function invitationProgress(Invitation $invitation): array
    {
        return [
            'days_until_event' => $invitation->event_date
                ? (int) today()->diffInDays($invitation->event_date, absolute: false)
                : null,
            'guests' => $invitation->hasFeature(PlanFeature::GuestManagement) ? $this->guestProgress($invitation) : null,
            'rsvps' => $invitation->hasFeature(PlanFeature::OnlineRsvp) ? $this->rsvps->summary($invitation) : null,
        ];
    }

    /**
     * The latest answers to any invitation of the client, the most recent first, with their invitation.
     *
     * @return Collection<int, Rsvp>
     */
    public function recentAnswers(Client $client, int $limit = 8): Collection
    {
        return $this->answersOf($client)
            ->with('invitation')
            ->latest('responded_at')
            ->limit($limit)
            ->get();
    }

    /**
     * How many answers to the client's invitations came in each of the last days, the oldest first. A guest who
     * changed their answer counts on the day of the change.
     *
     * @return list<array{day: string, attending: int, declined: int}>
     */
    public function answersByDay(Client $client): array
    {
        $firstDay = CarbonImmutable::today()->subDays(self::ANSWER_DAYS - 1);

        $counts = $this->answersOf($client)
            ->where('responded_at', '>=', $firstDay)
            ->selectRaw("to_char(responded_at, 'YYYY-MM-DD') as day")
            ->selectRaw('count(*) filter (where attending) as attending')
            ->selectRaw('count(*) filter (where not attending) as declined')
            ->groupBy('day')
            ->toBase()
            ->get()
            ->keyBy('day');

        return collect(range(0, self::ANSWER_DAYS - 1))
            ->map(function (int $offset) use ($firstDay, $counts): array {
                $day = $firstDay->addDays($offset)->toDateString();

                return [
                    'day' => $day,
                    'attending' => (int) ($counts[$day]->attending ?? 0),
                    'declined' => (int) ($counts[$day]->declined ?? 0),
                ];
            })
            ->all();
    }

    /**
     * @return array{total: int, sent: int, opened: int, limit: int|null}
     */
    private function guestProgress(Invitation $invitation): array
    {
        $counts = $invitation->guests()
            ->toBase()
            ->selectRaw('count(*) as total, count(sent_at) as sent, count(first_opened_at) as opened')
            ->first();

        return [
            'total' => (int) $counts->total,
            'sent' => (int) $counts->sent,
            'opened' => (int) $counts->opened,
            'limit' => $invitation->guestLimit(),
        ];
    }

    /**
     * @return Builder<Rsvp>
     */
    private function answersOf(Client $client): Builder
    {
        return Rsvp::query()->whereIn('invitation_id', $client->invitations()->select('id'));
    }

    private function money(float|int|string $amount): string
    {
        return number_format((float) $amount, 2, '.', '');
    }
}
