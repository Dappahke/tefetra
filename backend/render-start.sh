#!/usr/bin/env bash

set -euo pipefail

cd /var/www/html

mkdir -p \
  bootstrap/cache \
  storage/app/private \
  storage/app/public \
  storage/framework/cache/data \
  storage/framework/sessions \
  storage/framework/testing \
  storage/framework/views \
  storage/logs

chown -R www-data:www-data bootstrap/cache storage

if [ ! -L public/storage ]; then
  rm -rf public/storage
  php artisan storage:link
fi

php artisan config:clear
php artisan migrate --force
php artisan config:cache

exec apache2-foreground
