<?php

namespace App\Http\Controllers\Admin\Concerns;

use Illuminate\Http\Request;
use Illuminate\Support\Arr;

/**
 * A listing's create and edit modals carry its filters and page in their URL, and the forms post them along, so
 * saving or closing the modal returns to the listing as it was.
 */
trait KeepsListQuery
{
    /**
     * The given keys of the query string that have a value, to pass to the listing's route.
     *
     * @param  list<string>  $keys
     * @return array<string, string>
     */
    protected function listQuery(Request $request, array $keys): array
    {
        return array_filter(
            Arr::only($request->query(), $keys),
            fn (mixed $value): bool => is_string($value) && $value !== '',
        );
    }
}
