#!/usr/bin/env bash

APP_DIR="/var/www/fsfe"
BRANCH="master"

cd "$APP_DIR"

echo "Deploying staging at $(date)"
echo "Running as $(whoami)"

git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

npm ci

pm2 restart fsfe-production --update-env

echo "Production deployment completed."
