# Deploying to a Contabo VPS (Ubuntu)

Run these on the server over SSH. Replace `YOUR-DOMAIN` throughout.

## 1. Server basics

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y nginx git curl ufw

# Node.js 22 LTS (the repo needs Node 20+)
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
node -v && npm -v

# Firewall: SSH + web only
sudo ufw allow OpenSSH && sudo ufw allow 'Nginx Full' && sudo ufw --force enable
```

## 2. A non-root user to run the site

```bash
sudo adduser --disabled-password --gecos "" deploy
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

## 4. Run it as a service

```bash
sudo cp /var/www/waffle-wizard/deploy/waffle-wizard.service /etc/systemd/system/
sudo nano /etc/systemd/system/waffle-wizard.service   # set NEXT_PUBLIC_SITE_URL
sudo systemctl daemon-reload
sudo systemctl enable --now waffle-wizard
sudo systemctl status waffle-wizard --no-pager
curl -I http://127.0.0.1:3000        # expect HTTP/1.1 200
```

## 5. Nginx in front

```bash
sudo cp /var/www/waffle-wizard/deploy/nginx.conf /etc/nginx/sites-available/waffle-wizard
sudo nano /etc/nginx/sites-available/waffle-wizard   # set server_name
sudo ln -sf /etc/nginx/sites-available/waffle-wizard /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

Point the domain's A record at the server's IP before the next step.

## 6. HTTPS (free, auto-renewing)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d YOUR-DOMAIN -d www.YOUR-DOMAIN
```

Certbot edits the nginx file to serve HTTPS and sets up renewal. Check it with
`sudo certbot renew --dry-run`.

## Shipping a change later

```bash
ssh deploy@YOUR-SERVER-IP
bash /var/www/waffle-wizard/deploy/update.sh
```

## Checking on it

```bash
sudo systemctl status waffle-wizard      # running?
sudo journalctl -u waffle-wizard -f      # live logs
sudo systemctl restart waffle-wizard     # restart
```

## What this server needs from you

Unlike a managed host, nothing here updates itself. Budget a few minutes a
month for `sudo apt update && sudo apt upgrade`, and keep an eye on the
service after any change.
