<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderFile;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

/**
 * The files the team delivers with an order (the tribute video, the printables...), on the private local disk so
 * only the admin downloads them.
 */
class OrderFileService
{
    public const string DISK = 'local';

    public function store(Order $order, UploadedFile $file): OrderFile
    {
        $path = $file->store($this->directory($order), self::DISK);

        return $order->files()->create([
            'name' => $file->getClientOriginalName(),
            'path' => $path,
            'size' => $file->getSize(),
            'mime_type' => $file->getMimeType(),
        ]);
    }

    public function delete(OrderFile $file): void
    {
        Storage::disk(self::DISK)->delete($file->path);
        $file->delete();
    }

    /**
     * Delete every file of an order that is being deleted (its rows go with it).
     */
    public function deleteAll(Order $order): void
    {
        Storage::disk(self::DISK)->deleteDirectory($this->directory($order));
    }

    private function directory(Order $order): string
    {
        return "orders/{$order->id}";
    }
}
