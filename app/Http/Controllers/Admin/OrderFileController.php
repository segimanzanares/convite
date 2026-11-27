<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\OrderFile\StoreOrderFileRequest;
use App\Models\Order;
use App\Models\OrderFile;
use App\Services\OrderFileService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\StreamedResponse;

/**
 * The files delivered with an order, listed on the order page.
 */
class OrderFileController extends Controller
{
    public function __construct(private readonly OrderFileService $files) {}

    public function store(StoreOrderFileRequest $request, Order $order): RedirectResponse
    {
        $this->files->store($order, $request->file('file'));

        Inertia::flash('toast', ['type' => 'success', 'message' => __('File uploaded.')]);

        return to_route('admin.orders.show', $order);
    }

    public function download(OrderFile $file): StreamedResponse
    {
        Gate::authorize('view', $file->order);

        return Storage::disk(OrderFileService::DISK)->download($file->path, $file->name);
    }

    public function destroy(OrderFile $file): RedirectResponse
    {
        Gate::authorize('update', $file->order);

        $this->files->delete($file);

        Inertia::flash('toast', ['type' => 'success', 'message' => __('File deleted.')]);

        return to_route('admin.orders.show', $file->order_id);
    }
}
