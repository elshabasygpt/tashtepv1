#!/bin/bash
# ============================================================
# Tashtep - Hostinger Cloud Startup Deployment Script
# Usage: bash deploy.sh
# ============================================================

set -e

echo "==> [1/6] Pulling latest code..."
git pull origin main

echo "==> [2/6] Installing dependencies..."
npm install

echo "==> [3/6] Running database migrations..."
npx prisma db push

echo "==> [4/6] Building Next.js..."
npm run build

echo "==> [5/6] Pruning dev dependencies..."
npm prune --production

echo "==> [6/6] Restarting app with PM2..."
if pm2 list | grep -q "tashtep"; then
  pm2 restart tashtep
else
  pm2 start ecosystem.config.js
fi

pm2 save

echo ""
echo "==> Verifying app is running..."
sleep 3
if pm2 list | grep -q "online"; then
  echo "✓ Deployment complete! App is online."
  echo "  Run 'pm2 logs tashtep' to watch logs"
else
  echo "✗ WARNING: App may not be running. Check: pm2 logs tashtep"
  exit 1
fi
