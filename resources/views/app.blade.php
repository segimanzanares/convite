<!doctype html>
<html lang="es-MX" class="scroll-smooth">
    <head>
        @include('partials.head')

        @viteReactRefresh
        @vite(['resources/js/site/app.tsx', "resources/js/site/{$page['component']}.tsx"])
    </head>
    <body class="bg-ivory text-ink font-body overflow-x-hidden">
        <x-inertia::app />
    </body>
</html>
