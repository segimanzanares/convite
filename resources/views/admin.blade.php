@php
    // The admin app also serves pages outside the panel: the landing page and
    // the door of the event (the same prefixes as the PublicLayout pages in
    // resources/js/admin/app.tsx). They get the public meta tags and the brand
    // fonts, and are always shown in light mode.
    $isOutsidePanel = str_starts_with($page['component'], 'landing/') || str_starts_with($page['component'], 'check-in/');
@endphp
<!DOCTYPE html>
@if ($isOutsidePanel)
<html lang="es-MX" class="scroll-smooth" data-appearance="light">
@else
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ($appearance ?? 'system') == 'dark'])>
@endif
    <head>
        @if ($isOutsidePanel)
            @include('partials.head')

            @if ($page['component'] === 'landing/index')
                <script type="application/ld+json">
                    {!! json_encode([
                        '@context' => 'https://schema.org',
                        '@type' => 'Organization',
                        'name' => 'Convite',
                        'url' => url('/'),
                        'logo' => asset('app-icon.png'),
                        'description' => 'Diseño y publicación de invitaciones digitales para bodas, XV años y cualquier evento, con confirmación de asistencia, cuenta regresiva, galería y música ambiental.',
                        'areaServed' => 'MX',
                        'knowsLanguage' => 'es',
                    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!}
                </script>
            @endif
        @else
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <meta name="robots" content="noindex, nofollow">

            {{-- Inline script to detect system dark mode preference and apply it immediately --}}
            <script>
                (function() {
                    const appearance = '{{ $appearance ?? "system" }}';

                    if (appearance === 'system') {
                        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                        if (prefersDark) {
                            document.documentElement.classList.add('dark');
                        }
                    }
                })();
            </script>

            {{-- Inline style to set the HTML background color based on the theme in resources/js/admin/app.css --}}
            <style>
                html {
                    background-color: oklch(1 0 0);
                }

                html.dark {
                    background-color: oklch(0.145 0 0);
                }
            </style>

            <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}">
            <link rel="apple-touch-icon" href="{{ asset('app-icon.png') }}">

            @fonts
        @endif

        @viteReactRefresh
        @vite(['resources/js/admin/app.tsx', "resources/js/admin/pages/{$page['component']}.tsx"])

        @unless ($isOutsidePanel)
            <x-inertia::head>
                <title>{{ config('app.name') }}</title>
            </x-inertia::head>
        @endunless
    </head>
    @if ($isOutsidePanel)
        <body class="bg-ivory text-ink font-body overflow-x-hidden">
    @else
        <body class="font-sans antialiased">
    @endif
        <x-inertia::app />
    </body>
</html>
