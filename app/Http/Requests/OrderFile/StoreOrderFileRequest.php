<?php

namespace App\Http\Requests\OrderFile;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

/**
 * A file delivered with an order, up to convite.order_file_max_mb.
 */
class StoreOrderFileRequest extends FormRequest
{
    public function authorize(): bool
    {
        return (bool) $this->user()?->can('update', $this->route('order'));
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'file' => ['required', File::default()->max(config('convite.order_file_max_mb') * 1024)],
        ];
    }
}
