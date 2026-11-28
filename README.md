# Convite

Invitaciones digitales a medida: Laravel 13 + Inertia v3 + React 19 + TypeScript, con PostgreSQL.

## Puesta en marcha

```sh
composer install
npm install
cp .env.example .env        # ajusta DB_* y las variables VITE_*
php artisan key:generate
php artisan migrate --seed  # crea las tablas y registra las invitaciones existentes
php artisan admin:create    # crea la primera cuenta del panel (/admin)
composer dev                # servidor de Laravel + Vite
```

## Invitaciones en video

El video se dibuja con código: `videos/invitation/render.py` (Python con pycairo y Pillow, más ffmpeg) genera un MP4
vertical de 1080×1920 a partir de un JSON con los datos de la invitación. Lo que genera a mano va a
`videos/invitation/output/`, que git ignora.

```sh
pip install -r videos/invitation/requirements.txt   # pycairo y Pillow; ffmpeg se instala aparte
```

Desde el panel, la página **Video** de la invitación lo genera en la cola `videos`, cuyo worker corre aparte:

```sh
php artisan queue:work videos --queue=videos
```

O sin cola, para una invitación ya capturada:

```sh
php artisan invitations:render-video mi-slug --theme=noche
```

### A mano, con Python

1. Saca el JSON de una invitación: el botón **Descargar JSON** de su página **Video** en el panel, o este comando
   (cambia `mi-slug`). Las fotos y la música quedan como rutas absolutas de este equipo,
   así que el archivo no sirve en otra máquina:

   ```sh
   php artisan tinker --execute 'echo json_encode(app(App\Services\InvitationVideoService::class)->data(App\Models\Invitation::where("slug", "mi-slug")->firstOrFail()), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);' > videos/invitation/output/datos.json
   ```

   `videos/invitation/sample.json` es un ejemplo del formato.

2. Genera el video:

   ```sh
   python3 videos/invitation/render.py --data videos/invitation/output/datos.json --out videos/invitation/output/video.mp4
   ```

   | Opción | Qué hace |
   | --- | --- |
   | `--data` | El JSON de la invitación. Sin ella usa `sample.json`. |
   | `--theme` | `clasico` (por omisión) o `noche`, de `videos/invitation/themes/`. |
   | `--out` | La ruta del MP4 (por omisión `videos/invitation/output/video.mp4`). |
   | `--stills 3,9,16` | En lugar del video, guarda PNG de esos segundos en `stills/`, junto a `--out`. |
   | `--workers` | Cuántos cuadros dibuja a la vez (por omisión, todos los núcleos menos uno). |

## Tests

```sh
php artisan test            # Pest, contra la base de datos convite_testing
npm run lint
npm run build               # type-check + build de producción en public/build
```
