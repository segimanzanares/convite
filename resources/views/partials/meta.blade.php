@php
    // Pages may pass a `meta` prop to override these defaults, which are the
    // landing page's own (see LandingController, InvitationController and bootstrap/app.php).
    // Shared by the invitations app (invitations.blade.php) and the main app's pages
    // outside the panel (app.blade.php).
    $meta = array_merge([
        // The same title the landing page's <Head> sets once rendered (see app.tsx's title callback)
        'title' => 'Invitaciones digitales para bodas, XV años y más - Convite',
        'description' => 'Invitaciones digitales para bodas, XV años, bautizos y cumpleaños, con confirmación de asistencia, cuenta regresiva, galería y música. Listas para compartir en días.',
        'image' => null,
        'robots' => 'index, follow',
    ], array_filter(data_get($page, 'props.meta') ?? []));

    // The default image's size and type are known; an invitation's uploaded one may differ
    $isDefaultImage = $meta['image'] === null;
    $meta['image'] ??= asset('og-image.jpg');
    $isIndexable = str_starts_with($meta['robots'], 'index');
@endphp
<title>{{ $meta['title'] }}</title>
<meta name="description" content="{{ $meta['description'] }}" />
<meta name="robots" content="{{ $meta['robots'] }}" />
@if ($isIndexable)
    <link rel="canonical" href="{{ url()->current() }}" />
@endif

<!-- Open Graph / Facebook / WhatsApp -->
<meta property="og:type" content="website" />
<meta property="og:site_name" content="Convite" />
<meta property="og:title" content="{{ $meta['title'] }}" />
<meta property="og:description" content="{{ $meta['description'] }}" />
<meta property="og:image" content="{{ $meta['image'] }}" />
@if ($isDefaultImage)
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/jpeg" />
@endif
<meta property="og:image:alt" content="{{ $meta['title'] }}" />
<meta property="og:url" content="{{ url()->current() }}" />
<meta property="og:locale" content="es_MX" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{{ $meta['title'] }}" />
<meta name="twitter:description" content="{{ $meta['description'] }}" />
<meta name="twitter:image" content="{{ $meta['image'] }}" />
<meta name="twitter:image:alt" content="{{ $meta['title'] }}" />
