#!/usr/bin/env bash

set -euo pipefail

APP_DIR="/var/www/fsfe-staging"
BRANCH="staging"

cd "$APP_DIR"

echo "Deploying staging at $(date)"
echo "Running as $(whoami)"

git fetch origin "$BRANCH"
git reset --hard "origin/$BRANCH"

npm ci
npm run build

pm2 restart fsfe-staging --update-env

echo "Staging deployment completed."
