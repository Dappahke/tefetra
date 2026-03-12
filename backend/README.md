# Tefetro Backend

Laravel API for the Tefetro Studios platform.

## Local development

```bash
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8000
```

## Render deployment

This backend is prepared for Render using:

- `Dockerfile`
- `render-start.sh`
- root `render.yaml`

The Render service should mount a persistent disk at `/var/www/html/storage` so uploaded plan files and preview images survive redeploys.

Required production environment variables:

- `FRONTEND_URL`
- `ADMIN_API_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_SHORTCODE`
- `MPESA_PASSKEY`
- `MPESA_CALLBACK_URL`

Useful defaults already handled by the blueprint:

- `DB_CONNECTION=pgsql`
- `DB_URL` from the managed Render Postgres instance
- `FILESYSTEM_DISK=public`
- `SESSION_DRIVER=database`
- `CACHE_STORE=database`
- `QUEUE_CONNECTION=database`

## Production notes

- Render provides an ephemeral filesystem by default, so the persistent disk is required for local file storage.
- The frontend on Vercel must use the same `ADMIN_API_KEY` as the backend.
- If you keep storing files locally in production, do not scale the web service horizontally while using a single attached disk.
- Long term, plan storage should move to S3-compatible object storage.
