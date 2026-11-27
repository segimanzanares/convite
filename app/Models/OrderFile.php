<?php

namespace App\Models;

use Database\Factories\OrderFileFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 * A file the team delivers to the client of an order: the MP4 of a tribute video, the PDFs of the printables... It is
 * kept on the private local disk under orders/{order_id}/ and only the admin downloads it (see OrderFileService).
 *
 * @property int $id
 * @property int $order_id
 * @property string $name
 * @property string $path
 * @property int $size
 * @property string|null $mime_type
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 */
#[Fillable(['name', 'path', 'size', 'mime_type'])]
class OrderFile extends Model
{
    /** @use HasFactory<OrderFileFactory> */
    use HasFactory;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'size' => 'integer',
        ];
    }

    /** @return BelongsTo<Order, $this> */
    public function order(): BelongsTo
    {
        return $this->belongsTo(Order::class);
    }
}
