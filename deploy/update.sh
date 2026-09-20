#!/usr/bin/env bash
# Pull the latest code and restart. Run on the server:  bash deploy/update.sh
#
# Works whether you run it as root or as the app user. Touches only this app:
# its own directory, its own systemd service. nginx is never reloaded here, so
# HM Agri One cannot be affected by an update.
set -euo pipefail

APP_DIR=/var/www/waffle-wizard
SERVICE=waffle-wizard

cd "$APP_DIR"

ME="$(id -un)"
# The checkout belongs to one user. Doing git or npm work as anyone else leaves
# files that user can no longer write, and git refuses outright ("dubious
# ownership"), so repo work always runs as the owner.
OWNER="$(stat -c '%U' "$APP_DIR/.git")"

as_owner() {
  if [ "$ME" = "$OWNER" ]; then
    bash -c "$1"
  else
    sudo -u "$OWNER" -H bash -c "$1"
  fi
}

# Restarting needs root; only reach for sudo when we are not already root.
SUDO=""
[ "$ME" != "root" ] && SUDO="sudo"

echo "==> Running as $ME, repo owned by $OWNER"

# NEXT_PUBLIC_* values are inlined into the bundle at BUILD time, so the build
# has to see the same environment the service runs with. The systemd unit stays
# the single source of truth — edit it there, not here.
echo "==> Reading build-time settings from the service unit"
for pair in $(systemctl show "$SERVICE" -p Environment --value 2>/dev/null || true); do
  case "$pair" in
    NEXT_PUBLIC_SITE_URL=* | GOOGLE_PLACES_API_KEY=*) export "$pair" ;;
  esac
done

if [ -z "${NEXT_PUBLIC_SITE_URL:-}" ] || [[ "$NEXT_PUBLIC_SITE_URL" == *REPLACE-WITH* ]]; then
  echo "!! NEXT_PUBLIC_SITE_URL is missing from the unit, so sitemap, canonical"
  echo "   and share links would be built against a placeholder domain."
  echo "   Set it first:  sudo nano /etc/systemd/system/$SERVICE.service"
  echo "   then:          sudo systemctl daemon-reload"
  exit 1
fi

BUILD_ENV="NEXT_PUBLIC_SITE_URL=$(printf %q "$NEXT_PUBLIC_SITE_URL")"
echo "    site URL   : $NEXT_PUBLIC_SITE_URL"
# Never print the key itself.
if [ -n "${GOOGLE_PLACES_API_KEY:-}" ] && [[ "$GOOGLE_PLACES_API_KEY" != *REPLACE-WITH* ]]; then
  echo "    Google key : set (live rating enabled)"
  BUILD_ENV="$BUILD_ENV GOOGLE_PLACES_API_KEY=$(printf %q "$GOOGLE_PLACES_API_KEY")"
else
  echo "    Google key : not set — the rating falls back to the snapshot in site.ts"
fi

echo "==> Fetching latest code"
as_owner "cd $(printf %q "$APP_DIR") && git pull origin main"

echo "==> Installing dependencies"
# --include=dev because the build needs devDependencies even when the shell
# happens to carry NODE_ENV=production.
as_owner "cd $(printf %q "$APP_DIR") && npm ci --include=dev"

echo "==> Building"
as_owner "cd $(printf %q "$APP_DIR") && env $BUILD_ENV npm run build"

echo "==> Restarting service"
$SUDO systemctl restart "$SERVICE"   # only this app; HM Agri One is untouched
sleep 3
$SUDO systemctl status "$SERVICE" --no-pager | head -12

echo "==> Checking the app answers on its own port"
curl -fsS -o /dev/null -w "    127.0.0.1:3001 -> HTTP %{http_code}\n" http://127.0.0.1:3001 \
  || { echo "!! Not responding. Logs: $SUDO journalctl -u $SERVICE -n 50"; exit 1; }

echo "==> Done"
