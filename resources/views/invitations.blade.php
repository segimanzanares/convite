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
            href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400;1,500&family=Great+Vibes&family=Cinzel:wght@300;400;500&family=Jost:wght@300;400;500&display=swap"
            rel="stylesheet"
        />

        @viteReactRefresh
        @vite(['resources/js/invitations/app.tsx', "resources/js/invitations/{$page['component']}.tsx"])
    </head>
    <body class="bg-ivory text-ink font-body overflow-x-hidden">
        <x-inertia::app />
    </body>
</html>
