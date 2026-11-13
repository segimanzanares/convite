<!doctype html>
<html lang="es-MX" class="scroll-smooth">
    <head>
        <meta charset="UTF-8" />
        <link rel="icon" type="image/png" href="{{ asset('favicon.png') }}" />
        <link rel="apple-touch-icon" href="{{ asset('app-icon.png') }}" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#b97a1f" />
        @include('partials.meta')

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
            href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Great+Vibes&family=Cinzel:wght@300;400;500&family=Jost:wght@300;400;500&family=Geist:wght@300;400;500;600;700&family=Geist+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700&family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,500&family=EB+Garamond:ital,wght@0,400;0,500;1,400&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display:ital@0;1&family=Space+Grotesk:wght@400;500;600;700&family=Fredoka:wght@400;500;600;700&family=Nunito:wght@400;600;700;800&family=Luckiest+Guy&family=Pacifico&display=swap"
            rel="stylesheet"
        />

        @viteReactRefresh
        @vite(['resources/js/invitations/app.tsx', "resources/js/invitations/{$page['component']}.tsx"])
    </head>
    <body class="bg-ivory text-ink font-body overflow-x-hidden">
        <x-inertia::app />
    </body>
</html>
