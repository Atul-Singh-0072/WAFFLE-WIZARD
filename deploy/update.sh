#!/usr/bin/env bash
# Pull the latest code and restart. Run on the server:  bash deploy/update.sh
#
# Touches only this app: its own directory, its own systemd service. nginx is
# never reloaded here, so HM Agri One cannot be affected by an update.
set -euo pipefail

cd /var/www/waffle-wizard

# NEXT_PUBLIC_* values are inlined into the bundle at BUILD time, so the build
# has to see the same environment the service runs with. The systemd unit stays
# the single source of truth — edit it there, not here.
echo "==> Reading build-time settings from the service unit"
for pair in $(systemctl show waffle-wizard -p Environment --value 2>/dev/null || true); do
  case "$pair" in
    NEXT_PUBLIC_SITE_URL=* | GOOGLE_PLACES_API_KEY=*) export "$pair" ;;
  esac
done

if [ -z "${NEXT_PUBLIC_SITE_URL:-}" ] || [[ "$NEXT_PUBLIC_SITE_URL" == *REPLACE-WITH* ]]; then
  echo "!! NEXT_PUBLIC_SITE_URL is missing from the unit, so sitemap, canonical"
  echo "   and share links would be built against a placeholder domain."
  echo "   Set it first:  sudo nano /etc/systemd/system/waffle-wizard.service"
  echo "   then:          sudo systemctl daemon-reload"
  exit 1
fi

echo "    site URL   : $NEXT_PUBLIC_SITE_URL"
# Never print the key itself.
if [ -n "${GOOGLE_PLACES_API_KEY:-}" ] && [[ "$GOOGLE_PLACES_API_KEY" != *REPLACE-WITH* ]]; then
  echo "    Google key : set (live rating enabled)"
else
  echo "    Google key : not set — the rating falls back to the snapshot in site.ts"
  unset GOOGLE_PLACES_API_KEY
fi

echo "==> Fetching latest code"
git pull origin main

echo "==> Installing dependencies"
# --include=dev because the build needs devDependencies even when the shell
# happens to carry NODE_ENV=production.
npm ci --include=dev

echo "==> Building"
npm run build

echo "==> Restarting service"
sudo systemctl restart waffle-wizard   # only this app; HM Agri One is untouched
sleep 3
sudo systemctl status waffle-wizard --no-pager | head -12

echo "==> Checking the app answers on its own port"
curl -fsS -o /dev/null -w "    127.0.0.1:3001 -> HTTP %{http_code}\n" http://127.0.0.1:3001 \
  || { echo "!! The app is not responding. Logs: sudo journalctl -u waffle-wizard -n 50"; exit 1; }

echo "==> Done"
