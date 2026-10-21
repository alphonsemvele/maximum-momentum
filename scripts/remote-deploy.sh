#!/usr/bin/env bash
# Runs on the server, from the app directory, after rsync has uploaded a release.
set -euo pipefail

cd "$(dirname "$0")/.."

# Shared hosting may expose an older default `php`; Laravel 13 needs 8.3+.
PHP=""
for candidate in php /opt/alt/php84/usr/bin/php /opt/alt/php83/usr/bin/php /usr/local/bin/php84 /usr/local/bin/php83; do
    if command -v "$candidate" > /dev/null 2>&1 && "$candidate" -r 'exit(PHP_VERSION_ID >= 80300 ? 0 : 1);'; then
        PHP="$candidate"
        break
    fi
done

if [[ -z "$PHP" ]]; then
    echo "Aucun PHP >= 8.3 trouvé sur le serveur." >&2
    exit 1
fi

echo "PHP : $PHP ($("$PHP" -r 'echo PHP_VERSION;'))"
artisan() { "$PHP" artisan "$@" --no-interaction; }

mkdir -p storage/framework/{cache/data,sessions,views} storage/logs storage/app/public storage/app/private bootstrap/cache

artisan optimize:clear
artisan migrate --force

# First deployment only: admin account (from ADMIN_EMAIL / ADMIN_PASSWORD) and starter campaigns.
if [[ "$("$PHP" artisan tinker --execute='echo App\Models\User::count();' 2>/dev/null | tail -n1)" == "0" ]]; then
    artisan db:seed --force
fi

[[ -e public/storage ]] || artisan storage:link

artisan optimize
echo "Déploiement terminé : $(cat .deployed-commit 2>/dev/null || echo '?')"
