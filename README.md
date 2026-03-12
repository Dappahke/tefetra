# Tefetro

Monorepo for the Tefetro Studios platform.

## Apps

- `frontend/` - Next.js marketing site, marketplace, admin UI, and client portal shell
- `backend/` - Laravel API, order handling, consultations, downloads, payments, and admin endpoints

## Local development

Frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend:

```bash
cd backend
composer install
php artisan migrate
php artisan serve --host=127.0.0.1 --port=8000
```

## Deployment

- Deploy `frontend/` to Vercel
- Deploy `backend/` to a Laravel-capable host
- Point `NEXT_PUBLIC_API_BASE_URL` at the public backend URL
