@php
    // The admin app also serves pages outside the panel: the landing page and
    // the door of the event (the PublicLayout pages in resources/js/admin/app.tsx).
    // On the first visit they get the public meta tags, and start in light mode.
    $isOutsidePanel = str_starts_with($page['component'], 'landing/') || str_starts_with($page['component'], 'check-in/');
@endphp
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class(['dark' => ! $isOutsidePanel && ($appearance ?? 'system') == 'dark'])>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        @if ($isOutsidePanel)
            @include('partials.meta')

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
        @endif

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

        @viteReactRefresh
        @vite(['resources/js/admin/app.tsx', "resources/js/admin/pages/{$page['component']}.tsx"])

        @unless ($isOutsidePanel)
            <x-inertia::head>
                <title>{{ config('app.name') }}</title>
            </x-inertia::head>
        @endunless
    </head>
    <body class="font-sans antialiased">
        <x-inertia::app />
    </body>
</html>
