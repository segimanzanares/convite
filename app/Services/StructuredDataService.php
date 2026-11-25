<?php

namespace App\Services;

use App\Models\Plan;
use Illuminate\Database\Eloquent\Collection;

/**
 * The landing page's search engine data: its meta description and its schema.org JSON-LD.
 */
class StructuredDataService
{
    /**
     * The landing's meta description, with the lowest price of the plans offered (null keeps the default one).
     *
     * @param  Collection<int, Plan>  $plans
     */
    public function landingDescription(Collection $plans): ?string
    {
        if ($plans->isEmpty()) {
            return null;
        }

        return 'Invitaciones digitales para bodas, XV años, bautizos, baby showers y cumpleaños, con confirmación de asistencia, '
            .'cuenta regresiva y música. Desde '.$this->formatPrice((string) $plans->min('price')).' MXN.';
    }

    /**
     * The landing's JSON-LD graph: the business, its website and the service with the plans offered as its offers.
     *
     * @param  Collection<int, Plan>  $plans
     * @return array<string, mixed>
     */
    public function landing(Collection $plans): array
    {
        $organization = ['@id' => url('/#organization')];

        $service = [
            '@type' => 'Service',
            '@id' => url('/#service'),
            'name' => 'Invitaciones digitales',
            'serviceType' => 'Diseño de invitaciones digitales',
            'description' => 'Invitaciones digitales para bodas, XV años, bautizos, baby showers, revelaciones de género y cumpleaños, con diseño de catálogo o exclusivo, confirmación de asistencia, cuenta regresiva, ubicación con mapa, galería y música de fondo.',
            'provider' => $organization,
            'areaServed' => ['@type' => 'Country', 'name' => 'México'],
            'audience' => ['@type' => 'Audience', 'audienceType' => 'Personas que organizan bodas, XV años, bautizos, baby showers, revelaciones de género y cumpleaños'],
        ];

        if ($plans->isNotEmpty()) {
            $service['offers'] = [
                '@type' => 'AggregateOffer',
                'priceCurrency' => 'MXN',
                'lowPrice' => (string) $plans->min('price'),
                'highPrice' => (string) $plans->max('price'),
                'offerCount' => $plans->count(),
                'offers' => $plans->map(fn (Plan $plan): array => array_filter([
                    '@type' => 'Offer',
                    'name' => "Plan {$plan->name}",
                    'description' => $plan->description,
                    'price' => $plan->price,
                    'priceCurrency' => 'MXN',
                    'availability' => 'https://schema.org/InStock',
                    'url' => url('/#planes'),
                ]))->values()->all(),
            ];
        }

        return [
            '@context' => 'https://schema.org',
            '@graph' => [
                [
                    '@type' => 'Organization',
                    ...$organization,
                    'name' => 'Convite',
                    'url' => url('/'),
                    'logo' => asset('app-icon.png'),
                    'image' => asset('og-image.jpg'),
                    'description' => 'Diseño y publicación de invitaciones digitales para bodas, XV años, bautizos, baby showers, revelaciones de género y cumpleaños.',
                    'areaServed' => 'MX',
                    'knowsLanguage' => 'es',
                ],
                [
                    '@type' => 'WebSite',
                    '@id' => url('/#website'),
                    'url' => url('/'),
                    'name' => 'Convite',
                    'inLanguage' => 'es-MX',
                    'publisher' => $organization,
                ],
                $service,
            ],
        ];
    }

    /**
     * A price as shown to visitors: "$1,599", with cents only when it has them.
     */
    private function formatPrice(string $price): string
    {
        $amount = (float) $price;

        return '$'.number_format($amount, floor($amount) === $amount ? 0 : 2);
    }
}
