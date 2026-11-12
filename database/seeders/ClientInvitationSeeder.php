<?php

namespace Database\Seeders;

use App\Models\Client;
use App\Models\Invitation;
use App\Models\Plan;
use App\Services\OrderService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ClientInvitationSeeder extends Seeder
{
    /**
     * Bring the clients' invitations that predate the backend into the database, each with its client and order, from
     * database/seeders/data/clients/<slug>.php. Run it by hand once, after PlanSeeder. An invitation whose slug
     * already exists is skipped, so its client, order and content are never overwritten once they live in the panel.
     */
    public function run(OrderService $orders): void
    {
        foreach (glob(__DIR__.'/data/clients/*.php') ?: [] as $file) {
            /** @var array{client: array<string, mixed>, order: array{plan: string, status: string}, invitation: array<string, mixed>} $data */
            $data = require $file;

            if (Invitation::where('slug', $data['invitation']['slug'])->exists()) {
                $this->command?->info("{$data['invitation']['slug']} already exists, skipped.");

                continue;
            }

            DB::transaction(function () use ($data, $orders): void {
                $plan = Plan::where('slug', $data['order']['plan'])->firstOrFail();
                $client = Client::create($data['client']);
                $order = $orders->create($client, [
                    'plan_id' => $plan->id,
                    'price' => $plan->price,
                    'status' => $data['order']['status'],
                ]);

                Invitation::create([...$data['invitation'], 'client_id' => $client->id, 'order_id' => $order->id]);
            });
        }
    }
}
