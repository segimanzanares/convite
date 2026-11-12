@php
    // Pages may pass a `meta` prop to override these defaults, which are the
    // landing page's own (see InvitationController and bootstrap/app.php).
    // Shared by the public site (app.blade.php) and the admin app's pages
    // outside the panel (admin.blade.php).
    $meta = array_merge([
        'title' => 'Convite — Invitaciones Digitales para Bodas, XV años y Eventos',
        'description' => 'Invitaciones digitales para bodas, XV años y cualquier evento: diseños de catálogo o exclusivos, confirmación de asistencia, cuenta regresiva y galería de fotos. Lista para compartir en días.',
        'image' => asset('og-image.jpg'),
        'robots' => 'index, follow',
    ], array_filter(data_get($page, 'props.meta') ?? []));
@endphp
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
