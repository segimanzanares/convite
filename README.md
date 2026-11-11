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

## Tests

```sh
php artisan test            # Pest, contra la base de datos convite_testing
npm run lint
npm run build               # type-check + build de producción en public/build
```
