#!/usr/bin/env bash
# Pull the latest code and restart. Run on the server:  bash deploy/update.sh
set -euo pipefail

cd /var/www/waffle-wizard
echo "==> Fetching latest code"
git pull origin main

echo "==> Installing dependencies"
npm ci

echo "==> Building"
npm run build

echo "==> Restarting service"
sudo systemctl restart waffle-wizard   # only this app; HM Agri One is untouched
sleep 3
sudo systemctl status waffle-wizard --no-pager | head -12
echo "==> Done"
