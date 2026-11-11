<?php

namespace App\Services;

use App\Concerns\GuestValidationRules;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

/**
 * Reads a guest list from a CSV file, one guest per line: name, seats, table and, optionally, phone and email. It is
 * the format the printable passes already used, and what Excel or Google Sheets save as CSV (with commas or, in
 * Spanish locales, semicolons).
 */
class GuestImportService
{
    use GuestValidationRules;

    /** The most rows a single file may add. */
    public const int MAX_ROWS = 1000;

    /** @var list<string> */
    private const array COLUMNS = ['name', 'seats', 'table_label', 'phone', 'email'];

    /**
     * Parse a file into rows ready to review, each with its line number and validation errors.
     *
     * @return list<array{line: int, name: string, seats: int|string, table_label: string|null, phone: string|null, email: string|null, errors: list<string>}>
     */
    public function preview(UploadedFile $file): array
    {
        $lines = $this->lines((string) file_get_contents($file->getRealPath()));
        $delimiter = $this->delimiter($lines);
        $rows = [];

        foreach ($lines as $index => $line) {
            if (trim($line) === '') {
                continue;
            }

            $row = $this->row(str_getcsv($line, $delimiter, '"', ''));

            if ($rows === [] && $this->isHeader($row)) {
                continue;
            }

            $rows[] = [
                'line' => $index + 1,
                ...$row,
                'errors' => Validator::make($row, $this->guestRules())->errors()->all(),
            ];

            if (count($rows) === self::MAX_ROWS) {
                break;
            }
        }

        return $rows;
    }

    /**
     * Split the file into lines, converting it to UTF-8 when a spreadsheet saved it in Windows-1252.
     *
     * @return list<string>
     */
    private function lines(string $contents): array
    {
        if (! mb_check_encoding($contents, 'UTF-8')) {
            $contents = mb_convert_encoding($contents, 'UTF-8', 'Windows-1252');
        }

        $contents = Str::chopStart($contents, "\u{FEFF}");

        return preg_split('/\r\n|\r|\n/', $contents) ?: [];
    }

    /**
     * Semicolons when the first line has more of them than commas, as in files saved by spreadsheets in Spanish.
     *
     * @param  list<string>  $lines
     */
    private function delimiter(array $lines): string
    {
        $first = collect($lines)->first(fn (string $line) => trim($line) !== '') ?? '';

        return substr_count($first, ';') > substr_count($first, ',') ? ';' : ',';
    }

    /**
     * Map the cells of a line to guest attributes. Empty cells become null, and an empty seats cell means one seat.
     *
     * @param  array<int, string|null>  $cells
     * @return array{name: string, seats: int|string, table_label: string|null, phone: string|null, email: string|null}
     */
    private function row(array $cells): array
    {
        $values = [];

        foreach (self::COLUMNS as $position => $column) {
            $value = trim((string) ($cells[$position] ?? ''));
            $values[$column] = $value === '' ? null : $value;
        }

        $seats = $values['seats'] ?? '1';

        return [
            'name' => $values['name'] ?? '',
            'seats' => ctype_digit($seats) ? (int) $seats : $seats,
            'table_label' => $values['table_label'],
            'phone' => $values['phone'],
            'email' => $values['email'],
        ];
    }

    /**
     * Whether a row is a header such as "Nombre, Lugares, Mesa" rather than a guest.
     *
     * @param  array{name: string, seats: int|string}  $row
     */
    private function isHeader(array $row): bool
    {
        return ! is_int($row['seats']) && Str::contains(Str::lower(Str::ascii($row['name'])), ['nombre', 'invitado', 'name']);
    }
}
