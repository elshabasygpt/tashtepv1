#!/bin/bash
# ============================================================
# Tashtep - Hostinger Cloud Startup Deployment Script
# Usage: bash deploy.sh
# ============================================================

set -e

echo "==> [1/6] Pulling latest code..."
git pull origin main

echo "==> [2/6] Installing dependencies..."
npm install --include=dev

echo "==> [3/6] Generating Prisma client..."
npx prisma generate

echo "==> [4/6] Running database migrations..."
npx prisma db push

echo "==> [5/6] Building Next.js..."
npm run build

echo "==> [6/6] Restarting app with PM2..."
if pm2 list | grep -q "tashtep"; then
  pm2 restart tashtep
else
  pm2 start ecosystem.config.js
fi

pm2 save

echo ""
echo "✓ Deployment complete!"
echo "  Run 'pm2 logs tashtep' to watch logs"
