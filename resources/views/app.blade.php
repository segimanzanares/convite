@php
    // Pages may pass a `meta` prop to override these defaults, which are the
    // landing page's own (see InvitationController and bootstrap/app.php).
    $meta = array_merge([
        'title' => 'Convite — Invitaciones Digitales a Medida para Bodas, XV años y Eventos',
        'description' => 'Invitaciones digitales a medida para bodas, XV años y cualquier evento: diseño personalizado, RSVP por WhatsApp, cuenta regresiva y galería de fotos. Lista para compartir en días.',
        'image' => asset('og-image.jpg'),
        'robots' => 'index, follow',
    ], array_filter(data_get($page, 'props.meta') ?? []));

    $isLanding = ($page['component'] ?? null) === 'pages/landing/LandingPage';
@endphp
<!doctype html>
<html lang="es-MX" class="scroll-smooth">
    <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}" />
        <link rel="apple-touch-icon" href="{{ asset('app-icon.png') }}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#b97a1f" />
        <title>{{ $meta['title'] }}</title>
        <meta name="description" content="{{ $meta['description'] }}" />
        <meta name="robots" content="{{ $meta['robots'] }}" />
        <link rel="canonical" href="{{ url()->current() }}" />

        <!-- Open Graph / Facebook / WhatsApp -->
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Convite" />
        <meta property="og:title" content="{{ $meta['title'] }}" />
        <meta property="og:description" content="{{ $meta['description'] }}" />
        <meta property="og:image" content="{{ $meta['image'] }}" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:url" content="{{ url()->current() }}" />
        <meta property="og:locale" content="es_MX" />

        <!-- Twitter -->
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="{{ $meta['title'] }}" />
        <meta name="twitter:description" content="{{ $meta['description'] }}" />
        <meta name="twitter:image" content="{{ $meta['image'] }}" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Great+Vibes&family=Cinzel:wght@300;400;500&family=Jost:wght@300;400;500&display=swap"
            rel="stylesheet"
        />

        @if ($isLanding)
            <script type="application/ld+json">
                {!! json_encode([
                    '@context' => 'https://schema.org',
                    '@type' => 'Organization',
                    'name' => 'Convite',
                    'url' => url('/'),
                    'logo' => asset('app-icon.png'),
                    'description' => 'Diseño y publicación de invitaciones digitales a medida para bodas, XV años y cualquier evento, con RSVP por WhatsApp, cuenta regresiva, galería y música ambiental.',
                    'areaServed' => 'MX',
                    'knowsLanguage' => 'es',
                ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) !!}
            </script>
        @endif

        @viteReactRefresh
        @vite(['resources/js/app.tsx', "resources/js/{$page['component']}.tsx"])
    </head>
    <body class="bg-ivory text-ink font-body overflow-x-hidden">
        <x-inertia::app />
    </body>
</html>
