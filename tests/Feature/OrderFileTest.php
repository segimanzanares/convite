<?php

use App\Enums\PlanType;
use App\Models\Order;
use App\Models\OrderFile;
use App\Models\Plan;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Inertia\Testing\AssertableInertia as Assert;

it('uploads a file delivered with the order and lists it on the order page', function () {
    Storage::fake('local');
    $order = Order::factory()->for(Plan::factory()->ofType(PlanType::TributeVideo))->create();
    $admin = User::factory()->create();

    $this->actingAs($admin)
        ->post(route('admin.orders.files.store', $order), ['file' => UploadedFile::fake()->create('semblanza.mp4', 3000, 'video/mp4')])
        ->assertRedirect(route('admin.orders.show', $order));

    $file = OrderFile::sole();
    expect($file)
        ->order_id->toBe($order->id)
        ->name->toBe('semblanza.mp4')
        ->size->toBe(3000 * 1024);
    Storage::disk('local')->assertExists($file->path);
    expect($file->path)->toStartWith("orders/{$order->id}/");

    $this->actingAs($admin)
        ->get(route('admin.orders.show', $order))
        ->assertInertia(fn (Assert $page) => $page
            ->where('order.type', 'tribute_video')
            ->has('order.files', 1)
            ->where('order.files.0.name', 'semblanza.mp4'));
});

it('rejects a file larger than the limit', function () {
    Storage::fake('local');
    config(['convite.order_file_max_mb' => 1]);
    $order = Order::factory()->create();

    $this->actingAs(User::factory()->create())
        ->post(route('admin.orders.files.store', $order), ['file' => UploadedFile::fake()->create('pases.pdf', 2048)])
        ->assertSessionHasErrors('file');

    expect(OrderFile::count())->toBe(0);
});

it('downloads a delivered file with its original name', function () {
    Storage::fake('local');
    $file = OrderFile::factory()->create(['name' => 'Pases Ana y Luis.pdf']);
    Storage::disk('local')->put($file->path, 'pdf');

    $this->actingAs(User::factory()->create())
        ->get(route('admin.files.download', $file))
        ->assertOk()
        ->assertDownload('Pases Ana y Luis.pdf');
});

it('deletes a delivered file and what it stored', function () {
    Storage::fake('local');
    $file = OrderFile::factory()->create();
    Storage::disk('local')->put($file->path, 'pdf');

    $this->actingAs(User::factory()->create())
        ->delete(route('admin.files.destroy', $file))
        ->assertRedirect(route('admin.orders.show', $file->order_id));

    expect(OrderFile::count())->toBe(0);
    Storage::disk('local')->assertMissing($file->path);
});

it('deletes the files of an order that is deleted', function () {
    Storage::fake('local');
    $file = OrderFile::factory()->create();
    Storage::disk('local')->put($file->path, 'pdf');

    $this->actingAs(User::factory()->create())->delete(route('admin.orders.destroy', $file->order));

    Storage::disk('local')->assertMissing($file->path);
});

it('keeps the delivered files from client users', function () {
    Storage::fake('local');
    $file = OrderFile::factory()->create();
    Storage::disk('local')->put($file->path, 'pdf');
    $client = User::factory()->client($file->order->client)->create();

    $this->actingAs($client)->get(route('admin.files.download', $file))->assertForbidden();
    $this->actingAs($client)
        ->post(route('admin.orders.files.store', $file->order), ['file' => UploadedFile::fake()->create('otro.pdf', 10)])
        ->assertForbidden();
    $this->actingAs($client)->delete(route('admin.files.destroy', $file))->assertForbidden();
});
