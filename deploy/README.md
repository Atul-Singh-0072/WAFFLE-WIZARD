# Deploying Waffle Wizard to the Contabo VPS

**This server already runs HM Agri One (`app.hmagrione.in`).** Every step below
is additive: a new directory, a new systemd service on a new port, and a new
nginx file. Nothing existing is edited or removed.

Three rules that keep the other site safe:

1. Never delete or edit anything already in `/etc/nginx/sites-enabled/`.
2. Never add `default_server` to the Waffle Wizard block.
3. Always run `sudo nginx -t` before reloading, and use `reload`, not `restart`.

---

## 0. Before you start

- Confirm the SSH port and user (port 22 is closed on this server).
- Point a domain or subdomain at `217.217.251.34` with an **A record**.
  A domain is required — without one, nginx cannot tell the two sites apart.

Take a config backup first:

```bash
sudo tar czf ~/nginx-backup-$(date +%F).tar.gz /etc/nginx
```

## 1. Check what is already there

```bash
sudo ss -tlnp | grep -E ':(80|443|3000|3001)'   # 3001 must be free
ls -la /etc/nginx/sites-enabled/                # note the existing files
node -v                                         # need 20+
```

If Node is missing or older than 20:

```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

## 2. A user to run the app

```bash
id deploy || sudo adduser --disabled-password --gecos "" deploy
sudo mkdir -p /var/www && sudo chown deploy:deploy /var/www
```

## 3. Clone and build

```bash
sudo -u deploy -H bash
cd /var/www
git clone https://github.com/Atul-Singh-0072/WAFFLE-WIZARD.git waffle-wizard
cd waffle-wizard
npm ci
NEXT_PUBLIC_SITE_URL=https://YOUR-DOMAIN npm run build
exit
```

The build takes a few minutes and needs ~1 GB free.

## 4. Run it as a service (port 3001)

```bash
sudo cp /var/www/waffle-wizard/deploy/waffle-wizard.service /etc/systemd/system/
sudo nano /etc/systemd/system/waffle-wizard.service      # set NEXT_PUBLIC_SITE_URL
sudo systemctl daemon-reload
sudo systemctl enable --now waffle-wizard
sudo systemctl status waffle-wizard --no-pager | head -12
curl -I http://127.0.0.1:3001                            # expect HTTP/1.1 200
```

Nothing is public yet, so the other site cannot be affected by this step.

## 5. Give it an nginx block

```bash
sudo cp /var/www/waffle-wizard/deploy/nginx.conf /etc/nginx/sites-available/waffle-wizard
sudo nano /etc/nginx/sites-available/waffle-wizard        # set server_name
sudo ln -s /etc/nginx/sites-available/waffle-wizard /etc/nginx/sites-enabled/

sudo nginx -t          # must say "syntax is ok" AND "test is successful"
sudo systemctl reload nginx
```

If `nginx -t` fails, **do not reload**. Fix the file, or remove the symlink:
`sudo rm /etc/nginx/sites-enabled/waffle-wizard`.

Now check both sites:

```bash
curl -I http://YOUR-DOMAIN                 # Waffle Wizard
curl -I https://app.hmagrione.in           # still 200 — unchanged
```

## 6. HTTPS

```bash
sudo certbot --nginx -d YOUR-DOMAIN -d www.YOUR-DOMAIN
```

Name only the Waffle Wizard domain. Certbot edits just that block and leaves
the other certificate alone.

---

## Shipping changes later

```bash
bash /var/www/waffle-wizard/deploy/update.sh
```

Pulls from GitHub, rebuilds, restarts only this service.

## Day-to-day

```bash
sudo systemctl status waffle-wizard      # running?
sudo journalctl -u waffle-wizard -f      # live logs
sudo systemctl restart waffle-wizard     # restart just this app
```

## If something breaks

Remove this site and the server returns to exactly its previous state:

```bash
sudo rm /etc/nginx/sites-enabled/waffle-wizard
sudo nginx -t && sudo systemctl reload nginx
sudo systemctl disable --now waffle-wizard
```

## What you own now

Nothing here updates itself. Budget a few minutes a month for
`sudo apt update && sudo apt upgrade`, and check the service after changes.
Certbot renews TLS automatically — verify with `sudo certbot renew --dry-run`.
