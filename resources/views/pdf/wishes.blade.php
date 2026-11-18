<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="utf-8">
    <title>Libro de buenos deseos — {{ $title }}</title>
    <style>
        @font-face {
            font-family: 'Cormorant Garamond';
            font-style: normal;
            font-weight: 400;
            src: url('{{ $fontDirectory }}/CormorantGaramond-Regular.ttf') format('truetype');
        }

        @font-face {
            font-family: 'Cormorant Garamond';
            font-style: italic;
            font-weight: 400;
            src: url('{{ $fontDirectory }}/CormorantGaramond-Italic.ttf') format('truetype');
        }

        @font-face {
            font-family: 'Cormorant Garamond';
            font-style: normal;
            font-weight: 600;
            src: url('{{ $fontDirectory }}/CormorantGaramond-SemiBold.ttf') format('truetype');
        }

        @font-face {
            font-family: 'Great Vibes';
            font-style: normal;
            font-weight: 400;
            src: url('{{ $fontDirectory }}/GreatVibes-Regular.ttf') format('truetype');
        }

        @page {
            margin: 22mm 20mm 20mm;
        }

        body {
            margin: 0;
            font-family: 'Cormorant Garamond', serif;
            color: #2a1a2b;
            font-size: 13pt;
            line-height: 1.45;
        }

        .footer {
            position: fixed;
            bottom: -12mm;
            left: 0;
            right: 0;
            text-align: center;
            font-size: 9pt;
            letter-spacing: 2pt;
            text-transform: uppercase;
            color: #b97a1f;
        }

        .cover {
            text-align: center;
            padding-top: 62mm;
            page-break-after: always;
        }

        .cover .script {
            font-family: 'Great Vibes', cursive;
            font-size: 44pt;
            line-height: 1.1;
            color: #b97a1f;
        }

        .cover .title {
            margin-top: 10mm;
            font-size: 26pt;
            font-weight: 600;
        }

        .cover .date {
            margin-top: 3mm;
            font-size: 14pt;
            font-style: italic;
        }

        .cover .rule {
            width: 40mm;
            height: 0.6pt;
            margin: 10mm auto;
            background: #dfa33f;
            font-size: 0;
            line-height: 0;
        }

        .cover .count {
            font-size: 10pt;
            letter-spacing: 2.5pt;
            text-transform: uppercase;
            color: #b97a1f;
        }

        .wish {
            margin-bottom: 7mm;
            padding: 6mm 8mm 5mm;
            border: 0.6pt solid #ecc077;
            border-radius: 3mm;
            background: #fffdf9;
            page-break-inside: avoid;
        }

        .wish .quote {
            font-family: 'Great Vibes', cursive;
            font-size: 30pt;
            line-height: 0.6;
            color: #dfa33f;
        }

        .wish .message {
            margin: 1mm 0 3mm;
            font-style: italic;
            font-size: 14pt;
            line-height: 1.35;
        }

        .wish .author {
            font-weight: 600;
            font-size: 12pt;
        }

        .wish .date {
            font-size: 10pt;
            color: #8a7a6a;
        }

        .empty {
            text-align: center;
            font-style: italic;
            padding-top: 20mm;
        }
    </style>
</head>
<body>
    <div class="footer">{{ $title }} · Convite</div>

    <div class="cover">
        <div class="script">Libro de buenos deseos</div>
        <div class="title">{{ $title }}</div>
        @if ($dateLabel)
            <div class="date">{{ $dateLabel }}</div>
        @endif
        <div class="rule">&nbsp;</div>
        <div class="count">{{ count($wishes) === 1 ? '1 mensaje' : count($wishes).' mensajes' }}</div>
    </div>

    @forelse ($wishes as $wish)
        <div class="wish">
            <div class="quote">&ldquo;</div>
            <div class="message">{!! nl2br(e($wish['message'])) !!}</div>
            <div class="author">{{ $wish['author_name'] }}</div>
            @if ($wish['date'])
                <div class="date">{{ $wish['date'] }}</div>
            @endif
        </div>
    @empty
        <div class="empty">Aún no hay mensajes en el libro.</div>
    @endforelse
</body>
</html>
